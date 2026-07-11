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
   - **Autosave** answers + remaining time + selected prompt to `localStorage` every 5 seconds. On reload with a saved session, ask "Resume your test in progress?" before restoring; discard on decline.
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

**Task 2 — 15 prompts** across all five essay types: 4 opinion, 3 discussion, 3 advantages/disadvantages, 3 problem/solution, 2 two-part. Topics from the standard IELTS pool (education, technology, environment, society, health, work). Random draw per session, same as the cue cards.

### Grading payload (clipboard format)

```
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

- Word counts and UNDER MINIMUM flags are computed by the app and stamped into the payload — the grader never trusts self-reported counts.
- Single-task mode omits the other task's block.
- Clipboard failure falls back to the hidden-textarea `execCommand` copy already used in index.html.

## Grading prompt (`.claude/skills/ielts-coach/SKILL.md`)

The canonical prompt moves into the repo. The existing skill's strict-examiner core is kept; these are the additions:

### 1. Fixed response format (always, in this order)

1. **Verdict line** — overall band + one blunt sentence.
2. **Per-criterion table** — the four official criteria, band each, one-line reason each.
3. **What went well** — brief and genuine; never padded to soften the blow.
4. **What's holding you back** — specific unsugared failures, worst first, each with quoted evidence from the answer.
5. **The fixes** — corrections grouped by criterion: error → fix → why (pattern, not one-off).
6. **Band 8.5 version** — full rewrite of the answer.
7. **One thing to fix next** — the single highest-leverage item, never a list.

### 2. Calibration anchors

For each criterion, 2–3 short pinned example sentences at Band 6, 7, and 8 quality. The model scores against these fixed reference points rather than its own drifting sense of "good" — the primary defense against score inflation.

### 3. Task 1 accuracy checking

Grade the report against the payload's `VISUAL DATA` block. Misread or invented figures are named explicitly and cap Task Achievement.

### 4. Hard rules (never break)

- Never round a band up out of kindness.
- Always state the under-length penalty with the exact word count.
- Always flag memorized/template language.
- Never coach thesaurus-swap vocabulary; upgrade words in context only.

## Prompt test suite (`tests/prompt-scenarios/`)

Ten scripted answers with known target bands and known planted flaws:

| # | Scenario | Target band | Must be flagged in feedback |
|---|----------|-------------|------------------------------|
| 1 | Weak essay, frequent errors | 5.5–6.0 | grammar accuracy, repetitive vocabulary |
| 2 | Competent but flat essay | 6.5–7.0 | limited range, mechanical linking |
| 3 | Strong essay | 8.0–8.5 | (must NOT be nitpicked below 8.0) |
| 4 | Task 1 at 118 words | ≤6.0 on Task Achievement | under-length penalty stated |
| 5 | Padded, repetitive essay | ≤6.5 | padding named |
| 6 | Off-topic essay | ≤5.5 on Task Response | off-topic named |
| 7 | Memorized-template essay | ≤6.5 | template language named |
| 8 | Task 1 misreading its own chart | ≤6.5 on Task Achievement | data inaccuracy named |
| 9 | Strong Task 1 report | 8.0–8.5 | data accuracy confirmed |
| 10 | Fence-sitting opinion essay | ≤6.5 on Task Response | unclear position named |

Each scenario is a file pair: the answer payload (exactly what the app would copy) and an expectations file (target band range + must-flag strings).

**Runner** (`tests/run-prompt-tests.sh`): for each scenario, invoke `claude -p` with the SKILL.md content + the scenario payload, then check:

1. the band expectation holds — for range scenarios (1, 2, 3, 5, 7, 9), the overall band parsed from the verdict line is within the target range (±0.5 tolerance at range edges); for criterion-cap scenarios (4, 6, 8, 10), the named criterion's band parsed from the per-criterion table is at or below the cap (the fixed response format makes this table reliably parseable), and
2. every must-flag issue is named in the feedback (case-insensitive keyword match, with 2–3 accepted synonyms per flag).

**Ship gate:** the prompt replaces the live skill only when **all ten scenarios pass**. On failure, tighten the calibration anchors or rules and re-run. The scenario answers are written during implementation with their flaws planted deliberately (e.g., the "6.5–7.0" essay is written clean but with limited structures) so target bands are defensible.

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
