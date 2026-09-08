import fs from "node:fs";
import { loadCatalog, byName } from "../lib/catalog.mjs";
import { detectAgentDirs } from "../lib/paths.mjs";
import { copySkill, resolveSourceRoot, permissiveLicense } from "../lib/install.mjs";
import { paint } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

export const command = {
  name: "install",
  usage: "install <name> [--dir <agentDir>]",
  summary: "copy a core-pack skill into your agent folder",
  flags: { dir: "string" },
  run(positionals, options) {
    const name = positionals.join(" ").trim();
    if (!name) return usageError("install needs a skill name", command.usage);

    const { records } = loadCatalog();
    const record = byName(records, name);
    if (!record) {
      console.error(`skill not found: "${name}" (try: skill-cli search ${name})`);
      return CODES.NOT_FOUND;
    }
    if (record.availability === "fetchable") {
      console.error(
        `"${record.name}" is fetchable (origin pinned) but fetch-install ` +
          "isn't built yet (Phase 2.4). Only core-pack skills install today."
      );
      return CODES.UNAVAILABLE;
    }
    if (record.availability !== "core") {
      console.error(
        `"${record.name}" is index-only — no verified install source. ` +
          `Run: skill-cli request ${record.name} to ask for it to be added.`
      );
      return CODES.UNAVAILABLE;
    }
    const license = permissiveLicense(record.license);
    if (!license) {
      console.error(
        `license gate: "${record.license ?? "unknown"}" is not a recognized permissive ` +
          `license for "${record.name}". Attribution must be verified before shipping (see BUILD_SCHEMA.md Phase 4.0).`
      );
      return CODES.UNAVAILABLE;
    }
    if (record.risk === "offensive") {
      console.error(`risk gate: "${record.name}" is flagged risk: offensive — refusing to install.`);
      return CODES.UNAVAILABLE;
    }
    const sourceRoot = resolveSourceRoot();
    if (!sourceRoot) {
      console.error(
        "core pack not found on this system. Run from the repo (skills-core/) or set SKILL_CLI_SOURCE_DIR."
      );
      return CODES.UNAVAILABLE;
    }

    let agentDir = options.dir;
    if (!agentDir) {
      const found = detectAgentDirs().find((d) => d.found);
      if (!found) {
        return usageError(
          "no agent skill dir found — pass --dir <path> (or run: skill-cli init <dir>)",
          command.usage
        );
      }
      agentDir = found.dir;
    }
    if (!fs.existsSync(agentDir) || !fs.statSync(agentDir).isDirectory()) {
      return usageError(
        `agent dir not found: ${agentDir} (run: skill-cli init ${agentDir})`,
        command.usage
      );
    }

    let result;
    try {
      result = copySkill(sourceRoot, record.name, agentDir);
    } catch (err) {
      if (String(err.message).startsWith("already installed")) {
        console.error(`error: ${err.message}`);
        return CODES.CONFLICT;
      }
      console.error(`error: ${err.message}`);
      return CODES.UNAVAILABLE;
    }

    console.log(
      paint(`installed ${record.name} -> ${result.dest}`, "green") +
        `  (${result.files} file${result.files === 1 ? "" : "s"}, ~${record.tokens} tokens)`
    );
    console.log(paint(`license: ${license} · source tool: ${record.source}`, "dim"));
    return CODES.OK;
  },
};
