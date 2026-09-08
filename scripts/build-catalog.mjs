import fs from "node:fs";
import path from "node:path";
import { classify } from "./taxonomy.mjs";

const SKILLS_DIR =
  process.env.SKILLS_DIR ?? "C:/Users/Admin/Desktop/complete skills";
const MANIFEST_CSV = path.join(SKILLS_DIR, "_manifest.csv");
const OUT_JSONL = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "catalog.jsonl"
);
const OUT_FAILURES = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "parse-failures.json"
);
const LICENSES_JSON = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "licenses.json"
);
const AI_TAGS_JSON = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "ai-tags.json"
);
const ORIGINS_JSON = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "origins.json"
);
const CORE_PACK_JSON = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "core-pack.json"
);
const CURATED_TOP_JSON = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "curated-top.json"
);
const BLOCKLIST_JSON = path.join(
  import.meta.dirname,
  "..",
  "scripts",
  "blocklist.json"
);

function decodeBuffer(buf) {
  const utf8 = buf.toString("utf8");
  return utf8.includes("\uFFFD") ? buf.toString("latin1") : utf8;
}

function parseQuotedCsv(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!/^".*"$/.test(line)) continue;
    const inner = line.slice(1, -1);
    const fields = inner.split('","').map((f) => {
      const unescaped = f.replace(/\\"/g, '"').replace(/\\\\/g, "\\");
      return unescaped.replace(/^"(.*)"$/, "$1");
    });
    if (fields.length >= 2) rows.push(fields.slice(0, 2));
  }
  return rows;
}

function agentFromPath(p) {
  if (p.includes(".gemini")) return ".gemini";
  if (p.includes(".config") && p.includes("opencode")) return "opencode";
  if (p.includes(".cursor")) return ".cursor";
  if (p.includes(".claude")) return ".claude";
  return p ? "manifest" : "unknown";
}

function readFrontMatter(text) {
  const m = text
    .replace(/^\uFEFF/, "")
    .match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?=\r?\n|$)/);
  if (!m) return null;
  const rawLines = m[1].split(/\r?\n/);
  const data = {};
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    const mm = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1];
    let value = mm[2].trim();
    if (value.length === 0 || /^[|>]-?$/.test(value)) {
      const cont = [];
      while (i + 1 < rawLines.length && /^\s{2,}\S/.test(rawLines[i + 1])) {
        cont.push(rawLines[++i].trim());
      }
      value = cont.join(" ");
    }
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[key] = value.replace(/\s+/g, " ");
  }
  return data;
}

function cleanDescription(desc) {
  const clean = desc.replace(/\s+/g, " ").trim();
  const capped = clean.slice(0, 180);
  return capped !== clean ? capped + "..." : capped;
}

function fallbackDescription(text) {
  const body = text.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*$/, "");
  for (const para of body.split(/\r?\n\r?\n/)) {
    const p = para.replace(/^#{1,6}\s+.*$/m, "").replace(/\s+/g, " ").trim();
    if (p.length >= 30) return p.slice(0, 180) + (p.length > 180 ? "..." : "");
  }
  return "";
}

function estimateTokens(text) {
  return Math.round(text.length / 3.5);
}

function fmLicenseLooksLike(value) {
  return /^(MIT|Apache(?:[- ]2\.0| License)|BSD-?\d|ISC|MPL-?\d|Unlicense|CC0[- ]?1?\.?0?|GPL-?\d|LGPL-?\d|AGPL|Proprietary)([- .]*)/i.test(
    String(value ?? "")
  );
}

function main() {
  const dirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const manifest = new Map();
  if (fs.existsSync(MANIFEST_CSV)) {
    for (const [name, source] of parseQuotedCsv(
      decodeBuffer(fs.readFileSync(MANIFEST_CSV))
    )) {
      if (name && name.trim()) manifest.set(name.trim(), source);
    }
  }

  const licenses = fs.existsSync(LICENSES_JSON)
    ? JSON.parse(decodeBuffer(fs.readFileSync(LICENSES_JSON)))
    : {};
  const aiTags = fs.existsSync(AI_TAGS_JSON)
    ? JSON.parse(decodeBuffer(fs.readFileSync(AI_TAGS_JSON)))
    : {};

  const applyCategory = (name, description, risk) => {
    const ai = Array.isArray(aiTags[name]) ? aiTags[name].slice(0, 3) : null;
    return ai
      ? { category: ai, category_source: "ai" }
      : { category: classify({ name, description, risk }), category_source: "heuristic" };
  };
  const blocklist = fs.existsSync(BLOCKLIST_JSON)
    ? JSON.parse(decodeBuffer(fs.readFileSync(BLOCKLIST_JSON)))
    : {};
  const origins = fs.existsSync(ORIGINS_JSON)
    ? JSON.parse(decodeBuffer(fs.readFileSync(ORIGINS_JSON)))
    : {};
  const corePack = fs.existsSync(CORE_PACK_JSON)
    ? JSON.parse(decodeBuffer(fs.readFileSync(CORE_PACK_JSON)))
    : { approved: [] };
  const coreApproved = new Set(corePack.approved ?? []);
  const curated = fs.existsSync(CURATED_TOP_JSON)
    ? JSON.parse(decodeBuffer(fs.readFileSync(CURATED_TOP_JSON)))
    : { entries: [] };
  const curatedByName = new Map(
    (curated.entries ?? []).map((e) => [e.name, e])
  );

  // rev.3 availability: core (approved mini-core) | fetchable (pinned origin)
  // | index-only (everything else; offensive always index-only)
  const resolveAvailability = (name, risk) => {
    const raw = origins[name]?.origin ?? null;
    // catalog carries only usable origins (repo + path); repo-only leads
    // stay in origins.json as candidates until trees resolve them
    const o = raw && raw.repo && raw.path ? raw : null;
    if (risk === "offensive") return { availability: "index-only", origin: o };
    if (coreApproved.has(name)) return { availability: "core", origin: o };
    if (o && o.pin) return { availability: "fetchable", origin: o };
    return { availability: "index-only", origin: o };
  };

  const records = [];
  const failures = [];
  const blocked = [];
  let shortDesc = 0;

  for (const name of dirs) {
    if (Object.prototype.hasOwnProperty.call(blocklist, name)) {
      blocked.push(name);
      continue;
    }
    const skillDir = path.join(SKILLS_DIR, name);
    const skillFiles = fs
      .readdirSync(skillDir, { withFileTypes: true })
      .filter((f) => f.isFile());
    const skillMd = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillMd)) {
      failures.push(`${name}: no SKILL.md`);
      continue;
    }
    const text = decodeBuffer(fs.readFileSync(skillMd));
    const fm = readFrontMatter(text);
    const det = licenses[name];
    const fmLicense = fm?.license && fmLicenseLooksLike(fm.license) ? fm.license : null;
    if (!fm) {
      const description = cleanDescription(fallbackDescription(text));
      if (!description) {
        failures.push(`${name}: no front-matter`);
        continue;
      }
      const cat = applyCategory(name, description, "unknown");
      const av = resolveAvailability(name, "unknown");
      const cu = curatedByName.get(name);
      records.push({
        name,
        fm_name: null,
        description,
        category: cat.category,
        category_source: cat.category_source,
        risk: "unknown",
        source: "no-front-matter",
        license: det?.license ?? fmLicense,
        license_level: det?.license ? det.level : null,
        attribution: det?.attribution ?? null,
        tokens: estimateTokens(text),
        files: skillFiles.length,
        tier: cu ? "reviewed" : "indexed",
        curated_rank: cu?.rank ?? null,
        curated_note: cu?.note ?? null,
        availability: av.availability,
        origin: av.origin,
        updated: new Date().toISOString().slice(0, 10),
      });
      continue;
    }
    const rawDescription = (fm.description ?? fm.Description ?? "").trim();
    const description = cleanDescription(rawDescription);
    if (description.length < 10) shortDesc++;

    const mergedLicense = fmLicense ?? det?.license ?? null;
    const risk = fm.risk ?? "unknown";
    const cat = applyCategory(name, rawDescription, risk);
    const av = resolveAvailability(name, risk);
    const cu = curatedByName.get(name);
    records.push({
      name,
      fm_name: fm.name && fm.name !== name ? fm.name : null,
      description: description || `(no description)`,
      category: cat.category,
      category_source: cat.category_source,
      risk,
      source:
        (manifest.has(name) ? agentFromPath(manifest.get(name)) : null) ||
        fm.source ||
        "unknown",
      license: mergedLicense,
      license_level: fmLicense
        ? "front-matter"
        : (det?.license ? det.level : null),
      attribution: det?.attribution ?? null,
      tokens: estimateTokens(text),
      files: skillFiles.length,
      tier: cu ? "reviewed" : "indexed",
      curated_rank: cu?.rank ?? null,
      curated_note: cu?.note ?? null,
      availability: av.availability,
      origin: av.origin,
      updated: new Date().toISOString().slice(0, 10),
    });
  }

  const outDir = path.dirname(OUT_JSONL);
  fs.mkdirSync(outDir, { recursive: true });
  // size discipline: omit null/undefined fields (consumers all use ?. / ??).
  // Keeps the catalog under the 1 MB budget as origins + curation grow.
  const stripNulls = (r) =>
    Object.fromEntries(Object.entries(r).filter(([, v]) => v !== null && v !== undefined));
  fs.writeFileSync(
    OUT_JSONL,
    records.map((r) => JSON.stringify(stripNulls(r))).join("\n") + "\n"
  );

  const bytes = fs.statSync(OUT_JSONL).size;
  const totalTokens = records.reduce((s, r) => s + r.tokens, 0);

  console.log(JSON.stringify({
    skills_dir: SKILLS_DIR,
    records: records.length,
    failures: failures.length,
    blocked: blocked,
    short_descriptions: shortDesc,
    fmt: {
      with_risk: records.filter((r) => r.risk !== "unknown").length,
      risk_unknown: records.filter((r) => r.risk === "unknown").length,
      license_found: records.filter((r) => r.license).length,
      license_levels: Object.fromEntries(
        records
          .filter((r) => r.license_level)
          .reduce((m, r) => m.set(r.license_level, (m.get(r.license_level) ?? 0) + 1), new Map())
      ),
      with_attribution: records.filter((r) => r.attribution).length,
      categorized: records.filter((r) => Array.isArray(r.category) && r.category.length > 0).length,
      uncategorized_misc: records.filter((r) => r.category?.[0] === "misc").length,
      category_sources: Object.fromEntries(
        records
          .reduce((m, r) => m.set(r.category_source ?? "none", (m.get(r.category_source ?? "none") ?? 0) + 1), new Map())
      ),
      manifest_matched: records.filter((r) =>
        ["opencode", ".gemini", ".cursor", ".claude", "manifest"].includes(r.source)
      ).length,
      availability: Object.fromEntries(
        records
          .reduce((m, r) => m.set(r.availability ?? "none", (m.get(r.availability ?? "none") ?? 0) + 1), new Map())
      ),
      origins_resolved: records.filter((r) => r.origin?.repo).length,
      origins_pinned: records.filter((r) => r.origin?.pin).length,
      tier_reviewed: records.filter((r) => r.tier === "reviewed").length,
    },
    catalog_bytes: bytes,
    total_tokens_estimate: totalTokens,
    avg_tokens_per_skill: Math.round(totalTokens / records.length),
    top_categories: Object.fromEntries(
      Array.from(records.flatMap((r) => r.category ?? []).reduce((m, c) => m.set(c, (m.get(c) ?? 0) + 1), new Map()).entries()).sort((a, b) => b[1] - a[1]).slice(0, 15)
    ),
    out: OUT_JSONL,
  }, null, 2));

  fs.writeFileSync(OUT_FAILURES, JSON.stringify(failures, null, 2));
  if (failures.length) {
    console.log(`failures written to ${OUT_FAILURES}`);
  }
}

main();
