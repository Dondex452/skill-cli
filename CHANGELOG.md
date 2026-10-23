# Changelog

## 0.1.1 — 2026-10-23

Metadata and documentation only. No CLI behavior changed.

- `package.json` homepage points at the live site.
- `LICENSE` is pure MIT again. The third-party attribution note moved to
  `docs/LICENSES.md`, which is where GitHub's license detection expects it to stay.
- README links the site and the npm page.
- Added `CHANGELOG.md`.

## 0.1.0 — 2026-10-23

First public release.

- Catalog of 1,569 skills with categories, risk flags, licenses, and pinned origins.
- 106 curated entries in `skill-cli top`.
- 7 core skills install offline; 1,423 fetch from the author's pinned commit and
  are hash-checked; 139 are index only.
- Commands: `search`, `top`, `view`, `install`, `install --minimal` (BETA),
  `uninstall`, `list`, `stats`, `doctor`, `init`, `request`.
- 81 tests and a catalog sanity gate; CI on Node 18, 20, and 22.
