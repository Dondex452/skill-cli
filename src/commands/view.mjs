import { loadCatalog, byName } from "../lib/catalog.mjs";
import { paint } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

export const command = {
  name: "view",
  usage: "view <name> [--json]",
  summary: "show skill details + availability",
  flags: { json: "boolean" },
  run(positionals, options) {
    const name = positionals.join(" ").trim();
    if (!name) {
      return usageError("view needs a skill name", command.usage);
    }
    const { records } = loadCatalog();
    const record = byName(records, name);
    if (!record) {
      console.error(`skill not found: "${name}" (try: skill-cli search ${name})`);
      return CODES.NOT_FOUND;
    }

    if (options.json) {
      console.log(JSON.stringify(record, null, 2));
      return CODES.OK;
    }

    const line = (label, value) => console.log(`${paint(label.padEnd(15), "dim")}${value}`);
    console.log(paint(record.name, "bold"));
    if (record.fm_name && record.fm_name !== record.name) {
      console.log(paint(`(front-matter name: ${record.fm_name})`, "dim"));
    }
    line("Description", record.description || "(no description)");
    line("Source", record.source ?? "unknown");
    line("Risk", record.risk ?? "unknown");
    line("License", record.license ?? "unknown");
    line("Tokens", String(record.tokens));
    line("Files", String(record.files));
    line("Tier", record.tier);
    if (record.tier === "reviewed") {
      line("Curated", `#${record.curated_rank ?? "?"}`);
      if (record.curated_note) line("Curator note", record.curated_note);
    }
    line("Availability", record.availability);
    line("Updated", record.updated ?? "-");
    if (record.availability === "fetchable") {
      console.log(
        paint(
          "fetchable: origin pinned, but fetch-install isn't built yet (Phase 2.4). Only core-pack skills install today.",
          "yellow"
        )
      );
    } else if (record.availability === "index-only") {
      console.log(
        paint(
          "index-only: no verified install source. Run: skill-cli request <name> to ask for it to be added.",
          "yellow"
        )
      );
    }
    return CODES.OK;
  },
};
