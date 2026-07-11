# IELTS Academic Writing Module + Scenario-Tested Grading Prompt — Design

**Date:** 2026-07-11
**Status:** Approved (Approach A)
**Scope:** First of four planned modules (Writing → Reading → Listening → Speaking Part 1 / adaptive Part 3 are later cycles)

## Goal

Add a realistic IELTS **Academic Writing** practice module to the existing static-site simulator, and replace the untested grading prompt with a version-controlled, **scenario-tested** one that grades honestly (no inflated bands), tells the student exactly what went well, what is broken, and how to reach Band 8.5.

## Context and constraints

- The existing app is a single-file static site ([index.html](../../../index.html)) hosted on GitHub Pages: Speaking Parts 2 & 3 with speech-to-text and a copy-for-grading flow.
- **Audience:** the owner only. Grading stays copy-paste → the owner's Claude, where the `ielts-coach` skill grades. No backend, no API keys, site stays free and static.
- **Test type:** IELTS **Academic** (Task 1 = describe a visual; not General Training letters).
- **Practice modes:** both a full 60-minute test (Task 1 + Task 2, one shared clock) and single-task drills (Task 1 = 20 min, Task 2 = 40 min).
- Architecture decision (Approach A): **one self-contained HTML page per module**, no build step. Rejected: growing index.html into one giant file (edit risk); a Vite build (needless tooling for a static practice tool).

## File layout

```
index.html                          Speaking room — unchanged except a small nav strip
writing.html                        NEW: self-contained Academic Writing module
.claude/skills/ielts-coach/SKILL.md NEW: canonical grading prompt (version-controlled here)
tests/prompt-scenarios/             NEW: 10 scenario answers + expected results
tests/run-prompt-tests.sh           NEW: headless test runner (claude -p)
docs/superpowers/specs/             design docs (this file)
README.md                           updated for the new module
```

CSS is duplicated between the two pages for now; extract a shared stylesheet when the third module (Reading) lands, not before.

## Writing module (`writing.html`)

### Flow

1. **Start screen** — choose mode:
   - **Full Test** — 60:00 shared clock, both tasks
   - **Task 1 only** — 20:00
   - **Task 2 only** — 40:00
2. **Writing screen** — mirrors the real computer-based test:
   - Full Test shows both tasks with **tabs**; the candidate manages their own split (20/40 shown as guidance only, exactly like the real exam).
   - Task 1 renders its visual as an **inline SVG** above the answer box.
   - Plain `<textarea>` per task: live word count, minimum indicator (150 / 250), `spellcheck="false"` (the real test has none), **paste blocked** (`onpaste` prevented — you cannot paste in the real test).
   - Countdown timer with warnings at 10:00 and 5:00 (visual highlight), **hard stop at 0:00** → auto-submit whatever exists.
   - **Timer implementation:** store an absolute deadline timestamp and derive remaining time from `deadline - now` on each tick — a decrement-based `setInterval` countdown drifts when browsers throttle background tabs.
   - **Autosave** answers + remaining time + selected prompt to `localStorage` every 5 seconds, under a `schemaVersion` key; a saved blob with a mismatched schema version is discarded, never restored as garbage. On reload with a valid saved session, ask "Resume your test in progress?" before restoring; discard on decline. **Resume semantics: the clock freezes while the page is closed** — on resume, the new deadline is `now + saved remaining time`. (Friendlier for solo practice than a wall-clock deadline; chosen deliberately.)
3. **Done screen** — answers, word counts, under-length warnings in the same blunt tone as the speaking page, and **Copy for grading**.

### Question banks (embedded in the page as JS constants)

**Task 1 — 10 items.** Each item: `{id, type, prompt, svg, data}` where `data` is a plain-text description of the actual figures/stages/changes the visual encodes.

| Type | Count |
|------|-------|
| Line graph (trend over time) | 2 |
| Bar chart (comparison) | 2 |
| Pie chart set (proportions, two years) | 1 |
| Table | 1 |
| Process diagram (one linear, one cyclical) | 2 |
| Map (before/after) | 2 |

The `data` field ships in the grading payload so Claude can verify the report against what the visual actually showed — misread or invented figures are a Task Achievement failure that text-only grading cannot otherwise catch.

**Single source of truth per item:** the SVG and the `data` description must not be able to diverge, or "you misread the chart" becomes an app bug instead of a candidate error. For chart-type items (line, bar, pie, table) the SVG is **rendered programmatically from the `data` constant** at load time. Map and process items are hand-authored SVG/description pairs, reviewed together as a unit.

**Task 2 — 15 prompts** across all five essay types: 4 opinion, 3 discussion, 3 advantages/disadvantages, 3 problem/solution, 2 two-part. Topics from the standard IELTS pool (education, technology, environment, society, health, work). Random draw per session, same as the cue cards.

### Grading payload (clipboard format)

```
PAYLOAD v1
IELTS Academic Writing — grade strictly per criterion, no sugar-coating,
then show the Band 8.5 version. [ielts-coach skill]

MODE: Full test (60 min) · Time used: 58:12
TASK 1 PROMPT: <prompt text>
TASK 1 VISUAL DATA (for accuracy checking): <data description>
TASK 1 ANSWER (142 words — UNDER MINIMUM):
<answer or "(no answer written)">

TASK 2 PROMPT: <prompt text>
TASK 2 ANSWER (267 words):
<answer or "(no answer written)">
```

- The `PAYLOAD v1` version line lets a stale skill detect format drift; the SKILL.md states which payload versions it understands.
- Word counts and UNDER MINIMUM flags are computed by the app and stamped into the payload — the grader never re-counts.
- **Word-count algorithm (identical statement in app code and SKILL.md):** split on whitespace; a hyphenated word counts as one word; a number counts as one word; a contraction counts as one word.
- Single-task mode omits the other task's block.
- Clipboard failure falls back to the hidden-textarea `execCommand` copy already used in index.html.

## Grading prompt (`.claude/skills/ielts-coach/SKILL.md`)

The canonical prompt moves into the repo. The existing skill's strict-examiner core is kept, and its **Speaking sections are preserved verbatim** — everything below applies **only to Writing payloads**, keyed off the `IELTS Academic Writing` payload header. Speaking grading behavior does not change in this cycle (it gets its own format and test suite in the Speaking cycle); one Speaking smoke scenario in the test suite guards against gross regressions.

### 1. Scoring math (official IELTS weighting)

- Each task is banded independently: four criteria per task, task band = mean of its four criteria, rounded to a half band.
- **Full test:** overall = (Task 1 + 2 × Task 2) / 3, rounded to a half band — Task 2 counts double, as in the real test. The SKILL.md states this formula and the response must show the arithmetic.
- **Single-task payload:** the task band is the overall.
- **Rounding function — stated identically in SKILL.md and the runner, ties included:** round to the nearest half band; **on an exact tie (…​.25 or .75), round DOWN.** This is the on-brand choice for a no-inflation tool (official IELTS rounds .25/.75 up; we deliberately do not). Concretely: criteria 7/7/7/6 → mean 6.75 → **6.5**; full-test T1 6.0 + T2 7.0 → 6.667 → **6.5**; T1 6.5 + T2 7.5 → 7.167 → **7.0**. The runner applies this exact function when checking scenario 11's arithmetic.

### 2. Fixed response format (always, in this order)

For each task present in the payload:

1. **Task band line** — machine token: `TASK 1 BAND: X.X` / `TASK 2 BAND: X.X`.
2. **Per-criterion table** — fixed row shape `| <criterion name> | X.X | <one-line reason> |`, four rows, one per official criterion.

Then, once:

3. **Verdict line** — machine token: line begins `OVERALL: X.X`, followed by one blunt sentence. For full tests, the weighted arithmetic is shown next to it.
4. **What went well** — brief and genuine; never padded to soften the blow.
5. **What's holding you back** — specific unsugared failures, worst first, each with quoted evidence from the answer.
6. **The fixes** — corrections grouped by criterion: error → fix → why (pattern, not one-off).
7. **Band 8.5 version** — full rewrite of each answer.
8. **One thing to fix next** — the single highest-leverage item, never a list.

The machine tokens (`TASK n BAND:`, `OVERALL:`, and the table row shape) are pinned in the SKILL.md verbatim so the test runner parses fixed syntax, not prose.

### 3. Calibration anchors

For each criterion, 2–3 short pinned example sentences at Band 6, 7, and 8 quality. The model scores against these fixed reference points rather than its own drifting sense of "good" — the primary defense against score inflation.

### 4. Task 1 accuracy checking

Grade the report against the payload's `VISUAL DATA` block. Misread or invented figures are named explicitly and cap Task Achievement.

### 5. Hard rules (never break) — each encoded with its exact number

- **Under-length rule, stated numerically in the prompt:** Task 1 under 150 words or Task 2 under 250 words → that task's Task Achievement / Task Response is **capped at 6.0**, and the response must state the stamped word count. (House rule, chosen so the test suite asserts a rule the prompt actually encodes — not the model's mood.)
- **Trust the stamped word count** from the payload; never re-count.
- Never round a band up out of kindness.
- Always flag memorized/template language.
- Never coach thesaurus-swap vocabulary; upgrade words in context only.
- The skill states it understands `PAYLOAD v1`; on an unknown payload version it says so instead of guessing.

## Prompt test suite (`tests/prompt-scenarios/`)

Twelve scripted scenarios with known target bands and known planted flaws. Scenarios 1–3, 5–7, and 10 are single-task **Task 2** payloads; 4, 8, and 9 are single-task **Task 1** payloads; 11 is a **full-test** payload; 12 is a **Speaking** transcript (regression guard only).

| # | Scenario | Payload | Expectation | Must be flagged in feedback |
|---|----------|---------|-------------|------------------------------|
| 1 | Weak essay, frequent errors | Task 2 | OVERALL 5.5–6.0 | grammar accuracy, repetitive vocabulary |
| 2 | Competent but flat essay | Task 2 | OVERALL 6.5–7.0 | limited range, mechanical linking |
| 3 | Strong essay | Task 2 | OVERALL 8.0–8.5 | (must NOT be nitpicked below 8.0) |
| 4 | Task 1 at 118 words | Task 1 | Task 1 table: Task Achievement ≤6.0 | under-length cap stated with word count |
| 5 | Padded, repetitive essay | Task 2 | OVERALL ≤6.5 | padding named |
| 6 | Off-topic essay | Task 2 | Task 2 table: Task Response ≤5.5 | off-topic named |
| 7 | Memorized-template essay | Task 2 | OVERALL ≤6.5 | template language named |
| 8 | Task 1 misreading its own chart | Task 1 | Task 1 table: Task Achievement ≤6.5 | data inaccuracy named |
| 9 | Strong Task 1 report | Task 1 | OVERALL 8.0–8.5 | data accuracy confirmed |
| 10 | Fence-sitting opinion essay | Task 2 | Task 2 table: Task Response ≤6.5 | unclear position named |
| 11 | Full test: weak T1, strong T2 | Full test | T1 BAND 5.5–6.5 **and** T2 BAND 7.0–8.0 (grader tells them apart) **and** OVERALL = round-down-tie((T1 + 2×T2)/3) from its own task bands | arithmetic shown |
| 12 | Speaking Part 2 transcript, mid-level | Speaking | no `TASK n BAND:` / `OVERALL:` tokens present (Writing format did not leak); a band number 6.0–7.0 appears near the word "band" | (regression guard) |

Each scenario is a file pair: the answer payload (exactly what the app would copy) and an expectations file (band expectation + must-flag strings).

**Runner** (`tests/run-prompt-tests.sh`): for each scenario, invoke `claude -p` with the SKILL.md content + the scenario payload, with the **model version pinned via an explicit `--model` flag** (a silent model bump recalibrates every anchor). Checks per run:

1. the band expectation holds — `OVERALL:` scenarios parse the verdict line; criterion-cap scenarios (4, 6, 8, 10) parse the named criterion's row from the named task's table; scenario 11 parses both `TASK n BAND:` lines, checks each falls in its loose range, **and** verifies the `OVERALL:` value equals the round-down-tie weighted formula applied to them; scenario 12 asserts the Writing machine tokens are *absent* and a 6.0–7.0 band number appears near "band" — all against the pinned tokens, not prose; and
2. every must-flag issue is named in the feedback (case-insensitive keyword match, with 2–3 accepted synonyms per flag).

**Flake control:** LLM grading is stochastic, so each scenario runs **3 times**; a scenario passes if **at least 2 of 3 runs** satisfy both checks. The runner prints per-run results so a 2/3 pass is visible, not silent.

**Runner ergonomics:** `./run-prompt-tests.sh` with no argument runs the full 12 × 3 = 36-call gate; `./run-prompt-tests.sh 8` runs only scenario 8 (still 3 runs) so a single rule can be re-tested cheaply while iterating on anchors before paying for the full gate.

**Ship gate:** the prompt replaces the live skill only when **all twelve scenarios pass**. On failure, tighten the calibration anchors or rules and re-run. The scenario answers are written during implementation with their flaws planted deliberately (e.g., the "6.5–7.0" essay is written clean but with limited structures) so target bands are defensible.

## Error handling summary

| Failure | Behavior |
|---------|----------|
| Timer hits 0:00 | Auto-submit current text; done screen shows what was captured |
| Page refresh mid-test | localStorage restore with confirmation prompt |
| Empty answer | Payload carries "(no answer written)" — never a broken payload |
| Clipboard API rejected | Hidden-textarea execCommand fallback |
| localStorage unavailable (private mode) | App works; autosave silently disabled |

## Out of scope (later cycles)

- Reading module, Listening module
- Speaking Part 1 and adaptive Part 3
- Shared stylesheet extraction (trigger: third module)
- General Training Task 1 (letters)
- In-app AI grading / API integration
- Spell-check toggle, essay history, band tracking over time
