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
    

    // added key listener for enter for when using search and then pressing enter
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("Enter pressed");
            search();
        }
    });

    searchBtn.addEventListener('click' , search);
    // show the list
    examUI.renderExamList();

    function search(){
        let searchVal = document.getElementById("searchBAR").value;

        if(searchVal === ""){
            return;
        }
        console.log(searchVal);
        examUI.renderSearchListTeacher(searchVal);


    }






});