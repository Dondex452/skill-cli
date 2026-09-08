#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
import { paint } from "./lib/output.mjs";
import { CODES } from "./lib/exit.mjs";
import * as searchCmd from "./commands/search.mjs";
import * as viewCmd from "./commands/view.mjs";
import * as listCmd from "./commands/list.mjs";
import * as statsCmd from "./commands/stats.mjs";
import * as doctorCmd from "./commands/doctor.mjs";
import * as installCmd from "./commands/install.mjs";
import * as uninstallCmd from "./commands/uninstall.mjs";
import * as requestCmd from "./commands/request.mjs";
import * as initCmd from "./commands/init.mjs";
import * as topCmd from "./commands/top.mjs";

const VERSION = JSON.parse(
  fs.readFileSync(new URL("../package.json", import.meta.url), "utf8")
).version;

const PLANNED = [];

const COMMANDS = [
  searchCmd.command,
  viewCmd.command,
  listCmd.command,
  statsCmd.command,
  doctorCmd.command,
  installCmd.command,
  uninstallCmd.command,
  requestCmd.command,
  initCmd.command,
  topCmd.command,
].map((c) => ({ ...c, status: "ready" }));

const REGISTRY = [
  ...COMMANDS,
  ...PLANNED.filter((p) => !COMMANDS.find((c) => c.name === p.name)).map((p) => ({
    ...p,
    flags: {},
    run() {
      console.error(
        `\`${p.name}\` is planned but not built yet (see BUILD_SCHEMA.md). It is listed here so the CLI contract is visible.`
      );
      return CODES.USAGE;
    },
  })),
];

const FLAG_HINTS = {
  help: "show this help",
  limit: "max results to show",
  tool: "only skills from this source tool (opencode|.gemini|.cursor|.claude|manifest)",
  category: "only skills with this category/tag",
  tier: "indexed|reviewed",
  sort: "name|tokens|files|updated",
  json: "machine-readable output",
  dir: "agent skills dir (required for install/uninstall when none is detected)",
  minimal: "install with examples stripped (BETA)",
  yes: "skip the confirmation prompt",
  "dry-run": "print the URL without opening a browser",
};

function parseArgv(argv, flagSpec) {
  const positionals = [];
  const options = {};
  const errors = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith("-")) {
      positionals.push(arg);
      continue;
    }
    const eq = arg.indexOf("=");
    const body = eq === -1 ? arg.slice(2) : arg.slice(2, eq);
    const inline = eq === -1 ? undefined : arg.slice(eq + 1);
    const type = flagSpec[body];
    if (type === undefined) {
      errors.push(`unknown option: ${body}`);
      continue;
    }
    if (type === "boolean") {
      options[body] = true;
      continue;
    }
    if (inline !== undefined) {
      options[body] = inline;
      continue;
    }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith("-")) {
      options[body] = next;
      i++;
    } else {
      errors.push(`option --${body} requires a value`);
    }
  }
  return { positionals, options, errors };
}

function commandHelp(entry) {
  const lines = [`skill-cli ${entry.usage}`, "", `${entry.summary}`, ""];
  const flagSpec = { help: "boolean", ...entry.flags };
  const flags = Object.keys(flagSpec);
  if (flags.some((f) => f !== "help")) {
    lines.push("flags:");
    for (const f of flags) {
      if (f === "help") continue;
      lines.push(
        `  --${f}${flagSpec[f] === "boolean" ? "" : " <value>"}    ${FLAG_HINTS[f] ?? ""}`
      );
    }
    lines.push("  --help           show this help");
  }
  return lines.join("\n");
}

function globalHelp() {
  const lines = [
    `skill-cli ${VERSION} — curated catalog + CLI for AI agent skills`,
    "",
    "usage: skill-cli <command> [args]",
    "",
    "commands:",
  ];
  for (const entry of REGISTRY) {
    const mark = entry.status === "ready" ? "" : "  (planned)";
    lines.push(`  ${entry.name.padEnd(14)} ${entry.summary}${mark}`);
  }
  lines.push("", "options:", "  --help, -h       show this help", "  --version, -v    show version", "");
  return lines.join("\n");
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) {
    console.log(globalHelp());
    process.exitCode = CODES.USAGE;
    return;
  }

  if (argv[0] === "--help" || argv[0] === "-h") {
    console.log(globalHelp());
    return;
  }
  if (argv[0] === "--version" || argv[0] === "-v") {
    console.log(VERSION);
    return;
  }
  if (argv[0].startsWith("-")) {
    console.error(`unknown option: ${argv[0]} (try: skill-cli --help)`);
    process.exitCode = CODES.USAGE;
    return;
  }

  const entry = REGISTRY.find((c) => c.name === argv[0]);
  if (!entry) {
    console.error(`unknown command: ${argv[0]} (try: skill-cli --help)`);
    process.exitCode = CODES.USAGE;
    return;
  }

  const { positionals, options, errors } = parseArgv(
    argv.slice(1),
    { help: "boolean", ...entry.flags }
  );
  if (errors.length > 0) {
    for (const err of errors) console.error(`error: ${err}`);
    console.error(`usage: skill-cli ${entry.usage}`);
    process.exitCode = CODES.USAGE;
    return;
  }
  if (options.help) {
    console.log(commandHelp(entry));
    return;
  }

  let code;
  try {
    code = await entry.run(positionals, options);
  } catch (err) {
    console.error(`error: ${err.message}`);
    code = CODES.USAGE;
  }
  process.exitCode = code ?? CODES.USAGE;
}

await main();
