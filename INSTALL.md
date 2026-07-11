# Installing the `ielts-coach` grading skill

The web tools ([index.html](index.html), [writing.html](writing.html)) are static — deploy
them to GitHub Pages and anyone can use them in a browser with nothing to install. Only the
**grading** step needs the `ielts-coach` skill, because that runs inside Claude.

The skill is a single self-contained file: [`.claude/skills/ielts-coach/SKILL.md`](.claude/skills/ielts-coach/SKILL.md).
No dependencies, no build. "Installing" it just means putting that file where Claude looks for skills.

## Where skills live

| Scope | Path | Available in |
|-------|------|--------------|
| **Global** (per account) | `~/.claude/skills/ielts-coach/SKILL.md` | every project on that account |
| **Per-project** | `<project>/.claude/skills/ielts-coach/SKILL.md` | that project only |

This repo already ships the per-project copy, so working *inside this repo* it is available with no setup.

## Install globally on a new account or machine

Pick one method.

**A. Copy (simplest, self-contained).** The copy won't auto-update when the repo file changes —
re-run the copy after edits.

```bash
mkdir -p ~/.claude/skills/ielts-coach

# from a clone of this repo:
cp .claude/skills/ielts-coach/SKILL.md ~/.claude/skills/ielts-coach/SKILL.md

# …or straight from GitHub, without cloning:
curl -fsSL https://raw.githubusercontent.com/dev-afzy/IELTS-coach/master/.claude/skills/ielts-coach/SKILL.md \
  -o ~/.claude/skills/ielts-coach/SKILL.md
```

**B. Symlink (stays in sync with a local clone).** Best when you have the repo checked out and
want repo edits to take effect everywhere immediately. The symlink target is an absolute path, so
it only works on the machine that holds the clone.

```bash
ln -s "$PWD/.claude/skills/ielts-coach" ~/.claude/skills/ielts-coach
```

Then **start a fresh Claude session** — skills load at session start, so a running session won't
pick it up until you restart.

### Verify it loaded

In a new session, ask Claude to grade any short essay. The tested prompt always answers in a fixed
format — a `TASK n BAND:` line, a per-criterion table, an `OVERALL: X.X` verdict, a "what's holding
you back" section, and a Band 8.5 rewrite. If you don't see those, the old version is still active.

## No-install fallback

If you can't (or don't want to) install the skill on some account, paste the contents of
`SKILL.md` into the chat once, then paste the transcript the app copied for you. Same grading,
nothing installed.

## Notes

- **Name collision.** If an `ielts-coach` skill is also installed via a plugin/marketplace, both
  can coexist under the same name and resolution may be ambiguous. To use only the tested one,
  remove or disable the other through your plugin tooling.
- **Uninstall:** `rm ~/.claude/skills/ielts-coach` (removes the copy or the symlink; a symlink
  never touches the repo file).
