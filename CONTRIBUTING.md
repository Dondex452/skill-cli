# Contributing to skill-cli

## What this repo is

A CLI plus a generated catalog. Rule zero: **never hand-edit generated files**
(`src/data/catalog.jsonl`, `src/data/licenses.json`, `src/data/origins.json`
and friends). Change the generator or the inputs, then regenerate.

## Workflow

1. Change code under `src/`, `scripts/`, or `tests/`.
2. `npm test` — must be fully green (tests run against `tests/fixtures/`, never
   the full skill library).
3. `npm run sanity-check` — the PASS gate (includes the mini-core license gate).
4. If you touched the catalog pipeline, run `npm run build:catalog` and confirm
   the summary numbers look sane.

See `docs/BUILDING.md` for the pipeline and `BUILD_SCHEMA.md` for the plan.

## Adding skills to the core pack or curated list

- **Core pack** (`skills-core/` + `src/data/core-pack.json`): only skills with a
  permissive license AND a named author. Proof required, no exceptions.
- **Curated top** (`src/data/curated-top.json`): quality-ranked discovery list.
  Notes must describe what the skill actually does, taken from its own files.

## License and attribution

All code contributions are MIT. If you add a skill to the core pack, include
its author and license evidence — see `docs/LICENSES.md`.
