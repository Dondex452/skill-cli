import fs from "node:fs";
import { loadCatalog } from "../lib/catalog.mjs";
import { paint } from "../lib/output.mjs";
import { CODES } from "../lib/exit.mjs";

function countBy(records, key) {
  const m = new Map();
  for (const r of records) {
    const v = String(r[key] ?? "unknown");
    m.set(v, (m.get(v) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function formatCounts(entries) {
  return entries.map(([k, n]) => `${k} ${n}`).join(" · ");
}

export const command = {
  name: "stats",
  usage: "stats [--json]",
  summary: "catalog stats + health check",
  flags: { json: "boolean" },
  run(_positionals, options) {
    const { records, errors, filePath } = loadCatalog();
    const total = records.length;
    const tokensTotal = records.reduce((s, r) => s + (r.tokens ?? 0), 0);
    const licenseKnown = records.filter((r) => r.license).length;
    const bytes = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
    const data = {
      file: filePath,
      bytes,
      records: total,
      parse_errors: errors.length,
      tier: Object.fromEntries(countBy(records, "tier")),
      availability: Object.fromEntries(countBy(records, "availability")),
      risk: Object.fromEntries(countBy(records, "risk")),
      sources: Object.fromEntries(countBy(records, "source")),
      license_known: licenseKnown,
      license_unknown: total - licenseKnown,
      tokens: {
        total: tokensTotal,
        avg_per_skill: Math.round(tokensTotal / Math.max(1, total)),
        per_record_bytes: Math.round(bytes / Math.max(1, total)),
      },
    };

    if (options.json) {
      console.log(JSON.stringify(data, null, 2));
      return CODES.OK;
    }

    const health = errors.length === 0 ? "ok" : `${errors.length} parse issue(s)`;
    console.log(paint(`CATALOG STATS  ·  ${health}`, "bold"));
    console.log(paint(`${data.file}  (${(bytes / 1024).toFixed(1)} KB)`, "dim"));
    console.log(`records:              ${total}`);
    console.log(`tier:                 ${formatCounts(countBy(records, "tier"))}`);
    console.log(`availability:         ${formatCounts(countBy(records, "availability"))}`);
    console.log(`risk:                 ${formatCounts(countBy(records, "risk"))}`);
    console.log(`source tools:         ${formatCounts(countBy(records, "source"))}`);
    console.log(`license:              ${licenseKnown} known · ${total - licenseKnown} unknown`);
    console.log(`tokens:               ${tokensTotal} total · ${data.tokens.avg_per_skill} avg per skill`);
    console.log(`size:                 ${(bytes / 1024).toFixed(1)} KB (${data.tokens.per_record_bytes} B per record)`);
    for (const err of errors.slice(0, 10)) {
      console.log(`  problem: ${err}`);
    }
    if (!bytes) console.log(paint("warning: catalog file is empty", "yellow"));
    return CODES.OK;
  },
};
