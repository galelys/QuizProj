import { User } from "../../../js/models/user.js";
import { UserService } from "../../../js/services/UserService.js";
import { initThemeToggle } from "../../../js/ui/theme.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";

document.addEventListener('DOMContentLoaded', function () {

    // Create service instances
    const userService = new UserService();
    const examService = new ExamService();
    const examUI = new ExamUI(examService);


    const activeUser = JSON.parse(localStorage.getItem("activeUser"));

    let examID = localStorage.getItem("examID");
    let exam = examService.getExamById(examID);

    // If nobody is signed in, send them to the login page instead of crashing.
    if (!activeUser) {
        window.location.href = "../../auth/login.html";
        return;
    }
    // Find the complete user object
    const user = userService.findUserById(activeUser.id);

    // dark mode button initialization 
    initThemeToggle();

    // number of students that took the test
    examService.calculateExamRunCount(exam);

    let dash = document.getElementById("testsStats");
    dash.innerHTML = `
            <div class="stat">
                <h5 class="main-text">number of students that have taken the exam:</h5>
                 <p class="second-text">
                 ${examService.calculateExamRunCount(exam)}
                 </p>
            </div>
            <div class="stat">
                <h5 class="main-text">exam average overall</h5>
                 <p class="second-text">
                 ${examService.calculateExamResultys(exam)}
                 </p>
            </div>
            <div class="stat">
                <h5 class="main-text">avrage test taking</h5>
                 <p class="second-text">
                 ${examService.calculateExamTimeAverage(exam)}
                 </p>
            </div>
        
    `;



});


