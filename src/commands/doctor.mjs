import fs from "node:fs";
import { loadCatalog } from "../lib/catalog.mjs";
import { detectAgentDirs, validSkillsDir } from "../lib/paths.mjs";
import { paint } from "../lib/output.mjs";
import { CODES } from "../lib/exit.mjs";

export const command = {
  name: "doctor",
  usage: "doctor [--dir <path>] [--json]",
  summary: "validate catalog + detected agent skill dirs",
  flags: { dir: "string", json: "boolean" },
  run(_positionals, options) {
    const problems = [];
    const warnings = [];
    const results = [];
    const checked = [];

    let catalog;
    try {
      catalog = loadCatalog();
      results.push(`catalog: ok (${catalog.records.length} records, ${catalog.errors.length} parse issues)`);
      for (const err of catalog.errors) problems.push(`catalog: ${err}`);
    } catch (err) {
      problems.push(`catalog: ${err.message}`);
      catalog = null;
    }

    const dirs = options.dir
      ? [{ agent: "--dir", dir: options.dir, found: fsExists(options.dir) }]
      : detectAgentDirs();
    for (const d of dirs) {
      checked.push(d);
      if (!d.found) {
        results.push(`agent dir ${d.agent}: not found (${d.dir})`);
        if (options.dir) problems.push(`agent dir: ${d.dir} does not exist`);
        continue;
      }
      const v = validSkillsDir(d.dir);
      if (!v) {
        results.push(`agent dir ${d.agent}: exists but is not a readable directory (${d.dir})`);
        problems.push(`agent dir: ${d.agent} is not a usable directory`);
        continue;
      }
      results.push(`agent dir ${d.agent}: ${v.skills.length} skill dirs, ${v.invalid.length} without SKILL.md (${d.dir})`);
      for (const bad of v.invalid) warnings.push(`agent dir: ${d.agent}/${bad} has no SKILL.md (ignored by agents)`);
    }

    if (options.json) {
      console.log(JSON.stringify({
        problems,
        warnings,
        details: checked.map(({ agent, dir, found }) => ({
          agent,
          dir,
          found,
          skills: found ? validSkillsDir(dir)?.skills.length ?? null : null,
        })),
        catalog: catalog ? { records: catalog.records.length, parse_errors: catalog.errors.length } : null,
      }, null, 2));
      return problems.length === 0 ? CODES.OK : CODES.USAGE;
    }

    console.log(paint("DOCTOR  ·  skill-cli", "bold"));
    for (const line of results) console.log("  " + line);
    for (const w of warnings) console.log("  " + paint("warning: " + w, "yellow"));
    if (problems.length === 0) {
      console.log(paint("summary: ok", "green"));
      return CODES.OK;
    }
    for (const p of problems) console.log("  " + paint("problem: " + p, "red"));
    console.log(paint(`summary: ${problems.length} problem(s)`, "red"));
    return CODES.USAGE;
  },
};

function fsExists(p) {
  return fs.existsSync(p);
}
