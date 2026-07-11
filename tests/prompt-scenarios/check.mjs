// Deterministic checker for IELTS grading-prompt scenario outputs.
// Parses the pinned machine tokens from a model response and verifies it
// against a scenario expectation. No network, no side effects.
//
// Machine tokens (must match SKILL.md verbatim):
//   OVERALL: X.X            verdict line
//   TASK 1 BAND: X.X        per-task band line
//   TASK 2 BAND: X.X
//   | <criterion> | X.X | <reason> |   criterion table row

const BAND = "([0-9](?:\\.[05])?)"; // 0.0 .. 9.5 in half steps

export function roundHalfTieDown(x) {
  // Nearest half band; exact .25/.75 ties round DOWN.
  const y = x * 2;
  const n = Math.ceil(y - 0.5); // round-half-down on the doubled value
  return n / 2;
}

// Tolerate leading markdown/quote decoration models add, e.g. "**OVERALL: 6.5**".
const OVERALL_RE = new RegExp("^[\\s>*_#-]*OVERALL:\\s*" + BAND, "mi");

function parseOverall(text) {
  const m = text.match(OVERALL_RE);
  return m ? parseFloat(m[1]) : null;
}

function parseTaskBand(text, task) {
  const m = text.match(new RegExp("TASK\\s*" + task + "\\s*BAND:\\s*" + BAND, "i"));
  return m ? parseFloat(m[1]) : null;
}

function hasWritingTokens(text) {
  return OVERALL_RE.test(text) || /TASK\s*[12]\s*BAND:/i.test(text);
}

// Find a criterion row `| name | band | reason |` whose first cell matches.
// Matching is loose: the row cell must contain the expectation's criterion
// name (case-insensitive), so "Task Achievement" matches "| Task Achievement |".
function parseCriterion(text, criterion) {
  const want = criterion.toLowerCase().replace(/[^a-z]/g, "");
  for (const line of text.split("\n")) {
    if (!line.includes("|")) continue;
    const cells = line.split("|").map((c) => c.trim()).filter((c) => c.length);
    if (cells.length < 2) continue;
    const name = cells[0].toLowerCase().replace(/[^a-z]/g, "");
    if (!name.includes(want)) continue;
    // First band-looking token in the band cell — tolerates "6.0 (capped)".
    const bm = cells[1].match(new RegExp(BAND));
    if (bm) return parseFloat(bm[1]);
  }
  return null;
}

function flagsSatisfied(text, mustFlag, reasons) {
  const hay = text.toLowerCase();
  let allMet = true;
  for (const group of mustFlag || []) {
    const met = group.some((syn) => hay.includes(syn.toLowerCase()));
    if (!met) { allMet = false; reasons.push(`missing must-flag (any of: ${group.join(", ")})`); }
  }
  return allMet;
}

function inRange(v, [min, max], label, reasons) {
  if (v === null) { reasons.push(`${label}: not found`); return false; }
  if (v < min || v > max) { reasons.push(`${label}: ${v} outside [${min}, ${max}]`); return false; }
  return true;
}

export function checkOutput(modelText, expectation) {
  const reasons = [];
  let bandOk = true;

  switch (expectation.kind) {
    case "overall": {
      const o = parseOverall(modelText);
      bandOk = inRange(o, expectation.band, "OVERALL", reasons);
      break;
    }
    case "criterion": {
      const c = parseCriterion(modelText, expectation.criterion);
      if (c === null) { reasons.push(`criterion "${expectation.criterion}" row not found`); bandOk = false; }
      else if (c > expectation.cap) { reasons.push(`${expectation.criterion} ${c} > cap ${expectation.cap}`); bandOk = false; }
      break;
    }
    case "fulltest": {
      const t1 = parseTaskBand(modelText, 1);
      const t2 = parseTaskBand(modelText, 2);
      const o = parseOverall(modelText);
      const r1 = inRange(t1, expectation.taskRanges.t1, "TASK 1 BAND", reasons);
      const r2 = inRange(t2, expectation.taskRanges.t2, "TASK 2 BAND", reasons);
      let rArith = true;
      if (t1 === null || t2 === null || o === null) { reasons.push("full-test: a band token is missing"); rArith = false; }
      else {
        const want = roundHalfTieDown((t1 + 2 * t2) / 3);
        if (o !== want) { reasons.push(`OVERALL ${o} != formula ${want} for T1=${t1}, T2=${t2}`); rArith = false; }
      }
      bandOk = r1 && r2 && rArith;
      break;
    }
    case "speaking": {
      if (hasWritingTokens(modelText)) { reasons.push("writing machine tokens leaked into a Speaking response"); bandOk = false; }
      // Collect every band-adjacent number (both "band 6.5" and "6.5 band" forms)
      // and pass if ANY sits in [6.0, 7.0]. The regression guard only needs a
      // plausible speaking band to appear, not the first number to be it.
      const nums = [];
      for (const m of modelText.matchAll(/band[^0-9\n]{0,15}([0-9](?:\.[05])?)/gi)) nums.push(parseFloat(m[1]));
      for (const m of modelText.matchAll(/([0-9](?:\.[05])?)[^0-9\n]{0,8}band/gi)) nums.push(parseFloat(m[1]));
      if (!nums.length) { reasons.push("no band number found near the word 'band'"); bandOk = false; }
      else if (!nums.some((b) => b >= 6.0 && b <= 7.0)) { reasons.push(`no speaking band in [6.0, 7.0]; found ${nums.join(", ")}`); bandOk = false; }
      break;
    }
    default:
      reasons.push(`unknown expectation kind: ${expectation.kind}`);
      bandOk = false;
  }

  const flagsOk = flagsSatisfied(modelText, expectation.mustFlag, reasons);
  return { pass: bandOk && flagsOk, reasons };
}

// CLI: node check.mjs <expect.json>  (model output on stdin)
// Exit 0 = pass, 1 = fail; prints failure reasons to stdout.
const invokedDirectly = process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop());
if (invokedDirectly && process.argv[2]) {
  const { readFileSync } = await import("node:fs");
  const expectation = JSON.parse(readFileSync(process.argv[2], "utf8"));
  const modelText = readFileSync(0, "utf8"); // fd 0 = stdin
  const { pass, reasons } = checkOutput(modelText, expectation);
  if (!pass) { process.stdout.write(reasons.join("; ")); process.exit(1); }
  process.exit(0);
}
