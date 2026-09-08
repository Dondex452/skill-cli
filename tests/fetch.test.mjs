import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { test } from "node:test";
import { fetchSkillDir, FetchError } from "../src/lib/fetch.mjs";

const PIN = "abc123def456";
const FILES = {
  "sk/SKILL.md": "# demo\n",
  "sk/refs/notes.md": "notes\n",
};

// tiny origin server: tree + raw, logs every URL it serves
function startServer(routes) {
  const seen = [];
  const server = http.createServer((req, res) => {
    seen.push(req.url);
    const body = routes[req.url.split("?")[0]];
    if (body === undefined) {
      res.writeHead(404);
      res.end("nope");
      return;
    }
    res.writeHead(200, { "Content-Type": "application/octet-stream" });
    res.end(typeof body === "string" ? body : JSON.stringify(body));
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const base = `http://127.0.0.1:${server.address().port}`;
      resolve({ server, base, seen });
    });
  });
}

const TREE = {
  tree: [
    { path: "sk/SKILL.md", type: "blob" },
    { path: "sk/refs/notes.md", type: "blob" },
    { path: "other/SKILL.md", type: "blob" },
  ],
};

const ORIGIN = { repo: "o/r", ref: "main", path: "sk", pin: PIN };

test("fetch engine downloads pinned files into stage/<name>", async (t) => {
  const { server, base, seen } = await startServer({
    [`/repos/o/r/git/trees/${PIN}`]: TREE,
    [`/o/r/${PIN}/sk/SKILL.md`]: FILES["sk/SKILL.md"],
    [`/o/r/${PIN}/sk/refs/notes.md`]: FILES["sk/refs/notes.md"],
    [`/repos/o/r2/git/trees/${PIN}`]: {
      tree: [{ path: "sk/refs/notes.md", type: "blob" }],
    },
  });
  t.after(() => server.close());

  await t.test("downloads only files under origin path", async () => {
    const r = await fetchSkillDir("demo", ORIGIN, { apiBase: base, rawBase: base });
    assert.equal(r.files, 2);
    assert.equal(fs.readFileSync(path.join(r.skillDir, "SKILL.md"), "utf8"), "# demo\n");
    assert.equal(fs.readFileSync(path.join(r.skillDir, "refs", "notes.md"), "utf8"), "notes\n");
    fs.rmSync(r.stageRoot, { recursive: true, force: true });
  });

  await t.test("every request uses the pin, never the branch", async () => {
    assert.ok(seen.length > 0);
    for (const u of seen) {
      assert.ok(u.includes(PIN), `expected pin in ${u}`);
      assert.doesNotMatch(u, /\/main(\?|$)/);
    }
  });

  await t.test("missing SKILL.md refuses", async () => {
    await assert.rejects(
      fetchSkillDir("demo", { ...ORIGIN, repo: "o/r2" }, { apiBase: base, rawBase: base }),
      /no SKILL\.md/
    );
  });

  await t.test("bad pin fails loudly", async () => {
    await assert.rejects(
      fetchSkillDir("demo", { ...ORIGIN, pin: "deadbeef" }, { apiBase: base, rawBase: base }),
      /origin not found/
    );
  });

  await t.test("size cap refuses", async () => {
    await assert.rejects(
      fetchSkillDir("demo", ORIGIN, { apiBase: base, rawBase: base, maxTotalBytes: 2 }),
      /size cap/
    );
  });

  await t.test("unpinned origin refuses", async () => {
    await assert.rejects(
      fetchSkillDir("demo", { ...ORIGIN, pin: null }, { apiBase: base, rawBase: base }),
      /no pinned version/
    );
  });
});
