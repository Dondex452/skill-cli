import fs from "node:fs";
import { paint } from "../lib/output.mjs";
import { CODES, usageError } from "../lib/exit.mjs";

export const command = {
  name: "init",
  usage: "init <dir>",
  summary: "bootstrap an agent skills folder",
  flags: {},
  run(positionals) {
    const dir = positionals.join(" ").trim();
    if (!dir) return usageError("init needs a target dir", command.usage);
    const existed = fs.existsSync(dir);
    fs.mkdirSync(dir, { recursive: true });
    console.log(paint(existed ? `dir already exists: ${dir}` : `created agent skills dir: ${dir}`, "green"));
    console.log(paint(`next: skill-cli install <name> --dir ${dir}`, "dim"));
    return CODES.OK;
  },
};
