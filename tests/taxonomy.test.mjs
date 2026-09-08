import { test } from "node:test";
import assert from "node:assert";
import { classify, TAXONOMY, VALID_IDS } from "../scripts/taxonomy.mjs";

test("offensive risk is forced to offensive-security", () => {
  assert.deepStrictEqual(
    classify({ name: "foo", description: "bar", risk: "offensive" }),
    ["offensive-security"]
  );
});

test("n8n and workflow keywords map to n8n-workflows", () => {
  const cats = classify({
    name: "n8n-workflow-patterns",
    description: "building n8n workflows",
  });
  assert.ok(cats.includes("n8n-workflows"));
});

test("seo vocabulary maps to seo category", () => {
  const cats = classify({
    name: "seo-audit",
    description: "search engine optimization sitemap audit",
  });
  assert.ok(cats.includes("seo"));
});

test("playwright maps to browser-automation", () => {
  const cats = classify({
    name: "playwright-tests",
    description: "browser automation with playwright",
  });
  assert.ok(cats.includes("browser-automation"));
});

test("no match falls back to misc", () => {
  assert.deepStrictEqual(
    classify({ name: "zzzqqq", description: "xyzzy" }),
    ["misc"]
  );
});

test("at most 3 categories are assigned", () => {
  const cats = classify({
    name: "stripe-redis-react",
    description:
      "stripe checkout shopify react express redis push notification payment gateway",
  });
  assert.ok(cats.length <= 3);
});

test("taxonomy has ~50-64 categories with matchers in every entry", () => {
  assert.ok(TAXONOMY.length >= 48 && TAXONOMY.length <= 64);
  for (const c of TAXONOMY) {
    assert.ok(c.id === c.id.trim());
    assert.ok(VALID_IDS.has(c.id));
    assert.ok(typeof c.desc === "string" && c.desc.length > 0);
  }
});

test("assigned categories are always valid ids", () => {
  const cats = classify({
    name: "web-app-api",
    description: "backend rest api design",
  });
  for (const c of cats) assert.ok(VALID_IDS.has(c));
});
