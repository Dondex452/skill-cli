import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PERMISSIVE_LICENSE = [
  /^mit($|[- ])/i,
  /^apache($|[- ])/i,
  /^bsd($|[- ])/i,
  /^isc($|[- ])/i,
  /^mpl-?2(dir)?($|[- ])/i,
  /^unlicense($|[- ])/i,
  /^cc0($|[- ])/i,
  /^zlib($|[- ])/i,
];

export function permissiveLicense(value) {
  if (!value) return null;
  const normalized = String(value)
    .toLowerCase()
    .trim()
    .replace(/[ _]+/g, "-")
    .replace(/[-_]+license$/, "");
  return PERMISSIVE_LICENSE.some((re) => re.test(normalized))
    ? normalized
    : null;
}

export function packageRoot() {
  return path.dirname(path.dirname(fileURLToPath(import.meta.url)));
}

export function resolveSourceRoot(env = process.env) {
  if (env.SKILL_CLI_SOURCE_DIR) return env.SKILL_CLI_SOURCE_DIR;
  // src/lib/install.mjs -> src/ -> repo root; schema keeps skills-core/ at root
  const libDir = path.dirname(fileURLToPath(import.meta.url));
  for (const c of [
    path.join(libDir, "..", "..", "skills-core"),
    path.join(packageRoot(), "skills-core"),
  ]) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

export function hashFile(file) {
  return createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

export function hashDir(dir) {
  const out = {};
  for (const file of walkFiles(dir)) {
    out[toPosix(path.relative(dir, file))] = hashFile(file);
  }
  return out;
}

export function walkFiles(dir) {
  const files = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const child = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walkFiles(child));
    else if (e.isFile()) files.push(child);
  }
  return files;
}

export function toPosix(p) {
  return p.replace(/\\/g, "/");
}

export function statePath(targetDir) {
  return path.join(targetDir, ".skill-cli", "state.json");
}

export function readState(targetDir) {
  try {
    return JSON.parse(fs.readFileSync(statePath(targetDir), "utf8"));
  } catch {
    return {};
  }
}

export function writeState(targetDir, state) {
  const dir = path.dirname(statePath(targetDir));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(statePath(targetDir), JSON.stringify(state, null, 2));
}

export function recordInstall(targetDir, name, files) {
  const state = readState(targetDir);
  state[name] = {
    files,
    installedAt: new Date().toISOString(),
  };
  writeState(targetDir, state);
}

export function copySkill(sourceRoot, name, targetDir) {
  const src = path.join(sourceRoot, name);
  if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) {
    throw new Error(`skill files not found under core pack: ${name}`);
  }
  const dest = path.join(targetDir, name);
  if (fs.existsSync(dest)) {
    throw new Error(`already installed: ${name} (run: skill-cli uninstall ${name})`);
  }
  fs.cpSync(src, dest, { recursive: true });
  const files = hashDir(dest);
  recordInstall(targetDir, name, files);
  return { dest, files: Object.keys(files).length };
}

export function modifiedFiles(agentDir, name) {
  const state = readState(agentDir);
  const stored = state[name];
  const dir = path.join(agentDir, name);
  if (!fs.existsSync(dir)) return null;
  const current = hashDir(dir);
  const modified = [];
  if (!stored) return Object.keys(current).map((f) => ({ file: f, kind: "untracked" }));
  for (const [file, hash] of Object.entries(current)) {
    const rec = stored.files[file];
    if (!rec) modified.push({ file, kind: "added" });
    else if (rec !== hash) modified.push({ file, kind: "modified" });
  }
  return modified;
}

export function removeSkill(agentDir, name) {
  const dir = path.join(agentDir, name);
  fs.rmSync(dir, { recursive: true, force: true });
  const state = readState(agentDir);
  if (state[name]) {
    delete state[name];
    writeState(agentDir, state);
  }
}
