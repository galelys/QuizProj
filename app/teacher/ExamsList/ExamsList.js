import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){
    initThemeToggle();

    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    let searchBtn = document.getElementById("searchBTN");
    let searchBar = document.getElementById("searchBAR");

    // added key listener for enter for when using search and then pressing enter
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("Enter pressed");
        }
    });
    
    examUI.renderExamList();







});