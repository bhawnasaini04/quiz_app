// ---------- 1. QUESTIONS (data) ----------
// Each question has: text, 4 options, and the index (0-3) of the correct option.
const questions = [
  { q: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "func", "define"], answer: 1 },
  { q: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language"], answer: 0 },
  { q: "Which CSS property changes the text color?",
    options: ["font-color", "text-style", "color", "background"], answer: 2 },
  { q: "Which symbol is used for comments in Python?",
    options: ["//", "#", "/* */", "<!-- -->"], answer: 1 },
  { q: "Which method adds an element to the end of an array in JavaScript?",
    options: ["push()", "pop()", "shift()", "add()"], answer: 0 },
  { q: "What is the output of: print(type([]))  in Python?",
    options: ["<class 'tuple'>", "<class 'dict'>", "<class 'list'>", "<class 'set'>"], answer: 2 },
  { q: "Which HTML tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"], answer: 1 },
  { q: "Which of these is NOT a JavaScript data type?",
    options: ["String", "Boolean", "Float", "Undefined"], answer: 2 },
  { q: "Which data structure works on the LIFO principle?",
    options: ["Queue", "Stack", "Array", "Linked list"], answer: 1 },
  { q: "Which SQL command is used to get data from a table?",
    options: ["GET", "FETCH", "SELECT", "OPEN"], answer: 2 }
];

// ---------- 2. GET HTML ELEMENTS ----------
const startScreen  = document.getElementById("start-screen");
const quizScreen   = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn   = document.getElementById("start-btn");
const nextBtn    = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");

const questionEl  = document.getElementById("question");
const optionsEl   = document.getElementById("options");
const feedbackEl  = document.getElementById("feedback");
const progressTxt = document.getElementById("progress-text");
const progressBar = document.getElementById("progress-bar");
const scoreTxt    = document.getElementById("score-text");
const finalScore  = document.getElementById("final-score");
const resultMsg   = document.getElementById("result-msg");

// ---------- 3. QUIZ STATE ----------
let currentIndex = 0;   // which question we are on
let score = 0;          // correct answers so far
let quizQuestions = []; // shuffled copy of questions

// Shuffle an array (Fisher-Yates)
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ---------- 4. FUNCTIONS ----------
function startQuiz() {
  quizQuestions = shuffle(questions);
  currentIndex = 0;
  score = 0;
  startScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
}

function showQuestion() {
  const current = quizQuestions[currentIndex];

  // reset UI from the previous question
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";
  nextBtn.classList.add("hidden");
  optionsEl.innerHTML = "";

  // text and progress
  questionEl.textContent = current.q;
  progressTxt.textContent = `Question ${currentIndex + 1} of ${quizQuestions.length}`;
  scoreTxt.textContent = `Score: ${score}`;
  progressBar.style.width = `${(currentIndex / quizQuestions.length) * 100}%`;

  // create one button per option
  current.options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = text;
    btn.addEventListener("click", () => selectAnswer(index));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  const correctIndex = quizQuestions[currentIndex].answer;
  const buttons = optionsEl.querySelectorAll(".option");

  // lock all options after one click
  buttons.forEach(btn => (btn.disabled = true));

  if (selectedIndex === correctIndex) {
    score++;
    buttons[selectedIndex].classList.add("correct");
    feedbackEl.textContent = "Correct!";
    feedbackEl.classList.add("ok");
  } else {
    buttons[selectedIndex].classList.add("wrong");
    buttons[correctIndex].classList.add("correct");
    feedbackEl.textContent = "Wrong. The correct answer is highlighted.";
    feedbackEl.classList.add("no");
  }

  scoreTxt.textContent = `Score: ${score}`;
  nextBtn.textContent =
    currentIndex === quizQuestions.length - 1 ? "See result" : "Next question";
  nextBtn.classList.remove("hidden");
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex < quizQuestions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

function showResult() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");
  progressBar.style.width = "100%";

  const total = quizQuestions.length;
  finalScore.textContent = `${score} / ${total}`;

  const percent = (score / total) * 100;
  if (percent >= 80) resultMsg.textContent = "Excellent. Your basics are strong.";
  else if (percent >= 50) resultMsg.textContent = "Good effort. Revise the missed topics and try again.";
  else resultMsg.textContent = "Keep practicing. Try again after revising the basics.";
}

// ---------- 5. EVENTS ----------
startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);