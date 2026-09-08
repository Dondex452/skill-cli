import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { loadCatalog, byName, filterRecords } from "../lib/catalog.mjs";
import { paint, truncate } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

export function defaultCuratedPath() {
  return (
    process.env.SKILL_CLI_CURATED ||
    fileURLToPath(new URL("../data/curated-top.json", import.meta.url))
  );
}

export function loadCurated(filePath = defaultCuratedPath()) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `curated list not found: ${filePath} (set SKILL_CLI_CURATED)`
    );
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const entries = [...(data.entries ?? [])].sort((a, b) => a.rank - b.rank);
  return { entries, meta: data.meta ?? {} };
}

export const command = {
  name: "top",
  usage: "top [n] [--category X]",
  summary: "curated best-of list (reviewed tier)",
  flags: { category: "string" },
  run(positionals, options) {
    let n = 20;
    if (positionals.length > 1) {
      return usageError("top takes at most one number (try: skill-cli top 20)", command.usage);
    }
    if (positionals.length === 1) {
      n = Number(positionals[0]);
      if (!Number.isInteger(n) || n < 1 || n > 1000) {
        return usageError("top n must be a whole number from 1 to 1000", command.usage);
      }
    }

    let curated;
    try {
      curated = loadCurated();
    } catch (err) {
      console.error(`error: ${err.message}`);
      return CODES.USAGE;
    }
    const { records } = loadCatalog();
    const pool = curated.entries.filter((e) => byName(records, e.name));
    const skipped = curated.entries.length - pool.length;

    let ranked = pool;
    if (options.category) {
      const probe = filterRecords(
        pool.map((e) => byName(records, e.name)),
        { category: options.category }
      );
      const keep = new Set(probe.map((r) => r.name.toLowerCase()));
      ranked = pool.filter((e) => keep.has(e.name.toLowerCase()));
    }
    const shown = ranked.slice(0, n);
    if (shown.length === 0) {
      console.log("0 curated skills match the given filters.");
      return CODES.OK;
    }
    for (const e of shown) {
      const r = byName(records, e.name);
      const avail =
        r.availability === "core"
          ? paint("core", "green")
          : r.availability === "fetchable"
            ? paint("fetchable", "dim")
            : paint("index-only", "yellow");
      console.log(
        `${paint(String(e.rank).padStart(3), "bold")}  ${paint(e.name, "bold")}  ${avail}\n     ${truncate(e.note ?? r.description ?? "", 100)}`
      );
    }
    console.log(
      `${shown.length} of ${ranked.length} curated` +
        (options.category ? ` (category: ${options.category})` : "") +
        (skipped > 0 ? ` (${skipped} curated entries not in catalog)` : "")
    );
    return CODES.OK;
  },
};
