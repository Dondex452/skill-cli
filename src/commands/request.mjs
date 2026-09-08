import { spawn } from "node:child_process";
import { loadCatalog, byName } from "../lib/catalog.mjs";
import { paint, truncate } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

const DEFAULT_REPO = "Dondex452/skill-cli";

export function requestUrl(repo, record) {
  const title = `skill-cli: add to core pack: ${record.name}`;
  const body = [
    `Request to promote \`${record.name}\` into the core pack.`,
    "",
    `Description: ${truncate(record.description ?? "(none)", 200)}`,
    `Source tool: ${record.source ?? "unknown"}`,
    `Tokens: ${record.tokens}`,
    `Files: ${record.files}`,
    `License: ${record.license ?? "unknown (attribution verification needed)"}`,
  ].join("\n");
  return `https://github.com/${repo}/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`;
}

function openUrl(url) {
  const cmd = process.platform === "win32" ? "start" : process.platform === "darwin" ? "open" : "xdg-open";
  try {
    const child = spawn(cmd, [url], { detached: true, stdio: "ignore" });
    child.on("error", () => {});
    child.unref();
    return true;
  } catch {
    return false;
  }
}

export const command = {
  name: "request",
  usage: "request <name> [--dry-run]",
  summary: "ask to promote an index-only skill into the core pack",
  flags: { "dry-run": "boolean" },
  run(positionals, options) {
    const name = positionals.join(" ").trim();
    if (!name) return usageError("request needs a skill name", command.usage);
    const repo = process.env.SKILL_CLI_REPO || DEFAULT_REPO;

    const { records } = loadCatalog();
    const record = byName(records, name);
    if (!record) {
      console.error(`skill not found: "${name}" (try: skill-cli search ${name})`);
      return CODES.NOT_FOUND;
    }
    if (record.availability === "core") {
      console.log(paint(`"${record.name}" is already in the core pack — nothing to request.`, "green"));
      return CODES.OK;
    }
    const url = requestUrl(repo, record);
    if (options["dry-run"]) {
      console.log(url);
      return CODES.OK;
    }
    openUrl(url);
    console.log(`opened request for "${record.name}": ${url}`);
    return CODES.OK;
  },
};
