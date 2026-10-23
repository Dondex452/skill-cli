# Install

## The CLI

Requires Node.js 18+.

```sh
npm i -g skill-cli-ai     # installs the `skill-cli` command
# or run from source:
git clone https://github.com/Dondex452/skill-cli.git
cd skill-cli
node src/cli.js --help
```

## Agent folders

`install` copies skills into your agent's skills folder. It auto-detects:

- `~/.config/opencode/skills/` → opencode
- `~/.claude/skills/` → Claude Code
- Gemini / Cursor equivalents

No folder yet? Bootstrap one:

```sh
skill-cli init ~/.claude/skills
```

Or point anywhere explicitly per command:

```sh
skill-cli install unslop --dir ./my-project/.claude/skills
```

## What installs and what doesn't

- `core` (7 skills) — installs offline from the shipped `skills-core/`.
- `fetchable` (1,423 skills) — downloads from the skill's pinned origin
  (exact version, hash-checked). Needs internet.
- `index-only` — not installable. `skill-cli request <name>` opens an issue
  asking for it; hacking-flagged skills are never installable by design.

Check before you install:

```sh
skill-cli view <name>      # shows tier, license, origin pin
skill-cli doctor           # validates your setup
```

## Minimal installs (BETA)

`--minimal` copies only `SKILL.md` and leaves `examples/`, `assets/`, `scripts/`
and `references/` behind:

```sh
skill-cli install playwright-java --minimal
```

The instructions still work, but a skill that reads its own bundled files will
notice they are missing. The CLI prints how many files it skipped. This is BETA:
reinstall without `--minimal` if the skill needs its extras.
