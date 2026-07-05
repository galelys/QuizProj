import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();

    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    let examID = localStorage.getItem("ExamID");
    


});