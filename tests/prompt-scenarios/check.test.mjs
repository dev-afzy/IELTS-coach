// Deterministic unit tests for check.mjs — no network, no framework.
// Run: node tests/prompt-scenarios/check.test.mjs   (works on Node 14+)
import { checkOutput, roundHalfTieDown } from "./check.mjs";

let failures = 0;
function ok(cond, msg) {
  if (cond) { console.log("  ok   " + msg); }
  else { failures++; console.log("  FAIL " + msg); }
}
function eq(a, b, msg) { ok(a === b, `${msg} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`); }

console.log("roundHalfTieDown");
eq(roundHalfTieDown(6.75), 6.5, "6.75 -> 6.5 (tie down)");
eq(roundHalfTieDown((6.0 + 2 * 7.0) / 3), 6.5, "(6+14)/3=6.667 -> 6.5");
eq(roundHalfTieDown((6.5 + 2 * 7.5) / 3), 7.0, "(6.5+15)/3=7.167 -> 7.0");
eq(roundHalfTieDown(7.24), 7.0, "7.24 -> 7.0");
eq(roundHalfTieDown(7.26), 7.5, "7.26 -> 7.5");
eq(roundHalfTieDown(8.0), 8.0, "8.0 -> 8.0");

console.log("overall-range scenario: PASS in range, with must-flag met");
{
  const out = `OVERALL: 6.0 The essay is understandable but riddled with grammar errors.
| Task Response | 6.0 | position present but thinly developed |
| Coherence & Cohesion | 6.0 | mechanical linking |
| Lexical Resource | 5.5 | repetitive word choice throughout |
| Grammatical Range & Accuracy | 5.5 | frequent verb-tense errors |
What's holding you back: repetitive vocabulary and constant grammar accuracy slips.`;
  const exp = { kind: "overall", band: [5.5, 6.0],
    mustFlag: [["grammar", "accuracy", "grammatical"], ["repetitive", "repetition", "limited range"]] };
  const r = checkOutput(out, exp);
  ok(r.pass, "in-range + flags -> pass");
}

console.log("overall-range scenario: FAIL when band above range");
{
  const out = `OVERALL: 7.5 Solid essay.`;
  const exp = { kind: "overall", band: [5.5, 6.0], mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(!r.pass, "7.5 outside [5.5,6.0] -> fail");
}

console.log("overall-range scenario: FAIL when a must-flag is missing");
{
  const out = `OVERALL: 6.0 Understandable essay with some grammar slips.`;
  const exp = { kind: "overall", band: [5.5, 6.0],
    mustFlag: [["grammar", "grammatical"], ["repetitive", "repetition"]] };
  const r = checkOutput(out, exp);
  ok(!r.pass, "missing 'repetitive' flag -> fail");
}

console.log("criterion-cap scenario: PASS when capped criterion <= cap");
{
  const out = `TASK 1 BAND: 5.5
| Task Achievement | 5.5 | under 150 words (118) so capped; also misses the overview |
| Coherence & Cohesion | 6.0 | grouped but abrupt |
| Lexical Resource | 6.0 | adequate |
| Grammatical Range & Accuracy | 6.0 | adequate |
OVERALL: 5.5 The report is under length at 118 words, which caps Task Achievement.`;
  const exp = { kind: "criterion", task: 1, criterion: "Task Achievement", cap: 6.0,
    mustFlag: [["under", "below 150", "word count", "118"]] };
  const r = checkOutput(out, exp);
  ok(r.pass, "TA 5.5 <= 6.0 cap + under-length flagged -> pass");
}

console.log("criterion-cap scenario: FAIL when capped criterion above cap");
{
  const out = `TASK 2 BAND: 7.0
| Task Response | 7.0 | clear enough position |
| Coherence & Cohesion | 7.0 | fine |
| Lexical Resource | 7.0 | fine |
| Grammatical Range & Accuracy | 7.0 | fine |
OVERALL: 7.0`;
  const exp = { kind: "criterion", task: 2, criterion: "Task Response", cap: 5.5,
    mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(!r.pass, "TR 7.0 > 5.5 cap -> fail");
}

console.log("full-test scenario: PASS when ranges hold and arithmetic matches (tie down)");
{
  // T1=6.0, T2=7.0 -> (6 + 14)/3 = 6.667 -> 6.5
  const out = `TASK 1 BAND: 6.0
| Task Achievement | 6.0 | overview present but data patchy |
| Coherence & Cohesion | 6.0 | ok |
| Lexical Resource | 6.0 | ok |
| Grammatical Range & Accuracy | 6.0 | ok |
TASK 2 BAND: 7.0
| Task Response | 7.0 | developed |
| Coherence & Cohesion | 7.0 | ok |
| Lexical Resource | 7.0 | ok |
| Grammatical Range & Accuracy | 7.0 | ok |
OVERALL: 6.5 Weighting Task 2 double: (6.0 + 2x7.0)/3 = 6.67, rounded down to 6.5.`;
  const exp = { kind: "fulltest", taskRanges: { t1: [5.5, 6.5], t2: [7.0, 8.0] }, mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(r.pass, "T1/T2 in range and OVERALL matches formula -> pass");
}

console.log("full-test scenario: FAIL when overall contradicts the formula");
{
  const out = `TASK 1 BAND: 6.0
TASK 2 BAND: 7.0
OVERALL: 7.0 (arithmetic wrong on purpose)`;
  const exp = { kind: "fulltest", taskRanges: { t1: [5.5, 6.5], t2: [7.0, 8.0] }, mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(!r.pass, "OVERALL 7.0 != 6.5 formula -> fail");
}

console.log("full-test scenario: FAIL when grader can't tell tasks apart");
{
  // Both 7.0 -> overall (7+14)/3 = 7.0, arithmetic self-consistent, but T1 out of [5.5,6.5]
  const out = `TASK 1 BAND: 7.0
TASK 2 BAND: 7.0
OVERALL: 7.0`;
  const exp = { kind: "fulltest", taskRanges: { t1: [5.5, 6.5], t2: [7.0, 8.0] }, mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(!r.pass, "T1 7.0 outside [5.5,6.5] -> fail (calibration, not just math)");
}

console.log("speaking regression: PASS when no writing tokens leak and a band appears");
{
  const out = `Fluency & Coherence: generally flows with occasional hesitation.
Overall this is around Band 6.5 for Speaking. Here's the upgraded version...`;
  const exp = { kind: "speaking", mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(r.pass, "no TASK/OVERALL tokens + band 6.5 near 'band' -> pass");
}

console.log("speaking regression: FAIL when writing format leaks in");
{
  const out = `OVERALL: 6.5 Speaking response.
TASK 1 BAND: 6.5`;
  const exp = { kind: "speaking", mustFlag: [] };
  const r = checkOutput(out, exp);
  ok(!r.pass, "writing machine tokens present -> fail");
}

console.log("");
if (failures) { console.log(`${failures} FAILURE(S)`); process.exit(1); }
console.log("all checker tests passed");
