#!/usr/bin/env bash
# Integration gate for the IELTS grading prompt.
# Feeds each scenario payload through the live SKILL.md via `claude -p`,
# runs each 3x, and passes a scenario at 2-of-3. The prompt only ships
# when every scenario passes.
#
# Usage:
#   ./tests/run-prompt-tests.sh          # full gate (all scenarios)
#   ./tests/run-prompt-tests.sh 08       # only scenario 08 (still 3 runs)
#
# Env overrides (for harness testing only):
#   CLAUDE_CMD=./mock-claude.sh          # stub the model call
set -uo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCEN="$DIR/prompt-scenarios"
SKILL="$DIR/../.claude/skills/ielts-coach/SKILL.md"

# PINNED model — a silent bump would recalibrate every anchor. Change here on purpose only.
MODEL="claude-opus-4-8"
RUNS=3
CLAUDE_CMD="${CLAUDE_CMD:-claude}"
ONLY="${1:-}"

if [ ! -f "$SKILL" ]; then echo "SKILL.md not found at $SKILL" >&2; exit 2; fi

overall_fail=0
found=0

for payload in "$SCEN"/*.payload.txt; do
  [ -e "$payload" ] || { echo "no scenario payloads found in $SCEN" >&2; exit 2; }
  base="$(basename "$payload" .payload.txt)"   # e.g. 08-task1-misread
  num="${base%%-*}"                             # e.g. 08
  if [ -n "$ONLY" ] && [ "$ONLY" != "$num" ] && [ "$ONLY" != "$base" ]; then continue; fi
  found=1
  expect="$SCEN/$base.expect.json"
  if [ ! -f "$expect" ]; then echo "SCENARIO $base: MISSING $expect" >&2; overall_fail=1; continue; fi

  echo "=== $base ==="
  prompt="$(cat "$SKILL")

===== GRADE THE FOLLOWING (this is the app's clipboard payload) =====
$(cat "$payload")"

  passes=0
  for i in $(seq 1 "$RUNS"); do
    # Prompt goes in via stdin: it begins with SKILL.md's "---" frontmatter,
    # which `-p "$prompt"` would misparse as a CLI option.
    out="$(printf '%s' "$prompt" | "$CLAUDE_CMD" -p --model "$MODEL" 2>/dev/null)"
    if reasons="$(printf '%s' "$out" | node "$SCEN/check.mjs" "$expect")"; then
      passes=$((passes + 1)); echo "  run $i: pass"
    else
      echo "  run $i: FAIL — $reasons"
    fi
  done

  if [ "$passes" -ge 2 ]; then echo "SCENARIO $base: PASS ($passes/$RUNS)"
  else echo "SCENARIO $base: FAIL ($passes/$RUNS)"; overall_fail=1; fi
  echo
done

if [ "$found" -eq 0 ]; then echo "no scenario matched '$ONLY'" >&2; exit 2; fi
if [ "$overall_fail" -eq 0 ]; then echo "GATE: all scenarios passed"; else echo "GATE: FAILURES present"; fi
exit "$overall_fail"
