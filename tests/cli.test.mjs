import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const CLI = fileURLToPath(new URL("../src/cli.js", import.meta.url));
const FIX = fileURLToPath(new URL("./fixtures", import.meta.url));
const FIXCAT = path.join(FIX, "catalog.jsonl");

function run(args, env = {}, opts = {}) {
  return spawnSync(process.execPath, [CLI, ...args], {
    encoding: "utf8",
    env: { ...process.env, SKILL_CLI_CATALOG: FIXCAT, ...env },
    ...opts,
  });
}

function tmpdir(prefix = "skillcli-test-") {
  return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

test("--help lists commands with top ready (no planned markers)", () => {
  const r = run(["--help"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /search/);
  assert.match(r.stdout, /doctor/);
  assert.match(r.stdout, /top\s+curated best-of list/);
  assert.doesNotMatch(r.stdout, /planned/);
});

test("--version prints package version", () => {
  const r = run(["--version"]);
  assert.equal(r.status, 0);
  assert.equal(r.stdout.trim(), "0.1.0");
});

test("no arguments prints help and exits 1", () => {
  const r = run([]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /usage: skill-cli <command>/);
});

test("unknown command exits 1", () => {
  const r = run(["frobnicate"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /unknown command/);
});

test("unknown option exits 1", () => {
  const r = run(["search", "--bogus", "x"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /unknown option/);
});

test("search renders ranked results", () => {
  const r = run(["search", "n8n", "--limit", "3"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /n8n-workflow-patterns/);
  assert.match(r.stdout, /catalog: 5 records/);
});

test("search with empty query exits 1", () => {
  const r = run(["search"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /needs a query/);
});

test("search --limit out of range exits 1", () => {
  const r = run(["search", "x", "--limit", "100000"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /--limit/);
});

test("view renders skill details", () => {
  const r = run(["view", "n8n-workflow-patterns"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Proven architectural patterns/);
  assert.match(r.stdout, /core/);
});

test("view missing skill exits 2", () => {
  const r = run(["view", "does-not-exist"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /skill not found/);
});

test("view --json emits parseable record", () => {
  const r = run(["view", "seo-audit", "--json"]);
  assert.equal(r.status, 0);
  const rec = JSON.parse(r.stdout);
  assert.equal(rec.name, "seo-audit");
});

test("list filters by tier and tool", () => {
  const r = run(["list", "--tier", "reviewed"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /1 of 1 record/);
  const r2 = run(["list", "--tool", ".gemini"]);
  assert.equal(r2.status, 0);
  assert.match(r2.stdout, /2 of 2 records/);
});

test("list rejects invalid tier", () => {
  const r = run(["list", "--tier", "bogus"]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /--tier/);
});

test("stats reports fixture numbers", () => {
  const r = run(["stats"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /ok/);
  assert.match(r.stdout, /records:\s+5/);
});

test("stats --json emits parseable object", () => {
  const r = run(["stats", "--json"]);
  assert.equal(r.status, 0);
  const data = JSON.parse(r.stdout);
  assert.equal(data.records, 5);
});

test("doctor reports problems when --dir is missing", () => {
  const r = run(["doctor", "--dir", path.join(tmpdir(), "nope")]);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /does not exist/);
});

test("doctor is clean on an empty agent home", () => {
  const r = run(["doctor", "--json"], { SKILL_CLI_HOME: tmpdir() });
  assert.equal(r.status, 0);
  const data = JSON.parse(r.stdout);
  assert.equal(data.problems.length, 0);
});

test("doctor detects a valid skill dir", () => {
  const agentHome = tmpdir();
  const skill = path.join(agentHome, ".config", "opencode", "skills", "demo-skill");
  fs.mkdirSync(skill, { recursive: true });
  fs.writeFileSync(path.join(skill, "SKILL.md"), "# demo\n");
  const r = run(["doctor", "--dir", path.dirname(skill)]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /1 skill dirs/);
});

test("doctor flags broken catalog", () => {
  const r = run(["doctor"], { SKILL_CLI_CATALOG: path.join(FIX, "catalog-broken.jsonl") });
  assert.equal(r.status, 1);
  assert.match(r.stdout, /parse/);
});

function makeCore(root, name, body = "# demo skill\n") {
  const skill = path.join(root, name);
  fs.mkdirSync(skill, { recursive: true });
  fs.writeFileSync(path.join(skill, "SKILL.md"), body);
  return skill;
}

test("install refuses index-only skills with exit 4", () => {
  const agent = tmpdir();
  const r = run(["install", "seo-audit", "--dir", agent]);
  assert.equal(r.status, 4);
  assert.match(r.stderr, /index-only/);
});

test("install unknown skill exits 2", () => {
  const r = run(["install", "nope", "--dir", tmpdir()]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /skill not found/);
});

test("install fails cleanly when source root has no such skill", () => {
  const agent = tmpdir();
  const core = tmpdir();
  const r = run(["install", "n8n-workflow-patterns", "--dir", agent], {
    SKILL_CLI_SOURCE_DIR: core,
  });
  assert.equal(r.status, 4);
  assert.match(r.stderr, /not found under core pack/);
});

test("install copies core skill and records state", () => {
  const agent = tmpdir();
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  const r = run(["install", "n8n-workflow-patterns", "--dir", agent], {
    SKILL_CLI_SOURCE_DIR: core,
  });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /installed n8n-workflow-patterns/);
  const dest = path.join(agent, "n8n-workflow-patterns", "SKILL.md");
  assert.equal(fs.existsSync(dest), true);
  const state = JSON.parse(fs.readFileSync(path.join(agent, ".skill-cli", "state.json"), "utf8"));
  assert.ok(state["n8n-workflow-patterns"]);
});

test("install twice exits 3 (conflict)", () => {
  const agent = tmpdir();
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  const env = { SKILL_CLI_SOURCE_DIR: core };
  assert.equal(run(["install", "n8n-workflow-patterns", "--dir", agent], env).status, 0);
  const second = run(["install", "n8n-workflow-patterns", "--dir", agent], env);
  assert.equal(second.status, 3);
  assert.match(second.stderr, /already installed/);
});

test("install into missing agent dir exits 1 with init hint", () => {
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  const r = run(["install", "n8n-workflow-patterns", "--dir", path.join(tmpdir(), "ghost")], {
    SKILL_CLI_SOURCE_DIR: core,
  });
  assert.equal(r.status, 1);
  assert.match(r.stderr, /skill-cli init/);
});

test("uninstall not installed exits 2", () => {
  const r = run(["uninstall", "n8n-workflow-patterns", "--dir", tmpdir(), "--yes"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /not installed/);
});

test("uninstall removes skill with --yes (no prompt)", () => {
  const agent = tmpdir();
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  const env = { SKILL_CLI_SOURCE_DIR: core };
  assert.equal(run(["install", "n8n-workflow-patterns", "--dir", agent], env).status, 0);
  const r = run(["uninstall", "n8n-workflow-patterns", "--dir", agent, "--yes"]);
  assert.equal(r.status, 0);
  assert.equal(fs.existsSync(path.join(agent, "n8n-workflow-patterns")), false);
  const state = JSON.parse(fs.readFileSync(path.join(agent, ".skill-cli", "state.json"), "utf8"));
  assert.equal(state["n8n-workflow-patterns"], undefined);
});

test("uninstall aborts (exit 3) on modified files when answer is no", () => {
  const agent = tmpdir();
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  assert.equal(
    run(["install", "n8n-workflow-patterns", "--dir", agent], { SKILL_CLI_SOURCE_DIR: core }).status,
    0
  );
  fs.writeFileSync(path.join(agent, "n8n-workflow-patterns", "SKILL.md"), "# altered\n");
  const r = run(["uninstall", "n8n-workflow-patterns", "--dir", agent], {}, { input: "n\n" });
  assert.equal(r.status, 3);
  assert.equal(fs.existsSync(path.join(agent, "n8n-workflow-patterns")), true);
});

test("uninstall proceeds on modified files when answer is yes", () => {
  const agent = tmpdir();
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  assert.equal(
    run(["install", "n8n-workflow-patterns", "--dir", agent], { SKILL_CLI_SOURCE_DIR: core }).status,
    0
  );
  fs.writeFileSync(path.join(agent, "n8n-workflow-patterns", "SKILL.md"), "# altered\n");
  const r = run(["uninstall", "n8n-workflow-patterns", "--dir", agent], {}, { input: "y\n" });
  assert.equal(r.status, 0);
  assert.equal(fs.existsSync(path.join(agent, "n8n-workflow-patterns")), false);
});

test("request --dry-run prints issue URL", () => {
  const r = run(["request", "seo-audit", "--dry-run"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /^https:\/\/github\.com\/Dondex452\/skill-cli\/issues\/new\?title=/);
  assert.match(r.stdout, /seo-audit/);
});

test("request honors SKILL_CLI_REPO override", () => {
  const r = run(["request", "seo-audit", "--dry-run"], { SKILL_CLI_REPO: "me/test-repo" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /me\/test-repo/);
});

test("request on core skill reports already-in-core (exit 0)", () => {
  const r = run(["request", "n8n-workflow-patterns", "--dry-run"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /already in the core pack/);
});

test("request unknown skill exits 2", () => {
  const r = run(["request", "nope", "--dry-run"]);
  assert.equal(r.status, 2);
});

test("init creates dir and is idempotent", () => {
  const dir = path.join(tmpdir(), "fresh");
  const r1 = run(["init", dir]);
  assert.equal(r1.status, 0);
  assert.equal(fs.existsSync(dir), true);
  const r2 = run(["init", dir]);
  assert.equal(r2.status, 0);
  assert.match(r2.stdout, /already exists/);
});

const FIXCUR = path.join(FIX, "curated-top.json");

test("top renders curated list and skips unknown entries", () => {
  const r = run(["top"], { SKILL_CLI_CURATED: FIXCUR });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /n8n-workflow-patterns/);
  assert.match(r.stdout, /Fixture note/);
  assert.match(r.stdout, /2 of 2 curated/);
  assert.match(r.stdout, /1 curated entries not in catalog/);
});

test("top n limits output", () => {
  const r = run(["top", "1"], { SKILL_CLI_CURATED: FIXCUR });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /1 of 2 curated/);
  assert.match(r.stdout, /n8n-workflow-patterns/);
  assert.doesNotMatch(r.stdout, /seo-audit/);
});

test("top --category filters curated entries", () => {
  const r = run(["top", "--category", "n8n"], { SKILL_CLI_CURATED: FIXCUR });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /1 of 1 curated/);
  const r2 = run(["top", "--category", "no-such-cat"], { SKILL_CLI_CURATED: FIXCUR });
  assert.equal(r2.status, 0);
  assert.match(r2.stdout, /0 curated skills match/);
});

test("top bad n exits 1", () => {
  assert.equal(run(["top", "0"], { SKILL_CLI_CURATED: FIXCUR }).status, 1);
  assert.equal(run(["top", "abc"], { SKILL_CLI_CURATED: FIXCUR }).status, 1);
});

test("view shows curated rank and note for reviewed tier", () => {
  const r = run(["view", "n8n-workflow-patterns"]);
  assert.equal(r.status, 0);
  assert.match(r.stdout, /Tier\s+reviewed/);
});

test("install fetchable without pin refuses before any network", () => {
  const cat = path.join(tmpdir(), "catalog.jsonl");
  fs.writeFileSync(
    cat,
    JSON.stringify({
      name: "demo-fetch",
      description: "fetched demo skill for tests",
      category: ["developer-tooling"],
      risk: "safe",
      license: "MIT",
      tokens: 10,
      files: 1,
      tier: "indexed",
      availability: "fetchable",
      origin: { repo: "o/r", ref: "main", path: "sk", pin: null },
    }) + "\n"
  );
  const agent = tmpdir();
  const r = run(["install", "demo-fetch", "--dir", agent], {
    SKILL_CLI_CATALOG: cat,
    SKILL_CLI_API_BASE: "http://127.0.0.1:9",
    SKILL_CLI_RAW_BASE: "http://127.0.0.1:9",
  });
  assert.equal(r.status, 4);
  assert.match(r.stderr, /no pinned version/);
  assert.equal(fs.existsSync(path.join(agent, "demo-fetch")), false);
});

test("install then doctor sees a clean dir (hidden state ignored)", () => {
  const agent = tmpdir();
  const core = tmpdir();
  makeCore(core, "n8n-workflow-patterns");
  assert.equal(
    run(["install", "n8n-workflow-patterns", "--dir", agent], { SKILL_CLI_SOURCE_DIR: core }).status,
    0
  );
  const r = run(["doctor", "--dir", agent]);
  assert.equal(r.status, 0);
  assert.doesNotMatch(r.stdout, /problem/);
});
