# IELTS Coach — project instructions

Static practice tools that mirror real test conditions. Speaking (`index.html`) and Writing
(`writing.html`) copy a transcript into Claude, where the version-controlled `ielts-coach` skill
grades it. Reading (`reading.html`) is self-scored offline — no AI.

## Non-negotiables (grading prompt)
- The grading prompt is `.claude/skills/ielts-coach/SKILL.md`. It is **scenario-tested**.
  Never change it without re-running the gate: `./tests/run-prompt-tests.sh` — it must be 12/12.
- After editing the checker, run its unit tests: `node tests/prompt-scenarios/check.test.mjs`.
- The pinned machine tokens (`TASK n BAND:`, `OVERALL:`, `| criterion | X.X | reason |`) are a
  contract between SKILL.md, the app's payload, and the test checker. Change one → change all three.

## Non-negotiables (Reading)
- `scorer.js` is the **single source** of scoring/band/lint logic — the browser and the Node
  tests share it. Never change it without running the unit tests (needs **Node 18+**):
  `~/.nvm/versions/node/v22.17.1/bin/node --test tests/reading/scorer.test.js` — must be all green.
- After editing `reading-content.js`, run the content lint via `reading.html?selftest=1` (or the
  Node harness) — question numbering, answer keys, word limits, locations, and the multi-answer
  invariant must all pass. Both authored tests must score 40/40 on a perfect run.
- The pinned band table lives only in `scorer.js`; `rawToBand(0)=1.0`, and Band 0 is a
  Results-layer state (zero questions answered), never returned by `rawToBand`.

## Non-negotiables (all pages)
- Pages are self-contained, **no build step**, GitHub Pages + `file://` compatible. `scorer.js`
  and `reading-content.js` are **classic scripts** (ES modules are CORS-blocked on `file://`).
- `writing.html` and `reading.html` have `?selftest=1` harnesses — run them after touching
  scoring, word-count, payload, or content logic.

## Not in scope yet
Listening module, General Training (letters / GT Reading), diagram-label completion,
in-app AI grading, shared-stylesheet extraction across the pages.
