import fs from "node:fs";
import path from "node:path";
import { VALID_IDS } from "./taxonomy.mjs";

const CATALOG = path.join(import.meta.dirname, "..", "src", "data", "catalog.jsonl");
const AI_TAGS = path.join(import.meta.dirname, "..", "src", "data", "ai-tags.json");

function main() {
  if (!fs.existsSync(CATALOG)) {
    console.error("SKIP: catalog.jsonl not found. Run npm run build:catalog first.");
    process.exit(1);
  }

  const lines = fs.readFileSync(CATALOG, "utf8").split(/\r?\n/).filter(Boolean);
  const recs = lines.map((l) => JSON.parse(l));

  const issues = [];
  const seen = new Map();
  for (const r of recs) {
    if (!r.name) issues.push(`empty name: ${JSON.stringify(r)}`);
    if (seen.has(r.name)) issues.push(`duplicate name: ${r.name}`);
    seen.set(r.name, true);
    if (!r.description || r.description.length < 5)
      issues.push(`short description: ${r.name}`);
    if (!r.tier) issues.push(`missing tier: ${r.name}`);
    if (!["core", "fetchable", "index-only"].includes(r.availability))
      issues.push(`bad availability: ${r.name}`);
    if (r.risk === "offensive" && r.availability !== "index-only")
      issues.push(`offensive not index-only: ${r.name}`);
    if (r.availability === "fetchable") {
      if (!r.origin?.repo || !r.origin?.path || !r.origin?.ref || !r.origin?.pin)
        issues.push(`fetchable without pinned origin: ${r.name}`);
    }
    if (r.origin && (!r.origin.repo || !r.origin.path))
      issues.push(`malformed origin: ${r.name}`);
    if (r.tier === "reviewed" && (!r.curated_rank || !r.curated_note))
      issues.push(`reviewed without curation: ${r.name}`);
    if (typeof r.tokens !== "number" || r.tokens <= 0)
      issues.push(`bad tokens: ${r.name}`);
    if (!Array.isArray(r.category) || r.category.length === 0)
      issues.push(`no category: ${r.name}`);
    else
      for (const c of r.category)
        if (!VALID_IDS.has(c)) issues.push(`invalid category "${c}": ${r.name}`);
    if (r.category_source && !["heuristic", "ai", "human"].includes(r.category_source))
      issues.push(`bad category_source: ${r.name}`);
  }

  const bytes = fs.statSync(CATALOG).size;
  const status = issues.length === 0 ? "PASS" : "FAIL";

  const aiStats = { entries: 0, applied: 0 };
  if (fs.existsSync(AI_TAGS)) {
    const aiTags = JSON.parse(fs.readFileSync(AI_TAGS, "utf8"));
    const names = new Set(recs.map((r) => r.name));
    for (const [name, cats] of Object.entries(aiTags)) {
      aiStats.entries++;
      if (!names.has(name)) issues.push(`ai-tag for unknown skill: ${name}`);
      if (!Array.isArray(cats) || cats.length === 0 || cats.length > 3)
        issues.push(`ai-tag bad count: ${name}`);
      for (const c of cats)
        if (!VALID_IDS.has(c)) issues.push(`ai-tag invalid category "${c}": ${name}`);
    }
    aiStats.applied = recs.filter((r) => r.category_source === "ai").length;
  }

  const avail = {};
  for (const r of recs) avail[r.availability] = (avail[r.availability] ?? 0) + 1;

  // Phase 4.0 license gate (mini-core only): every approved skill ships as a
  // file, so each needs a permissive license + attribution + safe risk.
  const corePath = path.join(import.meta.dirname, "..", "src", "data", "core-pack.json");
  const coreDir = path.join(import.meta.dirname, "..", "skills-core");
  if (fs.existsSync(corePath)) {
    const corePack = JSON.parse(fs.readFileSync(corePath, "utf8"));
    const byName = new Map(recs.map((r) => [r.name, r]));
    for (const name of corePack.approved ?? []) {
      const r = byName.get(name);
      if (!r) issues.push(`core-pack unknown skill: ${name}`);
      else {
        if (!/^(mit|apache|bsd|isc|mpl|unlicense|cc0|zlib)/i.test(r.license ?? ""))
          issues.push(`core-pack non-permissive license: ${name} (${r.license})`);
        if (!r.attribution) issues.push(`core-pack missing attribution: ${name}`);
        if (r.risk === "offensive") issues.push(`core-pack offensive: ${name}`);
        if (r.availability !== "core") issues.push(`core-pack not core: ${name}`);
      }
      if (!fs.existsSync(path.join(coreDir, name, "SKILL.md")))
        issues.push(`core-pack files missing: ${name}`);
    }
  }

  const curatedPath = path.join(import.meta.dirname, "..", "src", "data", "curated-top.json");
  if (fs.existsSync(curatedPath)) {
    const curated = JSON.parse(fs.readFileSync(curatedPath, "utf8"));
    const names = new Set(recs.map((r) => r.name));
    for (const e of curated.entries ?? []) {
      if (!names.has(e.name)) issues.push(`curated-top unknown skill: ${e.name}`);
      if (!e.note) issues.push(`curated-top missing note: ${e.name}`);
    }
    const reviewed = recs.filter((r) => r.tier === "reviewed").length;
    if (reviewed !== (curated.entries ?? []).length)
      issues.push(`reviewed count ${reviewed} != curated-top ${(curated.entries ?? []).length}`);
  }

  console.log(JSON.stringify({
    status,
    records: recs.length,
    issues: issues.length,
    catalog_bytes: bytes,
    catalog_kb: (bytes / 1024).toFixed(1),
    availability: avail,
    origins_pinned: recs.filter((r) => r.origin?.pin).length,
    ai_tags: aiStats,
  }, null, 2));

  if (issues.length) {
    console.log(issues.slice(0, 25).join("\n"));
    process.exit(1);
  }
}

main();
