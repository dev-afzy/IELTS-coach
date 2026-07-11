# Academic Reading Module Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Build order: Phase A (scorer + tests) → Phase B (content, validated by the lint from A) → Phase C (app UI) → Phase D (nav + docs). The scorer is the contract everything else builds on.

**Goal:** Add an offline, self-scoring IELTS Academic Reading module (`reading.html`) with instant raw→band scoring and per-question review.

**Architecture:** Approach A — `reading.html` (app) loads `reading-content.js` (bank) and `scorer.js` (pure logic) as classic `<script src>` scripts; `scorer.js` also `module.exports` for Node tests, so the browser runs the exact code the tests prove. No build step.

**Tech Stack:** Vanilla HTML/CSS/JS. `node:test` (Node 18+) for scorer unit tests. Run tests with a modern nvm node: `~/.nvm/versions/node/v22.17.1/bin/node --test tests/reading/`.

## Global Constraints (verbatim from spec)

- Static site, **no build step**, GitHub Pages + `file://` compatible. `scorer.js`/`reading-content.js` are **classic scripts** (ES modules are CORS-blocked on `file://`).
- IELTS **Academic** only. Full test = 3 passages / 40 Q / 60 min; single passage = 20 min.
- Scoring is deterministic in-browser; **no AI step**.
- `rawToBand(0) → 1.0`; **Band 0** only at the Results layer when zero questions answered.
- Two-counter word limit `{words, numbers}`; numeric token = `/^\d[\d,.]*$/` after normalization.
- `normalize`: trim, collapse whitespace, lowercase, strip leading/trailing punctuation per token (before the number test).
- `input` (`single`|`match`|`text`) drives widget + scoring, not the type name.
- `allowReuse` is a solving constraint, never a scoring one (never disable options).
- `localStorage` key `ielts-reading-session` with its own `schemaVersion`.
- Timer reuses `writing.html` mechanics: absolute deadline, hard stop at 0:00, freeze-on-close resume.
- Band table pinned (see spec); every band boundary unit-tested.

---

## Phase A — `scorer.js` + unit tests (pure, TDD)

### Task A1: Band conversion
**Files:** Create `scorer.js`; Create `tests/reading/scorer.test.js`
**Produces:** `rawToBand(raw:int) → number`
- [ ] Write `node:test` cases for every boundary: 40→9, 39→9, 38→8.5, 35→8, 33→7.5, 32→7, 30→7, 29→6.5, 27→6.5, 26→6, 23→6, 22→5.5, 19→5.5, 18→5, 15→5, 14→4.5, 13→4.5, 12→4, 10→4, 9→3.5, 8→3.5, 7→3, 5→2.5, 3→2, 2→2, 1→1, 0→1.
- [ ] Run `…/v22.17.1/bin/node --test tests/reading/` → FAIL (rawToBand undefined).
- [ ] Implement `rawToBand` as a pinned lookup over descending thresholds; add `module.exports` tail.
- [ ] Run → PASS. Commit.

### Task A2: `normalize` + `withinWordLimit`
**Produces:** `normalize(s)→string`, `withinWordLimit(answer, {words,numbers})→bool`
- [ ] Tests: `normalize("  Parliament. ")==="parliament"`, `normalize("The  UK")==="the uk"`; `withinWordLimit("the 1901 act",{words:2,numbers:1})===true`, `withinWordLimit("the old 1901 act",{words:2,numbers:1})===false`, `withinWordLimit("eight",{words:1,numbers:0})===true`.
- [ ] Run → FAIL. Implement (token-strip punctuation before numeric test). Run → PASS. Commit.

### Task A3: `scoreQuestionGroup` (all three primitives + selectCount)
**Consumes:** A2. **Produces:** `scoreQuestionGroup(group, responses)→{marks, perQuestion:[{n,correct,your,key,marks}]}`
- [ ] Tests: `single` exact; `match` exact; `text` variant match + over-limit fails; `selectCount:2` with `ns:[7,8]`, `answer:["B","D"]` → picking `["B","E"]` gives 1 mark, fills n7=✓(B), n8=✗(missed D). Define fill convention exactly as spec.
- [ ] Run → FAIL. Implement. Run → PASS. Commit.

### Task A4: `scoreTest` + `lintContent`
**Consumes:** A1–A3. **Produces:** `scoreTest(test, responses)→{raw,outOf,band,perQuestion}`, `lintContent(tests)→{ok,errors}`
- [ ] Tests: `scoreTest` aggregates marks→raw→band over a 2-group fixture; `lintContent` flags each defect: non-contiguous `n`, key-not-in-options, TFNG key not in set, text variant over its own limit, bad `location`, broken multi-answer invariant (`ns.length===selectCount===answer.length`).
- [ ] Run → FAIL. Implement. Run → PASS (full suite green). Commit.

---

## Phase B — `reading-content.js` (2 authored tests)

### Task B1: Test 1 (3 passages, 40 Q) authored + lint-clean
**Files:** Create `reading-content.js`
- [ ] Author `READING_TESTS[0]`: 3 academic passages (~700–900 words, paragraphs labelled A…), 40 questions across ≥6 question types incl. one multi-answer MC and one matching-headings, each with `answer`, `justification`, `location`.
- [ ] Validate: `…/v22.17.1/bin/node -e "global.module={};require('./scorer.js');const t=require('./reading-content.js');console.log(lintContent(t))"` (or a tiny harness) → `{ok:true}`. Fix drift. Commit.

### Task B2: Test 2 (3 passages, 40 Q) authored + lint-clean
- [ ] Author `READING_TESTS[1]` same shape, different topics/types (cover the remaining types incl. `text` completion + `match` features/box). Lint → `{ok:true}`. Commit.

---

## Phase C — `reading.html`

### Task C1: Shell + start screen + nav
- [ ] Create `reading.html` reusing the newspaper CSS; nav strip (Speaking/Writing/Reading); start screen with Full Test (Test 1/2) and Single-passage (pick 1 of 6). Loads `scorer.js` + `reading-content.js`. Verify in browser. Commit.

### Task C2: Test screen — passage + question renderers (3 primitives)
- [ ] Render passage (labels shown when a matching group needs them) + question groups: `single` (radio, or checkboxes when `selectCount`), `match` (dropdown, never-disabled options), `text` (input). Capture responses into state. Verify each primitive renders + records. Commit.

### Task C3: Palette + timer + persistence
- [ ] 1–40 nav palette (answered/unanswered/flag states, click-to-jump); absolute-deadline timer (60/20 min), hard stop → submit; autosave to `ielts-reading-session` + freeze-on-close resume. Verify jump + resume. Commit.

### Task C4: Results screen + review + `?selftest=1`
- [ ] Call `scoreTest`; show raw/40, band (indicative), Band 0 when zero answered; per-question ✓/✗ with your/correct/justification and jump-to-passage highlight. Add `?selftest=1` running `lintContent(READING_TESTS)` + scorer fixture, banner like `writing.html`. Verify results + selftest green. Commit.

---

## Phase D — nav + docs

### Task D1: Wire nav on existing pages + docs
- [ ] Add "Reading" link to `index.html` and `writing.html` nav strips. Update `README.md` (Reading module) and `CLAUDE.md` (Reading test command, Node 18+). Verify all three nav strips. Commit.

---

## Self-review

Spec coverage: scorer/band/normalize/word-limit/selectCount/lint → A1–A4; band-0 semantics → A1 (raw 0→1) + C4 (Band 0 layer); content → B1–B2; screens/palette/timer/review/selftest → C1–C4; nav/docs → D1. No placeholders. Names consistent (`rawToBand`, `normalize`, `withinWordLimit`, `scoreQuestionGroup`, `scoreTest`, `lintContent`, key `ielts-reading-session`).
