import { User } from "../../../js/models/user.js";
import { UserService } from "../../../js/services/UserService.js";
import { initThemeToggle } from "../../../js/ui/theme.js";
import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";

document.addEventListener('DOMContentLoaded', function () {

    const userService = new UserService();
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    const user = userService.findUserById(activeUser.id);

    const examService = new ExamService();
    const examUI = new ExamUI(examService);


    // dark mode button initialization 
    initThemeToggle();

    // writing welcome <user name> on the page


    document.getElementById('title').textContent += user.name;
    let dash = document.getElementById('testsStats');

    let creatorExams = examService.getExamByCreatorId(user.id);
    //calculateExamAverage
    dash.innerHTML = `
            <div class="stat">
                <h5 class="main-text">Tests created so far</h5>
                <p class="second-text">${user.getExamsCreatedCount()}</p>
            </div>
            <div class="stat">
                <h5 class="main-text">Average across all tests</h5>
                <p class="second-text">${examService.calculateExamAverage(creatorExams)}</p>
            </div>
    `;



});


