// scan-origins.mjs — step 1 of origin resolution (rev.3).
// Mines LOCAL skill files for origin hints: front-matter repo/url/homepage
// fields, github URLs, registry mentions. No network. Emits:
//   src/data/origin-hints.json — per-skill hints { urls, mentions, fm }
// Usage: node scripts/scan-origins.mjs [--skills-dir <path>]
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const dirFlag = args.indexOf("--skills-dir");
const SKILLS_DIR =
  (dirFlag >= 0 && args[dirFlag + 1]) ||
  process.env.SKILLS_DIR ||
  "C:/Users/Admin/Desktop/complete skills";
const OUT = path.resolve("src/data/origin-hints.json");

const blocklist = JSON.parse(
  fs.readFileSync(path.resolve("scripts/blocklist.json"), "utf8")
);

function readText(p) {
  let s = fs.readFileSync(p, "utf8");
  if (s.includes("�")) {
    const buf = fs.readFileSync(p);
    s = buf.toString("latin1");
  }
  return s;
}

// minimal front-matter: between leading --- and closing --- (trailing spaces ok)
function frontMatter(content) {
  const m = content.match(/^--- *\r?\n([\s\S]*?)\r?\n--- *(\r?\n|$)/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)$/);
    if (kv) fm[kv[1].toLowerCase()] = kv[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return fm;
}

const URL_RE =
  /https?:\/\/(?:www\.)?(?:github\.com|gitlab\.com|npmjs\.com|pypi\.org|clawhub\.ai|hub\.docker\.com|crates\.io)\/[^\s"'<>)\]]+/gi;
const MENTION_RES = [
  /clawhub/i,
  /awesome-claude-skills/i,
  /everything-claude-code/i,
  /superpowers/i,
  /wshobson\/agents/i,
  /anthropics\/skills/i,
];

const hints = {};
let skills = 0;
for (const name of fs.readdirSync(SKILLS_DIR)) {
  if (blocklist[name]) continue;
  const sp = path.join(SKILLS_DIR, name);
  let st;
  try {
    st = fs.statSync(sp);
  } catch {
    continue;
  }
  if (!st.isDirectory()) continue;
  const fp = path.join(sp, "SKILL.md");
  if (!fs.existsSync(fp)) continue;
  skills++;
  let content;
  try {
    content = readText(fp);
  } catch {
    continue;
  }
  const fm = frontMatter(content);
  const urls = [...new Set(content.match(URL_RE) || [])].map((u) =>
    u.replace(/\/+$/, "")
  );
  const mentions = MENTION_RES.filter((re) => re.test(content)).map(
    (re) => re.source
  );
  const fmOrigin = {};
  for (const k of [
    "repo",
    "repository",
    "source_repo",
    "source_url",
    "upstream",
    "url",
    "author_url",
    "homepage",
    "source",
  ]) {
    if (fm[k]) fmOrigin[k] = fm[k];
  }
  if (urls.length || mentions.length || Object.keys(fmOrigin).length) {
    hints[name] = { urls, mentions, fm: fmOrigin };
  }
}

fs.writeFileSync(OUT, JSON.stringify(hints, null, 2) + "\n");

// summary to stdout
const withHints = Object.keys(hints).length;
const allUrls = Object.values(hints).flatMap((h) => h.urls);
const repoCounts = new Map();
for (const u of allUrls) {
  const m = u.match(
    /^https?:\/\/(?:www\.)?(github\.com|gitlab\.com)\/([^/]+)\/([^/]+)/i
  );
  if (m) {
    const k = `${m[1].toLowerCase()}/${m[2]}/${m[3]}`;
    repoCounts.set(k, (repoCounts.get(k) ?? 0) + 1);
  }
}
const top = [...repoCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 30);
console.log(
  JSON.stringify(
    { skills, with_hints: withHints, hintless: skills - withHints, top_repos: top },
    null,
    2
  )
);
