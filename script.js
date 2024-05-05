const topicWrapper = document.querySelector(".question-topic-wrapper");
const icon = topicWrapper.querySelector(".choice-icon");
const topicTitle = topicWrapper.querySelector(".choice-content")

const menuOpts = document.querySelectorAll(".menu [type=radio]");
let quizzes = [];
let questions = [];
let topic = {};

const dataPromise = fetch('/data.json');
dataPromise.then((request)=>{
  return request.json();
}).then ((data) => {
  return quizzes = data.quizzes;
})

function getTopic(topic) {
  return quizzes.find(quiz => quiz.title.toLowerCase() === topic);
}

menuOpts.forEach(menuOpt => {
  menuOpt.addEventListener("change", (e) => {
    document.querySelector(".menu").classList.add("hidden");

    topic = getTopic(e.target.value);
    icon.setAttribute("src", topic.icon);
    icon.parentElement.setAttribute("data-topic",`${topic.title.toLowerCase()}`);
    topicTitle.textContent = `${topic.title}`

    questions = topic.questions.shift();
    console.log(questions);

    questionContent.textContent = `${questions.question}`
    questions.options.forEach((option, index) => {
      answers[index].textContent = `${option}`;
    })
  })
})

const questionWapper = document.querySelector(".questions");
const answers = questionWapper.querySelectorAll(".choice-content");
const questionContent = questionWapper.querySelector("[data-question]");
const quizForm = questionWapper.querySelector(".quiz-form");
const btn = questionWapper.querySelector("[type=submit]")

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("hi");
  questions = topic.questions.shift();
  console.log(questions);

  questionContent.textContent = `${questions.question}`
  questions.options.forEach((option, index) => {
    answers[index].textContent = `${option}`;
  })
})