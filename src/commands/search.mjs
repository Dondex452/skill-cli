import { loadCatalog, filterRecords } from "../lib/catalog.mjs";
import { searchCatalog } from "../lib/search.mjs";
import { table, paint, truncate } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

export const command = {
  name: "search",
  usage: "search <query> [--limit N] [--tool X]",
  summary: "ranked search over the catalog",
  flags: { limit: "string", tool: "string" },
  run(positionals, options) {
    const query = positionals.join(" ").trim();
    if (!query) {
      return usageError("search needs a query", command.usage);
    }
    let limit = 10;
    if (options.limit !== undefined) {
      limit = Number(options.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 500) {
        return usageError("--limit must be a whole number from 1 to 500", command.usage);
      }
    }

    const { records } = loadCatalog();
    const pool = options.tool ? filterRecords(records, { tool: options.tool }) : records;
    const results = searchCatalog(pool, query);

    if (results.length === 0) {
      console.log(`0 results for "${query}" (catalog: ${records.length} records)`);
      return CODES.OK;
    }

    const rows = results.slice(0, limit).map(({ score, record }, i) => [
      String(i + 1),
      paint(record.name, "bold"),
      String(score),
      String(record.tokens),
      record.source ?? "-",
      record.tier,
      record.availability,
      truncate(record.description, 48),
    ]);
    console.log(
      table(["#", "SKILL", "SCORE", "TOKENS", "SOURCE", "TIER", "AVAIL", "DESCRIPTION"], rows, {
        min: 4,
        max: 48,
      })
    );
    const shown = Math.min(results.length, limit);
    console.log(
      `${shown} of ${results.length} result${results.length === 1 ? "" : "s"} (catalog: ${records.length} records)`
    );
    return CODES.OK;
  },
};
