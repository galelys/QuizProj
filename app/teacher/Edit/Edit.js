import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded', function () {
  initThemeToggle();


  // let saveBTN = examService.getExamById(examID);

  const examService = new ExamService();
  const examUI = new ExamUI(examService);

  let examID = localStorage.getItem("examID");

  let exam = examService.getExamById(examID);

  examUI.renderExamEdit(exam);

  // relevant buttons for editing the test
  let saveBTN = document.getElementById('saveQuestionBtn');
  let deleteBTN = document.getElementById('deleteQuestionBtn');
  let addBTN = document.getElementById('addQuestionBtn');

  const answer1Input = document.getElementById("answer1");
  const answer2Input = document.getElementById("answer2");
  const answer3Input = document.getElementById("answer3");
  const answer4Input = document.getElementById("answer0");
  const questionTextInput = document.getElementById("questionText");
  const sliderQDiff = document.getElementById("questionDiff");
  const outputQDiff = document.getElementById("diffValue");
  const correctAnswerInput = document.getElementById("correctAnswer");
  let timeLimitInput = document.getElementById('timeLimit');

  saveBTN.addEventListener("click", saveQuestion);

  // update on change
  sliderQDiff.addEventListener("input", () => {
    outputQDiff.textContent = sliderQDiff.value;
    
  });

  function saveQuestion() {
    const questionText = questionTextInput.value.trim();
    const correctAnswerNumber = Number(correctAnswerInput.value);
    let questionDiff = Number(sliderQDiff.value);
    const answers = [
      answer1Input.value.trim(),
      answer2Input.value.trim(),
      answer3Input.value.trim(),
      answer4Input.value.trim()
    ];

    const question = new Question(
      questionText,
      answers,
      correctAnswerNumber,
      questionDiff
    );
    exam.updateQuestion(0, question);
    examService.saveExam(exam);

  }



});