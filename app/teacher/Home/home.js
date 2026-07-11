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
    // If nobody is signed in, send them to the login page instead of crashing.
    if (!activeUser) {
        window.location.href = "../../auth/login.html";
        return;
    }
    // Find the complete user object
    const user = userService.findUserById(activeUser.id);

    // dark mode button initialization 
    initThemeToggle();

    // writing welcome <user name> on the page
    document.getElementById('title').textContent += user.name;
    let dash = document.getElementById('testsStats');

    // Retrieve all exams created by the current user
    let creatorExams = examService.getExamByCreatorId(user.id);

    // Debug output
    console.log(creatorExams);
    // Display user statistics on the dashboard
    dash.innerHTML = `
            <div class="stat">
                <h5 class="main-text">Tests created so far</h5>
                <p class="second-text">${user.getExamsCreatedCount()}</p>
            </div>
            <div class="stat">
                <h5 class="main-text">currently avalable tests</h5>
                <p class="second-text">${examService.getExamCountByCreatorId(user.id)}</p>
            </div>
            <div class="stat">
                <h5 class="main-text">Average across all tests</h5>
                <p class="second-text">${examService.calculateExamAverage(creatorExams)}</p>
            </div>
    `;

});


