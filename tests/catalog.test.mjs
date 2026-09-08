import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadCatalog, byName, filterRecords, sortRecords } from "../src/lib/catalog.mjs";

const FIX = fileURLToPath(new URL("./fixtures", import.meta.url));
const FIXCAT = path.join(FIX, "catalog.jsonl");

test("loads clean fixture without errors", () => {
  const { records, errors } = loadCatalog(FIXCAT);
  assert.equal(errors.length, 0);
  assert.equal(records.length, 5);
});

test("reports broken json lines as errors", () => {
  const { errors } = loadCatalog(path.join(FIX, "catalog-broken.jsonl"));
  assert.ok(errors.length >= 1, "expected at least one parse error");
});

test("reports duplicate names as errors", () => {
  const { errors } = loadCatalog(path.join(FIX, "catalog-dup.jsonl"));
  assert.ok(errors.some((e) => e.includes("duplicate name")), "expected duplicate name error");
});

test("byName is case-insensitive exact match", () => {
  const { records } = loadCatalog(FIXCAT);
  assert.equal(byName(records, "SEO-AUDIT").name, "seo-audit");
  assert.equal(byName(records, "nope"), null);
});

test("filterRecords by tool and tier", () => {
  const { records } = loadCatalog(FIXCAT);
  assert.equal(filterRecords(records, { tool: ".gemini" }).length, 2);
  assert.equal(filterRecords(records, { tier: "reviewed" }).length, 1);
  assert.equal(filterRecords(records, { category: "workflow" })[0].name, "n8n-workflow-patterns");
});

test("sortRecords orders tokens ascending and updated descending", () => {
  const { records } = loadCatalog(FIXCAT);
  assert.equal(sortRecords(records, "tokens")[0].name, "web-scraper");
  assert.equal(sortRecords(records, "updated")[0].name, "n8n-workflow-patterns");
  assert.throws(() => sortRecords(records, "bogus"), /unsupported sort/);
});
