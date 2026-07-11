# Academic Writing Module + Scenario-Tested Grading Prompt — Implementation Plan

> **For agentic workers:** Steps use checkbox (`- [ ]`) syntax. Build order is Phase A (prompt + deterministic test harness) before Phase B (app), because the payload format is the contract both sides build to.

**Goal:** Add an Academic Writing practice module (`writing.html`) to the static-site IELTS simulator, and ship a version-controlled, scenario-tested grading prompt that grades honestly against the official criteria.

**Architecture:** Approach A — one self-contained HTML page per module, no build step. Grading stays copy-paste → the owner's Claude. The grading prompt lives in the repo at `.claude/skills/ielts-coach/SKILL.md` and is gated by a deterministic checker (`node --test`) plus an integration runner that calls `claude -p`.

**Tech Stack:** Vanilla HTML/CSS/JS (no framework, no build). Node's built-in test runner (`node --test`, zero deps) for the checker. Bash + `claude -p` for the integration gate.

## Global Constraints (verbatim from spec)

- Static site, **no build step**, GitHub Pages compatible; no external network requests at runtime except the Google Fonts already used by index.html.
- IELTS **Academic** only. Task 1 min **150** words, Task 2 min **250** words.
- Under-length → that task's TA/TR **capped at 6.0**, word count stated.
- Rounding: nearest half band; **ties (.25/.75) round DOWN**.
- Full-test overall = **round-down-tie((T1 + 2×T2) / 3)**.
- Clipboard payload starts with `PAYLOAD v1`.
- Machine tokens (pinned, verbatim): task band line `TASK 1 BAND: X.X` / `TASK 2 BAND: X.X`; verdict line begins `OVERALL: X.X`; criterion row `| <criterion> | X.X | <reason> |`.
- Word count: split on whitespace; hyphenated word = 1; number = 1; contraction = 1.
- New response format applies **only to Writing payloads** (keyed off the `IELTS Academic Writing` header); Speaking behavior preserved verbatim.
- Timer: absolute deadline timestamp; resume **freezes** the clock (new deadline = now + saved remaining).
- localStorage blob carries `schemaVersion`; mismatch → discard.
- Prompt test gate: 12 scenarios × 3 runs, pass at **2 of 3**, model pinned via `--model`.

---

## Phase A — Grading prompt & test harness

### Task A1: Deterministic checker + its unit tests

**Files:**
- Create: `tests/prompt-scenarios/check.mjs` (pure parser/checker, no network)
- Test: `tests/prompt-scenarios/check.test.mjs` (`node --test`)

**Interfaces:**
- Produces: `checkOutput(modelText, expectation) → {pass: boolean, reasons: string[]}` and `roundHalfTieDown(x) → number`.
- `expectation` shape: `{ kind: 'overall'|'criterion'|'fulltest'|'speaking', band?: [min,max], task?: 1|2, criterion?: string, cap?: number, taskRanges?: {t1:[min,max], t2:[min,max]}, mustFlag: string[][] }` where each `mustFlag` entry is a list of accepted synonyms (any-of).

Steps: write `check.test.mjs` fixtures first (good output PASS; wrong-band FAIL; criterion-cap; full-test arithmetic with a tie; speaking token-absence), run `node --test` to see them fail, implement `check.mjs` until green, commit.

### Task A2: Integration runner

**Files:**
- Create: `tests/run-prompt-tests.sh`

Loops scenario pairs in `tests/prompt-scenarios/`, calls `claude -p --model <pinned>` with `SKILL.md` + payload, 3 runs each, pipes each output to `check.mjs`, applies 2-of-3, prints per-run results. Optional `$1` = single scenario number. Verified with a mock `CLAUDE_CMD` env override so the plan's test step burns no tokens.

### Task A3: The 12 scenario pairs

**Files:**
- Create: `tests/prompt-scenarios/NN-name.payload.txt` and `NN-name.expect.json` (×12)

Content per the spec's scenario table. Flaws planted deliberately; expectations encode band/cap + must-flag synonym sets.

### Task A4: SKILL.md grading prompt

**Files:**
- Create: `.claude/skills/ielts-coach/SKILL.md`

Full prompt: Writing-scoped fixed format, machine tokens, scoring math + round-down-tie, calibration anchors, Task 1 accuracy, hard rules (incl. numeric under-length cap), Speaking sections preserved verbatim from the current skill.

### Task A5: Calibrate to green

Run `./tests/run-prompt-tests.sh` for real; tighten anchors/rules until all 12 pass at 2-of-3. Commit the calibrated prompt.

---

## Phase B — writing.html app

### Task B1: Page skeleton + start screen + nav
Self-contained `writing.html`; CSS reused from index.html plus writing-specific additions; three mode buttons (Full/Task 1/Task 2). Nav strip added to both pages.

### Task B2: Question banks + SVG renderer
Task 2: 15 prompts across 5 types. Task 1: 10 items; chart types (line/bar/pie/table) rendered programmatically from a single `data` constant; map/process hand-authored as SVG+data pairs (single source of truth).

### Task B3: Writing screen
Tabs (full test), Task 1 SVG, textarea(s), live word count + min indicator, `spellcheck=false`, paste blocked.

### Task B4: Timer
Absolute-deadline countdown; 60/20/40 min per mode; warnings at 10:00 and 5:00; hard stop at 0:00 → auto-submit.

### Task B5: Autosave + resume
localStorage with `schemaVersion`; freeze-on-close resume with confirm; discard mismatched schema.

### Task B6: Done screen + payload builder
Word counts, under-length warnings, `PAYLOAD v1` format, copy button with `execCommand` fallback, single-task omits the other block. In-page `?selftest=1` harness asserts word-count + payload-builder purity.

### Task B7: README + final polish
Document the module, requirements, and grading flow.

---

## Self-review

Spec coverage: every spec section maps to a task (contracts→A1/A2, scenarios→A3, prompt→A4, gate→A5, app screens→B1–B6, docs→B7). No placeholders. Types consistent (`checkOutput`, `roundHalfTieDown`, payload tokens) across tasks.
