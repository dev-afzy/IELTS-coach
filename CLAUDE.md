# IELTS Coach — project instructions

Static practice tools that mirror real test conditions. Speaking (`index.html`) and Writing
(`writing.html`) copy a transcript into Claude, where the version-controlled `ielts-coach` skill
grades it. Reading (`reading.html`) and Listening (`listening.html`) are self-scored offline — no AI.
Listening speaks its audio live via the browser (no files).

## Non-negotiables (grading prompt)
- The grading prompt is `.claude/skills/ielts-coach/SKILL.md`. It is **scenario-tested**.
  Never change it without re-running the gate: `./tests/run-prompt-tests.sh` — it must be 12/12.
- After editing the checker, run its unit tests: `node tests/prompt-scenarios/check.test.mjs`.
- The pinned machine tokens (`TASK n BAND:`, `OVERALL:`, `| criterion | X.X | reason |`) are a
  contract between SKILL.md, the app's payload, and the test checker. Change one → change all three.

## Non-negotiables (Reading + Listening — shared scorer)
- `scorer.js` is the **single source** of scoring/band/lint logic for both modules — the browser
  and the Node tests share it. Never change it without running the unit tests (needs **Node 18+**):
  `~/.nvm/versions/node/v22.17.1/bin/node --test tests/scorer.test.js` — must be all green.
- `rawToBand(raw, module)` has two pinned band tables (`module` defaults to `"reading"`); they
  genuinely differ (e.g. raw 32 → Reading 7.0, Listening 7.5). Keep the back-compat tests passing.
  `rawToBand(0)=1.0`; Band 0 is a Results-layer state (zero answered), never returned by `rawToBand`.
- After editing `reading-content.js` / `listening-content.js`, run the content lint via
  `reading.html?selftest=1` / `listening.html?selftest=1` (or the Node harness). Every authored test
  must score 40/40 on a perfect run.
- **Listening only:** every `text` answer must appear verbatim in its part's script (the lint
  enforces this); spelled names / read-out numbers carry `spokenAs`. `RATE=1.0` and the sentence-
  splitter rules are pinned — the splitter is a pure, unit-tested function. Play-once is enforced by
  construction (no file, no seek); a mid-recording reload forfeits the audio by design.

## Non-negotiables (all pages)
- Pages are self-contained, **no build step**, GitHub Pages + `file://` compatible. `scorer.js`
  and `reading-content.js` are **classic scripts** (ES modules are CORS-blocked on `file://`).
- `writing.html`, `reading.html`, and `listening.html` have `?selftest=1` harnesses — run them
  after touching scoring, word-count, payload, or content logic.

## Not in scope yet
General Training (letters / GT Reading), diagram-label completion (Reading) and map/plan labelling
(Listening, deferred to v1.1), a second Listening test, in-app AI grading, shared-stylesheet
extraction across the pages.
