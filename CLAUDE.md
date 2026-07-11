# IELTS Coach — project instructions

Static practice tools (Speaking `index.html`, Academic Writing `writing.html`) that
copy a transcript into Claude, where the version-controlled `ielts-coach` skill grades it.

## Non-negotiables
- The grading prompt is `.claude/skills/ielts-coach/SKILL.md`. It is **scenario-tested**.
  Never change it without re-running the gate: `./tests/run-prompt-tests.sh` — it must be 12/12.
- After editing the checker, run its unit tests: `node tests/prompt-scenarios/check.test.mjs`.
- The pinned machine tokens (`TASK n BAND:`, `OVERALL:`, `| criterion | X.X | reason |`) are a
  contract between SKILL.md, the app's payload, and the test checker. Change one → change all three.
- Pages are self-contained, **no build step**, GitHub Pages compatible. Keep them that way.
- `writing.html` has a `?selftest=1` harness — run it after touching word-count or payload logic.

## Not in scope yet
Reading and Listening modules, General Training Task 1 (letters), in-app AI grading.
