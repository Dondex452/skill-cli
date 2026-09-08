// resolve-origin.mjs — origin resolution (rev.3, Phase 1.5a).
// Resolves fetch origins for catalog records from upstream repos:
//   1. exact blob-URL origins mined by scan-origins.mjs (highest confidence)
//   2. skill-dir name match against upstream repo file trees (bulk)
// Caches trees + pins under OS temp dir; resumable; emits src/data/origins.json.
// Usage: node scripts/resolve-origin.mjs [--repo owner/name ...] (default: SOURCES below)
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const UA = { "User-Agent": "skill-cli-origin-resolver", Accept: "application/vnd.github+json" };
const CACHE = path.join(os.tmpdir(), "opencode", "origin-trees");
fs.mkdirSync(CACHE, { recursive: true });
const OUT = path.resolve("src/data/origins.json");

// candidate upstream repos: [owner/repo, note]
const SOURCES = [
  ["prewsh/seo-aeo-engine", "renamed from mrprewsh; 8 exact-blob origins"],
  ["bitjaru/styleseed", "11 exact-blob origins (ui-*/ux-*)"],
  ["fal-ai-community/skills", "6 exact-blob origins (fal-*)"],
  ["anthropics/claude-plugins-official", "official; skill-creator origin"],
  ["zebbern/skills", "zebbern cluster (28), 2 confirmed in tree"],
  ["sickn33/agentic-awesome-skills", "mega-collection 1340+ skills, mirrors origins"],
  ["prewsh/antigravity-awesome-skills", "mega-collection 1340+ skills"],
  ["huggingface/skills", "11 references"],
  ["ai-evos/agent-skills", "8 references"],
  ["AgriciDaniel/claude-seo", "14 references"],
  ["coreyhaines31/marketingskills", "10 references"],
  ["kepano/obsidian-skills", "5 references"],
  ["whatiskadudoing/fp-ts-skills", "fp-* cluster (kadu/fp-ts-skills attributions)"],
  ["frmoretto/clarity-gate", "front-matter repo origin"],
  ["Enreign/progressive-estimation", "blob-URL origin (own repo)"],
  ["google-deepmind/science-skills", "official DeepMind; ~35 bio *_database skills"],
  ["jamalavedra/agent-swarm", "fork of desplega-ai; pi-skills (start-leader/worker, todos...)"],
  ["cursor/plugins", "registry evidence (run-smoke-tests)"],
  ["cyangzhou/2-project-yunshu", "registry evidence"],
  ["designnotdrum/brain-jar", "registry evidence (summarize)"],
  ["dotnet/maui", "registry evidence (run-integration-tests)"],
  ["elizaos/eliza", "registry evidence (coding-agent)"],
  ["harperreed/dotfiles", "registry evidence (uv)"],
  ["igorganapolsky/thumbgate", "registry evidence (graphify)"],
  ["janjaszczak/cursor", "registry evidence (create-rule/subagent/settings)"],
  ["jjyaoao/helloagents", "registry evidence (finance/gift/podcast/video)"],
  ["kcns008/cluster-agent-swarm-skills", "README path skills/artifacts"],
  ["ladderchaos/tora-skills", "registry evidence (fullstack-dev)"],
  ["openclaw/skills", "registry evidence (skill-vetter)"],
  ["streamlit/agent-skills", "README path developing-with-streamlit"],
  ["victory-hugo/s2-agent-skill", "registry evidence (market-research-reports)"],
];

const blocklist = JSON.parse(
  fs.readFileSync(path.resolve("scripts/blocklist.json"), "utf8")
);
const catalog = fs
  .readFileSync(path.resolve("src/data/catalog.jsonl"), "utf8")
  .split(/\r?\n/)
  .filter(Boolean)
  .map((l) => JSON.parse(l))
  .filter((r) => !blocklist[r.name]);
const names = new Set(catalog.map((r) => r.name));
const lower = new Map(catalog.map((r) => [r.name.toLowerCase(), r.name]));

const OFFLINE = process.argv.includes("--offline");

async function gh(url) {
  const f = (p) => path.join(CACHE, p);
  const key = url.replace(/[^a-z0-9]+/gi, "_");
  if (fs.existsSync(f(key))) return JSON.parse(fs.readFileSync(f(key), "utf8"));
  if (OFFLINE) return { __http: "offline-skip" };
  const res = await fetch(url, { headers: UA });
  if (res.status === 403 || res.status === 429) {
    console.error(`RATE-LIMITED at ${url} — progress saved, rerun later`);
    save();
    process.exit(2);
  }
  if (!res.ok) return { __http: res.status };
  const j = await res.json();
  fs.writeFileSync(f(key), JSON.stringify(j));
  return j;
}

async function treeFor(repo) {
  for (const br of ["main", "master"]) {
    const t = await gh(
      `https://api.github.com/repos/${repo}/git/trees/${br}?recursive=1`
    );
    if (t.tree) return { tree: t, branch: br, truncated: !!t.truncated };
  }
  return { dead: true };
}

async function pinFor(repo, branch) {
  const c = await gh(
    `https://api.github.com/repos/${repo}/commits?per_page=1&sha=${branch}`
  );
  if (Array.isArray(c) && c[0]?.sha) return c[0].sha;
  return null;
}

const origins = fs.existsSync(OUT)
  ? JSON.parse(fs.readFileSync(OUT, "utf8"))
  : {};

const hints = JSON.parse(
  fs.readFileSync(path.resolve("src/data/origin-hints.json"), "utf8")
);
// exact blob-URL origins mined from SKILL.md bodies: name -> [{repo, ref, path}]
const blobMap = {};
{
  const re =
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+?)\/SKILL\.md$/i;
  for (const [name, h] of Object.entries(hints)) {
    for (const u of h.urls || []) {
      const m = u.match(re);
      if (!m || ["owner", "user"].includes(m[1].toLowerCase())) continue;
      (blobMap[name] ??= []).push({
        repo: `${m[1]}/${m[2]}`,
        ref: m[3],
        path: m[4],
      });
    }
  }
}

const pathSets = {}; // repo -> Set of SKILL.md dir paths (for staleness checks)

let verification = {};
try {
  verification = JSON.parse(
    fs.readFileSync(path.resolve("src/data/origin-verification.json"), "utf8")
  );
} catch {}
let similarity = {};
try {
  similarity = JSON.parse(
    fs.readFileSync(path.resolve("src/data/origin-similarity.json"), "utf8")
  );
} catch {}

function save() {
  // promote (1) hash-verified local-identical copy, else (2) single-repo agreement
  for (const [name, rec] of Object.entries(origins)) {
    if (rec.origin) continue;
    const byRepo = new Map();
    for (const c of rec.candidates) {
      if (!byRepo.has(c.repo)) byRepo.set(c.repo, []);
      byRepo.get(c.repo).push(c);
    }
    const v = verification[name];
    if (v && v.local_sha) {
      const all = [...byRepo.values()].flat();
      const winners = all.filter(
        (c) => v.upstream[`${c.repo}:${c.path}`] === v.local_sha
      );
      const wRepos = new Set(winners.map((c) => c.repo));
      if (winners.length >= 1 && wRepos.size === 1) {
        const w = winners[0];
        rec.origin = {
          repo: w.repo, ref: w.ref, path: w.path, pin: w.pin ?? null,
          verified: "local-identical",
        };
        continue;
      }
    }
    const s = similarity[name];
    if (s && (s.tier === "same-evolved" || s.tier === "drifted-related") && s.best_repo) {
      const c = [...byRepo.values()]
        .flat()
        .find((x) => x.repo === s.best_repo && x.path === s.best_path && x.pin);
      if (c) {
        rec.origin = {
          repo: c.repo, ref: c.ref, path: c.path, pin: c.pin,
          verified: `similarity-${s.sim}`,
        };
        continue;
      }
    }
    if (byRepo.size !== 1) continue;
    const [repo, cs] = [...byRepo.entries()][0];
    const exact = cs.find((c) => c.confidence === "exact-blob");
    const inTree =
      exact && pathSets[repo]?.has(exact.path) ? exact : null;
    const pick =
      inTree ?? cs.find((c) => c.confidence !== "exact-blob") ?? exact;
    if (!pick) continue;
    rec.origin = {
      repo: pick.repo,
      ref: pick.ref,
      path: pick.path,
      pin: pick.pin ?? null,
      verified: "single-repo",
      stale: exact && !inTree ? true : undefined,
    };
  }
  fs.writeFileSync(OUT, JSON.stringify(origins, null, 2) + "\n");
}

const filter = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const repos = filter.length ? filter.map((r) => [r, "manual"]) : SOURCES;

let apiCalls = 0;
// seed exact-blob candidates first (repos not yet fetched get pin:null)
for (const [name, blobs] of Object.entries(blobMap)) {
  const rec = (origins[name] ??= { candidates: [] });
  for (const b of blobs) {
    if (!rec.candidates.some((c) => c.confidence === "exact-blob" && c.repo === b.repo)) {
      rec.candidates.push({ repo: b.repo, ref: b.ref, path: b.path, pin: null, confidence: "exact-blob" });
    }
  }
}
// seed front-matter repo-level candidates (path resolved once repo tree is fetched)
{
  const re = /(?:github\.com\/)?([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)(?:\.git)?\/?$/i;
  for (const [name, h] of Object.entries(hints)) {
    const fm = h.fm || {};
    for (const k of ["source_repo", "repository", "repo", "source_url", "upstream"]) {
      if (!fm[k]) continue;
      const m = String(fm[k]).match(re);
      if (!m || ["owner/repo", "user/repo"].includes(m[1].toLowerCase())) continue;
      const rec = (origins[name] ??= { candidates: [] });
      if (!rec.candidates.some((c) => c.repo.toLowerCase() === m[1].toLowerCase())) {
        rec.candidates.push({ repo: m[1], ref: null, path: null, pin: null, confidence: "fm-repo" });
      }
    }
  }
}
// registry evidence: skills.cat sitemap maps skill -> (owner, repo)
try {
  const sm = JSON.parse(
    fs.readFileSync(path.join(os.tmpdir(), "opencode", "sitemap-matches.json"), "utf8")
  );
  for (const [name, m] of Object.entries(sm)) {
    const rec = (origins[name] ??= { candidates: [] });
    const repo = `${m.owner}/${m.repo}`;
    if (!rec.candidates.some((c) => c.repo.toLowerCase() === repo.toLowerCase())) {
      rec.candidates.push({ repo, ref: null, path: null, pin: null, confidence: "registry" });
    }
  }
} catch {}
// registry seeds: skill -> repo (websearch/skills.cat evidence, path resolved on tree fetch)
{
  const seeds = {
    "google-deepmind/science-skills": null, // matched by *_database suffix below
    "jamalavedra/agent-swarm": ["start-leader","start-worker","swarm-chat","close-issue","respond-github","todos","work-on-task","investigate-sentry-issue","review-offered-task","implement-issue","review-pr","create-pr"],
  };
  const sciBio = ["alphagenome_single_variant_analysis","embl_ebi_ols","foldseek_structural_search","ncbi_sequence_fetch","protein_sequence_msa","protein_sequence_similarity_search","pymol","ucsc_conservation_and_tfbs"];
  const sci = catalog.map((r) => r.name).filter((n) => /(_database|^science_skills_common$|^literature_search_)/.test(n) || sciBio.includes(n));
  for (const name of sci) {
    const rec = (origins[name] ??= { candidates: [] });
    if (!rec.candidates.some((c) => c.repo === "google-deepmind/science-skills"))
      rec.candidates.push({ repo: "google-deepmind/science-skills", ref: null, path: null, pin: null, confidence: "registry" });
  }
  for (const name of seeds["jamalavedra/agent-swarm"]) {
    if (!names.has(name)) continue;
    const rec = (origins[name] ??= { candidates: [] });
    if (!rec.candidates.some((c) => c.repo === "jamalavedra/agent-swarm"))
      rec.candidates.push({ repo: "jamalavedra/agent-swarm", ref: null, path: null, pin: null, confidence: "registry" });
  }
}
// README-confirmed paths (pin pending API window)
const SEEDS = {
  "developing-with-streamlit": { repo: "streamlit/agent-skills", path: "developing-with-streamlit" },
  artifacts: { repo: "kcns008/cluster-agent-swarm-skills", path: "skills/artifacts" },
};
for (const [name, s] of Object.entries(SEEDS)) {
  const rec = (origins[name] ??= { candidates: [] });
  if (!rec.origin) {
    rec.origin = { repo: s.repo, ref: "main", path: s.path, pin: null, verified: "readme-path" };
  }
}
// VERIFIED remaps: bitjaru renamed ui-*/ux-* -> ss-* and rewrote content
// (name correspondence + same repo/author, description similarity 0.33-0.79)
{
  const PIN = "4a9b894c7b0fcf08530d75fc75012fd1e913ad1b";
  const pairs = {"ui-tokens":"ss-tokens","ui-page":"ss-page","ui-a11y":"ss-a11y","ui-component":"ss-component","ui-pattern":"ss-pattern","ui-review":"ss-review","ui-setup":"ss-setup","ux-feedback":"ss-feedback","ux-flow":"ss-flow","ux-audit":"ss-audit","ux-copy":"ss-copy"};
  for (const [name, ss] of Object.entries(pairs)) {
    const rec = (origins[name] ??= { candidates: [] });
    rec.origin = {
      repo: "bitjaru/styleseed", ref: "main",
      path: `engine/.claude/skills/${ss}`, pin: PIN, verified: "remapped-evolved",
    };
  }
}
for (const [repo] of repos) {
  const { tree, branch, truncated, dead } = await treeFor(repo);
  apiCalls += 2;
  if (dead || !tree) {
    console.log(`SKIP ${repo} (dead or uncached-offline)`);
    continue;
  }
  const pin = await pinFor(repo, branch);
  apiCalls += 1;
  // index SKILL.md dirs: dir full-path -> dirname
  pathSets[repo] = new Set();
  let matched = 0;
  for (const e of tree.tree) {
    if (e.type !== "blob" || !e.path.endsWith("/SKILL.md")) continue;
    const dir = e.path.slice(0, -"/SKILL.md".length);
    pathSets[repo].add(dir);
    const base = dir.split("/").pop();
    let hit = names.has(base) ? base : lower.get(base.toLowerCase());
    let conf = "tree-match";
    if (!hit && base.length >= 3) {
      // suffix match: catalog "seo-aeo-keyword-research" <-> repo dir "keyword-research"
      const suf = "-" + base.toLowerCase();
      hit = catalog.map((r) => r.name).find((n) => n.toLowerCase().endsWith(suf));
      conf = "suffix-match";
    }
    if (!hit) continue;
    const rec = (origins[hit] ??= { candidates: [] });
    if (!rec.candidates.some((c) => c.repo === repo && c.path === dir)) {
      rec.candidates.push({ repo, ref: branch, path: dir, pin, confidence: conf });
      matched++;
    }
  }
  // exact-blob candidates whose repo is THIS repo (cross-validates staleness)
  for (const [name, blobs] of Object.entries(blobMap)) {
    for (const b of blobs) {
      if (b.repo.toLowerCase() !== repo.toLowerCase()) continue;
      const rec = (origins[name] ??= { candidates: [] });
      if (!rec.candidates.some((c) => c.confidence === "exact-blob" && c.repo === repo)) {
        rec.candidates.push({
          repo, ref: b.ref, path: b.path, pin,
          confidence: "exact-blob",
        });
      }
    }
  }
  console.log(
    `OK ${repo}@${branch} pin=${pin?.slice(0, 7) ?? "null"} matched=${matched}${truncated ? " TRUNCATED" : ""}`
  );
  save(); // incremental — a rate-limit stop never loses work
}
const resolved = Object.values(origins).filter((r) => r.origin).length;
console.log(
  JSON.stringify({ skills: names.size, with_candidates: Object.keys(origins).length, resolved, apiCalls })
);
