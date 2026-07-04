import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

const examService = new ExamService();
const examUI = new ExamUI(examService);

let currentExam = null;

const examTitleInput = document.getElementById("examTitle");
const questionTextInput = document.getElementById("questionText");

const answer1Input = document.getElementById("answer1");
const answer2Input = document.getElementById("answer2");
const answer3Input = document.getElementById("answer3");
const answer4Input = document.getElementById("answer4");

const correctAnswerInput = document.getElementById("correctAnswer");
let timeLimitInput = document.getElementById('timeLimit');

const addQuestionBtn = document.getElementById("addQuestionBtn");
const saveExamBtn = document.getElementById("saveExamBtn");
let categorsCard = document.getElementById('categoryCard');
let categories = examService.getCategories();




//const examListElement = document.getElementById("examList");
initThemeToggle();
examUI.showExamCategories(categorsCard ,categories);




addQuestionBtn.addEventListener("click", () => {
  const title = examTitleInput.value.trim();
  const questionText = questionTextInput.value.trim();

  const answers = [
    answer1Input.value.trim(),
    answer2Input.value.trim(),
    answer3Input.value.trim(),
    answer4Input.value.trim()
  ];

  const correctAnswerNumber = Number(correctAnswerInput.value);

  if (!title) {
    examUI.showBuilderMessage("Please enter exam title.", "danger");
    return;
  }

  if (!questionText) {
    examUI.showBuilderMessage("Please enter question text.", "danger");
    return;
  }

  if (answers.some(answer => answer === "")) {
    examUI.showBuilderMessage("Please fill all 4 answers.", "danger");
    return;
  }

  if (correctAnswerNumber < 1 || correctAnswerNumber > 4) {
    examUI.showBuilderMessage("Correct answer must be a number from 1 to 4.", "danger");
    return;
  }

  if (!currentExam) {
    currentExam = new Exam(title);
  }

  const correctAnswerIndex = correctAnswerNumber - 1;

  const question = new Question(
    questionText,
    answers,
    correctAnswerIndex
  );

  currentExam.addQuestion(question);

  examUI.showBuilderMessage(
    `Question added. Current exam has ${currentExam.getQuestionCount()} question(s).`,
    "success"
  );

  clearQuestionInputs();
});

saveExamBtn.addEventListener("click", () => {
  if (!currentExam) {
    examUI.showBuilderMessage("Create an exam and add at least one question first.", "danger");
    return;
  }

  if (currentExam.getQuestionCount() === 0) {
    examUI.showBuilderMessage("Cannot save exam without questions.", "danger");
    return;
  }
  currentExam.category = localStorage.getItem('selected_category');
  if(currentExam.category === null){
        examUI.showBuilderMessage("Cannot save exam without a category.", "danger");
    return;
  }
  localStorage.removeItem('selected_category');
  let time = Number(timeLimitInput.value);
    if(isNaN(time) || time <= -1){
      examUI.showBuilderMessage("Cannot save exam without questions.", "danger");
    return;
    
  }
  currentExam.timeLimit = time;
  
  examService.saveExam(currentExam);

  examUI.showBuilderMessage("Exam saved successfully.", "success");
  
  currentExam = null;

  examTitleInput.value = "";


});


function clearQuestionInputs() {
  questionTextInput.value = "";

  answer1Input.value = "";
  answer2Input.value = "";
  answer3Input.value = "";
  answer4Input.value = "";

  correctAnswerInput.value = "";
}





