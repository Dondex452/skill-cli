import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  permissiveLicense,
  copySkill,
  readState,
  modifiedFiles,
  removeSkill,
  hashDir,
} from "../src/lib/install.mjs";

function tmp(prefix = "skillcli-lib-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

function makeCorePack(root, name) {
  const skillDir = path.join(root, name);
  fs.mkdirSync(path.join(skillDir, "sub"), { recursive: true });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), "# demo skill\n");
  fs.writeFileSync(path.join(skillDir, "sub", "extra.txt"), "extra\n");
  return skillDir;
}

test("permissiveLicense recognizes common permissive licenses", () => {
  assert.equal(permissiveLicense("MIT"), "mit");
  assert.equal(permissiveLicense("MIT License"), "mit");
  assert.equal(permissiveLicense("Apache-2.0"), "apache-2.0");
  assert.equal(permissiveLicense("Apache License 2.0"), "apache-license-2.0");
  assert.equal(permissiveLicense("Apache 2.0"), "apache-2.0");
  assert.equal(permissiveLicense("BSD-3-Clause"), "bsd-3-clause");
  assert.equal(permissiveLicense("ISC"), "isc");
  assert.equal(permissiveLicense("Unlicense"), "unlicense");
  assert.equal(permissiveLicense("CC0-1.0"), "cc0-1.0");
});

test("permissiveLicense rejects unknown/non-permissive values", () => {
  assert.equal(permissiveLicense(null), null);
  assert.equal(permissiveLicense(""), null);
  assert.equal(permissiveLicense("Proprietary"), null);
  assert.equal(permissiveLicense("GPL-3.0"), null);
});

test("copySkill copies files and records state with hashes", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  makeCorePack(core, "demo-skill");
  const result = copySkill(core, "demo-skill", agent);
  assert.equal(result.files, 2);
  assert.equal(fs.existsSync(path.join(agent, "demo-skill", "SKILL.md")), true);
  const state = readState(agent);
  assert.ok(state["demo-skill"]);
  assert.equal(Object.keys(state["demo-skill"].files).length, 2);
});

test("copySkill refuses when already installed", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  makeCorePack(core, "demo-skill");
  copySkill(core, "demo-skill", agent);
  assert.throws(() => copySkill(core, "demo-skill", agent), /already installed/);
});

test("copySkill refuses when skill is not in source root", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  assert.throws(() => copySkill(core, "no-such-skill", agent), /not found under core pack/);
});

test("modifiedFiles flags added and modified files", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  makeCorePack(core, "demo-skill");
  copySkill(core, "demo-skill", agent);
  const skill = path.join(agent, "demo-skill");
  fs.writeFileSync(path.join(skill, "new-note.md"), "hi\n");
  const mods = modifiedFiles(agent, "demo-skill");
  assert.ok(mods.some((m) => m.file === "new-note.md" && m.kind === "added"));
  fs.writeFileSync(path.join(skill, "SKILL.md"), "# changed\n");
  const mods2 = modifiedFiles(agent, "demo-skill");
  assert.ok(mods2.some((m) => m.file === "SKILL.md" && m.kind === "modified"));
});

test("modifiedFiles returns null when skill dir is gone", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  makeCorePack(core, "demo-skill");
  copySkill(core, "demo-skill", agent);
  removeSkill(agent, "demo-skill");
  assert.equal(modifiedFiles(agent, "demo-skill"), null);
  assert.equal(readState(agent)["demo-skill"], undefined);
});

test("hashDir produces stable independent hashes", () => {
  const a = tmp("skillcli-a-");
  const b = tmp("skillcli-b-");
  fs.writeFileSync(path.join(a, "SKILL.md"), "# same\n");
  fs.writeFileSync(path.join(b, "SKILL.md"), "# same\n");
  assert.deepEqual(hashDir(a), hashDir(b));
});

test("copySkill minimal installs only SKILL.md and records minimal state", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  const src = makeCorePack(core, "demo-skill");
  fs.writeFileSync(path.join(src, "README.md"), "root extra\n");
  const result = copySkill(core, "demo-skill", agent, { minimal: true });
  assert.equal(result.files, 1);
  assert.equal(result.skippedFiles, 2);
  assert.ok(result.skippedBytes > 0);
  const dest = path.join(agent, "demo-skill");
  assert.equal(fs.existsSync(path.join(dest, "SKILL.md")), true);
  assert.equal(fs.existsSync(path.join(dest, "sub")), false);
  assert.equal(fs.existsSync(path.join(dest, "README.md")), false);
  const state = readState(agent)["demo-skill"];
  assert.equal(Object.keys(state.files).length, 1);
  assert.equal(state.minimal, true);
});

test("copySkill minimal refuses a skill without SKILL.md", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  fs.mkdirSync(path.join(core, "broken"), { recursive: true });
  fs.writeFileSync(path.join(core, "broken", "notes.md"), "x\n");
  assert.throws(
    () => copySkill(core, "broken", agent, { minimal: true }),
    /needs SKILL.md/
  );
  assert.equal(fs.existsSync(path.join(agent, "broken")), false);
});

test("modifiedFiles still works on a minimal install", () => {
  const core = tmp("skillcli-core-");
  const agent = tmp("skillcli-agent-");
  makeCorePack(core, "demo-skill");
  copySkill(core, "demo-skill", agent, { minimal: true });
  assert.deepEqual(modifiedFiles(agent, "demo-skill"), []);
  fs.writeFileSync(path.join(agent, "demo-skill", "SKILL.md"), "# edited\n");
  const mods = modifiedFiles(agent, "demo-skill");
  assert.ok(mods.some((m) => m.file === "SKILL.md" && m.kind === "modified"));
});
