# skill-cli

Your AI assistant can learn new skills. This finds the good ones and installs them.

A **skill** is a small instruction pack that makes assistants like Claude Code,
OpenCode, Gemini CLI, or Cursor better at one thing: writing cleaner, using fewer
tokens, building bots, checking code, doing research. Thousands exist, scattered
across GitHub. This collects **1,569** of them into one searchable list, ranks the
**top 106**, and installs them with one command.

```sh
npm i -g skill-cli

skill-cli search "voice ai"     # find skills for a task
skill-cli top 20                # the curated best-of list
skill-cli install caveman       # install it into your assistant
```

Real output:

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

## How installing works

Each skill shows an availability level:

- **`core`** — 7 verified skills shipped with the tool. Install works offline.
- **`fetchable`** — 1,423 skills downloaded from the original author at a pinned
  version. Needs internet, can't silently change under you.
- **`index-only`** — searchable but not installable (no verified source yet).
  `skill-cli request <name>` asks for it to be added.

Search is instant and fully offline. Nothing is ever bundled without the
author's permission — see `docs/LICENSES.md`.

## All commands

```
skill-cli search <query>            # ranked search
skill-cli view <name>               # details: license, origin, curator note
skill-cli install <name> [--dir X]  # install into an agent folder
skill-cli uninstall <name>          # remove (asks before deleting your edits)
skill-cli list [--category X]       # browse with filters
skill-cli top [n] [--category X]    # the curated best-of
skill-cli stats                     # catalog health
skill-cli doctor                    # check your setup
skill-cli init <dir>                # make a fresh skills folder
skill-cli request <name>            # ask for a skill to be added
```

## Learn more

- `docs/INSTALL.md` — setup walkthrough
- `docs/CATEGORIES.md` — all 63 categories
- `docs/LICENSES.md` — what ships, what doesn't, and why
- `docs/BUILDING.md` — for contributors: regenerate the catalog
- `BUILD_SCHEMA.md` — the internal build plan

MIT licensed. Built in the open.
