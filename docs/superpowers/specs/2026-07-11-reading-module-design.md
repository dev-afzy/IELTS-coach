# IELTS Academic Reading Module — Design

**Date:** 2026-07-11
**Status:** Approved (Approach A)
**Scope:** Third module in the simulator (Speaking + Writing already shipped). Reading is
fully offline and self-scored — no AI step.

## Goal

Add an IELTS **Academic Reading** practice module that reproduces real test conditions,
scores instantly in the browser (raw `/40` → band), and teaches through per-question review
(correct answer + one-line justification + jump to the passage location). No Claude/AI is
involved: Reading answers are objectively right or wrong, so the app owns scoring end to end.

## Context and constraints

- Static site, **no build step**, GitHub Pages compatible. Existing pages: `index.html`
  (Speaking), `writing.html` (Writing). Grading for those is copy-paste → Claude; **Reading is
  different — it self-scores**.
- IELTS **Academic** only (General Training Reading uses different passages and a different band
  table — out of scope).
- **Experience model:** instant in-app score, fully offline. No AI review step.
- **Practice modes:** Full Test (3 passages, 40 questions, one 60-minute clock) and Single
  passage drills (one passage, ~20 minutes).
- **Content:** hand-authored. Launch bank = **2 full tests (6 passages, 80 questions)** with
  answer keys and justifications, in a data format that accepts more tests with no code change.
- **Review depth:** every question reveals the correct answer, a one-line justification, and the
  passage location it's proven in.
- Architecture (Approach A): app logic in `reading.html`, content in a separate
  `reading-content.js`, and the scoring/band/lint logic in a **single** `scorer.js` shared by
  the page and the Node tests (no dual copy).

## File layout

```
reading.html          NEW: app — screens, timer, palette, review; loads the two scripts below
reading-content.js    NEW: const READING_TESTS = [...]  (the question bank; append to extend)
scorer.js             NEW: pure scoring + band conversion + content lint (browser globals + CJS export)
tests/reading/scorer.test.js   NEW: node:test unit tests (Node 18+)
index.html            MODIFY: add "Reading" to the nav strip
writing.html          MODIFY: add "Reading" to the nav strip
README.md             MODIFY: document the module
CLAUDE.md             MODIFY: add the Reading test command + Node 18+ note
```

CSS is duplicated across the three pages for now; a shared-stylesheet extraction stays deferred
(it would touch two working pages — separate cleanup, not this module).

### Single-source scorer (no drift)

`scorer.js` is a **classic script** (not an ES module, so it loads over `file://` like
`reading-content.js`; ES modules are CORS-blocked there). It defines its functions and exposes
them two ways:

```js
function normalize(s) { ... }
function withinWordLimit(answer, limit) { ... }
function scoreQuestionGroup(group, response) { ... }
function scoreTest(test, responses) { ... }
function rawToBand(raw) { ... }
function lintContent(tests) { ... }
if (typeof module !== "undefined") module.exports = { normalize, withinWordLimit, scoreQuestionGroup, scoreTest, rawToBand, lintContent };
```

`reading.html` loads it via `<script src="scorer.js">` and calls the globals; the Node test does
`require("../../scorer.js")`. The browser runs the exact code the tests prove.

## Data model (`reading-content.js`)

Adding a test = append one object to `READING_TESTS`. No code change.

```js
const READING_TESTS = [{
  id: "test-1",
  title: "Academic Reading Test 1",
  passages: [{
    number: 1,
    title: "…",
    // Every paragraph is labelled A, B, C… internally, always — so location-based
    // jump-to-justification works on every passage. Labels are DISPLAYED only when a
    // matching-headings / matching-information group in this passage needs them.
    paragraphs: [{ label: "A", text: "…" }, { label: "B", text: "…" }, …],
    groups: [{
      input: "single" | "match" | "text",   // drives the widget + scoring (NOT the type name)
      type: "True/False/Not Given",          // human label for the instructions block
      instructions: "Do the following statements agree with the information…",
      options: [{ key: "i", text: "…" }],    // match groups AND single-MCQ groups (the selectable choices).
                                             //   TFNG / YNNG single groups omit it (fixed value set).
      allowReuse: false,                     // match groups: may an option be chosen more than once?
      selectCount: 2,                        // single groups only: choose N letters (checkboxes)
      wordLimit: { words: 2, numbers: 1 },   // text groups only: two-counter limit
      questions: [{
        n: 1,                                // global 1–40 within the test (single-mark groups)
        ns: [7, 8],                          // multi-mark groups (selectCount): the numbers covered
        prompt: "…",
        answer: "TRUE" | "iii" | ["parliament","the parliament"] | ["B","D"],
        justification: "Para C: “…the act passed in 1901.”",
        location: "C"                        // paragraph label to scroll/highlight on review
      }]
    }]
  }]
}];
```

### Input primitives → IELTS question types

| `input` | IELTS types | Answer key | Scoring |
|---------|-------------|-----------|---------|
| `single` | True/False/Not Given, Yes/No/Not Given, Multiple choice, **multi-answer MC** (`selectCount`) | one key, or an array for `selectCount` | exact match; multi = 1 mark per correct letter |
| `match` | Matching headings, Matching information, Matching features, Matching sentence endings, summary-from-a-box | one option key | exact match; options never disabled (see `allowReuse`) |
| `text` | Sentence / summary / note / table / flow-chart completion, Short-answer | array of accepted variants | normalized match + two-counter word limit |

`allowReuse` is a **solving constraint, never a scoring one**: match dropdowns never disable a
chosen option. Headings (`allowReuse:false`) rely on distractor headings; matching-information
sets `allowReuse:true` ("you may use any letter more than once").

## Scoring engine (`scorer.js`)

- **`normalize(s)`** — trim, collapse inner whitespace, lowercase, and strip leading/trailing
  punctuation per token. Punctuation is stripped **before** the number test, so `"1901."` and
  `"1901,"` still read as numbers and `"parliament."` matches `"parliament"`.
- **`withinWordLimit(answer, {words, numbers})`** — tokenise on whitespace; a token is numeric if
  it matches `/^\d[\d,.]*$/` after normalization, otherwise it's a word. Valid iff
  `wordTokens ≤ words` AND `numberTokens ≤ numbers`. Over-limit answers are marked **wrong** even
  if they contain the right word (real IELTS rule). Example: `"the 1901 act"` = 2 words + 1 number
  → valid under `{words:2, numbers:1}`.
- **`scoreQuestionGroup(group, response)`** — returns marks + a per-question breakdown:
  - `single` (no `selectCount`): 1 mark iff `response === answer`.
  - `single` with `selectCount`: response is an unordered set (UI caps selections at
    `selectCount`); marks = count of correct letters chosen. **`perQuestion` convention:** correct
    selections fill the group's `ns` in order (each a ✓ with its letter); any leftover `ns` are ✗
    listing the missed key letters; wrong picks are noted on the group.
  - `match`: 1 mark iff `response === answer`.
  - `text`: 1 mark iff `withinWordLimit(response, wordLimit)` AND `normalize(response)` equals a
    normalized entry in the `answer` variants array.
- **`scoreTest(test, responses)`** → `{ raw, outOf, band, perQuestion: [{ n, correct, your, key, marks }] }`.
- **`rawToBand(raw)`** — the pinned table below.
- **`lintContent(tests)`** → `{ ok, errors: [] }`.

### Band conversion (Academic Reading, `/40` → band) — pinned

Indicative table (official boundaries shift slightly per paper; the UI labels the band
"indicative"). Encoded as the single data table in `scorer.js`; defined for **all** raw 0–40.

| Raw | Band | Raw | Band |
|-----|------|-----|------|
| 39–40 | 9.0 | 13–14 | 4.5 |
| 37–38 | 8.5 | 10–12 | 4.0 |
| 35–36 | 8.0 | 8–9 | 3.5 |
| 33–34 | 7.5 | 6–7 | 3.0 |
| 30–32 | 7.0 | 4–5 | 2.5 |
| 27–29 | 6.5 | 2–3 | 2.0 |
| 23–26 | 6.0 | 1 | 1.0 |
| 19–22 | 5.5 | 0 | 1.0 |
| 15–18 | 5.0 | | |

**Band 0 vs raw 0 (stated choice, matching real-test semantics):** in IELTS, Band 0 means "did
not attempt the test"; a candidate who sits it and scores 0 raw gets Band 1 ("non-user"). So
`rawToBand(0) → 1.0` — any *attempted* test floors at Band 1. **Band 0 is reserved for a
submission with zero questions answered** and is decided by the Results screen (when
answered-count === 0 it shows "Band 0 — no answers submitted"), independent of `rawToBand`.

### Content lint (`lintContent`)

`console.error`s on every page load and asserts inside `?selftest=1`. Fails if:
- Question numbers across a test are not contiguous and unique `1..N` (N = 40 for a full test).
- An answer key is not among its group's valid values: `match` and single-**MCQ** keys must
  appear in `options`; TFNG keys must be in `{TRUE, FALSE, NOT GIVEN}`; YNNG keys in
  `{YES, NO, NOT GIVEN}`.
- Any `text` accepted-variant exceeds its own group's `wordLimit`.
- Any `location` points to a paragraph label absent from its passage.
- **Multi-answer invariant:** for `selectCount` groups, `ns.length === selectCount ===
  answer.length`, and every answer letter exists in `options`.

## Screens & flow (`reading.html`)

Mirrors `writing.html`'s three-screen structure.

1. **Start** — choose **Full Test** (Test 1 or Test 2 → 3 passages, 40 Q, 60 min) or **Single
   passage** (any one of the 6 passages → 20 min).
2. **Test** — passage pane + question pane; a shared countdown; a **1–40 question-navigation
   palette** with answered / unanswered / flag-for-review states and click-to-jump (single-passage
   mode shows only that passage's slice). Matching-type groups display paragraph labels in the
   passage.
   - **Timer & persistence — reuse `writing.html` mechanics verbatim:** absolute-deadline
     countdown (no background-tab drift); warnings; hard stop at 0:00 → auto-submit whatever is
     answered; autosave every 5s to `localStorage` key **`ielts-reading-session`** (distinct from
     Writing's `ielts-writing-session`) under its own `schemaVersion`; freeze-on-close resume
     (new deadline = now + saved remaining); discard a mismatched-schema blob.
3. **Results** — raw `/40`, converted band (labelled indicative), and a per-question review list:
   your answer vs correct answer, ✓/✗, the one-line justification, and a **jump-to-passage** link
   that scrolls to and highlights the `location` paragraph.

## Testing

- **`tests/reading/scorer.test.js`** (`node:test` + `assert`, **Node 18+**; run with a modern
  nvm node): text normalization incl. trailing punctuation; two-counter word limit incl.
  `"the 1901 act"` valid and a 3-word answer invalid; `text` variant matching (British/American,
  number/word); `single` exact match; `selectCount` partial marks + the `perQuestion` fill
  convention; `match` exact match; **band boundaries** at raw 0→1.0, 1→1.0, 9, 10, 26/27, 32/33,
  39/40 (plus the zero-attempts → Band 0 path at the Results layer);
  and `lintContent` catching each defect class (bad number sequence, key-not-in-options,
  variant-over-limit, bad location, broken multi-answer invariant).
- **`reading.html?selftest=1`** — runs `lintContent(READING_TESTS)` over the real bank and asserts
  scorer wiring on a fixture, printing a pass/fail banner (same pattern as `writing.html`).
- **Content lint on normal load** — `console.error` surfaces authoring drift immediately.

## Error handling summary

| Failure | Behavior |
|---------|----------|
| Timer hits 0:00 | Auto-submit answered questions; unanswered scored 0; go to Results |
| Zero questions answered | Results shows "Band 0 — no answers submitted" (did-not-attempt), bypassing `rawToBand` |
| Page refresh mid-test | localStorage resume with confirmation (freeze-on-close semantics) |
| Unanswered question | Scored 0; shown ✗ with the correct answer on Results |
| Content defect | `lintContent` `console.error`s on load; `?selftest=1` fails loudly |
| localStorage unavailable (private mode) | App works; autosave silently disabled |

## Out of scope (v1), explicit

- Diagram-label completion (needs bespoke per-passage artwork)
- General Training Reading (different passages + band table)
- Any AI/Claude step — Reading is offline by design
- Shared-stylesheet extraction across the three pages (still deferred)
- Per-question timing analytics / historical score tracking
