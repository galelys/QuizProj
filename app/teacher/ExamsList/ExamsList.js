import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){
    initThemeToggle();

    const examService = new ExamService();
    const examUI = new ExamUI(examService);
    
    const examListElement = document.getElementById("examList");


    let searchBtn = document.getElementById("searchBTN");
    let CLRBtn = document.getElementById("clearBTN");

    // added key listener for enter for when using search and then pressing enter
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("Enter pressed");
            search();
        }
    });

    searchBtn.addEventListener('click' , search);
    clearBTN.addEventListener('click' , clear);
    // show the list
    examUI.renderExamList("teacher");

    function search(){
        let searchVal = document.getElementById("searchBAR").value;

        if(searchVal === ""){
            return;
        }
        console.log(searchVal);
        examUI.sorterListTeacher(searchVal);


    }

    function clear(){
        examUI.renderExamList("teacher");
        document.getElementById("searchBAR").value = "";

    }

examListElement.addEventListener("click", event => {
  const examId = event.target.dataset.id;

  if (event.target.classList.contains("run-btn")) {
    const exam = examService.getExamById(examId);

    examUI.renderExamRunner(exam);
  }

  if (event.target.classList.contains("delete-btn")) {
    const confirmed = confirm("Are you sure you want to delete this exam?");

    if (!confirmed) {
      return;
    }

    examService.deleteExam(examId);

    examUI.renderExamList();
  }
});




});