import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog } from "../src/lib/catalog.mjs";
import { scoreRecord, searchCatalog } from "../src/lib/search.mjs";

const FIXCAT = path.join(
  fileURLToPath(new URL("./fixtures", import.meta.url)),
  "catalog.jsonl"
);

function fixtureRecords() {
  return loadCatalog(FIXCAT).records;
}

test("exact name match beats prefix match", () => {
  const res = searchCatalog(fixtureRecords(), "seo-audit");
  assert.equal(res[0].record.name, "seo-audit");
  assert.equal(res[0].score, 5);
});

test("prefix match ranks above description-only hit", () => {
  const res = searchCatalog(fixtureRecords(), "web");
  assert.equal(res[0].record.name, "web-scraper");
});

test("description word match contributes", () => {
  const res = searchCatalog(fixtureRecords(), "conventional");
  assert.equal(res[0].record.name, "git-commit-message");
});

test("reviewed tier adds a tie-break bonus", () => {
  const indexed = { name: "a-skill", description: "workflow builder", tier: "indexed" };
  const reviewed = { name: "a-skill", description: "workflow builder", tier: "reviewed" };
  assert.ok(scoreRecord("workflow", reviewed) > scoreRecord("workflow", indexed));
});

test("stopword-only query returns nothing", () => {
  assert.equal(searchCatalog(fixtureRecords(), "the").length, 0);
});

test("results are deterministic, scored descending", () => {
  const res = searchCatalog(fixtureRecords(), "n8n");
  assert.ok(res[0].record.name.startsWith("n8n"));
  for (let i = 1; i < res.length; i++) {
    assert.ok(res[i].score <= res[i - 1].score, "scores must be non-increasing");
  }
  assert.equal(res[0].record.name, "n8n-workflow-patterns");
});
