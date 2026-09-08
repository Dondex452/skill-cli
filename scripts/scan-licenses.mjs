import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR =
  process.env.SKILLS_DIR ?? "C:/Users/Admin/Desktop/complete skills";
const OUT_JSON = path.join(
  import.meta.dirname,
  "..",
  "src",
  "data",
  "licenses.json"
);

const URL_RE = /https?:\/\/(?:www\.)?(?:github\.com|gitlab\.com|npmjs\.com|pypi\.org|rubygems\.org|hub\.docker\.com|crates\.io)\/[^\s"'<>)\]]+/gi;

const LICENSE_FILES = /^(licen[cs]e|copying|copyright|notice)/i;

function decodeBuffer(buf) {
  const utf8 = buf.toString("utf8");
  return utf8.includes("\uFFFD") ? buf.toString("latin1") : utf8;
}

function readFrontMatter(text) {
  const m = text
    .replace(/^\uFEFF/, "")
    .match(/^---[ \t]*\r?\n([\s\S]*?)\r?\n---[ \t]*(?=\r?\n|$)/);
  if (!m) return {};
  const rawLines = m[1].split(/\r?\n/);
  const data = {};
  for (let i = 0; i < rawLines.length; i++) {
    const mm = rawLines[i].match(/^(\w[\w-]*):\s*(.*)$/);
    if (!mm) continue;
    const key = mm[1];
    let value = mm[2].trim();
    if (value.length === 0) {
      const cont = [];
      while (i + 1 < rawLines.length && /^\s{2,}\S/.test(rawLines[i + 1])) {
        cont.push(rawLines[++i].trim());
      }
      value = cont.join(" ");
    }
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    data[key] = value.replace(/\s+/g, " ");
  }
  return data;
}

function detectLicense(text) {
  if (!text) return null;
  if (/proprietary|all rights reserved[^.]*do not|no redistribution|internal use only/i.test(text)) {
    return "proprietary";
  }
  if (/AGPL|Affero General Public License/i.test(text)) return "AGPL";
  if (/LGPL/i.test(text)) return "LGPL";
  if (/\bGPL[- ]v?\d|GNU General Public License\b/i.test(text)) return "GPL";
  if (/\bMIT\b(?![- ]use)/i.test(text)) return "MIT";
  if (/Apache[ ]?(?:Software |Foundation )?License|Apache[- ]2(?:\.0)?|Apache License, Version 2/i.test(text)) {
    return "Apache-2.0";
  }
  if (/\bBSD[- ]?\d(?:[-.]\d+)*\b/i.test(text)) {
    const v = text.match(/\bBSD[- ]?(\d)/i)?.[1];
    return `BSD-${v}`;
  }
  if (/\bISC\b/i.test(text)) return "ISC";
  if (/MPL[- ]2|Mozilla Public License(?: 2\.0)?/i.test(text)) return "MPL-2.0";
  if (/\bUnlicense\b/i.test(text)) return "Unlicense";
  if (/\bCC0[- ]1\.0\b|\bCC0\b/i.test(text)) return "CC0-1.0";
  return null;
}

function copyrightHint(text) {
  const m = text.match(
    /Copyright[ ]*[©(?:C)]?[ ]*(\d{4})[ ]*([A-Za-z0-9][A-Za-z0-9 .,&'+-]{2,60})/i
  );
  return m ? `${m[1]} ${m[2]}`.trim() : null;
}

function explicitMention(text) {
  return /licen[cs]ed under|licen[cs]e(?:d)?[:=]\s|is (?:released|distributed|licensed) (?:under|with)|MIT License|Apache 2\.0|Apache License/i.test(
    text
  );
}

function scanSkill(dir) {
  const name = path.basename(dir);
  const files = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((f) => f.isFile());
  const byName = new Map(files.map((f) => [f.name.toLowerCase(), f.name]));

  const skillMd = byName.get("skill.md");
  const fm = skillMd ? readFrontMatter(decodeBuffer(fs.readFileSync(path.join(dir, skillMd)))) : {};

  let license = fm.license && detectLicense(fm.license);
  let level = "front-matter";
  let evidence = null;

  for (const file of files) {
    if (LICENSE_FILES.test(file.name) && !license) {
      const content = decodeBuffer(fs.readFileSync(path.join(dir, file.name)));
      const detected = detectLicense(content);
      if (detected && detected !== "proprietary") {
        license = detected;
        level = "file";
        evidence = copyrightHint(content);
        break;
      }
    }
  }

  if (!license && skillMd) {
    const content = decodeBuffer(fs.readFileSync(path.join(dir, skillMd)));
    const detected = detectLicense(content);
    if (detected && detected !== "proprietary" && explicitMention(content)) {
      license = detected;
      level = "mention";
    }
  }

  let attribution = null;
  const fmCandidate = fm.author || fm.author_url || fm.url || fm.repo || fm.repository;
  if (fmCandidate && typeof fmCandidate === "string") {
    const urls = fmCandidate.match(URL_RE);
    attribution = (urls ? urls[0] : fmCandidate).replace(/\/+$/, "");
  }
  if (!attribution) {
    for (const file of ["LICENSE", "LICENSE.txt", "COPYING"]) {
      if (byName.has(file.toLowerCase())) {
        const content = decodeBuffer(fs.readFileSync(path.join(dir, byName.get(file.toLowerCase()))));
        const m = content.match(URL_RE);
        if (m) {
          attribution = m[0].replace(/\/+$/, "");
          break;
        }
      }
    }
  }
  if (!attribution && evidence) attribution = evidence;
  if (attribution && attribution.length > 120) attribution = null;

  return { license, level, attribution };
}

function main() {
  const dirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const out = {};
  for (const name of dirs) {
    const result = scanSkill(path.join(SKILLS_DIR, name));
    if (result.license || result.attribution) out[name] = result;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, JSON.stringify(out, null, 2) + "\n");

  const byLicense = {};
  const byLevel = {};
  for (const [, v] of Object.entries(out)) {
    if (v.license) {
      byLicense[v.license] = (byLicense[v.license] ?? 0) + 1;
      byLevel[v.level] = (byLevel[v.level] ?? 0) + 1;
    }
  }
  const withLicense = Object.values(out).filter((v) => v.license).length;
  const withAttribution = Object.values(out).filter((v) => v.attribution).length;

  console.log(JSON.stringify({
    skills_dir: SKILLS_DIR,
    scanned: dirs.length,
    with_license: withLicense,
    with_attribution: withAttribution,
    by_license: Object.fromEntries(Object.entries(byLicense).sort((a, b) => b[1] - a[1])),
    by_level: byLevel,
    out: OUT_JSON,
  }, null, 2));
}

main();
