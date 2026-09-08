import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const AGENT_DIRS = [
  { agent: "opencode", rel: path.join(".config", "opencode", "skills") },
  { agent: "gemini", rel: path.join(".gemini", "config", "skills") },
  { agent: "claude", rel: path.join(".claude", "skills") },
  { agent: "cursor", rel: path.join(".cursor", "skills") },
];

export function detectAgentDirs(home = process.env.SKILL_CLI_HOME || os.homedir()) {
  return AGENT_DIRS.map(({ agent, rel }) => ({
    agent,
    dir: path.join(home, rel),
    found: fs.existsSync(path.join(home, rel)),
  }));
}

export function validSkillsDir(dir) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;
  const children = fs.readdirSync(dir, { withFileTypes: true });
  const skills = children
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort();
  const valid = skills.filter((n) =>
    fs.existsSync(path.join(dir, n, "SKILL.md"))
  );
  const invalid = skills.filter((n) => !valid.includes(n));
  return { dir, skills: valid, invalid };
}
