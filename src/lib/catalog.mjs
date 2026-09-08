import fs from "node:fs";
import { fileURLToPath } from "node:url";

export const DEFAULT_CATALOG = fileURLToPath(
  new URL("../data/catalog.jsonl", import.meta.url)
);

export function defaultCatalogPath() {
  return process.env.SKILL_CLI_CATALOG || DEFAULT_CATALOG;
}

export function loadCatalog(filePath = defaultCatalogPath()) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `catalog not found: ${filePath} (run "npm run build:catalog" or set SKILL_CLI_CATALOG)`
    );
  }
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/).filter(Boolean);
  const records = [];
  const errors = [];
  for (const [i, line] of lines.entries()) {
    try {
      const r = JSON.parse(line);
      if (r && typeof r.name === "string" && r.name) records.push(r);
      else errors.push(`line ${i + 1}: missing name`);
    } catch (err) {
      errors.push(`line ${i + 1}: ${err.message}`);
    }
  }
  const seen = new Map();
  for (const r of records) {
    if (seen.has(r.name)) errors.push(`duplicate name: ${r.name}`);
    seen.set(r.name, true);
  }
  return { filePath, records, errors };
}

export function byName(records, name) {
  const wanted = String(name).trim().toLowerCase();
  return records.find((r) => r.name.toLowerCase() === wanted) ?? null;
}

export function filterRecords(records, { tool, tier, category } = {}) {
  return records.filter((r) => {
    if (tool && r.source !== tool) return false;
    if (tier && r.tier !== tier) return false;
    if (category) {
      const hay = [
        ...(Array.isArray(r.category) ? r.category : []),
        ...(Array.isArray(r.tags) ? r.tags : []),
      ].map((c) => String(c).toLowerCase());
      if (!hay.some((c) => c.includes(category.toLowerCase()))) return false;
    }
    return true;
  });
}

export function sortRecords(records, sort = "name") {
  const sorted = [...records];
  const comparators = {
    name: (a, b) => a.name.localeCompare(b.name),
    tokens: (a, b) => (a.tokens ?? 0) - (b.tokens ?? 0),
    files: (a, b) => (a.files ?? 0) - (b.files ?? 0),
    updated: (a, b) =>
      String(b.updated ?? "").localeCompare(String(a.updated ?? "")),
  };
  const cmp = comparators[sort];
  if (!cmp) throw new Error(`unsupported sort: ${sort} (name|tokens|files|updated)`);
  return sorted.sort(cmp);
}
