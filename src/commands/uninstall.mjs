import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { detectAgentDirs } from "../lib/paths.mjs";
import { modifiedFiles, removeSkill, readState } from "../lib/install.mjs";
import { paint } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

function isYes(answer) {
  return ["y", "yes"].includes(String(answer).trim().toLowerCase());
}

function readStdinLine() {
  try {
    return fs.readFileSync(0, "utf8").trim();
  } catch {
    return "";
  }
}

function askQuestion(rl, prompt) {
  return new Promise((resolve) => rl.question(prompt, (a) => resolve(a)));
}

async function confirm(question, yesFlag) {
  if (yesFlag) return true;
  if (!process.stdin.isTTY) return isYes(readStdinLine());
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  try {
    return isYes(await askQuestion(rl, question));
  } finally {
    rl.close();
  }
}

export const command = {
  name: "uninstall",
  usage: "uninstall <name> [-d DIR] [--yes]",
  summary: "remove an installed skill (asks before deleting modified files)",
  flags: { dir: "string", yes: "boolean" },
  async run(positionals, options) {
    const name = positionals.join(" ").trim();
    if (!name) return usageError("uninstall needs a skill name", command.usage);

    let agentDir = options.dir;
    if (!agentDir) {
      const found = detectAgentDirs().find((d) => d.found);
      if (!found) return usageError("pass --dir <agentDir>", command.usage);
      agentDir = found.dir;
    }
    if (!fs.existsSync(agentDir) || !fs.statSync(agentDir).isDirectory()) {
      return usageError(`agent dir not found: ${agentDir}`, command.usage);
    }

    const skillDir = path.join(agentDir, name);
    const modified = modifiedFiles(agentDir, name);
    if (!modified) {
      if (readState(agentDir)[name]) {
        removeSkill(agentDir, name);
        console.log(`removed stale state for "${name}" (files already gone).`);
        return CODES.OK;
      }
      console.error(`not installed: "${name}" in ${agentDir}`);
      return CODES.NOT_FOUND;
    }

    if (modified.length > 0 && !options.yes) {
      const lines = modified.map((m) => `    ${m.file} (${m.kind})`).join("\n");
      console.log(
        paint(`files changed since install in ${paint(name, "bold")}:`, "yellow") + "\n" + lines
      );
      const ok = await confirm("Remove anyway? [y/N] ", false);
      if (!ok) {
        console.error("aborted: nothing removed.");
        return CODES.CONFLICT;
      }
    }

    removeSkill(agentDir, name);
    console.log(`removed ${name} from ${agentDir}`);
    return CODES.OK;
  },
};
