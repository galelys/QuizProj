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
    let saveBTN = examService.getExamById(saveQuestionBtn);
    let deleteBTN = examService.getExamById(deleteQuestionBtn);
    let addBTN = examService.getExamById(addQuestionBtn);


    saveBTN.addEventListener("click", () => {
  const index = Number(select.value);

  const question = exam.questions[index];

  // update text
  question.text = document.getElementById("editText").value;

  // update answers
  const answerInputs = document.querySelectorAll(".edit-answer");
  question.answers = Array.from(answerInputs).map(input => input.value);

  examService.saveExam(exam); // if you have persistence

  alert("Question updated!");
});






});