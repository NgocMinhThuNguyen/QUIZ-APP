const header = document.querySelector(".header-icon");
const headerIcon = header.querySelector(".icon");
const headerTopic = header.querySelector(".header-topic");

const menu = document.querySelector(".menu");
const topics = menu.querySelectorAll("[type=radio]");

const questionsWrapper = document.querySelector(".questions");
const questionIndex = questionsWrapper.querySelector("[data-index]");
const questionDetail = questionsWrapper.querySelector("[data-question]");
const choicesDetail = questionsWrapper.querySelectorAll(".radio-content");
const error = questionsWrapper.querySelector(".error");

const quizForm = document.querySelector(".quiz-questions-form");
const buttons = quizForm.querySelectorAll(".btn")

const resultSummary = document.querySelector(".quiz-complete-wrapper");
const resultIcon = resultSummary.querySelector(".icon");
const resultTopic = resultSummary.querySelector(".result-topic");
const score = resultSummary.querySelector("[data-score]");
const replayBtn = resultSummary.querySelector(".replay-btn");

let quizz = {
  title: "",
  icon: "",
  questions: [],
  correctIndex: 0,
  numberCorrect: 0,
};

let count = 0;

function addHidden(element) {
  element.setAttribute("hidden", null);
}

function removeHidden(element) {
  element.removeAttribute("hidden");
}

function toggleBtn(button) {
  button.toggleAttribute("hidden");  // show/hide submit/next question btn
}

function resetStyle(attribute) {
  const attributeCheck = questionsWrapper.querySelector(`[${attribute}]`);
  (attributeCheck) ? attributeCheck.removeAttribute(`${attribute}`): null
}

async function fetchData(topic) {
  const response = await fetch('/data.json');
  const data = await response.json();
  const quizTopic = data.quizzes.find(quiz => quiz.title.toLowerCase() === topic);
  quizz.title = quizTopic.title;
  quizz.icon = quizTopic.icon;
  quizz.questions = quizTopic.questions;
  return quizTopic;
}

function loadIcon(wrapper, wrapperIcon, wrapperContent) {
  (wrapper) ?  wrapper.removeAttribute("hidden") : null;
  wrapperIcon.setAttribute("src", `${quizz.icon}`);
  wrapperIcon.setAttribute("alt", `${quizz.title}`);
  wrapperIcon.parentElement.setAttribute("data-topic", `${quizz.title.toLocaleLowerCase()}`); // for styling
  wrapperContent.textContent = `${quizz.title}`;
}

function resetIcon(wrapper, wrapperIcon, wrapperContent) {
  (wrapper) ?  wrapper.setAttribute("hidden", "") : null;
  wrapperIcon.setAttribute("src", `#`);
  wrapperIcon.setAttribute("alt", "");
  wrapperIcon.parentElement.setAttribute("data-topic", ""); // styling
  wrapperContent.textContent = "";
}

function loadQuestions() {
  const currentQuestion = quizz.questions[count]
  questionDetail.textContent = `${currentQuestion.question}`;
  choicesDetail.forEach((choiceDetail, index) => {
    choiceDetail.textContent = `${currentQuestion.options[index]}` // retrieve choices detail
  });
  quizz.correctIndex = currentQuestion.options.indexOf(currentQuestion.answer);
  count += 1;
  questionIndex.textContent = `${count}`;
}

function checkAnswer(userAnswer, correctIndex) {
  if (parseInt(userAnswer.dataset.choice) === correctIndex) {
    userAnswer.setAttribute("data-check", "true");
    quizz.numberCorrect += 1;
  } else {
    questionsWrapper.querySelector(`[data-choice="${correctIndex}"]`).setAttribute("data-correct", "true");
    userAnswer.setAttribute("data-check", "false");
  }
}

function displayResult() {
  addHidden(questionsWrapper);
  removeHidden(resultSummary);
  loadIcon(null, resultIcon, resultTopic);

  score.textContent = quizz.numberCorrect;
}

topics.forEach((topic) => {
  topic.addEventListener("change", (e) => {
    addHidden(menu);
    removeHidden(questionsWrapper);
    fetchData(e.target.value)
      .then(() => {
        loadIcon(header, headerIcon, headerTopic);
        loadQuestions();
      })
      .catch(error => console.error('Error fetching data:', error));
  })
})

quizForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userAnswer = questionsWrapper.querySelector("[name=choices]:checked"); // get chosen topic

  if (!userAnswer) {
    removeHidden(error);
  } else {
    addHidden(error);
    checkAnswer(userAnswer, quizz.correctIndex); 
    buttons.forEach(toggleBtn);
  }
})

quizForm.addEventListener("reset", (e) => {
  if(count === 10) {
    displayResult();
  } else {
    loadQuestions();
  }
  ["data-correct", "data-check"].forEach(resetStyle);
  buttons.forEach(toggleBtn);
});

replayBtn.addEventListener("click", () => {
  menu.querySelector("[name=menu]:checked").checked = false; //reset topic
  removeHidden(menu);
  [header, resultSummary].forEach(addHidden);

  // resetIcon(header, headerIcon, headerTopic); // I dont do this because header is inaccessible by both screen reader and normal user already

   quizz = {
    title: "",
    icon: "",
    questions: [],
    correctIndex: 0,
    numberCorrect: 0,
  };
  count = 0;
})


// check for saved 'darkMode' in localStorage
let darkMode = localStorage.getItem("darkMode"); 

const toggleWrapper = document.querySelector(".toggle-wrapper")
const darkModeToggle = toggleWrapper.querySelector('.toggle-switch');
const sunIcon = toggleWrapper.querySelector(".sun");
const moonIcon = toggleWrapper.querySelector(".moon");

const enableDarkMode = () => {
  document.body.setAttribute("darkmode", "");
  sunIcon.setAttribute("src", "assets/images/icon-sun-light.svg");
  moonIcon.setAttribute("src", "assets/images/icon-moon-light.svg");
  darkModeToggle.setAttribute("aria-checked", "false");

  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  document.body.removeAttribute("darkMode");
  sunIcon.setAttribute("src", "assets/images/icon-sun-dark.svg");
  moonIcon.setAttribute("src", "assets/images/icon-moon-dark.svg");
  darkModeToggle.setAttribute("aria-checked", "true");
  
  localStorage.setItem('darkMode', null);
}
 
// If the user already visited and enabled darkMode
// start things off with it on
// if (darkMode === 'enabled') {
//   enableDarkMode();
// }

// When someone clicks the button
// darkModeToggle.addEventListener('click', () => {
//   // get their darkMode setting
//   darkMode = localStorage.getItem('darkMode'); 
//   console.log(darkMode);
  
//   // if it not current enabled, enable it
//   if (darkMode !== 'enabled') {
//     enableDarkMode();
//   // if it has been enabled, turn it off  
//   } else {  
//     disableDarkMode(); 
//   }
// });

function setThemePreference() {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    enableDarkMode();
    return;
  }
  enableLightMode();
}

document.onload = setThemePreference();
