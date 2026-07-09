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

    const questionText = document.getElementById("questionText").value.trim();
    const correctAnswerNumber = Number(correctAnswerInput.value);
    const questionDiff = Number(
      document.getElementById("questionDiff").value
    );
    const answers = [
      document.getElementById("answer0").value,
      document.getElementById("answer1").value,
      document.getElementById("answer2").value,
      document.getElementById("answer3").value
    ];
    

    const question = new Question(
      questionText,
      answers,
      correctAnswerNumber,
      questionDiff
    );

    let index = localStorage.getItem('currentQuestionIndex');
    exam.updateQuestion(index, question);
    examService.saveExam(exam);
    examUI.renderExamEdit(exam);
  }

  deleteBTN.addEventListener('click', () => {
    let index = localStorage.getItem('currentQuestionIndex');
    exam.removeQuestion(index);
    examService.saveExam(exam);
    examUI.renderExamEdit(exam);

  });

  addBTN.addEventListener('click', () => {
    const answers = ["", "", "", ""];

    const question = new Question("", answers, 0, 0);

    exam.addQuestion(question);

    examService.saveExam(exam);

    const newIndex = exam.questions.length - 1;

    examUI.renderQuestionSelect(exam, newIndex);
    examUI.renderQuestion(exam, newIndex);
  });

});