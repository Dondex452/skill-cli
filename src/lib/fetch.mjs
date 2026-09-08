import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// fetch.mjs — fetch-install engine (rev.3, Phase 2.4).
//
// Downloads a skill directory from a pinned origin:
//   1. recursive file tree, addressed AT THE PIN (commit sha), via API (1 call)
//   2. every file downloaded at the same pin via raw (unmetered)
//
// Pin enforcement is structural: no branch name is ever requested, so upstream
// cannot move under the user. A bad pin fails loudly (404/422 on the tree).
// Caps protect against accidentally broad paths. No network in CI: callers
// inject apiBase/rawBase (tests point them at localhost).

const UA = { "User-Agent": "skill-cli", Accept: "application/vnd.github+json" };

export class FetchError extends Error {}

function need(cond, msg) {
  if (!cond) throw new FetchError(msg);
}

export async function fetchSkillDir(name, origin, opts = {}) {
  const {
    apiBase = process.env.SKILL_CLI_API_BASE || "https://api.github.com",
    rawBase = process.env.SKILL_CLI_RAW_BASE || "https://raw.githubusercontent.com",
    fetchImpl = fetch,
    maxFiles = 500,
    maxTotalBytes = 5 * 1024 * 1024,
    stageParent = path.join(os.tmpdir(), "skill-cli-fetch"),
  } = opts;

  need(origin && origin.repo && origin.path, `no usable origin for "${name}"`);
  need(origin.pin, `no pinned version for "${name}" — refusing unpinned fetch`);
  const { repo, path: skillPath, pin } = origin;
  need(!skillPath.includes(".."), `unsafe origin path for "${name}"`);

  const treeUrl = `${apiBase}/repos/${repo}/git/trees/${pin}?recursive=1`;
  let treeRes;
  try {
    treeRes = await fetchImpl(treeUrl, { headers: UA });
  } catch (err) {
    throw new FetchError(`cannot reach origin for "${name}": ${err.message}`);
  }
  if (treeRes.status === 403 || treeRes.status === 429)
    throw new FetchError(`origin rate limit hit for "${name}" — retry in about an hour`);
  if (treeRes.status === 404 || treeRes.status === 422)
    throw new FetchError(`origin not found for "${name}": ${repo}@${short(pin)} (moved or bad pin)`);
  if (!treeRes.ok)
    throw new FetchError(`origin lookup failed for "${name}": HTTP ${treeRes.status}`);
  const tree = await treeRes.json();
  need(Array.isArray(tree.tree), `bad tree response for "${name}"`);
  if (tree.truncated)
    throw new FetchError(`origin tree too large to verify for "${name}" — refusing`);

  const prefix = skillPath.replace(/\/+$/, "") + "/";
  const blobs = tree.tree.filter(
    (e) => e.type === "blob" && typeof e.path === "string" && e.path.startsWith(prefix)
  );
  need(blobs.length > 0, `origin has no files under ${skillPath} for "${name}"`);
  need(blobs.length <= maxFiles, `origin lists ${blobs.length} files for "${name}" (cap ${maxFiles}) — refusing`);
  need(
    blobs.some((e) => e.path === `${prefix}SKILL.md`),
    `origin has no SKILL.md at ${skillPath} for "${name}" (moved upstream?)`
  );

  fs.mkdirSync(stageParent, { recursive: true });
  const stageRoot = fs.mkdtempSync(path.join(stageParent, `${name}-`));
  let total = 0;
  try {
    for (const b of blobs) {
      const rel = b.path.slice(prefix.length);
      need(!rel.includes("..") && !path.isAbsolute(rel), `unsafe path in origin: ${b.path}`);
      const url = `${rawBase}/${repo}/${pin}/${b.path}`;
      let res;
      try {
        res = await fetchImpl(url, { headers: UA });
      } catch (err) {
        throw new FetchError(`cannot download ${b.path} for "${name}": ${err.message}`);
      }
      if (!res.ok) throw new FetchError(`download failed for "${name}": ${b.path} (HTTP ${res.status})`);
      const buf = Buffer.from(await res.arrayBuffer());
      total += buf.length;
      need(total <= maxTotalBytes, `origin exceeds size cap for "${name}" (${maxTotalBytes} bytes) — refusing`);
      const dest = path.join(stageRoot, name, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, buf);
    }
  } catch (err) {
    fs.rmSync(stageRoot, { recursive: true, force: true });
    throw err;
  }
  return { stageRoot, skillDir: path.join(stageRoot, name), files: blobs.length, bytes: total };
}

export function short(sha) {
  return String(sha ?? "").slice(0, 7);
}
