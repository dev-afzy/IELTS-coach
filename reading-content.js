/* reading-content.js — IELTS Academic Reading question bank.
 *
 * Classic script: defines the global `READING_TESTS`. Loaded by reading.html via
 * <script src="reading-content.js"> and required by the Node lint harness.
 *
 * All passages are ORIGINAL, written for practice. To add a test, append an object
 * of the same shape; question numbers run 1..40 within each test. Run the content
 * lint (reading.html?selftest=1, or the Node harness) after editing — it checks
 * numbering, answer-key validity, word limits, locations, and the multi-answer invariant.
 */

var READING_TESTS = [

/* ==================================================================== TEST 1 */
{
  id: "test-1",
  title: "Academic Reading — Test 1",
  passages: [

    /* -------- Passage 1: The Origins of Paper (Q1–13) -------- */
    {
      number: 1,
      title: "The Origins of Paper",
      paragraphs: [
        { label: "A", text: "The invention of paper is traditionally credited to Cai Lun, an official at the Chinese imperial court, around 105 CE. Writing itself was already ancient by then. For centuries the Chinese had recorded texts on strips of bamboo, which were bulky and heavy, or on silk, which was smooth and light but far too expensive for everyday use. What Cai Lun offered was not a new way of writing but a new surface to write on." },
        { label: "B", text: "The method he recorded was strikingly simple. Plant fibres — mulberry bark, hemp, worn-out rags and even old fishing nets — were pounded with water into a wet pulp. This pulp was spread thinly over a screen or mould so that the water drained away, leaving a mat of tangled fibres that was then pressed and dried into a sheet. The result was cheap, light and easy to produce in quantity." },
        { label: "C", text: "For several centuries the technique remained a closely guarded secret of the East. It is often said to have reached the Islamic world after the Battle of Talas in 751 CE, when Chinese soldiers taken prisoner supposedly revealed the process to their captors. Whatever the truth of that story, Baghdad had a working paper mill by the year 794, and paper soon became the standard material of Islamic scholarship." },
        { label: "D", text: "Europe was comparatively slow to adopt it. The first European paper mill was established at Xàtiva in Spain in the twelfth century, in a region then under Moorish rule. Christian Europe was at first suspicious of the new material and continued to prefer parchment, made from animal skin, for its most important official documents." },
        { label: "E", text: "Everything changed with the printing press. When Johannes Gutenberg introduced movable-type printing around 1450, the demand for a cheap writing surface exploded, and paper was the only material that could meet it. Even so, the paper of this period was still made from cotton and linen rags, and the supply of rags struggled to keep pace with the printing presses." },
        { label: "F", text: "The solution arrived in the 1840s, when Friedrich Gottlob Keller demonstrated that paper could be made from ground wood pulp. Wood was abundant and cheap, and for the first time paper became disposable enough for mass-circulation newspapers. Yet wood-pulp paper carried a hidden cost: it is chemically acidic and slowly breaks down over time, a fact that has since created a serious preservation problem for the world's libraries." }
      ],
      groups: [
        {
          input: "single", type: "True/False/Not Given",
          instructions: "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
          questions: [
            { n: 1, prompt: "Cai Lun was the inventor of writing in China.", answer: "FALSE", location: "A", justification: "Para A: writing was 'already ancient'; Cai Lun offered 'a new surface to write on', not writing itself." },
            { n: 2, prompt: "Before paper, the Chinese wrote on both bamboo and silk.", answer: "TRUE", location: "A", justification: "Para A: texts were recorded 'on strips of bamboo … or on silk'." },
            { n: 3, prompt: "Cai Lun's paper was more expensive to produce than silk.", answer: "FALSE", location: "B", justification: "Para B: the result was 'cheap, light and easy to produce'; silk was 'far too expensive' (Para A)." },
            { n: 4, prompt: "Baghdad had a paper mill before the year 800.", answer: "TRUE", location: "C", justification: "Para C: 'Baghdad had a working paper mill by the year 794'." },
            { n: 5, prompt: "Parchment was more durable than early paper.", answer: "NOT GIVEN", location: "D", justification: "Para D mentions Europe preferred parchment but makes no comparison of durability." },
            { n: 6, prompt: "Wood-pulp paper has caused difficulties for libraries.", answer: "TRUE", location: "F", justification: "Para F: acidic wood-pulp paper 'breaks down over time … a serious preservation problem for the world's libraries'." }
          ]
        },
        {
          input: "text", type: "Sentence completion",
          instructions: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          wordLimit: { words: 2, numbers: 0 },
          questions: [
            { n: 7, prompt: "Cai Lun worked as an ____ at the Chinese imperial court.", answer: ["official"], location: "A", justification: "Para A: 'Cai Lun, an official at the Chinese imperial court'." },
            { n: 8, prompt: "To make pulp, plant fibres were pounded with ____.", answer: ["water"], location: "B", justification: "Para B: fibres 'were pounded with water into a wet pulp'." },
            { n: 9, prompt: "In Europe, paper was long considered less suitable than ____ for official records.", answer: ["parchment"], location: "D", justification: "Para D: Europe 'continued to prefer parchment … for its most important official documents'." },
            { n: 10, prompt: "Early printed paper was made from cotton and ____ rags.", answer: ["linen"], location: "E", justification: "Para E: 'made from cotton and linen rags'." }
          ]
        },
        {
          input: "match", type: "Matching information", allowReuse: true,
          instructions: "Which paragraph contains the following information? You may use any letter more than once.",
          options: [
            { key: "A", text: "Paragraph A" }, { key: "B", text: "Paragraph B" }, { key: "C", text: "Paragraph C" },
            { key: "D", text: "Paragraph D" }, { key: "E", text: "Paragraph E" }, { key: "F", text: "Paragraph F" }
          ],
          questions: [
            { n: 11, prompt: "a step-by-step description of how paper is physically made", answer: "B", location: "B", justification: "Para B describes pounding fibres, draining on a screen, pressing and drying." },
            { n: 12, prompt: "reference to a modern problem of preservation", answer: "F", location: "F", justification: "Para F: the 'serious preservation problem for the world's libraries'." },
            { n: 13, prompt: "the effect of a new printing technology on demand", answer: "E", location: "E", justification: "Para E: Gutenberg's press meant 'the demand for a cheap writing surface exploded'." }
          ]
        }
      ]
    },

    /* -------- Passage 2: Biomimicry (Q14–26) -------- */
    {
      number: 2,
      title: "Biomimicry: Design Inspired by Nature",
      paragraphs: [
        { label: "A", text: "Biomimicry is the practice of solving human design problems by imitating the strategies that living things have evolved over millions of years. Although people have always borrowed ideas from nature, the term was popularised by the biologist Janine Benyus in her 1997 book, which reframed the natural world as a library of tested engineering solutions rather than a set of raw materials to be exploited." },
        { label: "B", text: "One of the most familiar examples came about almost by accident. In the 1940s the Swiss engineer George de Mestral returned from a walk in the countryside to find his clothes and his dog covered in burrs. Examining one under a microscope, he saw that its tiny hooks caught on the loops of fabric and fur. Years of experiment turned that observation into Velcro, a fastener now used everywhere from clothing to spacecraft." },
        { label: "C", text: "Sometimes the inspiration solves a very specific problem. Japan's Shinkansen bullet train was fast but noisy: each time it rushed out of a tunnel, a wall of compressed air produced a loud boom that disturbed nearby residents. Eiji Nakatsu, the engineer in charge and a keen birdwatcher, redesigned the train's nose to resemble the long, tapered beak of a kingfisher, a bird that dives into water with barely a splash. The new shape reduced the noise and, as a bonus, cut the train's energy use." },
        { label: "D", text: "Architecture has borrowed from nature too. The Eastgate Centre in Harare, Zimbabwe, was modelled on the mounds built by termites, which stay at a constant temperature despite the heat outside through a clever system of vents. The building uses a similar approach to circulate air, and as a result consumes a fraction of the energy that a conventional air-conditioned block of its size would require." },
        { label: "E", text: "Materials science offers some of the field's greatest prizes. Spider silk is, weight for weight, stronger than steel and tougher than the fibres used in bullet-proof vests, yet a spider produces it at room temperature from little more than digested insects. Laboratories around the world are racing to reproduce it, hoping for lightweight materials with medical and industrial uses, though a fully commercial version has proved stubbornly hard to achieve." },
        { label: "F", text: "Enthusiasts should be cautious, however. A solution that works for an organism evolved for that organism's particular circumstances, and it will not automatically transfer to a human context of different scale or purpose. Critics also warn that 'biomimicry' has become a fashionable label, sometimes attached to products as little more than marketing, with only a superficial connection to the biology it claims to imitate." },
        { label: "G", text: "Even so, the prospects for the field are considerable. As designers combine biological insight with advances in computing and manufacturing, biomimicry is increasingly promoted as a route to sustainability — a way of making things that, like nature itself, use little energy, waste almost nothing and cause no lasting harm. Its growing place in engineering education suggests it is more than a passing fashion." }
      ],
      groups: [
        {
          input: "match", type: "Matching headings", allowReuse: false,
          instructions: "The passage has seven paragraphs, A–G. Choose the correct heading for paragraphs B–G from the list of headings below. (Paragraph A has been done for you: heading i.)",
          options: [
            { key: "i", text: "A term made popular by one writer" },
            { key: "ii", text: "An accidental discovery on a country walk" },
            { key: "iii", text: "Copying a bird to reduce noise" },
            { key: "iv", text: "Cooling a building without machinery" },
            { key: "v", text: "A prize that materials scientists chase" },
            { key: "vi", text: "Reasons to be cautious" },
            { key: "vii", text: "Encouraging prospects ahead" },
            { key: "viii", text: "The economics of patents" },
            { key: "ix", text: "A transport project that failed" }
          ],
          questions: [
            { n: 14, prompt: "Paragraph B", answer: "ii", location: "B", justification: "Para B: de Mestral's burrs discovery 'almost by accident' after 'a walk in the countryside'." },
            { n: 15, prompt: "Paragraph C", answer: "iii", location: "C", justification: "Para C: the kingfisher-beak nose 'reduced the noise' of the train." },
            { n: 16, prompt: "Paragraph D", answer: "iv", location: "D", justification: "Para D: termite-inspired ventilation cools the Eastgate Centre with little energy." },
            { n: 17, prompt: "Paragraph E", answer: "v", location: "E", justification: "Para E: spider silk is 'some of the field's greatest prizes' for materials science." },
            { n: 18, prompt: "Paragraph F", answer: "vi", location: "F", justification: "Para F: 'Enthusiasts should be cautious'." },
            { n: 19, prompt: "Paragraph G", answer: "vii", location: "G", justification: "Para G: 'the prospects for the field are considerable'." }
          ]
        },
        {
          input: "single", type: "Multiple choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          options: [
            { key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }, { key: "D", text: "D" }
          ],
          questions: [
            { n: 20, prompt: "The nose of the Shinkansen was redesigned mainly in order to:", answer: "B",
              choices: ["make the train faster", "reduce a loud noise near tunnels", "lower the cost of tickets", "improve passenger safety"],
              location: "C", justification: "Para C: the boom on leaving tunnels 'disturbed nearby residents'; the new shape 'reduced the noise'." },
            { n: 21, prompt: "The Eastgate Centre is chiefly remarkable for:", answer: "B",
              choices: ["its unusual height", "how little energy it uses for cooling", "the termites living in it", "its Japanese designers"],
              location: "D", justification: "Para D: it 'consumes a fraction of the energy' of a conventional air-conditioned building." },
            { n: 22, prompt: "The writer suggests that the word 'biomimicry' is:", answer: "B",
              choices: ["always applied accurately", "sometimes used merely as marketing", "a term invented in the 1940s", "used only about buildings"],
              location: "F", justification: "Para F: the label is 'sometimes attached to products as little more than marketing'." }
          ]
        },
        {
          input: "single", type: "Multiple choice (choose TWO)", selectCount: 2,
          instructions: "Choose TWO letters, A–E. Which TWO of the following are described in the passage as examples of biomimicry?",
          options: [
            { key: "A", text: "Velcro fasteners" }, { key: "B", text: "the printing press" },
            { key: "C", text: "spider-silk materials" }, { key: "D", text: "solar panels" }, { key: "E", text: "wood-pulp paper" }
          ],
          questions: [
            { ns: [23, 24], prompt: "Two examples of biomimicry named in the passage", answer: ["A", "C"], location: "B",
              justification: "Velcro (Para B) and attempts to reproduce spider silk (Para E) are both given as examples; the others are not." }
          ]
        },
        {
          input: "text", type: "Summary completion",
          instructions: "Complete the summary below. Choose ONE WORD ONLY from the passage for each answer.",
          wordLimit: { words: 1, numbers: 0 },
          questions: [
            { n: 25, prompt: "Weight for weight, spider silk is stronger than ____.", answer: ["steel"], location: "E", justification: "Para E: spider silk is 'stronger than steel'." },
            { n: 26, prompt: "The engineer who redesigned the bullet train was a keen ____.", answer: ["birdwatcher"], location: "C", justification: "Para C: Eiji Nakatsu was 'a keen birdwatcher'." }
          ]
        }
      ]
    },

    /* -------- Passage 3: The Homework Debate (Q27–40) -------- */
    {
      number: 3,
      title: "Rethinking Homework",
      paragraphs: [
        { label: "A", text: "Few features of school life are as universal, or as unexamined, as homework. It is set almost by reflex, on the assumption that more practice must mean more learning. Yet when researchers look closely at the evidence, the picture that emerges is far messier than most parents and teachers assume, and it suggests that a great deal of the homework set in schools does little good and occasionally does harm." },
        { label: "B", text: "The clearest finding concerns age. Harris Cooper, whose reviews of the research are among the most widely cited, has repeatedly found that homework has almost no measurable effect on the grades of children in primary school. Only in the later years of secondary school does a consistent, though still modest, benefit appear. In other words, the younger the child, the weaker the case for sending work home — the very opposite of how homework is often defended." },
        { label: "C", text: "Some critics go further. Alfie Kohn argues that homework can actively damage children's attitude to learning, turning what should be an interest into a chore and eating into the free play and family time that young children need. Large international comparisons point the same way: an OECD study covering dozens of countries found that piling on ever more homework did not raise national results, and that some of the highest-performing systems set relatively little." },
        { label: "D", text: "None of this means homework is worthless. For older students it can consolidate difficult material and build the habits of independent study that university and work demand. The writer's argument is not that homework should be abolished, but that its amount should be governed by the student's age, and its content by a single question: does this task actually teach something? Short, purposeful tasks that a student can complete without a parent's help are worth far more than hours of repetitive exercises." },
        { label: "E", text: "There is a fairness dimension too. Homework quietly assumes that every child goes home to the same conditions — a quiet place to work, a reliable internet connection, and parents with the time and knowledge to help. In reality these resources vary enormously, so heavy homework can widen the gap between advantaged and disadvantaged pupils rather than narrowing it. Whatever else it is, the writer concludes, homework should never be mere busywork; if a task cannot justify the time it takes, it should not be set at all." }
      ],
      groups: [
        {
          input: "single", type: "Yes/No/Not Given",
          instructions: "Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.",
          questions: [
            { n: 27, prompt: "Homework brings clear benefits to children in primary school.", answer: "NO", location: "B", justification: "Para B: homework has 'almost no measurable effect on the grades of children in primary school'." },
            { n: 28, prompt: "The benefit of homework for older secondary students is large.", answer: "NO", location: "B", justification: "Para B: only 'a consistent, though still modest, benefit' appears in later secondary school." },
            { n: 29, prompt: "Homework can help older students prepare for university.", answer: "YES", location: "D", justification: "Para D: for older students it can 'build the habits of independent study that university and work demand'." },
            { n: 30, prompt: "Most parents would like homework to be abolished.", answer: "NOT GIVEN", location: "D", justification: "The passage never states parents' overall opinion of abolishing homework." },
            { n: 31, prompt: "The purpose of a task matters more than the number of exercises.", answer: "YES", location: "D", justification: "Para D: short purposeful tasks 'are worth far more than hours of repetitive exercises'." },
            { n: 32, prompt: "Heavy homework can increase the gap between richer and poorer pupils.", answer: "YES", location: "E", justification: "Para E: heavy homework 'can widen the gap between advantaged and disadvantaged pupils'." }
          ]
        },
        {
          input: "match", type: "Matching features", allowReuse: true,
          instructions: "Match each finding with the correct source. You may use any letter more than once.",
          options: [
            { key: "H", text: "Harris Cooper" }, { key: "K", text: "Alfie Kohn" }, { key: "O", text: "the OECD study" }
          ],
          questions: [
            { n: 33, prompt: "found little effect of homework on younger children's grades", answer: "H", location: "B", justification: "Para B: Cooper found 'almost no measurable effect … in primary school'." },
            { n: 34, prompt: "warns that homework can harm attitudes to learning", answer: "K", location: "C", justification: "Para C: Kohn 'argues that homework can actively damage children's attitude to learning'." },
            { n: 35, prompt: "reported that more homework did not raise national results", answer: "O", location: "C", justification: "Para C: the OECD study found more homework 'did not raise national results'." },
            { n: 36, prompt: "identified a modest benefit for older students", answer: "H", location: "B", justification: "Para B: Cooper found a 'modest, benefit' in later secondary school." }
          ]
        },
        {
          input: "text", type: "Short-answer questions",
          instructions: "Answer the questions below. Choose NO MORE THAN THREE WORDS from the passage for each answer.",
          wordLimit: { words: 3, numbers: 0 },
          questions: [
            { n: 37, prompt: "According to the writer, what should govern the amount of homework set?", answer: ["the student's age", "student's age", "age"], location: "D", justification: "Para D: 'its amount should be governed by the student's age'." },
            { n: 38, prompt: "What kind of tasks does the writer recommend?", answer: ["short purposeful tasks", "purposeful tasks", "short, purposeful tasks"], location: "D", justification: "Para D: 'Short, purposeful tasks … are worth far more'." },
            { n: 39, prompt: "Besides a quiet place and internet, what does homework assume pupils have at home?", answer: ["parents", "parents to help", "help from parents"], location: "E", justification: "Para E: it assumes 'parents with the time and knowledge to help'." },
            { n: 40, prompt: "What does the writer say homework should never be?", answer: ["mere busywork", "busywork"], location: "E", justification: "Para E: homework 'should never be mere busywork'." }
          ]
        }
      ]
    }
  ]
}

];

if (typeof module !== "undefined" && module.exports) { module.exports = READING_TESTS; }
