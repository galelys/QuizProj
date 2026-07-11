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
    



});


