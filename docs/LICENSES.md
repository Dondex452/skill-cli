# Licenses and attribution

## The rule

This project **never redistributes other people's skills**. There are exactly
two ways a skill reaches your machine, and both keep the author's rights intact:

1. **Core pack** (7 skills in `skills-core/`) — shipped as files. Every one has
   a permissive license (all MIT) plus a named author, recorded in
   `src/data/licenses.json` and enforced by `npm run sanity-check` (the Phase
   4.0 gate). Two entries (`faf-wizard`, `technical-change-tracker`) carry
   mention-level license evidence — the weakest kind — and were still approved
   by the owner. If that bothers you, they are one edit away from removal.
2. **Fetchable** (1,423 skills) — never shipped. `install` downloads them from
   the author's own repository at a pinned version, at your request. That is
   you fetching upstream, not us re-sharing.

Everything else is `index-only`: searchable metadata, no files, no install.
Hacking-flagged skills are additionally locked out of install at runtime,
even if they somehow gained an origin.

## If you own a skill listed here

- Indexed metadata (name + description + tags) is factual cataloging, like a
  search engine listing.
- Want it removed or corrected? Open an issue — removal is one row deletion,
  no release needed since we ship no copies.
- Want it promoted to the core pack? Provide license + attribution and it goes
  through the same gate as everything else.
