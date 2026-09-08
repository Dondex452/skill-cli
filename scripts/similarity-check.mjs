// similarity-check.mjs — drift triage for unresolved origins.
// For each unresolved skill: download local + candidate copies (raw, unmetered),
// strip front-matter, token-Jaccard similarity. Tiers:
//   >=0.85 same-evolved | 0.50-0.85 drifted-related | <0.50 possible-collision
// Emits src/data/origin-similarity.json. Usage: node scripts/similarity-check.mjs
import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR =
  process.env.SKILLS_DIR || "C:/Users/Admin/Desktop/complete skills";
const OUT = path.resolve("src/data/origin-similarity.json");
const CONC = 10;

const origins = JSON.parse(
  fs.readFileSync(path.resolve("src/data/origins.json"), "utf8")
);

const stripFm = (s) =>
  s.replace(/^--- *\r?\n[\s\S]*?\r?\n--- *(\r?\n|$)/, "");
const toks = (s) =>
  new Set(
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 4)
  );
const jaccard = (a, b) => {
  let i = 0;
  for (const w of a) if (b.has(w)) i++;
  return i / Math.max(1, Math.min(a.size, b.size));
};
const norm = (s) => s.replace(/\r\n?/g, "\n").trim();

function readLocal(name) {
  try {
    let s = fs.readFileSync(path.join(SKILLS_DIR, name, "SKILL.md"), "utf8");
    if (s.includes("�")) s = fs.readFileSync(path.join(SKILLS_DIR, name, "SKILL.md"), "latin1");
    return norm(s);
  } catch {
    return null;
  }
}
async function raw(repo, pin, p) {
  if (!pin) return null;
  try {
    const r = await fetch(
      `https://raw.githubusercontent.com/${repo}/${pin}/${p}/SKILL.md`,
      { headers: { "User-Agent": "skill-cli-origin-resolver" } }
    );
    if (!r.ok) return null;
    return norm(await r.text());
  } catch {
    return null;
  }
}

const queue = Object.keys(origins).filter((n) => !origins[n].origin);
const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const out = { ...prev };
let done = 0;

async function one(name) {
  const local = readLocal(name);
  if (!local) {
    out[name] = { tier: "no-local", sim: 0 };
    return;
  }
  const lt = toks(stripFm(local));
  let best = { repo: null, path: null, sim: 0 };
  for (const c of origins[name].candidates.filter((c) => c.pin).slice(0, 4)) {
    const body = await raw(c.repo, c.pin, c.path);
    if (!body) continue;
    const s = jaccard(lt, toks(stripFm(body)));
    if (s > best.sim) best = { repo: c.repo, path: c.path, sim: +s.toFixed(3) };
  }
  out[name] = {
    best_repo: best.repo,
    best_path: best.path,
    sim: best.sim,
    tier:
      best.sim >= 0.85
        ? "same-evolved"
        : best.sim >= 0.5
          ? "drifted-related"
          : best.sim > 0
            ? "possible-collision"
            : "unverifiable",
  };
}

for (let i = 0; i < queue.length; i += CONC) {
  await Promise.all(queue.slice(i, i + CONC).map(one));
  done += Math.min(CONC, queue.length - i);
  if (done % 100 === 0 || done === queue.length)
    console.log(`progress ${done}/${queue.length}`);
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n"); // incremental
}
const tiers = {};
for (const v of Object.values(out)) tiers[v.tier] = (tiers[v.tier] ?? 0) + 1;
console.log(JSON.stringify({ checked: queue.length, tiers }));
