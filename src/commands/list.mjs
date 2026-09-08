import { loadCatalog, filterRecords, sortRecords } from "../lib/catalog.mjs";
import { table, paint, truncate } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

export const command = {
  name: "list",
  usage: "list [--category X] [--tool X] [--tier X] [--sort name|tokens|files|updated] [--limit N]",
  summary: "list skills with filters",
  flags: {
    category: "string",
    tool: "string",
    tier: "string",
    sort: "string",
    limit: "string",
  },
  run(positionals, options) {
    if (positionals.length > 0) {
      return usageError("list takes filters only, no positional arguments (try: skill-cli search <query>)", command.usage);
    }
    let limit = 50;
    if (options.limit !== undefined) {
      limit = Number(options.limit);
      if (!Number.isInteger(limit) || limit < 1 || limit > 2000) {
        return usageError("--limit must be a whole number from 1 to 2000", command.usage);
      }
    }
    if (options.tier && !["indexed", "reviewed"].includes(options.tier)) {
      return usageError("--tier must be indexed or reviewed", command.usage);
    }

    const { records } = loadCatalog();
    let pool = filterRecords(records, {
      tool: options.tool,
      tier: options.tier,
      category: options.category,
    });
    const sort = options.sort ?? "name";
    let sorted;
    try {
      sorted = sortRecords(pool, sort);
    } catch (err) {
      return usageError(err.message, command.usage);
    }

    const shown = sorted.slice(0, limit);
    if (shown.length === 0) {
      console.log("0 records match the given filters.");
      return CODES.OK;
    }
    const rows = shown.map((r) => [
      paint(r.name, "bold"),
      String(r.tokens),
      String(r.files),
      r.source ?? "-",
      r.tier,
      r.availability,
      r.updated ?? "-",
      truncate(r.description, 44),
    ]);
    console.log(
      table(["SKILL", "TOKENS", "FILES", "SOURCE", "TIER", "AVAIL", "UPDATED", "DESCRIPTION"], rows, {
        min: 4,
        max: 44,
      })
    );
    console.log(
      `${shown.length} of ${pool.length} record${pool.length === 1 ? "" : "s"} (sort: ${sort}${options.tier ? `, tier: ${options.tier}` : ""})`
    );
    return CODES.OK;
  },
};
