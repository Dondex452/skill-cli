import fs from "node:fs";
import path from "node:path";

const SKILLS_DIR =
  process.env.SKILLS_DIR ?? "C:/Users/Admin/Desktop/complete skills";

const SUSPICIOUS = [
  { name: "download-and-exec", re: /(iwr|invoke[- ]?webrequest|wget|curl)[^\n]{0,120}(-o|outfile|\|(?![^|]))[^\n]{0,120}(sh|bash|python|perl|powershell|cmd|mshta|rundll32|cscript|wscript)/i },
  { name: "encoded-powershell", re: /-[eE]nc(?:oded[A-Za-z]*)?\s+[A-Za-z0-9+/=]{20,}|\$\{[^}]{30,}\}\s*[-|>].{0,20}frombase64/i },
  { name: "base64-decode-exec", re: /frombase64|base64[ -]d[^&\n]{0,120}(sh|bash|python|cmd|powershell)/i },
  { name: "credential-stealer", re: /mimikatz|sekurlsa|lsass|credential[ _-]?(dump|stealer)|password[ _-]?stealer/i },
  { name: "persistence", re: /schtasks[^\n]{0,80}\/create|reg[^\n]*add[^\n]*(run|runonce)/i },
  { name: "ransomware", re: /ransomware|wannacry|petya|zerolocker|lockbit/i },
  { name: "shell-upload", re: /webshell|r57\.|(?:^|[^a-z0-9])c99\b|shell\.php|jsp[-_ ]?shell|b374k/i },
  { name: "cryptojacking", re: /xmrig|coinhive|cryptonight|nicehash|miner\.(exe|py|sh)|cryptojack/i },
  { name: "exe-files", re: /^(?!SKILL\.md$).+\.(exe|dll|scr|vbs|bat|cmd|ps1|pif|com)$/i },
];

function decodeBuffer(buf) {
  const utf8 = buf.toString("utf8");
  return utf8.includes("\uFFFD") ? buf.toString("latin1") : utf8;
}

function scanDir(dir, findings, stats) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      scanDir(full, findings, stats);
      continue;
    }
    if (!e.isFile()) continue;
    const ext = path.extname(e.name);
    stats.files++;
    if (ext === "" || ext === ".md" || ext === ".txt") {
      const content = decodeBuffer(fs.readFileSync(full)).slice(0, 200000);
      for (const rule of SUSPICIOUS) {
        if (rule.name === "exe-files") continue;
        const m = rule.re.exec(content);
        if (m) {
          findings.push({
            type: rule.name,
            file: path.relative(SKILLS_DIR, full),
            line: m[0].slice(0, 160),
          });
          break;
        }
      }
    }
    if (SUSPICIOUS.at(-1).re.test(e.name)) {
      findings.push({
        type: "exe-files",
        file: path.relative(SKILLS_DIR, full),
        line: `file type: ${ext}`,
      });
    }
  }
}

function main() {
  const stats = { dirs: 0, files: 0 };
  const findings = [];
  for (const name of fs.readdirSync(SKILLS_DIR)) {
    const full = path.join(SKILLS_DIR, name);
    if (!fs.statSync(full).isDirectory()) continue;
    stats.dirs++;
    scanDir(full, findings, stats);
  }
  const byType = findings.reduce((m, f) => {
    m[f.type] = (m[f.type] ?? 0) + 1;
    return m;
  }, {});
  console.log(JSON.stringify({
    skills_dir: SKILLS_DIR,
    scanned_dirs: stats.dirs,
    scanned_files: stats.files,
    findings: findings.length,
    by_type: byType,
  }, null, 2));
  if (!findings.length) {
    console.log("no suspicious matches");
    return;
  }
  console.log("--- findings (read-only report; review before any action) ---");
  for (const f of findings) {
    console.log(`[${f.type}] ${f.file} :: ${f.line}`);
  }
  process.exitCode = 1;
}

main();
