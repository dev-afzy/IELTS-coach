// Unit tests for scorer.js — the single source of Reading + Listening scoring logic.
// Run with a modern node (18+):  node --test tests/scorer.test.js
const test = require("node:test");
const assert = require("node:assert");
const S = require("../scorer.js");

test("rawToBand covers the whole 0-40 table at every boundary", () => {
  const cases = [
    [40, 9], [39, 9], [38, 8.5], [37, 8.5], [36, 8], [35, 8],
    [34, 7.5], [33, 7.5], [32, 7], [30, 7], [29, 6.5], [27, 6.5],
    [26, 6], [23, 6], [22, 5.5], [19, 5.5], [18, 5], [15, 5],
    [14, 4.5], [13, 4.5], [12, 4], [10, 4], [9, 3.5], [8, 3.5],
    [7, 3], [6, 3], [5, 2.5], [4, 2.5], [3, 2], [2, 2], [1, 1], [0, 1],
  ];
  for (const [raw, band] of cases) {
    assert.strictEqual(S.rawToBand(raw), band, `raw ${raw} -> ${band}`);
  }
});

test("rawToBand: Listening table + module argument + back-compat", () => {
  const L = [
    [40, 9], [37, 8.5], [35, 8], [32, 7.5], [30, 7], [26, 6.5],
    [23, 6], [18, 5.5], [16, 5], [13, 4.5], [10, 4], [8, 3.5],
    [6, 3], [4, 2.5], [2, 2], [1, 1], [0, 1],
  ];
  for (const [raw, band] of L) {
    assert.strictEqual(S.rawToBand(raw, "listening"), band, `listening raw ${raw} -> ${band}`);
  }
  // cross-table divergence points
  assert.strictEqual(S.rawToBand(32), 7.0, "reading 32 -> 7.0 (default)");
  assert.strictEqual(S.rawToBand(32, "listening"), 7.5, "listening 32 -> 7.5");
  assert.strictEqual(S.rawToBand(18), 5.0, "reading 18 -> 5.0 (default)");
  assert.strictEqual(S.rawToBand(18, "listening"), 5.5, "listening 18 -> 5.5");
  // back-compat: one-arg still reading
  assert.strictEqual(S.rawToBand(30), 7.0, "one-arg = reading");
});

test("splitSentences: sentence boundaries, spelled names, abbreviations, numbers", () => {
  assert.deepStrictEqual(S.splitSentences("Hi there. How are you?"), ["Hi there.", "How are you?"]);
  assert.deepStrictEqual(S.splitSentences("B. R. A. D. F. O. R. D."), ["B. R. A. D. F. O. R. D."]); // single-letter spell = one utterance
  assert.deepStrictEqual(S.splitSentences("Mr. Smith said hello."), ["Mr. Smith said hello."]);     // abbreviation
  assert.deepStrictEqual(S.splitSentences("It costs £3.50 today."), ["It costs £3.50 today."]);      // number
  assert.deepStrictEqual(S.splitSentences("No. 7 is here. Come in."), ["No. 7 is here.", "Come in."]); // abbrev + real break
  assert.deepStrictEqual(S.splitSentences("Just one line"), ["Just one line"]);                      // no terminal punctuation
});

test("lintContent (Listening): transcript-verbatim rule + spokenAs exception", () => {
  const mk = (grp) => [{
    id: "L", parts: [{
      part: 1, script: [{ speaker: "man", text: "My name is Bradford. The fee is fifty pounds." }],
      groups: [grp],
    }],
  }];
  // answer present verbatim in the script -> ok
  assert.strictEqual(S.lintContent(mk({ input: "text", wordLimit: { words: 1, numbers: 0 },
    questions: [{ n: 1, answer: ["Bradford"] }] })).ok, true);
  // answer NOT in the script -> fail
  assert.strictEqual(S.lintContent(mk({ input: "text", wordLimit: { words: 1, numbers: 0 },
    questions: [{ n: 1, answer: ["London"] }] })).ok, false);
  // spokenAs form present -> ok even though written answer differs from spoken
  const spelledScript = [{ id: "L", parts: [{ part: 1,
    script: [{ speaker: "man", text: "That's B. R. A. D. F. O. R. D." }],
    groups: [{ input: "text", wordLimit: { words: 1, numbers: 0 },
      questions: [{ n: 1, answer: ["Bradford"], spokenAs: "B. R. A. D. F. O. R. D." }] }] }] }];
  assert.strictEqual(S.lintContent(spelledScript).ok, true);
  // spokenAs form absent from script -> fail
  const spelledBad = JSON.parse(JSON.stringify(spelledScript));
  spelledBad[0].parts[0].script[0].text = "That's something else entirely.";
  assert.strictEqual(S.lintContent(spelledBad).ok, false);
});

test("normalize: trims, collapses whitespace, lowercases, strips edge punctuation", () => {
  assert.strictEqual(S.normalize("  Parliament. "), "parliament");
  assert.strictEqual(S.normalize("The  UK"), "the uk");
  assert.strictEqual(S.normalize("(colour)"), "colour");
  assert.strictEqual(S.normalize("1901."), "1901");
});

test("withinWordLimit: two-counter rule (words and numbers separate)", () => {
  const lim = { words: 2, numbers: 1 };
  assert.strictEqual(S.withinWordLimit("the 1901 act", lim), true);   // 2 words + 1 number
  assert.strictEqual(S.withinWordLimit("the old 1901 act", lim), false); // 3 words
  assert.strictEqual(S.withinWordLimit("1901 1902", lim), false);     // 2 numbers
  assert.strictEqual(S.withinWordLimit("parliament", { words: 2, numbers: 0 }), true);
  assert.strictEqual(S.withinWordLimit("eight", { words: 1, numbers: 0 }), true);
});

test("scoreQuestionGroup: single (TFNG) exact match", () => {
  const g = { input: "single", questions: [{ n: 1, answer: "TRUE" }] };
  assert.strictEqual(S.scoreQuestionGroup(g, { 1: "TRUE" }).marks, 1);
  assert.strictEqual(S.scoreQuestionGroup(g, { 1: "FALSE" }).marks, 0);
  assert.strictEqual(S.scoreQuestionGroup(g, {}).marks, 0); // unanswered
});

test("scoreQuestionGroup: match exact; case/space-insensitive on keys not needed (keys are canonical)", () => {
  const g = { input: "match", options: [{ key: "i" }, { key: "ii" }], questions: [{ n: 3, answer: "ii" }] };
  assert.strictEqual(S.scoreQuestionGroup(g, { 3: "ii" }).marks, 1);
  assert.strictEqual(S.scoreQuestionGroup(g, { 3: "i" }).marks, 0);
});

test("scoreQuestionGroup: text — variant match and word-limit enforcement", () => {
  const g = {
    input: "text", wordLimit: { words: 2, numbers: 0 },
    questions: [{ n: 5, answer: ["colour", "color"] }],
  };
  assert.strictEqual(S.scoreQuestionGroup(g, { 5: "Colour." }).marks, 1); // normalized + variant
  assert.strictEqual(S.scoreQuestionGroup(g, { 5: "color" }).marks, 1);
  assert.strictEqual(S.scoreQuestionGroup(g, { 5: "the bright colour" }).marks, 0); // 3 words > limit
  assert.strictEqual(S.scoreQuestionGroup(g, { 5: "shade" }).marks, 0);
});

test("scoreQuestionGroup: selectCount multi-answer — partial marks + fill convention", () => {
  const g = {
    input: "single", selectCount: 2,
    questions: [{ ns: [7, 8], answer: ["B", "D"] }],
  };
  // picked one correct (B) and one wrong (E): 1 mark; n7=✓ B, n8=✗ missed D
  const r = S.scoreQuestionGroup(g, { 7: ["B", "E"] });
  assert.strictEqual(r.marks, 1);
  const byN = Object.fromEntries(r.perQuestion.map((q) => [q.n, q]));
  assert.strictEqual(byN[7].correct, true);
  assert.strictEqual(byN[7].your, "B");
  assert.strictEqual(byN[8].correct, false);
  assert.strictEqual(byN[8].key, "D"); // the missed letter
  // both correct -> 2 marks
  assert.strictEqual(S.scoreQuestionGroup(g, { 7: ["D", "B"] }).marks, 2); // order-independent
});

test("scoreTest: aggregates marks -> raw -> band across groups", () => {
  const test1 = {
    passages: [{
      groups: [
        { input: "single", questions: [{ n: 1, answer: "TRUE" }, { n: 2, answer: "FALSE" }] },
        { input: "text", wordLimit: { words: 1, numbers: 0 }, questions: [{ n: 3, answer: ["moon"] }] },
      ],
    }],
  };
  const out = S.scoreTest(test1, { 1: "TRUE", 2: "TRUE", 3: "moon" });
  assert.strictEqual(out.raw, 2);
  assert.strictEqual(out.outOf, 3);
  assert.strictEqual(out.perQuestion.length, 3);
  assert.strictEqual(typeof out.band, "number");
});

test("lintContent: passes clean content", () => {
  const good = [{
    id: "t", passages: [{
      number: 1, paragraphs: [{ label: "A", text: "x" }, { label: "B", text: "y" }],
      groups: [
        { input: "single", type: "TFNG", questions: [{ n: 1, answer: "TRUE", location: "A" }, { n: 2, answer: "NOT GIVEN", location: "B" }] },
        { input: "match", options: [{ key: "i" }, { key: "ii" }], questions: [{ n: 3, answer: "ii", location: "A" }] },
      ],
    }],
  }];
  assert.strictEqual(S.lintContent(good).ok, true);
});

test("lintContent: catches every defect class", () => {
  const bad = (mut) => {
    const base = {
      id: "t", passages: [{
        number: 1, paragraphs: [{ label: "A", text: "x" }],
        groups: [{ input: "single", type: "TFNG", questions: [{ n: 1, answer: "TRUE", location: "A" }] }],
      }],
    };
    mut(base);
    return S.lintContent([base]).ok;
  };
  assert.strictEqual(bad((b) => { b.passages[0].groups[0].questions[0].n = 2; }), false); // non-contiguous
  assert.strictEqual(bad((b) => { b.passages[0].groups[0].questions[0].answer = "MAYBE"; }), false); // TFNG bad key
  assert.strictEqual(bad((b) => { b.passages[0].groups[0].questions[0].location = "Z"; }), false); // bad location
  assert.strictEqual(bad((b) => {
    b.passages[0].groups[0] = { input: "match", options: [{ key: "i" }], questions: [{ n: 1, answer: "ix", location: "A" }] };
  }), false); // match key not in options
  assert.strictEqual(bad((b) => {
    b.passages[0].groups[0] = { input: "text", wordLimit: { words: 1, numbers: 0 }, questions: [{ n: 1, answer: ["two words"], location: "A" }] };
  }), false); // variant over its own limit
  assert.strictEqual(bad((b) => {
    b.passages[0].groups[0] = { input: "single", selectCount: 2, options: [{ key: "B" }, { key: "D" }], questions: [{ ns: [1], answer: ["B", "D"], location: "A" }] };
  }), false); // multi-answer invariant: ns.length !== selectCount
});
