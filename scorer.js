/* scorer.js — IELTS Academic Reading scoring, band conversion, and content lint.
 *
 * SINGLE SOURCE OF TRUTH: this classic script exposes its functions as globals when
 * loaded in the browser via <script src="scorer.js">, and as CommonJS exports when
 * required by the Node tests. The browser runs the exact code the tests prove.
 * (Classic script, not an ES module, so it loads over file:// too.)
 */

/* ---------- text normalization ---------- */

// Trim, collapse inner whitespace, lowercase, and strip leading/trailing punctuation
// from each token. Punctuation is stripped BEFORE any numeric test, so "1901." still
// reads as a number and "parliament." matches "parliament".
function normalize(s) {
  return String(s == null ? "" : s)
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(function (tok) { return tok.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ""); })
    .filter(function (t) { return t.length > 0; })
    .join(" ");
}

function isNumberToken(tok) {
  return /^\d[\d,.]*$/.test(tok);
}

// Two-counter word limit: words and numbers are budgeted separately, matching the real
// instruction "NO MORE THAN N WORDS AND/OR A NUMBER".
function withinWordLimit(answer, limit) {
  if (!limit) return true;
  var words = 0, numbers = 0;
  normalize(answer).split(" ").filter(Boolean).forEach(function (tok) {
    if (isNumberToken(tok)) numbers++; else words++;
  });
  return words <= (limit.words || 0) && numbers <= (limit.numbers || 0);
}

/* ---------- band conversion (pinned Academic Reading table) ---------- */

// Descending thresholds: first row whose min <= raw wins. Covers all raw 0-40.
// rawToBand(0) === 1.0 (an attempted test floors at Band 1); Band 0 "did not attempt"
// is decided by the Results layer, not here.
var BAND_TABLE = [
  { min: 39, band: 9.0 }, { min: 37, band: 8.5 }, { min: 35, band: 8.0 },
  { min: 33, band: 7.5 }, { min: 30, band: 7.0 }, { min: 27, band: 6.5 },
  { min: 23, band: 6.0 }, { min: 19, band: 5.5 }, { min: 15, band: 5.0 },
  { min: 13, band: 4.5 }, { min: 10, band: 4.0 }, { min: 8, band: 3.5 },
  { min: 6, band: 3.0 }, { min: 4, band: 2.5 }, { min: 2, band: 2.0 },
  { min: 0, band: 1.0 },
];

function rawToBand(raw) {
  for (var i = 0; i < BAND_TABLE.length; i++) {
    if (raw >= BAND_TABLE[i].min) return BAND_TABLE[i].band;
  }
  return 1.0;
}

/* ---------- scoring ---------- */

var TFNG = ["TRUE", "FALSE", "NOT GIVEN"];
var YNNG = ["YES", "NO", "NOT GIVEN"];

// Score one question group. Returns { marks, perQuestion:[{n, correct, your, key, marks}] }.
function scoreQuestionGroup(group, responses) {
  responses = responses || {};
  var per = [];
  var marks = 0;

  group.questions.forEach(function (q) {
    if (group.input === "single" && group.selectCount) {
      // Multi-answer MC: one unordered set spanning q.ns; 1 mark per correct letter.
      var picked = responses[q.ns[0]] || [];
      var keys = q.answer.slice();
      var correctPicks = picked.filter(function (k) { return keys.indexOf(k) !== -1; });
      marks += correctPicks.length;
      // Fill convention: correct picks fill q.ns in order (each ✓ with its letter);
      // leftover ns are ✗ showing the missed key letters.
      var missed = keys.filter(function (k) { return correctPicks.indexOf(k) === -1; });
      q.ns.forEach(function (n, i) {
        if (i < correctPicks.length) {
          per.push({ n: n, correct: true, your: correctPicks[i], key: correctPicks[i], marks: 1 });
        } else {
          per.push({ n: n, correct: false, your: (picked[i] || null), key: missed.shift() || null, marks: 0 });
        }
      });
      return;
    }

    var your = responses[q.n];
    var ok;
    if (group.input === "text") {
      ok = your != null && String(your).trim() !== "" &&
        withinWordLimit(your, group.wordLimit) &&
        q.answer.some(function (v) { return normalize(v) === normalize(your); });
    } else {
      // single (TFNG/YNNG/MCQ) and match: exact key match.
      ok = your != null && your === q.answer;
    }
    if (ok) marks += 1;
    per.push({
      n: q.n, correct: !!ok, your: (your == null ? null : your),
      key: Array.isArray(q.answer) ? q.answer[0] : q.answer, marks: ok ? 1 : 0,
    });
  });

  return { marks: marks, perQuestion: per };
}

function eachGroup(test, fn) {
  test.passages.forEach(function (p) { (p.groups || []).forEach(fn); });
}

// Score a whole test. Returns { raw, outOf, band, perQuestion }.
function scoreTest(test, responses) {
  var raw = 0, outOf = 0, per = [];
  eachGroup(test, function (g) {
    var r = scoreQuestionGroup(g, responses);
    raw += r.marks;
    per = per.concat(r.perQuestion);
    // marks available = number of question numbers in the group
    g.questions.forEach(function (q) { outOf += q.ns ? q.ns.length : 1; });
  });
  return { raw: raw, outOf: outOf, band: rawToBand(raw), perQuestion: per };
}

/* ---------- content lint ---------- */

// Validate a hand-authored bank. Returns { ok, errors:[] }.
function lintContent(tests) {
  var errors = [];
  tests.forEach(function (test) {
    var labels = {};
    var seen = [];
    eachGroup(test, function () {});
    // collect paragraph labels
    test.passages.forEach(function (p) {
      (p.paragraphs || []).forEach(function (par) { labels[par.label] = true; });
    });
    eachGroup(test, function (g) {
      var optKeys = (g.options || []).map(function (o) { return o.key; });
      g.questions.forEach(function (q) {
        // multi-answer invariant
        if (g.input === "single" && g.selectCount) {
          if (!(q.ns && q.ns.length === g.selectCount && q.answer.length === g.selectCount)) {
            errors.push(test.id + ": multi-answer invariant broken (ns/selectCount/answer length)");
          }
          q.answer.forEach(function (k) {
            if (optKeys.indexOf(k) === -1) errors.push(test.id + ": multi-answer key " + k + " not in options");
          });
          q.ns.forEach(function (n) { seen.push(n); });
        } else {
          seen.push(q.n);
          // key validity
          if (g.input === "match") {
            if (optKeys.indexOf(q.answer) === -1) errors.push(test.id + " q" + q.n + ": match key not in options");
          } else if (g.input === "single") {
            var set = g.options ? optKeys : (g.type && /yes\/no/i.test(g.type) ? YNNG : TFNG);
            if (set.indexOf(q.answer) === -1) errors.push(test.id + " q" + q.n + ": single key '" + q.answer + "' not valid");
          } else if (g.input === "text") {
            q.answer.forEach(function (v) {
              if (!withinWordLimit(v, g.wordLimit)) errors.push(test.id + " q" + q.n + ": variant '" + v + "' exceeds word limit");
            });
          }
        }
        // location must exist
        if (q.location && !labels[q.location]) errors.push(test.id + " q" + (q.n || (q.ns && q.ns[0])) + ": location '" + q.location + "' missing");
      });
    });
    // contiguous & unique 1..N
    seen.sort(function (a, b) { return a - b; });
    for (var i = 0; i < seen.length; i++) {
      if (seen[i] !== i + 1) { errors.push(test.id + ": question numbers not contiguous/unique at " + seen[i]); break; }
    }
  });
  return { ok: errors.length === 0, errors: errors };
}

/* ---------- dual export ---------- */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { normalize: normalize, withinWordLimit: withinWordLimit, rawToBand: rawToBand, scoreQuestionGroup: scoreQuestionGroup, scoreTest: scoreTest, lintContent: lintContent };
}
