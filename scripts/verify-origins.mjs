// verify-origins.mjs — fidelity checks for resolved origins (rev.3).
// Uses raw.githubusercontent.com (NOT rate-limited): downloads candidate
// SKILL.md files at pinned shas, hashes them, compares vs local copies and
// across mirrors. Emits src/data/origin-verification.json.
// Usage: node scripts/verify-origins.mjs [--all | --sample N] [--skills-dir <path>]
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const args = process.argv.slice(2);
const ALL = args.includes("--all");
const sampleIdx = args.indexOf("--sample");
const SAMPLE_N = sampleIdx >= 0 ? parseInt(args[sampleIdx + 1], 10) || 60 : 60;
const dirFlag = args.indexOf("--skills-dir");
const SKILLS_DIR =
  (dirFlag >= 0 && args[dirFlag + 1]) ||
  process.env.SKILLS_DIR ||
  "C:/Users/Admin/Desktop/complete skills";
const OUT = path.resolve("src/data/origin-verification.json");

const origins = JSON.parse(
  fs.readFileSync(path.resolve("src/data/origins.json"), "utf8")
);

function readLocal(name) {
  for (const enc of ["utf8", "latin1"]) {
    try {
      let s = fs.readFileSync(path.join(SKILLS_DIR, name, "SKILL.md"), enc);
      if (enc === "utf8" && s.includes("�")) continue;
      return norm(s);
    } catch {
      return null;
    }
  }
  return null;
}
const norm = (s) => s.replace(/\r\n?/g, "\n").trim();
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex").slice(0, 16);

async function raw(repo, pin, p) {
  if (!pin) return null;
  try {
    const res = await fetch(
      `https://raw.githubusercontent.com/${repo}/${pin}/${p}/SKILL.md`,
      { headers: { "User-Agent": "skill-cli-origin-resolver" } }
    );
    if (!res.ok) return null;
    return norm(await res.text());
  } catch {
    return null;
  }
}

const names = Object.keys(origins);
const resolved = names.filter((n) => origins[n].origin);
const multi = names.filter((n) => !origins[n].origin);
// deterministic sample: every k-th, so reruns are stable
const step = Math.max(1, Math.floor(multi.length / SAMPLE_N));
const sampled = multi.filter((_, i) => i % step === 0).slice(0, SAMPLE_N);
const queue = ALL ? names : [...resolved, ...sampled];

const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, "utf8")) : {};
const out = { ...prev };
let localMatch = 0, localMismatch = 0, mirrorSame = 0, mirrorDiff = 0, failed = 0;

for (const name of queue) {
  const rec = origins[name];
  const cands = rec.origin
    ? [{ repo: rec.origin.repo, ref: rec.origin.ref, path: rec.origin.path, pin: rec.origin.pin }]
    : rec.candidates.filter((c) => c.pin);
  const local = readLocal(name);
  const localSha = local ? sha(local) : null;
  const up = {};
  for (const c of cands.slice(0, 4)) {
    const body = await raw(c.repo, c.pin, c.path);
    if (body === null) {
      up[`${c.repo}:${c.path}`] = null;
      continue;
    }
    up[`${c.repo}:${c.path}`] = sha(body);
    // stash full-text equality vs local without storing bodies
    if (local !== null) {
      if (body === local) localMatch++;
      else localMismatch++;
    }
  }
  const hashes = [...new Set(Object.values(up).filter(Boolean))];
  const entry = {
    local_sha: localSha,
    upstream: up,
    upstream_agree: hashes.length <= 1,
    local_match: localSha ? Object.values(up).includes(localSha) : null,
  };
  if (hashes.length <= 1 && hashes.length > 0) mirrorSame++;
  else if (hashes.length > 1) mirrorDiff++;
  if (!hashes.length) failed++;
  out[name] = entry;
  if (queue.indexOf(name) % 20 === 0) process.stdout.write(`.${queue.indexOf(name)}`);
}
console.log("");
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + "\n");
console.log(
  JSON.stringify({
    checked: queue.length,
    upstream_agree: mirrorSame,
    upstream_disagree: mirrorDiff,
    unverifiable: failed,
    local_copies_identical: localMatch,
    local_copies_differ: localMismatch,
  })
);
