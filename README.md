# skill-cli

**1,569 skills indexed · 106 curated · 7 ship in the core pack.**

Find, review, and install AI agent skills for Claude Code, OpenCode, Gemini CLI,
Cursor, and Codex — from one local catalog. Search is instant and offline; installs
are either offline file copies (core pack) or pinned downloads from the skill's
original author (fetchable tier). Nothing is ever bundled without permission.

```sh
npm i -g skill-cli
skill-cli search "voice ai"
skill-cli top 20
skill-cli install caveman --dir ~/.claude/skills
```

## How it works

Every skill in the catalog has an **availability** level, shown by every command:

| Level | Meaning | Install |
|---|---|---|
| `core` | 7 verified skills shipped in `skills-core/`, MIT + attributed | offline copy |
| `fetchable` | 1,423 skills with a version-pinned origin | downloads from the author at install |
| `index-only` | 139 skills: no verified origin yet, or gated | `skill-cli request <name>` to ask for it |

`reviewed` tier (106 skills) is the human-curated best-of list behind `top` —
each entry has a one-line note describing what the skill actually does.

## Commands

```
skill-cli search <query>            # ranked search over the catalog
skill-cli view <name>               # skill card: tier, license, origin, curation
skill-cli install <name>            # core now; fetchable downloads pinned
skill-cli uninstall <name>          # remove (asks before deleting your edits)
skill-cli list                      # filter by --category --tool --tier
skill-cli top [n] [--category X]    # curated best-of (106 entries)
skill-cli stats                     # catalog health
skill-cli doctor                    # validate your agent setup
skill-cli init <dir>                # bootstrap a skills folder
skill-cli request <name>            # open an issue asking for a skill
```

Example:

```
$ skill-cli top 5
  1  skill-creator  fetchable
     Create new CLI skills the official Anthropic way: brainstorming, templates, validation, install.
  2  frontend-design  fetchable
     A frontend designer-engineer, not a layout generator. Distinctive, production-grade interfaces.
  3  caveman  fetchable
     Talk like caveman, cut ~75% of output tokens, keep full technical accuracy. MIT.
  4  claude-api  fetchable
     Build apps with the Claude API or Anthropic SDK, with trigger rules for when it applies.
  5  mcp-builder  fetchable
     Create MCP servers that let LLMs interact with external services through well-designed tools.
5 of 106 curated
```

## Docs

- `docs/INSTALL.md` — install the CLI and set up agent folders
- `docs/BUILDING.md` — regenerate the catalog, run the pipeline
- `docs/LICENSES.md` — what ships, what doesn't, and why
- `docs/CATEGORIES.md` — the 63-category taxonomy
- `CONTRIBUTING.md` — contribution rules

## License

MIT for the code and tooling (`LICENSE`). Individual skills keep their own
licenses and authors — see `docs/LICENSES.md`.
