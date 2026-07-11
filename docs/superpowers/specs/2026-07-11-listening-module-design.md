# IELTS Listening Module — Design

**Date:** 2026-07-11
**Status:** Approved (Approach A — browser TTS, utterance-queue engine)
**Scope:** Fourth module (Speaking, Writing, Reading already shipped). Fully offline; audio is
synthesised live in the browser.

## Goal

Add an IELTS Listening practice module (`listening.html`) that plays a scripted recording via the
browser's speech synthesis, under strict exam conditions (the recording plays **once**, no pause or
replay), scores instantly (`/40` → band), and reveals the transcript for review afterwards.

## Context and constraints

- Static site, **no build step**, GitHub Pages + `file://` compatible. New scripts are **classic
  scripts** (ES modules are CORS-blocked on `file://`).
- **Audio:** browser `speechSynthesis`, live, multi-voice. No audio files; nothing to download.
- **Play-once:** strict. No pause, no replay, no seek — enforced by construction (there is no file,
  only a running utterance queue).
- **Modes:** Full Test (4 parts, 40 questions, one continuous recording) and single-part drills.
- **Content:** hand-authored. Launch = **1 full test** (4 parts, 40 questions) with answer keys and
  justifications; the data format accepts more tests by appending, like Reading.
- Reuse the Reading machinery: the three question primitives (`single`/`match`/`text`), the palette,
  persistence pattern, results/review, and `scorer.js` — extended, not duplicated.

## File layout

```
listening.html          NEW: app — speech engine, screens, palette, review
listening-content.js    NEW: const LISTENING_TESTS = [...] (scripts + questions; append to extend)
scorer.js               MODIFY: rawToBand(raw, module) + a pinned Listening band table
tests/scorer.test.js    RENAMED from tests/reading/scorer.test.js; + Listening bands, back-compat, splitter
index.html / writing.html / reading.html   MODIFY: nav gains "Listening"
README.md / CLAUDE.md    MODIFY: document the module + non-negotiables
```

`scorer.js` serves multiple modules, so its test file moves out of `tests/reading/`
(`git mv tests/reading/scorer.test.js tests/scorer.test.js`); the CLAUDE.md command is updated to match.

## Shared-code change: `rawToBand(raw, module)`

`rawToBand(raw)` becomes `rawToBand(raw, module)` with `module` defaulting to `"reading"`, so every
existing call site is unchanged and the unit suite asserts it (one-arg calls still return Reading
bands). The Listening table is pinned below; `rawToBand(0) === 1.0` and the Band-0 = did-not-attempt
rule (Results layer only) are identical to Reading.

### Listening band table (Academic Listening `/40` → band) — pinned, indicative

| Raw | Band | Raw | Band |
|-----|------|-----|------|
| 39–40 | 9.0 | 16–17 | 5.0 |
| 37–38 | 8.5 | 13–15 | 4.5 |
| 35–36 | 8.0 | 10–12 | 4.0 |
| 32–34 | 7.5 | 8–9 | 3.5 |
| 30–31 | 7.0 | 6–7 | 3.0 |
| 26–29 | 6.5 | 4–5 | 2.5 |
| 23–25 | 6.0 | 2–3 | 2.0 |
| 18–22 | 5.5 | 1 | 1.0 |
|       |     | 0 | 1.0 |

It genuinely differs from Reading (e.g. raw **32** → Listening 7.5 but Reading 7.0; raw **18** →
Listening 5.5 but Reading 5.0) — which is why a second table exists rather than one shared curve.
Both divergence points are unit-tested against both modules.

## Content model (`listening-content.js`)

Question numbering runs 1–40 across the four parts (Part 1: 1–10, Part 2: 11–20, Part 3: 21–30,
Part 4: 31–40). Append a test object to extend; no code change.

```js
var LISTENING_TESTS = [{
  id: "test-1", title: "Listening — Test 1",
  parts: [{
    part: 1,
    context: "A phone call to book a holiday cottage.",
    script: [
      { speaker: "narrator", text: "Section 1. You will hear a telephone conversation… You now have thirty seconds to look at questions 1 to 5." },
      { pause: 30 },
      { speaker: "woman", text: "Good morning, Meadow Cottages, how can I help?" },
      { speaker: "man",   text: "Hi, I'd like to book a cottage. My name's Bradford — that's B. R. A. D. F. O. R. D." },
      …
    ],
    groups: [ /* same shape as Reading: input single|match|text, questions with n, answer, justification */ ]
  }]
}];
```

- **Speakers:** `narrator`, `woman`, `man`, `man2` (role labels; the engine maps them to distinct
  voices — see below).
- **Timed gaps:** `{ pause: seconds }` reproduces the real test's "you now have 30 seconds…" beats.
- **`text` answers that are spoken differently from how they're written** (spelled names, read-out
  numbers) carry a **`spokenAs`** field giving the spoken form, e.g.
  `{ n: 2, answer: ["Bradford"], spokenAs: "B. R. A. D. F. O. R. D." }`.

### Pinned authoring convention for spellings and numbers

TTS mangles bare spellings unpredictably, so scripts render them mechanically:

- **Spelled names:** letters separated by period-space — `"B. R. A. D. F. O. R. D."`.
- **Read-out numbers / codes:** digits written as words — `"zero four five two, seven eight six…"`.
- Verified once per convention against target browsers (Chrome, Safari, Edge), then used uniformly.

## The speech engine (inline in `listening.html`)

Not a shared file — it has no second consumer, and the single-source rule applies to *scoring*.

### Voices and rate

- On load, read `speechSynthesis.getVoices()` filtered to English voices; wait for `onvoiceschanged`
  (or a short timeout) before enabling the Start control, since voices populate asynchronously.
- Map each speaker role to a **distinct voice** (best-effort; name-based gender is only a hint).
  **Fallback, stated not silent:** with fewer than two English voices, speakers are separated by
  pitch/rate and a one-line notice says voice quality is device-dependent. If speech synthesis is
  unsupported, show a clear "use Chrome/Edge/Safari" message instead of a dead page.
- **`RATE = 1.0`** — a pinned constant, never the device default, so difficulty (and band
  comparability) does not drift per machine. Pitch offsets are used only in the no-voices fallback.

### Steps, sentence-chunking, and the watchdog

- At load, the script is expanded into a flat list of **steps**: each `pause` is a wait step; each
  spoken turn is split into **sentence-level utterance steps** (same voice/pitch/rate), so no single
  utterance approaches Chrome's ~15-second continuous-speech truncation limit. Sections 2 and 4
  (monologues) are the reason this is mandatory, not per-turn.
- **`currentStep = (turn, sentence)`** is the single source of playback state (and the anchor the
  resume logic would use).
- **Sentence splitter — pinned rules (pure function, unit-tested):** split on `[.!?]` followed by
  whitespace and a capital letter, **except** when the token before the period is (a) a single
  capital letter — keeps a spelled name (`"B. R. A. D. F. O. R. D."`) as one ~10-second utterance,
  comfortably under the limit — or (b) a known abbreviation (`Mr, Mrs, Dr, St, No, e.g., i.e.`); and
  **never** split inside a number (period between digits, e.g. `£3.50`, `No. 7`). Unit tests must
  include the spelled-name string, an abbreviation mid-sentence, and a decimal price.
- **Advance path:** `playNext()` speaks one utterance with `onend`→advance, or waits for a pause.
  Because `onend` is unreliable (tab throttling, `cancel()`, sporadic drops) and it is the only
  advance trigger, every utterance also arms a **watchdog timeout** ≈ `words / 2.5 wps × 1.5 slack`;
  if neither `onend` nor `onerror` fires by then, log and advance. `onerror` is wired to the same
  advance path. Bounded-but-ugly beats elegant-but-hangable.

### Play-once, by construction

- Browsers require a user gesture to start speech, so the recording begins from one **"▶ Play the
  recording"** button. That gesture unlocks the audio context; the four parts then **auto-chain
  continuously** (narrator bridges + pause steps between them) — one recording, like test day.
  Single-part drills play just that part from their own gesture.
- There is no pause, seek, or replay control — none can exist, because there is no file.
- Questions for the current part surface as the audio reaches it; already-heard parts stay
  answerable via the palette, but their audio never replays.
- **Tab-hidden stance (named, not hidden):** if the listener leaves the tab, the browser may throttle
  or drop speech and that audio is simply lost — faithful to the real test; the engine never rewinds.
  A visible "🔊 Recording in progress — do not leave this tab" warning sets the expectation up front.
- `speechSynthesis.cancel()` fires on `beforeunload` and on entering the results screen, so no
  orphaned speech narrates over the score.

## Timing, finish, and resume

- **No global countdown during audio** — the recording is the pacing.
- When the final part ends, a **2-minute "check your answers" countdown** starts (matching
  computer-delivered IELTS), then auto-submits. Finish is available manually throughout.
- **Autosave** (key `ielts-listening-session`, own `schemaVersion`) stores answers, completed-part
  flags, a `recordingActive` flag, and — during the check phase — the remaining check time.
- **Resume — the deliberate, play-once-consistent decision:**
  - Reload **before** the recording started → resume normally at the start screen.
  - Reload **during** the recording (`recordingActive`) → the recording is **forfeit** (it cannot be
    replayed — exam rule). Answers entered so far are preserved, and the user is taken to the
    checking/submit screen with a plain notice. **All 40 questions remain shown and answerable**
    there, including parts never heard (a real candidate who lost focus may still guess); the palette
    never silently hides half its cells.
  - Reload **during the 2-minute check phase** (recording already finished, nothing to forfeit) → the
    check clock **freezes-on-close and resumes** with the time that was left, consistent with
    Writing/Reading.

## Results and review

Reuses Reading's results/review, with `rawToBand(raw, "listening")`:

- Raw `/40` → indicative band; **Band 0** when zero questions answered; single-part drills show
  `/N` and a percentage, no band (a band needs the full 40).
- Per-question ✓/✗ with your answer vs the correct answer, and a one-line justification.
- **Listening-specific:** the **full transcript is revealed** on the results screen, per part — the
  biggest learning lever in Listening. Justifications quote the script line, and a chip jumps to it.
  Spelled-name answers appear in the transcript in their written spoken form (`"B. R. A. D. F. O. R.
  D."`), which is ideal for review.

## Content lint (`lintContent`, extended)

In addition to the existing rules (contiguous numbering, key-in-options, word-limit, valid location,
multi-answer invariant), for any test carrying a `script`:

- **Transcript-verbatim rule:** every `text` answer variant must occur **verbatim, post-`normalize`,
  in its part's script** — in Listening the answer is spoken aloud, so a variant absent from the
  transcript is provably an authoring bug.
- **`spokenAs` exception:** a question flagged `spokenAs` is checked against its spoken form instead
  (that string must appear in the script), because the written answer deliberately differs from what
  is voiced.

## Testing

- `git mv tests/reading/scorer.test.js tests/scorer.test.js`. Add:
  - **Listening band boundaries** across the whole table, plus **cross-table divergence**:
    `rawToBand(32) === 7.0` (Reading default) and `rawToBand(32, "listening") === 7.5`;
    `rawToBand(18) === 5.0` and `rawToBand(18, "listening") === 5.5`.
  - **Back-compat:** one-arg `rawToBand(raw)` still returns Reading bands everywhere.
  - **Sentence splitter** pure-function tests: spelled name → one utterance; `"Mr. Smith said hello."`
    → not split at `Mr.`; `"It costs £3.50 today."` → not split inside the number; a normal two-sentence
    string → two utterances.
  - **Turn→step expansion** produces the expected step count and preserves speaker/voice per step.
- **`listening.html?selftest=1`** runs `lintContent(LISTENING_TESTS)` over the real bank, scores a
  fixture, and asserts the transcript-verbatim rule catches a **planted** bad variant — banner like
  the other modules. The speech engine (voice assignment, auto-chaining, watchdog advance) is
  **browser-verified** here, since `speechSynthesis` has no Node equivalent.
- Node suite stays green: `~/.nvm/versions/node/v22.17.1/bin/node --test tests/scorer.test.js`.

## Error handling summary

| Failure | Behavior |
|---------|----------|
| `speechSynthesis` unsupported | Clear "use Chrome/Edge/Safari" message; no dead page |
| < 2 English voices | Pitch/rate fallback + device-dependent-quality notice |
| `onend` dropped | Watchdog timeout advances the queue; test never hangs |
| Utterance error | `onerror` → same advance path |
| Tab left mid-recording | Audio lost (faithful); no rewind; warned up front |
| Reload mid-recording | Recording forfeit; answers kept; all 40 answerable on check screen |
| Reload during check phase | Check clock freezes and resumes |
| Zero questions answered | Results shows "Band 0 — no answers submitted" |
| Content defect | `lintContent` `console.error`s on load; `?selftest=1` fails loudly |

## Out of scope (v1), explicit

- **Map/plan labelling — deferred to v1.1.** A Section-2 staple, so a real gap; kept out of v1 for
  scope discipline, but the artwork/authoring pattern already exists in this repo (Writing Task 1
  before/after maps), so the build path is known.
- A second full test (follow-up content task, no code change).
- General Training (Listening is identical across Academic/GT — N/A).
- Real human or accented audio (TTS only, by decision).
- Shared-stylesheet extraction across the pages (still deferred).
