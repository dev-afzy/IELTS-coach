/* listening-content.js — IELTS Listening question bank.
 *
 * Classic script: defines the global `LISTENING_TESTS`, loaded by listening.html via
 * <script src>. All scripts are ORIGINAL, written for TTS practice.
 *
 * Authoring conventions (pinned — see the design spec):
 *   - Spelled names: letters separated by period-space  ->  "B. R. A. D. F. O. R. D."
 *   - Read-out numbers: digits as words                 ->  "three hundred and twenty"
 *   - A `text` answer whose spoken form differs from its written form carries `spokenAs`
 *     (the spoken string), so the content lint checks the transcript against what is heard.
 *   - Every `text` answer variant must occur verbatim (post-normalize) in its part's script.
 *
 * Question numbers run 1..40 across the four parts (1-10 / 11-20 / 21-30 / 31-40).
 * Run the lint (listening.html?selftest=1 or the Node harness) after editing.
 */

var LISTENING_TESTS = [

{
  id: "listening-1",
  title: "Listening — Test 1",
  parts: [

    /* ---------------- PART 1 (Q1-10): phone booking, form completion ---------------- */
    {
      part: 1,
      context: "A telephone conversation between a holiday-letting agent and a caller.",
      script: [
        { speaker: "narrator", text: "Section 1. You will hear a telephone conversation between a woman at a holiday cottage agency and a man who wants to make a booking. First, you have some time to look at questions 1 to 10." },
        { pause: 30 },
        { speaker: "woman", text: "Good afternoon, Meadow Cottages, how can I help you?" },
        { speaker: "man", text: "Hello. I'd like to book one of your holiday cottages, please." },
        { speaker: "woman", text: "Of course. Could I take your surname?" },
        { speaker: "man", text: "Yes, it's Bradford. That's B. R. A. D. F. O. R. D." },
        { speaker: "woman", text: "Thank you, Mr Bradford. And how many nights would you like to stay?" },
        { speaker: "man", text: "We'd like to stay for four nights, please." },
        { speaker: "woman", text: "Lovely. We have two cottages free that week: the Meadow cottage and the Garden cottage. The Garden cottage is a little larger." },
        { speaker: "man", text: "The Garden cottage sounds perfect for us." },
        { speaker: "woman", text: "Great choice. And which month were you thinking of?" },
        { speaker: "man", text: "We were hoping for September, if it's available." },
        { speaker: "woman", text: "September is fine. For four nights in the Garden cottage, that comes to three hundred and twenty pounds in total." },
        { speaker: "man", text: "That's within our budget, that's fine." },
        { speaker: "woman", text: "I should also mention that breakfast is included in the price each morning." },
        { speaker: "man", text: "Oh, that's a lovely touch. One more thing — can we bring our pet?" },
        { speaker: "woman", text: "You can bring one dog, but no other animals, I'm afraid." },
        { speaker: "man", text: "Just the one dog, so that's no problem. Is the cottage far from town?" },
        { speaker: "woman", text: "Not at all. The nearest town is Ashford, only about ten minutes away by car." },
        { speaker: "man", text: "That's handy. And how do I secure the booking?" },
        { speaker: "woman", text: "We ask for a deposit of fifty pounds to hold the dates for you." },
        { speaker: "man", text: "And how would you like me to pay the deposit?" },
        { speaker: "woman", text: "You can pay by card over the phone right now, if that suits you." },
        { speaker: "man", text: "Perfect. Let me just find my card." },
        { speaker: "narrator", text: "That is the end of Section 1." }
      ],
      groups: [
        {
          input: "text", type: "Form completion",
          instructions: "Complete the booking form below. Write ONE WORD OR A NUMBER for each answer.",
          wordLimit: { words: 1, numbers: 1 },
          questions: [
            { n: 1, prompt: "Surname:", answer: ["Bradford"], spokenAs: "B. R. A. D. F. O. R. D.", justification: "The caller spells his surname: 'B. R. A. D. F. O. R. D.'" },
            { n: 2, prompt: "Number of nights:", answer: ["four"], justification: "'We'd like to stay for four nights.'" },
            { n: 3, prompt: "Cottage chosen: the ____ cottage", answer: ["Garden"], justification: "'The Garden cottage sounds perfect.'" },
            { n: 4, prompt: "Month of stay:", answer: ["September"], justification: "'We were hoping for September.'" },
            { n: 5, prompt: "Total price: £____", answer: ["320"], spokenAs: "three hundred and twenty", justification: "'that comes to three hundred and twenty pounds'." },
            { n: 6, prompt: "Included each morning:", answer: ["breakfast"], justification: "'breakfast is included in the price each morning'." },
            { n: 7, prompt: "Pet allowed: one ____", answer: ["dog"], justification: "'You can bring one dog.'" },
            { n: 8, prompt: "Nearest town:", answer: ["Ashford"], justification: "'The nearest town is Ashford.'" },
            { n: 9, prompt: "Deposit required: £____", answer: ["50"], spokenAs: "fifty", justification: "'a deposit of fifty pounds'." },
            { n: 10, prompt: "Payment method:", answer: ["card"], justification: "'You can pay by card over the phone.'" }
          ]
        }
      ]
    },

    /* ---------------- PART 2 (Q11-20): leisure-centre guide, MCQ + matching ---------------- */
    {
      part: 2,
      context: "A guide describes a new leisure centre and its class timetable.",
      script: [
        { speaker: "narrator", text: "Section 2. You will hear a guide talking to visitors at a new leisure centre. First, you have some time to look at questions 11 to 14." },
        { pause: 30 },
        { speaker: "woman", text: "Welcome, everyone, to the Riverside Leisure Centre. We're really proud of this building, which we opened just last month, so everything you see is brand new." },
        { speaker: "woman", text: "We have a swimming pool, a fully equipped gym, and a climbing wall. By far the most popular with our members so far has been the climbing wall — people queue for it every evening." },
        { speaker: "woman", text: "Joining us is very affordable: monthly membership is forty pounds, which gives you unlimited access to everything. And I'm often asked about parking — parking here is free for everyone, members and visitors alike." },
        { speaker: "narrator", text: "Now look at questions 15 to 20." },
        { pause: 30 },
        { speaker: "woman", text: "Let me run through our class timetable. Our gentle yoga class runs on Monday mornings, which is a lovely way to start the week. Spinning, our indoor cycling class, is on Wednesday evenings." },
        { speaker: "woman", text: "Pilates is held on Saturday mornings, when we have more space. Boxing is also on Monday, but in the evenings. Our popular swimming lessons for adults are on Wednesday afternoons, and finally our dance class takes place on Saturday afternoons." },
        { speaker: "narrator", text: "That is the end of Section 2." }
      ],
      groups: [
        {
          input: "single", type: "Multiple choice",
          instructions: "Choose the correct letter, A, B or C.",
          options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }],
          questions: [
            { n: 11, prompt: "The leisure centre opened:", answer: "A", choices: ["last month", "last year", "two years ago"], justification: "'we opened just last month'." },
            { n: 12, prompt: "The most popular facility is:", answer: "C", choices: ["the pool", "the gym", "the climbing wall"], justification: "'By far the most popular … has been the climbing wall.'" },
            { n: 13, prompt: "Monthly membership costs:", answer: "B", choices: ["£30", "£40", "£50"], justification: "'monthly membership is forty pounds'." },
            { n: 14, prompt: "Parking is:", answer: "A", choices: ["free for everyone", "half price for members", "not available"], justification: "'parking here is free for everyone'." }
          ]
        },
        {
          input: "match", type: "Matching", allowReuse: true,
          instructions: "On which day does each class take place? Choose A, B or C. You may use any letter more than once.",
          options: [{ key: "A", text: "Monday" }, { key: "B", text: "Wednesday" }, { key: "C", text: "Saturday" }],
          questions: [
            { n: 15, prompt: "Yoga", answer: "A", justification: "'yoga class runs on Monday mornings'." },
            { n: 16, prompt: "Spinning", answer: "B", justification: "'Spinning … is on Wednesday evenings'." },
            { n: 17, prompt: "Pilates", answer: "C", justification: "'Pilates is held on Saturday mornings'." },
            { n: 18, prompt: "Boxing", answer: "A", justification: "'Boxing is also on Monday, but in the evenings'." },
            { n: 19, prompt: "Swimming lessons", answer: "B", justification: "'swimming lessons for adults are on Wednesday afternoons'." },
            { n: 20, prompt: "Dance", answer: "C", justification: "'dance class takes place on Saturday afternoons'." }
          ]
        }
      ]
    },

    /* ---------------- PART 3 (Q21-30): student discussion, MCQ + matching ---------------- */
    {
      part: 3,
      context: "Two students and their tutor discuss a geography field-study project.",
      script: [
        { speaker: "narrator", text: "Section 3. You will hear two students, Tom and Sara, discussing their geography project with their tutor. First, you have some time to look at questions 21 to 25." },
        { pause: 30 },
        { speaker: "man2", text: "So, Tom and Sara, how is the river project coming along?" },
        { speaker: "man", text: "Quite well, but we've had to change our topic. We originally wanted to study pollution, but there wasn't enough recent data, so we've switched to looking at flooding instead." },
        { speaker: "man2", text: "That's a sensible change. What method are you using to collect your information?" },
        { speaker: "woman", text: "We decided that interviews with local residents would give us the richest picture, rather than a questionnaire. People remember the floods vividly." },
        { speaker: "man2", text: "Good. And what has surprised you most so far?" },
        { speaker: "man", text: "Honestly, how willing people were to talk to us. We expected it to be difficult, but everyone was very welcoming." },
        { speaker: "man2", text: "And what do you think is the main cause of the flooding?" },
        { speaker: "woman", text: "At first we assumed it was heavy rainfall, but actually the evidence points to new building on the floodplain as the biggest factor." },
        { speaker: "man2", text: "Excellent analysis. When is the report due?" },
        { speaker: "man", text: "We need to submit it in March, so we still have a few weeks." },
        { speaker: "narrator", text: "Now look at questions 26 to 30." },
        { pause: 30 },
        { speaker: "man2", text: "Let's make sure you've divided the work sensibly. Who is doing what?" },
        { speaker: "woman", text: "I'm writing the introduction, and Tom is doing the maps." },
        { speaker: "man", text: "Right, the maps are mine. Sara is also analysing the interview data, since she's better with statistics." },
        { speaker: "woman", text: "And Tom is taking the photographs down at the river. We're going to write the conclusion together, though." },
        { speaker: "man", text: "Yes, the conclusion is a joint effort. Oh, and Sara's handling the references as well." },
        { speaker: "narrator", text: "That is the end of Section 3." }
      ],
      groups: [
        {
          input: "single", type: "Multiple choice",
          instructions: "Choose the correct letter, A, B or C.",
          options: [{ key: "A", text: "A" }, { key: "B", text: "B" }, { key: "C", text: "C" }],
          questions: [
            { n: 21, prompt: "The students changed their topic to:", answer: "C", choices: ["pollution", "wildlife", "flooding"], justification: "'we've switched to looking at flooding instead'." },
            { n: 22, prompt: "They are collecting information by:", answer: "B", choices: ["a questionnaire", "interviews", "laboratory tests"], justification: "'interviews with local residents … rather than a questionnaire'." },
            { n: 23, prompt: "What surprised them most was:", answer: "A", choices: ["how willing people were to talk", "how little data existed", "how long it took"], justification: "'how willing people were to talk to us'." },
            { n: 24, prompt: "They conclude the main cause of flooding is:", answer: "C", choices: ["heavy rainfall", "blocked drains", "building on the floodplain"], justification: "'new building on the floodplain as the biggest factor'." },
            { n: 25, prompt: "The report must be submitted in:", answer: "B", choices: ["January", "March", "May"], justification: "'We need to submit it in March.'" }
          ]
        },
        {
          input: "match", type: "Matching", allowReuse: true,
          instructions: "Who is responsible for each task? Choose A, B or C. You may use any letter more than once.",
          options: [{ key: "A", text: "Tom" }, { key: "B", text: "Sara" }, { key: "C", text: "both students" }],
          questions: [
            { n: 26, prompt: "the introduction", answer: "B", justification: "'I'm writing the introduction' — Sara." },
            { n: 27, prompt: "the maps", answer: "A", justification: "'the maps are mine' — Tom." },
            { n: 28, prompt: "analysing the interview data", answer: "B", justification: "'Sara is also analysing the interview data'." },
            { n: 29, prompt: "the photographs", answer: "A", justification: "'Tom is taking the photographs'." },
            { n: 30, prompt: "the conclusion", answer: "C", justification: "'We're going to write the conclusion together' — both." }
          ]
        }
      ]
    },

    /* ---------------- PART 4 (Q31-40): lecture, note completion ---------------- */
    {
      part: 4,
      context: "A lecture on the benefits and challenges of urban trees.",
      script: [
        { speaker: "narrator", text: "Section 4. You will hear part of a lecture about trees in cities. First, you have some time to look at questions 31 to 40." },
        { pause: 30 },
        { speaker: "man", text: "Good morning. Today I want to talk about urban trees, because trees in cities do far more than simply look attractive." },
        { speaker: "man", text: "Let's start with the benefits. First, trees cool the air around them through a process called transpiration, in which water evaporates from their leaves. On a hot day, a street lined with trees can be several degrees cooler than a bare one." },
        { speaker: "man", text: "Second, their leaves trap tiny particles of pollution, cleaning the air we breathe. Third, and perhaps more surprisingly, spending time near trees has been linked to lower levels of stress, which is a real benefit for mental health in busy cities." },
        { speaker: "man", text: "Trees also provide a habitat for birds and insects that would otherwise struggle in a built-up area, and in the hot months they give us valuable shade." },
        { speaker: "man", text: "Of course, urban trees are not without their challenges. Their roots can damage pavements, which is expensive for councils to repair. And the ongoing cost of maintenance — pruning, inspecting and occasionally removing trees — is considerable." },
        { speaker: "man", text: "So how should cities respond? The research is clear on a few points. The best time to plant a new tree is in autumn, when the soil is still warm but the weather is cooler. Young trees then need regular watering during their first few dry spells to survive." },
        { speaker: "man", text: "And wherever possible, planners should choose native species, which are already adapted to the local climate and support far more local wildlife than imported ones. Get these things right, and our cities will be greener, cooler and healthier places to live." },
        { speaker: "narrator", text: "That is the end of Section 4, and the end of the recording." }
      ],
      groups: [
        {
          input: "text", type: "Note completion",
          instructions: "Complete the notes below. Write ONE WORD ONLY for each answer.",
          wordLimit: { words: 1, numbers: 0 },
          questions: [
            { n: 31, prompt: "Trees cool the air through a process called ____.", answer: ["transpiration"], justification: "'a process called transpiration'." },
            { n: 32, prompt: "Their leaves trap particles of ____.", answer: ["pollution"], justification: "'leaves trap tiny particles of pollution'." },
            { n: 33, prompt: "Being near trees is linked to lower levels of ____.", answer: ["stress"], justification: "'linked to lower levels of stress'." },
            { n: 34, prompt: "Trees provide a ____ for birds and insects.", answer: ["habitat"], justification: "'provide a habitat for birds and insects'." },
            { n: 35, prompt: "In hot months, trees give valuable ____.", answer: ["shade"], justification: "'they give us valuable shade'." },
            { n: 36, prompt: "A drawback: roots can damage ____.", answer: ["pavements"], justification: "'Their roots can damage pavements'." },
            { n: 37, prompt: "Another challenge is the cost of ____.", answer: ["maintenance"], justification: "'the ongoing cost of maintenance'." },
            { n: 38, prompt: "The best time to plant a tree is in ____.", answer: ["autumn"], justification: "'The best time to plant a new tree is in autumn'." },
            { n: 39, prompt: "Young trees need regular ____ in dry spells.", answer: ["watering"], justification: "'need regular watering during their first few dry spells'." },
            { n: 40, prompt: "Planners should choose ____ species.", answer: ["native"], justification: "'planners should choose native species'." }
          ]
        }
      ]
    }
  ]
}

];

if (typeof module !== "undefined" && module.exports) { module.exports = LISTENING_TESTS; }
