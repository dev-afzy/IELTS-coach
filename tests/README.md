# Grading-prompt tests

The Writing grading prompt (`.claude/skills/ielts-coach/SKILL.md`) is gated by two layers.

## 1. Deterministic checker (fast, no model calls)

`prompt-scenarios/check.mjs` parses the prompt's pinned machine tokens
(`OVERALL:`, `TASK n BAND:`, criterion table rows), applies the round-down-tie
weighting formula, and verifies must-flag keyword sets. Its unit tests use canned
model-output fixtures — no network:

```bash
node tests/prompt-scenarios/check.test.mjs
```

## 2. Integration gate (calls the model)

`run-prompt-tests.sh` feeds each scenario payload through the live `SKILL.md` via
`claude -p`, runs each **3×**, and passes a scenario at **2 of 3**. The model is
pinned in the script so a version bump can't silently recalibrate the anchors.

```bash
./tests/run-prompt-tests.sh        # full gate (all scenarios)
./tests/run-prompt-tests.sh 08     # just scenario 08 (still 3 runs)
```

Each scenario is a pair: `NN-name.payload.txt` (exactly what the app copies to the
clipboard) and `NN-name.expect.json` (the band expectation + must-flag synonym sets).
Flaws are planted deliberately so the target bands are defensible. **The prompt only
ships when every scenario passes.**
