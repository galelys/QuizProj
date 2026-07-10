import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";
import { UserService } from "../../js/services/UserService.js";

document.addEventListener('DOMContentLoaded', function () {

    initThemeToggle();

    const examService = new ExamService();
    const examUI = new ExamUI(examService);
    const userService = new UserService();

    // Load the selected exam using the ID stored in localStorage
    let examID = localStorage.getItem("examID");
    let exam = examService.getExamById(examID);

    examUI.renderExamRunner(exam);
    let results = JSON.parse(localStorage.getItem('lastResult'));
    
    const user = JSON.parse(localStorage.getItem('activeUser'));
    

    if (user.type === "student") {
        console.log("hi");
        results.userID = user.id;
        exam.updateStats(results);
        
        examService.saveExam(exam);
        let u = userService.findUserById(user.id);
        console.log(u);
        u.addExamResults( results);
        userService.saveUser(u);

    }


});