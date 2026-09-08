# MEMORY — skill-cli

**Repo:** `C:\Users\Admin\Desktop\hope 1` · git initialized · public target `Dondex452/skill-cli`
**Last session:** 2026-09-08 — rev.3 + origins (1,521) + mini-core shipped (7) + REVIEW_3.3 (49 OK/1 FIX) + Phase 3.4 DONE (curated-top 106, `top` live, view upgrade) · 68 tests green · nothing committed yet

## State
- `scripts/build-catalog.mjs` — generator (env `SKILLS_DIR` override, default `C:/Users/Admin/Desktop/complete skills`) — emits `category`/`category_source`, applies `src/data/ai-tags.json`
- `scripts/taxonomy.mjs` — 63 categories, single source; `classify()`, `--docs` regenerates `docs/CATEGORIES.md`
- `scripts/sanity-check.mjs` — PASS gate (dup names, empty descs, missing fields, category ids, ai-tags integrity)
- `src/data/catalog.jsonl` — **1,569 records, 0 failures, 701 KB** · `src/data/ai-tags.json` — 328 entries
- Pending owner validation: `DECISION_LOG_1.5.md` (core/index-only) + `docs/REVIEW_3.3.md` (50-row spot check)

## Verified numbers (measured, not estimated)
- Source library: **1,570 dirs**. `windows-privilege-escalation` = **TROJAN (Trojan:Win32/Pomal!rfn) — quarantined by Windows Defender, NEVER restore**. Blocked at build time via `scripts/blocklist.json` (build shows `blocked: [name]`, treats it as neither record nor failure). Catalog = **1,569** records
- 24 skills flagged `risk: offensive` exist as index-only metadata (pentest/red-team); install gate also refuses risk=offensive at runtime — double-layered, by design

## Threat sweep (Defender verified, 2026-08-31)
- `Start-MpScan` (custom scan) over `complete skills`: **NO new threats** — threat log shows only the Pomal trojan (inactive/quarantined). AV enabled.
- `scripts/scan-threats.mjs` (`npm run scan:threats`): 30 hits over 5,822 files — all reviewed, all noise-by-nature: security vocabulary (Mimikatz/ransomware/C99 in legit pentest docs — skills already risk-flagged, index-only), official vendor installers (docker/hf/google CLI), playwright node_modules .cmd/.ps1 wrappers. No malware signatures. Re-run after any batch of new skills.
- Descriptions: parsed from front-matter (BLOCK SCALARS `|`/`>` handled)
- Field coverage: 707 `risk` values; licenses now scanned (see below); source mapped to tool (`opencode`/`.gemini`/`.cursor`/`.claude`/`manifest`)
- Tokens estimate: ~2,660 avg/skill (~4.2M total). Catalog size budget 1 MB ✅ (592.6 KB now)
- Critical lesson: **token safety** — catalog never enters LLM context; installed skills are local file copies

## License intelligence (scanner, this session)
- `scripts/scan-licenses.mjs` → reads 1,570 dirs (LICENSE*/COPYING* files, front-matter, explicit SKILL.md mentions) → `src/data/licenses.json` (license + level file|front-matter|mention + attribution)
- Results: **131 with license, 124 permissive** (Apache-2.0 79, MIT 35, BSD-3 4, MIT-0 1; 5 proprietary, 1 AGPL, 1 GPL — correctly locked out)
- Catalog grows `license_level` + `attribution` fields; prose `license:` front-matter values (e.g. "Complete terms in LICENSE.txt") fall back to file-level detection
- 174 records have an attribution (author URL/copyright line) hint

## Bugs fixed last session (do NOT re-introduce)
1. CRLF: match `\r?\n` everywhere; JS `$` does NOT match before bare `\r`
2. Encoding: decode latin1 if utf8 contains U+FFFD
3. YAML block scalars → join indented continuation lines
4. Front-matter delimiters: allow trailing spaces `--- ` and end-of-file closing
5. `firstSentence` was too aggressive (cut "6. Reduces Clutter…" to "6.") → capped 180 chars instead
6. Manifest CSV: quote-escaped (`\"`); local paths are PRIVATE → remap to agent-type, never emit raw paths
7. Canonical name = DIRECTORY name (front-matter `name` differs → kept as `fm_name`)

## Bugs fixed this session (do NOT re-introduce)
8. No `require()` in ESM files — always `import fs from "node:fs"` (hit twice in paths.mjs/doctor.mjs)
9. Reviewed bonus must NOT fire on zero matches (stopword-only queries polluted results) → applies only if base score > 0
10. `doctor --dir <missing>` = problem (exit 1), not a note; `docs/`-style subdirs without SKILL.md = warning, NOT problem
11. `node --test tests/` does NOT scan dirs on Node 24 → package.json test script uses glob `"tests/**/*.test.mjs"`

## Product decisions (see BUILD_SCHEMA.md rev.2)
- Two-tier: Core pack (~150-200, shipped) + index-only (searchable, `skill-cli request` to promote)
- `tier: indexed|reviewed` — NEVER auto-claim `verified`
- License gate before any skill file ships; risk table fully reviewed
- Runtime = no AI; search = weighted string scoring

## Implemented this session (full Phase 2 CLI MVP minus phased-gated parts)
- Part 1: `src/cli.js` (bin) + `src/lib/{catalog,search,output,paths,exit}.mjs` + `src/commands/{search,view,list,stats,doctor}.mjs`
- Part 2: `src/lib/install.mjs` (copy/hash/state engine) + `src/commands/{install,uninstall,request,init}.mjs`
- Exit codes: 0 ok · 1 usage · 2 not found · 3 conflict · 4 license/unavailable
- `install` gate blocks: non-core (`index-only`), non-permissive license (own list: mit/apache/bsd/isc/mpl/unlicense/cc0/zlib), risk=offensive, missing source root
- `uninstall` prompt via TTY readline or piped stdin; modified/added files (sha256 diff vs state) require confirmation (or --yes); state = `<agentDir>/.skill-cli/state.json` (dot-dirs ignored by doctor/agents)
- `request <name> --dry-run` never opens a browser in tests; `SKILL_CLI_REPO` (default `Dondex452/skill-cli`), `SKILL_CLI_SOURCE_DIR`, `SKILL_CLI_HOME`, `SKILL_CLI_CATALOG` env overrides
- Search: schema 2.3 weights, stopwords, reviewed bonus only on real matches (measured ~21 ms)
- `top` remains the only PLANNED command (needs curated-top.json — Phase 3.4)
- Tests: 55 pass (`npm test`). Fixtures: `tests/fixtures/catalog{,-dup,-broken}.jsonl`

## Implemented this session (2026-09-01, Phases 3.1-3.2)
- `scripts/taxonomy.mjs` — 63 categories (62 named + misc), single source; classify() = hyphen-normalized keyword matchers (EN/PT/ES/ZH), risk=offensive forced to offensive-security, max 3 cats, no-match → misc; builds `docs/CATEGORIES.md` via `--docs` (`npm run build:categories-doc`)
- build-catalog.mjs now emits `category` + `category_source` per record (heuristic | ai); ai-tags override applies after heuristic; sanity-check validates category ids + ai-tags entries (names exist, ≤3 ids)
- `src/data/ai-tags.json` — 328 AI-assigned tags for the misc queue (committed, owner-reviewable)
- Measured: 1,569/1,569 categorized, **1 misc** (sharp-edges, junk by design), category_source: 1,241 heuristic / 328 ai
- Tests: 63 pass (tests/taxonomy.test.mjs — 8 tests incl. offensive-forced, misc fallback, max-3)
- 3.3 kickoff: `docs/REVIEW_3.3.md` = 50-row spot-check sheet (random 42 + 8 hardest) — **owner must OK/FIX before 3.4 curated-top**

## Origin resolution (2026-09-08, rev.3 Phase 1.5a)
- Pipeline: `scripts/scan-origins.mjs` (local hints) → `scripts/resolve-origin.mjs` (trees+pins, cached, resumable) → `scripts/verify-origins.mjs` (hash fidelity) → `scripts/similarity-check.mjs` (drift triage) → `scripts/find-candidates.mjs` (upstream-only adds)
- Data: `src/data/origins.json` (1,521 resolved: 964 similarity / 356 local-identical / 144 single-repo / 11 remapped-evolved / 2 readme-path / rest mixed), `origin-verification.json`, `origin-similarity.json`, `origin-candidates.json` (**821 addable skills**, 25 official Anthropic)
- Key findings: library ≈ sickn33/agentic-awesome-skills content (969 byte-identical); renat = contributor, not host; mrprewsh→prewsh rename; bitjaru ui-*→ss-* remap (11, sim-verified); caveman = JuliusBrussee/caveman (MIT); bio cluster = google-deepmind/science-skills (official); swarm cluster = jamalavedra/agent-swarm; 20 offensive all zebbern, never fetchable
- Gaps: 14 possible-collisions (owner review) + 34 no-candidates (stragglers) + 17 repos queued for next GitHub API window (`node scripts/resolve-origin.mjs` online rerun — cache makes it cheap). Dead: mrprewsh/*, danielmiessler/personal-ai-infrastructure, alchaincyf/glm-claude, bizshuk/llm-plugin
- Rate limit: 60/hr unauthenticated; trees+pins cached under %TEMP%/opencode/origin-trees; raw.githubusercontent unmetered (verify/similarity need no API)

## Next steps (safe order)
1. [~] Phase 1.5 shortlist: `DECISION_LOG_1.5.md` DRAFTED 2026-09-01 (124 permissive / 7 non-permissive / 166 attribution-only; 340 lines, Decision column blank for owner) — owner fills core/index-only, then regenerates catalog with availability
2. [~] Phase 3: taxonomy + AI batch tagging — **3.1+3.2 DONE (63 cats, 328 ai-tags, 1 misc left)**; **3.3 next**: owner reviews docs/REVIEW_3.3.md (50 rows OK/FIX) → fix ai-tags.json → then 3.4 curated-top-100 + `top`
3. [ ] Phase 2.5 only after 1.5: `install --minimal` (BETA stripper — decision on what "examples" means)
4. [ ] Phase 4: README, docs, LICENSE, CI, npm/GitHub publish
5. [ ] Everything is UNCOMMITTED — first commit should be scaffold + catalog + CLI + tests
