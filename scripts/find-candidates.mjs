// find-candidates.mjs — skills present upstream but missing from our catalog.
// Emits src/data/origin-candidates.json: {name, repo, ref, path, pin, reason}.
// All candidates are immediately fetchable (repo+pin known). Owner picks adds.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const CACHE = path.join(os.tmpdir(), "opencode", "origin-trees");
const OUT = path.resolve("src/data/origin-candidates.json");
const REPOS = [
  "sickn33/agentic-awesome-skills",
  "prewsh/antigravity-awesome-skills",
  "anthropics/claude-plugins-official",
  "huggingface/skills",
  "fal-ai-community/skills",
  "ai-evos/agent-skills",
  "AgriciDaniel/claude-seo",
  "coreyhaines31/marketingskills",
  "kepano/obsidian-skills",
  "zebbern/skills",
  "bitjaru/styleseed",
];
const key = (u) => u.replace(/[^a-z0-9]+/gi, "_");

const cat = new Set(
  fs
    .readFileSync(path.resolve("src/data/catalog.jsonl"), "utf8")
    .split(/\r?\n/)
    .filter(Boolean)
    .map((l) => {
      try {
        return JSON.parse(l).name;
      } catch {
        return null;
      }
    })
);
const catLower = new Set([...cat].map((n) => n && n.toLowerCase()));

const out = [];
for (const repo of REPOS) {
  const tf = path.join(
    CACHE,
    key(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`)
  );
  if (!fs.existsSync(tf)) {
    console.log(`SKIP ${repo} (no cached tree)`);
    continue;
  }
  const tree = JSON.parse(fs.readFileSync(tf, "utf8"));
  const cf = path.join(
    CACHE,
    key(`https://api.github.com/repos/${repo}/commits?per_page=1&sha=main`)
  );
  const pin = fs.existsSync(cf)
    ? JSON.parse(fs.readFileSync(cf, "utf8"))[0]?.sha ?? null
    : null;
  if (tree.truncated) console.log(`NOTE ${repo} tree truncated`);
  // dedupe basenames across layouts (skills/ vs plugins/): keep shortest path
  const byBase = new Map();
  for (const e of tree.tree) {
    if (e.type !== "blob" || !e.path.endsWith("/SKILL.md")) continue;
    const dir = e.path.slice(0, -"/SKILL.md".length);
    const base = dir.split("/").pop();
    const k = base.toLowerCase();
    if (!byBase.has(k) || dir.length < byBase.get(k).length) byBase.set(k, dir);
  }
  let n = 0;
  for (const [k, dir] of byBase) {
    const base = dir.split("/").pop();
    if (cat.has(base) || catLower.has(k)) continue;
    out.push({
      name: base,
      repo,
      ref: "main",
      path: dir,
      pin,
      reason: repo.startsWith("anthropics/") ? "official-anthropic" : "upstream-only",
    });
    n++;
  }
  console.log(`OK ${repo}: ${n} candidates`);
}
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(`total=${out.length} -> ${OUT}`);
