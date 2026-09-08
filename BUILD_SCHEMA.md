# BUILD SCHEMA — `skill-cli`

> **Visitors start at [README.md](README.md).** This file is the internal build
> plan: what gets built, in what order, and what rules can never be broken.
> Some linked worksheets (`DECISION_LOG_1.5.md`, `docs/REVIEW_3.3.md`) are
> author-local working papers and are intentionally not published.

**Product:** Curated catalog + CLI for installing AI agent skills
**Asset base:** 1,570 unique skills (source: `C:\Users\Admin\Desktop\complete skills`)
**Local folder:** `C:\Users\Admin\Desktop\hope 1` — **public GitHub repo name: `skill-cli`** (`Dondex452/skill-cli`)
**Created:** 2026-08-31
**Owner goal:** GitHub credibility + content engine + sellable client service

---

## 1. Product Definition

### 1.1 What it is
An open-source CLI that lets anyone search, review, and install AI agent skills,
powered by a pre-indexed catalog of 1,570 skills. The catalog is the
differentiator — a *curated* view of the skill ecosystem, not a dump.

**Critical design truth (rev. 3):** the catalog is fetch-first, not ship-copies.
- **No redistribution:** `install` never ships third-party skill files in our repo. It downloads each skill from its recorded origin (author repo + pinned version) at install time — like `npm install` pulls code instead of bundling it. We point, we don't re-share, so bulk permission review is unnecessary.
- **Tier A — VERIFIED MINI-CORE:** a small set (~7-40 skills) with confirmed permissive license + attribution, committed in `skills-core/`. Always installable, works offline. This is the only thing the license gate covers.
- **Tier B — FETCHABLE:** any catalog record with a resolved + pinned `origin`. Installable with internet; hash-checked against the pin.
- **Tier C — INDEX-ONLY:** searchable/browsable metadata only (no origin resolved yet, or risk-gated). `install` says "no verified origin — request it" instead of pretending to work.
- The bulk catalog is a *discovery* product; the mini-core is an *offline guarantee*. Both are honest if separated clearly in the UI (`view` shows `available: core | fetchable | index-only`).

### 1.2 Non-goals (explicitly out of scope)
- NOT a skill library downloader/scraper of external repos (v1)
- NOT a skill editor/authoring tool
- NOT an AI model or agent itself
- NO cloud service, accounts, or auth in v1 (fully local, offline)

### 1.3 Personas
| Persona | Need | Feature that serves them |
|---|---|---|
| AI agent user | "Which skill is best for X?" | `search`, `top`, `view` |
| Business owner | "Set my agent up for my business" | `install`, `stack`, `slim` |
| Employer (recruiter) | "Show me real engineering" | code quality, tests, README |

### 1.4 Commands (contract, v1)
```
skill-cli search <query>            # ranked search over catalog
skill-cli view <name>               # render skill details + curator notes + availability
skill-cli install <name>            # copy skill into agent folder (core pack only, v1)
skill-cli install --minimal <name>  # BETA: install with examples stripped
skill-cli uninstall <name>          # remove skill (asks before deleting modified files)
skill-cli list                      # all skills, filterable --category --tool --tier
skill-cli top <n> [--category X]    # curated best-of list (reviewed tier)
skill-cli stats                     # catalog stats, health check
skill-cli doctor                    # validate local agent/skill setup
skill-cli init <dir>                # bootstrap agent folder structure
skill-cli request <name>            # open issue: "add to core pack" (index-only skills)
```

### 1.5 Exit criteria (definition of "done")
- Published to npm + GitHub with README, LICENSE, CI
- `search`/`install`/`uninstall`/`list`/`view`/`stats` fully working with tests
- Catalog index generated for all 1,570 skills with tags + descriptions
- Verified mini-core ships and installs cleanly offline; every record has `tier` + `availability` + `origin` (null until resolved)
- `top` curated list (≥100 skills) exists with 1-line justifications (reviewed tier)
- Zero token bloat: catalog never enters LLM context; installs are file copies
- Performance targets: `search < 50ms`, catalog < 1 MB, `install < 200ms`
- **License gate passed** (see Phase 1.5) BEFORE any skill file is committed — gate covers the mini-core only, never the fetchable tier

---

## 2. Architecture

### 2.1 Repo layout
```
skill-cli/
├── BUILD_SCHEMA.md            # this file
├── README.md                  # public-facing (stars = goal)
├── LICENSE                    # MIT (code only — skills each keep their own attribution)
├── package.json               # npm package + bin entry
├── tsconfig.json
├── src/
│   ├── cli.ts                 # arg parsing → command dispatch
│   ├── commands/              # one file per command
│   │   ├── search.ts
│   │   ├── install.ts
│   │   ├── uninstall.ts
│   │   ├── view.ts
│   │   ├── list.ts
│   │   ├── top.ts
│   │   ├── stats.ts
│   │   ├── doctor.ts
│   │   ├── init.ts
│   │   └── request.ts
│   ├── lib/
│   │   ├── catalog.ts         # load/filter/sort catalog (reads .jsonl)
│   │   ├── search.ts          # scoring + ranking engine
│   │   ├── install.ts         # copy engine (w/ token-aware slim mode, BETA)
│   │   ├── paths.ts           # agent folder discovery (opencode/claude/gemini/cursor)
│   │   ├── token-estimate.ts  # token size estimate per skill
│   │   └── output.ts          # table/color/pretty printing
│   └── data/                  # generated artifacts (committed)
│       ├── catalog.jsonl      # one record per line → clean git diffs (NOT one big json)
│       ├── curated-top.json   # human-reviewed best-of (100+ entries)
│       ├── manifest.csv       # source of truth (copied from skills folder)
│       └── licenses.json      # attribution map: skill name → author/link/license
├── skills-core/               # COMMITTED: verified mini-core ONLY (~7-40 skills, <5 MB)
├── scripts/
│   ├── build-catalog.ts       # reads manifest + SKILL.md front-matter → catalog.jsonl
│   ├── resolve-origin.mjs     # (PLANNED rev.3) resolves + pins fetch origin per record → catalog `origin` field
│   ├── tag-all.ts             # (AI-assisted, one-off) adds tags/descriptions
│   ├── slim-strip.ts          # generate slim variants (BETA)
│   └── sanity-check.mjs       # validates catalog integrity after generation
├── tests/
│   ├── fixtures/              # COMMITTED: 10 sample skills (copied from core pack)
│   │   ├── n8n-workflow-patterns/ ...
│   │   └── (9 more)
│   ├── catalog.test.ts
│   ├── search.test.ts
│   ├── install.test.ts        # runs against fixtures, NEVER against full library
│   └── paths.test.ts
└── skills-full/               # DO NOT COMMIT (all 1,570 stay local, author-only)
```
**Rules (rev. 3):**
- `skills-full/` (1,570) stays OUT of git. Only the verified mini-core (`skills-core/`) is committed — third-party files are never committed, only fetched.
- CI tests run against `tests/fixtures/` — a committed, reproducible slice of reality. Never against `skills-full/` (not in CI).
- Catalog uses `.jsonl` (one record per line) so regenerating produces line-level diffs, not 550 KB noise.

### 2.2 Data model (catalog.jsonl — single record)
```json
{
  "name": "n8n-workflow-patterns",
  "description": "Proven architectural patterns for building n8n workflows.",
  "category": ["workflow-automation", "n8n"],
  "tags": ["n8n", "automation", "patterns"],
  "tools": ["n8n"],
  "tier": "reviewed",
  "tag_source": "ai",             /* ai | human | source */
  "availability": "core",         /* core | fetchable | index-only */
  "origin": null,                 /* null until resolved; else { repo, ref (pinned commit/tag), path } */
  "license": "MIT",               /* null = unknown → mini-core excluded, fetchable unaffected */
  "attribution": "url-or-author",
  "tokens": 2417,
  "files": 3,
  "curated_rank": null,
  "curated_note": null,
  "updated": "2026-08-31"
}
```
**Tiers are honest, never empty claims:**
- `tier: indexed` = exists + indexed. NO quality claim.
- `tier: reviewed` = in `curated-top.json` (100+ entries, human-validated, note written from the skill's own README content, not invented).
- No record is auto-marked "verified/trusted" — that requires human review.
**Size budget:** 1,570 records × ~400 B ≈ ~630 KB. Under the 1 MB target.

### 2.3 Search ranking (v1, no AI at runtime)
Simple weighted scoring, deterministic and fast:
```
score = 5×exactNameMatch + 3×prefixMatch + 2×descriptionWordCount
      + 1×tagMatch + 1×categoryMatch + 1.5×reviewed_bonus
```
Pure string ops → no LLM call, no token cost, works offline.

### 2.4 Availability logic (rev. 3 — fetch-first)
```
install <name>:
  record.availability == "core"        → copy from skills-core/ (offline OK)   ✓
  record.availability == "fetchable"   → download from origin.repo @ origin.ref,
                                         hash-check against pin, then copy in   ✓ (needs internet)
  record.availability == "index-only"  → print "no verified origin — request it",
                                         suggest `skill-cli request`
  record.risk == "offensive"           → refuse, always (design rule, any tier)
```
Third-party files are never committed — only fetched. The mini-core is the sole
exception (verified license + attribution, committed). Author-local regeneration
uses `skills-full/`; published CLI ships `skills-core/` + `catalog.jsonl` (origins, not copies).

### 2.5 Agent folder detection
`doctor`/`init`/`install` probe known candidates in order:
```
~/.config/opencode/skills/       → opencode
~/.gemini/config/skills/         → Gemini
~/.claude/skills/                → Claude Code
~/.cursor/skills/                → Cursor
```
Only the one that exists wins; `--dir <path>` overrides.

---

## 3. Phases & Steps (ordered, with acceptance criteria)

### PHASE 0 — File it (day 0)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 0.1 | Confirm source library | author-local `skills-full/` reference (never committed) | `sanity-check` passes vs manifest |
| 0.2 | Freeze manifest | `scripts/manifest.csv` copied from `complete skills\_manifest.csv` | CSV row count == 1,570 |
| 0.3 | Repo scaffold | `package.json`, `tsconfig.json`, `src/`, `scripts/`, `tests/`, `.gitignore` | `npm run typecheck` passes |
| 0.4 | GitHub repo created | `Dondex452/skill-cli` (public), local remote named `origin` | `git push` dry-run says up-to-date |
**Acceptance:** `npm install && npm run build` produces a runnable CLI (`skill-cli --help`).

### PHASE 1 — Catalog build pipeline (days 1-2)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 1.1 | Build `build-catalog.ts` | reads front-matter of 1,570 SKILL.md files | catalog.jsonl with 1,570 records |
| 1.2 | Extract metadata | name, description, front-matter version, files list, license hints | parse-failures report; missing descriptions get folder-name fallback |
| 1.3 | Token estimation | `token-estimate.ts` (chars/3.5 heuristic) | `stats` reports total catalog tokens |
| 1.4 | Integrity tests | `tests/catalog.test.ts` + `sanity-check.mjs` | CI passes, no dup names, no empties |
| 1.5 | **ORIGIN GATE (rev. 3)** | resolve + pin fetch origin per record (see 1.5a) | every record has `availability` + `tier` + `license` + `origin` filled |
| 1.6 | Fixtures | copy 10 skills into `tests/fixtures/` | fixture set committed; tests reference fixtures only |

**1.5a — Origin Resolution (rev. 3, must complete before Phase 2.4):**
1. New script `scripts/resolve-origin.mjs`: for each record, resolve a fetch origin from (in order) front-matter `repo`/`url` fields, `licenses.json` URL attributions, author-username + skill-name heuristics against public hosts. Record `{ repo, ref (pinned commit/tag), path }` in catalog `origin`; unresolvable stays `origin: null` → `index-only`.
2. Mini-core selection (replaces the 150-200 core pack): only rows with permissive license + attribution land in `skills-core/` (strict-7 PROPOSED 2026-09-08, owner approval pending; may grow via hand verification). `DECISION_LOG_1.5.md` is superseded — kept for audit, no longer gating.
3. risk=offensive records are never fetchable, even with a resolved origin.
**Acceptance:** `npm run build:catalog` idempotent; every record has `origin` (object or null); `stats` shows fetchable/index-only split honestly.

### PHASE 2 — CLI MVP (days 2-4)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 2.1 | Arg parsing + dispatch | `cli.ts`, command registry | all `--help` texts render |
| 2.2 | `search` | scoring engine + table output | query speeds <50 ms; exact/partial/tag hits |
| 2.3 | `view` | skill card (desc, tags, token size, tier, availability, curated_note) | renders for core + index-only fixtures |
| 2.4 | `install`/`uninstall` | copy engine + fetch engine (download + hash-check vs pin) + availability gate (2.4 logic) + agent-folder detection | round-trip on fixtures; core installs offline; fetchable installs with net; refuses index-only/offensive |
| 2.5 | `install --minimal` (BETA) | slim variant install; warned as beta, never promised | installed skill sanity-checked on 10 fixture skills |
| 2.6 | `list`/`top` | flags: `--category`, `--tool`, `--sort`, `--limit`, `--tier` | correct filtered sets incl. tier separation |
| 2.7 | `doctor` | detects agent dirs, validates skills, reports health | correct report on clean/empty systems |
| 2.8 | `request` | opens issue URL for index-only skills | works with `--dry-run` |
| 2.9 | Error handling | exit codes (0 ok, 1 usage, 2 not found, 3 conflict, 4 license/unavailable), messages | unit tests cover paths |
**Acceptance:** manual e2e with fixtures (not full library) — all 10 commands pass.

### PHASE 3 — Curation (days 4-7)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 3.1 | Category taxonomy | ~50 categories authored (tools × domains) | taxonomy.md exists; every skill gets ≥1 category |
| 3.2 | AI batch tagging | `tag-all.ts` pipes skill descriptions to an LLM (offline fallback = heuristics) | 90%+ tagged, human spot-check; `tag_source` recorded per record |
| 3.3 | Human review pass | owner reviews random 50; fixes miscategorized; **reviewed flags set only by this pass** | review log committed; 0 records labeled reviewed without evidence |
| 3.4 | `curated-top.json` | rank 100+ skills, one-line note each; notes drafted FROM each skill's own README, then human-validated | 100 entries curated |
| 3.5 | `view` upgrade | view renders curated_note + rank when present | notes visible |
**Acceptance:** `top 20` output tells a coherent story (a non-coder gets why each is picked).

### PHASE 4 — Polish & publish (days 7-9)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 4.0 | **LICENSE GATE (mini-core only)** | every committed skill has a permissive license or verified attribution in `licenses.json` | gate blocks publish if unpermissive files would ship; fetchable tier out of scope |
| 4.1 | README hero section | number "1,570 skills indexed · 150 shipped in core pack", 3-second demo GIF, install command | renders on GitHub |
| 4.2 | Docs | `docs/CATEGORIES.md`, `docs/INSTALL.md`, `docs/BUILDING.md`, `docs/LICENSES.md` | all commands documented |
| 4.3 | License + code of conduct | MIT + CONTRIBUTING.md + attribution credits | compliant |
| 4.4 | CI workflow | GitHub Actions: typecheck, lint, test (fixtures), build:catalog integrity | green on push |
| 4.5 | npm publish | package name + bin, versioned, unpacked ≤ 1 MB (core pack excluded from npm package? → decision in 1.5; default: pull core from repo tarball) | `npm i -g skill-cli && skill-cli search n8n` → 3 results |
| 4.6 | GitHub release | tag v1.0.0, release notes | repo public, link on README |
**Acceptance:** fresh machine → install from repo/npm → search → install a core skill → works offline.

### PHASE 5 — Content & growth engine (days 9-14)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 5.1 | Content assets | 10 post drafts: "top 10 skills for X" (startups, SREs, SEO, freelancing, recruiters, no-code, sales, scraping, ecom, n8n) | drafts in `content/` folder |
| 5.2 | Catalog page | one HTML page per category (buildable from catalog.jsonl) | `/docs/` renders on-site |
| 5.3 | Social posting cadence | script drafts a month of X/LinkedIn posts; owner posts 3/week | 12 posts live |
| 5.4 | Scorecard files | changelog + issue templates + roadmap.md | repo looks alive |
**Acceptance:** 100+ stars OR 50+ engaged posts in 2 weeks — whichever first (metric recorded in MEMORY.md).

### PHASE 6 — Monetization (days 14-30, optional)
| # | Step | Deliverable | Done when |
|---|---|---|---|
| 6.1 | Client offer sheet | 3 service tiers (setup $150 / stack $350 / automation retainer $?) | offer sheet in `content/` |
| 6.2 | One demo case study | deploy a real business workflow with the stack (n8n/whatsapp/telegram skills) | case study written with before/after |
| 6.3 | Supporter/premium pack | optional paid "business packs" (n8n stack, ecom stack, SEO stack) — built from skills WITH verifiable licenses | 1 paying customer |
**Acceptance:** first invoice sent. (Failure = still shipped two strong portfolio pieces.)

---

## 4. Execution Rules

1. **Fetch-first, never redistribute (rev. 3)** — third-party skill files are downloaded at install time, never committed. Only the verified mini-core ships files; `skills-full/` never leaves the author machine.
2. **No unverified claims** — `tier` is `indexed` by default; `reviewed` only after human pass. Never call bulk skills "verified". `origin: null` means index-only, honestly.
3. **Tests before merge** — every command has a test against `tests/fixtures/`; `npm test` gates. Fetch paths tested with mocked origins, never live network in CI.
4. **No runtime AI** — search/tagging happen at build time, never in the shipped CLI.
5. **License gate covers the mini-core only** — a skill without a clear license + attribution never lands in `skills-core/`, ever. Fetchable tier needs a pinned origin, not a license review.
6. **Pin everything fetched** — an install without a pinned `ref` + hash check is a bug, not a feature.
6. **Token discipline** — catalog ≤ 1 MB; `--minimal` is explicitly BETA until validated on 10+ skills.
7. **Single source of truth** — `scripts/manifest.csv` + `catalog.jsonl`; never hand-edit catalog (regenerate).
8. **Measure in MEMORY.md** — stars, installs, content reach, leads; review weekly (kaizen).
9. **Sequencing is hard** — Phase 1.5 gate blocks Phase 2.4; 4.0 gate blocks 4.1+; Phases 3 and 5 can overlap with 2 and 4.

## 5. Risks & Mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| **Distribution gap (the big one)** — install without files | *fixed rev.3* | fetch-on-install with pinned origins; mini-core committed; index-only marked clearly; author-only `skills-full/` |
| Licensing issues redistribute third-party skills | **Low** (rev. 3) | nothing third-party is committed — only fetched; license gate covers mini-core only; DMCA-ready removal = drop the origin row |
| Upstream changes under users (hijack/drift) | **Medium** | pinned `ref` + hash check on every fetch; warn loudly on pin mismatch, never silently install |
| Offline installs fail | **Medium** | mini-core always works offline; `view` shows availability honestly before install is attempted |
| Origin link rot (repos move/vanish) | **Medium** | `resolve-origin` re-runnable; health check script planned; broken origins fall back to index-only, never to silent failure |
| `--minimal` slim strips break skill behavior | Medium | BETA flag; validate on 10 fixture skills; measure token savings honestly before claiming |
| Catalog quality inconsistent (AI tagging errors) | Medium | 90%+ then human pass; tier honesty hides nothing |
| Manifests drift after edits | Low | `sanity-check` in CI regenerates/fails loudly |
| Repo ballooning size | Medium | only `skills-core/` committed (~10-20 MB); npm keeps core out of package (default), pulled at install via repo tarball |
| Reviewer sees "index-only" as worthless | Medium | it's a *feature*: the catalog is the content; `request` turns users into contributors |
| Search relevance is weak for 1,370 untagged-ish entries | Medium | descriptions from source, name/prefix/desc fallbacks; curated-tier bonus keeps top-quality results first |

## 6. Milestones & Timeline

| Milestone | Day | Gate |
|---|---|---|
| M0 Scaffold | 0 | CLI builds |
| M1 Catalog + origin gate | 2 | 1,570 indexed, origins resolved + pinned, mini-core chosen, license check done (mini-core only) |
| M2 MVP | 4 | all commands pass fixture e2e (incl. fetch path mocked, availability refusal) |
| M3 Curated | 7 | 100 reviewed entries, tier data correct |
| M4 Public | 9 | license gate passed; published npm + GitHub |
| M5 Content | 14 | 100 stars or better engagement |
| M6 Revenue | 30 | first client |

## 7. Immediate Next Steps (rev. 3, 2026-09-08)
1. [ ] Owner approves mini-core proposal (strict-7) — then copy into `skills-core/`
2. [ ] Build `scripts/resolve-origin.mjs` → fill catalog `origin` per record (front-matter repo/url → licenses.json URLs → author heuristics → null)
3. [ ] Regenerate catalog with `availability` = core | fetchable | index-only; extend `sanity-check` to validate origins
4. [ ] Owner reviews `docs/REVIEW_3.3.md` (50 rows OK/FIX) → fix ai-tags.json → 3.4 curated-top
5. [ ] Commit rev.3 result (schema + catalog + CLI + tests); update MEMORY.md
