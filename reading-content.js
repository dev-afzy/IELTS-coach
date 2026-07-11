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
},

/* ==================================================================== TEST 2 */
{
  id: "test-2",
  title: "Academic Reading — Test 2",
  passages: [

    /* -------- Passage 1: The Domestication of the Horse (Q1–13) -------- */
    {
      number: 1,
      title: "The Domestication of the Horse",
      paragraphs: [
        { label: "A", text: "For most of human history the horse was simply prey. Herds of wild horses roamed the vast grasslands of the Eurasian steppe, and for thousands of years people hunted them for their meat and hides long before anyone thought to ride one. The horse was, in evolutionary terms, a very late addition to the list of domesticated animals, arriving well after the dog, the sheep and the cow." },
        { label: "B", text: "The oldest widely accepted evidence of taming comes from the Botai culture of northern Kazakhstan, dated to roughly 5,500 years ago. Three clues point to domestication: fatty residues left on broken pottery suggest the people were drinking mare's milk; distinctive wear on the horses' teeth matches the pressure of a bit; and chemical traces in the soil reveal the outlines of ancient corrals where animals were penned." },
        { label: "C", text: "Once harnessed, the horse transformed human society more profoundly than almost any other animal. Hitched to chariots and later ridden into battle by cavalry, it revolutionised the way wars were fought and won. Just as importantly, it collapsed distances: messages, goods and armies could now move at a speed that reshaped trade and the reach of empires." },
        { label: "D", text: "Because horses travelled with the people who kept them, their spread across Eurasia is closely tied to the movement of human populations. Many scholars link the rapid expansion of horse-riding groups to the spread of languages and technologies out of the steppe, though the precise connections remain the subject of energetic debate." },
        { label: "E", text: "Genetics has recently complicated the story. Analysis of ancient DNA shows that the Botai horses were not, in fact, the ancestors of the animals we ride today; that line appears to be the origin of the wild Przewalski's horse instead. Almost all modern domestic horses descend from a different lineage that spread explosively from the western steppe about 4,200 years ago, displacing others as it went." },
        { label: "F", text: "The horse's role has shifted again in modern times. The spread of railways and then the motor car ended its long career as a working animal, and today most horses are kept for sport and leisure rather than labour. Conservationists, meanwhile, work to protect the few genuinely wild populations that remain." }
      ],
      groups: [
        {
          input: "match", type: "Matching headings", allowReuse: false,
          instructions: "The passage has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.",
          options: [
            { key: "i", text: "From hunted animal to domestic servant" },
            { key: "ii", text: "The oldest signs of taming" },
            { key: "iii", text: "A revolution in fighting and movement" },
            { key: "iv", text: "Travelling alongside human migrations" },
            { key: "v", text: "Evidence hidden in the genes" },
            { key: "vi", text: "New purposes in the modern world" },
            { key: "vii", text: "The anatomy of the horse" },
            { key: "viii", text: "Breeding purely for speed" },
            { key: "ix", text: "The economics of horse racing" }
          ],
          questions: [
            { n: 1, prompt: "Paragraph A", answer: "i", location: "A", justification: "Para A: the horse moved from being 'simply prey' to a domesticated animal." },
            { n: 2, prompt: "Paragraph B", answer: "ii", location: "B", justification: "Para B: 'The oldest widely accepted evidence of taming'." },
            { n: 3, prompt: "Paragraph C", answer: "iii", location: "C", justification: "Para C: it 'revolutionised the way wars were fought' and 'collapsed distances'." },
            { n: 4, prompt: "Paragraph D", answer: "iv", location: "D", justification: "Para D: horses' spread is 'closely tied to the movement of human populations'." },
            { n: 5, prompt: "Paragraph E", answer: "v", location: "E", justification: "Para E: 'Analysis of ancient DNA' rewrote the ancestry of modern horses." },
            { n: 6, prompt: "Paragraph F", answer: "vi", location: "F", justification: "Para F: 'The horse's role has shifted again in modern times.'" }
          ]
        },
        {
          input: "single", type: "True/False/Not Given",
          instructions: "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
          questions: [
            { n: 7, prompt: "People ate horses before they rode them.", answer: "TRUE", location: "A", justification: "Para A: people 'hunted them for their meat … long before anyone thought to ride one'." },
            { n: 8, prompt: "The Botai people left written descriptions of how they kept horses.", answer: "NOT GIVEN", location: "B", justification: "Para B lists only archaeological evidence; writing is never mentioned." },
            { n: 9, prompt: "The horse changed the way wars were conducted.", answer: "TRUE", location: "C", justification: "Para C: it 'revolutionised the way wars were fought and won'." },
            { n: 10, prompt: "Most horses alive today are descended from the Botai horses.", answer: "FALSE", location: "E", justification: "Para E: Botai horses 'were not … the ancestors of the animals we ride today'." }
          ]
        },
        {
          input: "text", type: "Note completion",
          instructions: "Complete the notes below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          wordLimit: { words: 2, numbers: 0 },
          questions: [
            { n: 11, prompt: "Evidence at Botai — residue on pottery from drinking mare's ____", answer: ["milk"], location: "B", justification: "Para B: residues suggest 'drinking mare's milk'." },
            { n: 12, prompt: "Evidence at Botai — tooth wear caused by a ____", answer: ["bit"], location: "B", justification: "Para B: tooth wear 'matches the pressure of a bit'." },
            { n: 13, prompt: "Evidence at Botai — soil marking the outlines of ancient ____", answer: ["corrals"], location: "B", justification: "Para B: soil reveals 'the outlines of ancient corrals'." }
          ]
        }
      ]
    },

    /* -------- Passage 2: The Body Clock (Q14–26) -------- */
    {
      number: 2,
      title: "The Body Clock",
      paragraphs: [
        { label: "A", text: "Almost every living thing keeps time. In humans, an internal clock running on a cycle of roughly twenty-four hours governs when we feel alert and when we feel sleepy. This clock is coordinated by a small cluster of cells in the brain known as the suprachiasmatic nucleus, or SCN, which is reset each day by the light entering our eyes." },
        { label: "B", text: "The clock does much of its work through hormones. As darkness falls, the brain releases melatonin, a chemical signal that prepares the body for sleep. This system evolved under natural skies, and it is easily fooled: the bright light of screens and lamps in the evening suppresses melatonin and pushes the whole cycle later, which is one reason that late-night phone use can make falling asleep so difficult." },
        { label: "C", text: "People are not all the same. Our genes give each of us a natural preference, or chronotype: some are 'larks' who wake and work best early, while others are 'owls' who come alive in the evening. Because school and office hours are built around early starts, they tend to suit larks, leaving owls to struggle through mornings that fight against their biology." },
        { label: "D", text: "When the clock is disrupted, the effects reach well beyond tiredness. Shift workers and long-distance travellers, whose schedules clash with their internal time, suffer more than mere fatigue: research has linked chronic disruption, along with the jet lag that follows rapid travel across time zones, to a range of metabolic and mood problems." },
        { label: "E", text: "Sleep is not idle time. During the night the brain consolidates the day's memories, and a network known as the glymphatic system becomes active, flushing out waste products that build up between brain cells while we are awake. Far from switching off, the sleeping brain is doing essential housekeeping." },
        { label: "F", text: "Understanding the clock points to practical remedies. Getting bright light early in the day and dimming it at night helps keep the cycle on track, as does a consistent sleep schedule. Some schools that pushed their start times later, in line with the biology of teenagers, have reported better attendance and results — a small change working with the clock rather than against it." }
      ],
      groups: [
        {
          input: "match", type: "Summary completion (from a list)", allowReuse: false,
          instructions: "Complete the summary using the list of words, A–G, below.",
          options: [
            { key: "A", text: "SCN" }, { key: "B", text: "light" }, { key: "C", text: "melatonin" },
            { key: "D", text: "owls" }, { key: "E", text: "larks" }, { key: "F", text: "metabolism" }, { key: "G", text: "memory" }
          ],
          questions: [
            { n: 14, prompt: "The body's clock is coordinated by a region of the brain called the (14)____,", answer: "A", location: "A", justification: "Para A: coordinated by 'the suprachiasmatic nucleus, or SCN'." },
            { n: 15, prompt: "which is reset each day by (15)____.", answer: "B", location: "A", justification: "Para A: the SCN 'is reset each day by the light'." },
            { n: 16, prompt: "As night falls the brain releases (16)____ to prepare for sleep.", answer: "C", location: "B", justification: "Para B: 'the brain releases melatonin'." },
            { n: 17, prompt: "People who prefer the evening are called (17)____,", answer: "D", location: "C", justification: "Para C: evening people are 'owls'." },
            { n: 18, prompt: "while morning people are called (18)____.", answer: "E", location: "C", justification: "Para C: early people are 'larks'." }
          ]
        },
        {
          input: "single", type: "Multiple choice",
          instructions: "Choose the correct letter, A, B, C or D.",
          options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }, { key: "D", text: "D" }],
          questions: [
            { n: 19, prompt: "Melatonin is released mainly:", answer: "B",
              choices: ["at midday", "when it is dark", "during exercise", "after eating"],
              location: "B", justification: "Para B: 'As darkness falls, the brain releases melatonin'." },
            { n: 20, prompt: "Standard school and office hours tend to suit:", answer: "A",
              choices: ["larks", "owls", "shift workers", "travellers"],
              location: "C", justification: "Para C: early hours 'tend to suit larks'." },
            { n: 21, prompt: "The glymphatic system is described as:", answer: "C",
              choices: ["storing memories", "producing melatonin", "removing waste from the brain", "controlling body temperature"],
              location: "E", justification: "Para E: it is 'flushing out waste products' in the brain." }
          ]
        },
        {
          input: "single", type: "Multiple choice (choose TWO)", selectCount: 2,
          instructions: "Choose TWO letters, A–E. Which TWO problems does the passage link to a disrupted body clock?",
          options: [
            { key: "A", text: "difficulties for shift workers" }, { key: "B", text: "improved memory" },
            { key: "C", text: "the effects of jet lag" }, { key: "D", text: "increased height" }, { key: "E", text: "better mood" }
          ],
          questions: [
            { ns: [22, 23], prompt: "Two consequences of a disrupted body clock", answer: ["A", "C"], location: "D",
              justification: "Para D links problems for 'shift workers' and 'the jet lag' of travel to disruption; the others are not." }
          ]
        },
        {
          input: "single", type: "Yes/No/Not Given",
          instructions: "Do the following statements agree with the claims of the writer? Write YES, NO or NOT GIVEN.",
          questions: [
            { n: 24, prompt: "Using screens at night can make it harder to fall asleep.", answer: "YES", location: "B", justification: "Para B: evening screen light suppresses melatonin, so 'late-night phone use can make falling asleep so difficult'." },
            { n: 25, prompt: "A person's chronotype is decided entirely by their habits.", answer: "NO", location: "C", justification: "Para C: 'Our genes give each of us a natural preference' — it is not purely habit." },
            { n: 26, prompt: "Later school start times have generally produced worse results.", answer: "NO", location: "F", justification: "Para F: schools with later starts 'reported better attendance and results'." }
          ]
        }
      ]
    },

    /* -------- Passage 3: Green Roofs (Q27–40) -------- */
    {
      number: 3,
      title: "The Return of the Green Roof",
      paragraphs: [
        { label: "A", text: "A green roof is a roof that is deliberately covered with living plants, grown in a layer of soil above a waterproof membrane that protects the building beneath. The idea is far from new — turf roofs kept Scandinavian houses warm for centuries — but the modern engineered version was revived and refined in Germany in the late twentieth century, from where it has spread to cities around the world." },
        { label: "B", text: "The most immediate benefit is what a green roof does with rain. Ordinary roofs shed water instantly into drains, overwhelming them during storms, whereas a planted roof soaks up a large share of the rainfall and releases the rest slowly. In dense cities where hard surfaces dominate, this reduces the risk of the flash flooding that follows heavy downpours." },
        { label: "C", text: "There is a thermal benefit as well. The soil and plants insulate the building, cutting the energy needed to heat it in winter and cool it in summer. On a larger scale, replacing dark, heat-absorbing roofs with vegetation across a district lowers the surrounding air temperature and eases the urban heat-island effect that makes cities noticeably hotter than the countryside around them." },
        { label: "D", text: "Green roofs bring life back to the city, too. They offer habitat for insects, birds and other wildlife that would otherwise find little foothold in a built-up area, and they give residents access to green space in places where ground-level land is scarce and expensive — a view of plants rather than asphalt that has measurable benefits for wellbeing." },
        { label: "E", text: "None of this is free. A green roof is considerably heavier than a bare one, so the building must be strong enough to bear it, and the higher upfront cost of construction and the need for ongoing maintenance put some owners off. Not every roof is suitable. To overcome this reluctance, a number of cities now encourage green roofs through financial incentives or, in some cases, building regulations that require them on new developments." }
      ],
      groups: [
        {
          input: "match", type: "Matching sentence endings", allowReuse: false,
          instructions: "Complete each sentence with the correct ending, A–G, from the box below.",
          options: [
            { key: "A", text: "absorbs much of the rain and releases the rest slowly." },
            { key: "B", text: "lowers the energy needed to heat and cool the building." },
            { key: "C", text: "provides a habitat for insects and birds." },
            { key: "D", text: "is heavier and more expensive to build." },
            { key: "E", text: "was revived and refined in Germany." },
            { key: "F", text: "removes the need for any maintenance." },
            { key: "G", text: "is now required by law in every city." }
          ],
          questions: [
            { n: 27, prompt: "The modern engineered green roof", answer: "E", location: "A", justification: "Para A: the modern version 'was revived and refined in Germany'." },
            { n: 28, prompt: "During a storm, a green roof", answer: "A", location: "B", justification: "Para B: it 'soaks up a large share of the rainfall and releases the rest slowly'." },
            { n: 29, prompt: "By insulating the building, a green roof", answer: "B", location: "C", justification: "Para C: it cuts 'the energy needed to heat it in winter and cool it in summer'." },
            { n: 30, prompt: "For urban wildlife, a green roof", answer: "C", location: "D", justification: "Para D: it offers 'habitat for insects, birds and other wildlife'." },
            { n: 31, prompt: "Compared with an ordinary roof, a green roof", answer: "D", location: "E", justification: "Para E: it is 'considerably heavier' with a 'higher upfront cost'." }
          ]
        },
        {
          input: "text", type: "Sentence completion",
          instructions: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.",
          wordLimit: { words: 2, numbers: 0 },
          questions: [
            { n: 32, prompt: "The plants of a green roof grow in soil laid above a waterproof ____.", answer: ["membrane"], location: "A", justification: "Para A: soil sits 'above a waterproof membrane'." },
            { n: 33, prompt: "By holding back rainwater, green roofs reduce the risk of flash ____.", answer: ["flooding"], location: "B", justification: "Para B: this 'reduces the risk of the flash flooding'." },
            { n: 34, prompt: "Across a district, vegetation eases the urban ____ effect.", answer: ["heat-island", "heat island"], location: "C", justification: "Para C: it 'eases the urban heat-island effect'." },
            { n: 35, prompt: "Green roofs give city residents access to valuable ____ space.", answer: ["green"], location: "D", justification: "Para D: they give 'access to green space'." },
            { n: 36, prompt: "One drawback is the higher ____ cost of construction.", answer: ["upfront"], location: "E", justification: "Para E: 'the higher upfront cost of construction'." }
          ]
        },
        {
          input: "single", type: "True/False/Not Given",
          instructions: "Do the following statements agree with the information given in the passage? Write TRUE, FALSE or NOT GIVEN.",
          questions: [
            { n: 37, prompt: "Green roofs are an entirely modern invention.", answer: "FALSE", location: "A", justification: "Para A: 'far from new — turf roofs kept Scandinavian houses warm for centuries'." },
            { n: 38, prompt: "A green roof can reduce a building's energy use.", answer: "TRUE", location: "C", justification: "Para C: it cuts the energy needed to heat and cool the building." },
            { n: 39, prompt: "Every roof is suitable for conversion to a green roof.", answer: "FALSE", location: "E", justification: "Para E: 'Not every roof is suitable.'" },
            { n: 40, prompt: "Some cities use incentives or regulations to promote green roofs.", answer: "TRUE", location: "E", justification: "Para E: cities encourage them 'through financial incentives or … building regulations'." }
          ]
        }
      ]
    }
  ]
}

];

if (typeof module !== "undefined" && module.exports) { module.exports = READING_TESTS; }
