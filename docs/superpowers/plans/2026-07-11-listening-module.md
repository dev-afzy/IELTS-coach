# Listening Module Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Build order: Phase A (shared scorer changes + pure sentence splitter, tested) → Phase B (author 1 test) → Phase C (listening.html: engine + screens) → Phase D (nav + docs). The scorer/splitter are the contracts the app builds on.

**Goal:** Add an offline IELTS Listening module (`listening.html`) that plays a scripted recording via browser TTS under strict play-once conditions, scores instantly (`/40` → band), and reveals the transcript for review.

**Architecture:** Reuse the Reading machinery. `scorer.js` gains `rawToBand(raw, module)` + a Listening band table + a pure sentence splitter + a `spokenAs`-aware transcript lint. `listening.html` holds the inline speech engine (sentence-chunked utterance queue with a watchdog) and reuses the three question primitives, palette, persistence, and results/review. No build step.

**Tech Stack:** Vanilla HTML/CSS/JS classic scripts; `speechSynthesis`; `node:test` (Node 18+) via `~/.nvm/versions/node/v22.17.1/bin/node --test tests/scorer.test.js`.

## Global Constraints (verbatim from spec)

- Static site, **no build step**, GitHub Pages + `file://` compatible; classic scripts only.
- Audio = browser `speechSynthesis`, live, multi-voice, no files. **`RATE = 1.0`** (pinned).
- **Strict play-once**: no pause/seek/replay; one gesture starts a continuous auto-chained recording.
- Sentence-splitter rules pinned (spelled-name / abbreviation / number safe).
- Watchdog per utterance ≈ `words / 2.5 × 1.5`; `onerror` shares the advance path.
- `rawToBand(raw, module="reading")`; pinned Listening table; `rawToBand(0)=1.0`; Band 0 = Results-layer only.
- Question numbers 1–40 across 4 parts (1–10/11–20/21–30/31–40).
- Resume: pre-recording resumes; **mid-recording is forfeit** (answers kept, all 40 answerable on check screen); check-phase clock freezes/resumes. Key `ielts-listening-session`.
- Transcript-verbatim lint on `text` answers, with `spokenAs` exception. Transcript revealed on results.
- `git mv tests/reading/scorer.test.js tests/scorer.test.js`.

---

## Phase A — shared scorer changes (pure, TDD)

### Task A1: `rawToBand(raw, module)` + Listening table + back-compat
**Files:** Modify `scorer.js`; `git mv tests/reading/scorer.test.js tests/scorer.test.js`; Modify `tests/scorer.test.js`
**Produces:** `rawToBand(raw, module?)` — `module` defaults to `"reading"`.
- [ ] `git mv tests/reading/scorer.test.js tests/scorer.test.js` and update the `require("../../scorer.js")` path to `require("../scorer.js")`.
- [ ] Add tests: existing Reading boundaries still pass with one arg; Listening full table; divergence `rawToBand(32)===7.0` & `rawToBand(32,"listening")===7.5`; `rawToBand(18)===5.0` & `rawToBand(18,"listening")===5.5`; `rawToBand(0,"listening")===1`.
- [ ] Run `…/v22.17.1/bin/node --test tests/scorer.test.js` → FAIL.
- [ ] Implement: add `LISTENING_TABLE` (pinned), make `rawToBand(raw, module)` pick the table by module (default reading). Run → PASS. Commit.

### Task A2: pure sentence splitter
**Produces:** `splitSentences(text) → string[]`
- [ ] Tests: `splitSentences("Hi there. How are you?")` → 2; `"B. R. A. D. F. O. R. D."` → 1 (single-capital-letter rule); `"Mr. Smith said hello."` → 1 (abbreviation); `"It costs £3.50 today."` → 1 (number); `"No. 7 is here. Come in."` → 2.
- [ ] Run → FAIL. Implement (split on `[.!?]\s+[A-Z]`, guard single-capital / abbrev list `Mr,Mrs,Dr,St,No,e.g.,i.e.` / digit-period-digit). Run → PASS. Commit.

### Task A3: transcript-verbatim lint (script-aware) + `spokenAs`
**Consumes:** existing `lintContent`, `normalize`.
- [ ] Tests: a Listening-shaped fixture (parts with `script` arrays) passes; a planted `text` variant not in the script fails; a `spokenAs` question passes when its spoken form is in the script and fails when it isn't.
- [ ] Run → FAIL. Extend `lintContent`: when a test has `parts` with `script`, concat+normalize the part's script text; for each `text` question assert each `answer` variant (or `spokenAs` if present) appears. Run → PASS (Reading lint still green). Commit.

---

## Phase B — author 1 Listening test

### Task B1: `listening-content.js` (4 parts, 40 Q) lint-clean
**Files:** Create `listening-content.js`
- [ ] Author `LISTENING_TESTS[0]`: Part 1 (form/note completion, a phone booking, incl. a `spokenAs` spelled name + a written-number), Part 2 (monologue, MCQ + matching), Part 3 (2–3 speaker discussion, MCQ + matching), Part 4 (lecture monologue, sentence/summary completion). Narrator turns + `{pause:30}` gaps. 40 questions, justifications quoting the script, using the pinned spelling/number convention.
- [ ] Validate with the Node harness: `…/node -e "global.module={};require('./scorer.js');const t=require('./listening-content.js');console.log(lintContent(t))"` → `{ok:true}`. Fix drift. Confirm a perfect run scores 40/40. Commit.

---

## Phase C — `listening.html`

### Task C1: shell + start screen + nav + speech-support gate
- [ ] Create `listening.html` reusing the newspaper CSS + nav (4 links). Start screen: Full Test + single-part list. Load `scorer.js` + `listening-content.js`. Detect `speechSynthesis`; if absent show the browser message. Enumerate voices (wait for `onvoiceschanged`). Verify in browser. Commit.

### Task C2: speech engine — step expansion, queue, voices, watchdog
- [ ] At load expand each part's script into steps (pauses + sentence-chunked utterances via `splitSentences`); assign distinct voices per speaker (pitch/rate fallback); `RATE=1.0`. `playNext()` with `onend`/`onerror`/watchdog advance. One "▶ Play" gesture auto-chains parts. `cancel()` on unload/results. Verify: audio plays, voices differ, chaining works, no hang. Commit.

### Task C3: questions + palette + play-once wiring
- [ ] Render current part's question groups (reuse Reading primitives) + 1–40 palette (answered/flag/jump); questions surface as audio reaches each part; earlier parts answerable, no replay; "recording in progress" warning. Verify answering + palette during playback. Commit.

### Task C4: finish/check timer + resume (forfeit) + results + transcript
- [ ] 2-minute check countdown after last part → auto-submit; manual finish anytime. Autosave (`ielts-listening-session`): pre-recording resume; mid-recording forfeit → check screen, all 40 answerable; check-phase clock freeze/resume. Results via `rawToBand(raw,"listening")` (Band 0 zero-answered; `/N` single-part); per-question review + **full transcript reveal** with jump. `?selftest=1`: `lintContent` + scored fixture + planted-bad-variant assertion. Verify end-to-end in browser. Commit.

---

## Phase D — nav + docs

### Task D1: wire nav + docs
- [ ] Add "Listening" to `index.html`, `writing.html`, `reading.html` nav strips. Update `README.md` (Listening module) and `CLAUDE.md` (Listening non-negotiables + the renamed `tests/scorer.test.js` command). Verify 4-way nav on all pages. Commit.

---

## Self-review

Spec coverage: band table/back-compat → A1; splitter → A2; lint+spokenAs → A3; content → B1; engine/voices/watchdog/play-once → C2/C3; timing/resume/results/transcript/selftest → C4; nav/docs → D1. Rename in A1. No placeholders. Names consistent (`rawToBand(raw,module)`, `splitSentences`, `spokenAs`, key `ielts-listening-session`, `LISTENING_TESTS`).
