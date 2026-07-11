import { User } from "../../../js/models/user.js";
import { UserService } from "../../../js/services/UserService.js";
import { initThemeToggle } from "../../../js/ui/theme.js";
import { Exam } from "../../../js/models/exam.js";
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
                 ${examService.calculateExamRunCount(exam) === 0
        ? "No stats yet"
        : examService.calculateExamAverage([exam]) }
                 </p>
            </div>
            <div class="stat">
                <h5 class="main-text">avrage test taking</h5>
                 <p class="second-text">
                 ${examService.calculateExamTimeAverage(exam)}
                 </p>
            </div>
        
    `;

    // ---- List of students who took the exam, with their score ----
    const st = document.getElementById('students');

    // Every recorded attempt lives on exam.stats. Each attempt carries the
    // student's userID and score, so we resolve the name from UserService.
    const attempts = Array.isArray(exam.stats) ? exam.stats : [];

    if (attempts.length === 0) {
        st.innerHTML = `
            <h4 class="main-text">Students</h4>
            <p class="second-text">No students have taken this exam yet</p>
        `;
        return;
    }

    // Prefer the stored percentage; fall back to recomputing it for older
    // attempts saved before that field existed.
    const percentOf = (stat) => {
        if (typeof stat.percentage === "number") {
            return stat.percentage;
        }
        return stat.examMaxScore > 0
            ? Math.round((stat.score / stat.examMaxScore) * 100)
            : 0;
    };

    const rows = attempts.map(stat => {
        const student = userService.findUserById(stat.userID);
        const name = student ? student.getUserName() : "Unknown student";

        return `
            <tr>
                <td class="second-text">${name}</td>
                <td class="second-text">${stat.score} / ${stat.examMaxScore}</td>
                <td class="second-text">${percentOf(stat)}</td>
                
            </tr>
        `;
    }).join("");

    st.innerHTML = `
        <h4 class="main-text">Students (${attempts.length})</h4>
        <table class="table">
            <thead>
                <tr>
                    <th class="main-text">Student</th>
                    <th class="main-text">Score</th>
                    <th class="main-text">Final score</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

});


