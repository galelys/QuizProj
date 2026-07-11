import { Question } from "../../js/models/Question.js";
import { Exam } from "../../js/models/exam.js";
import { ExamService } from "../../js/services/ExamService.js";
import { ExamUI } from "../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../js/ui/theme.js";
import { UserService } from "../../js/services/UserService.js";

document.addEventListener('DOMContentLoaded', function () {

    initThemeToggle();


    const examService = new ExamService();
    const examUI = new ExamUI(examService);
    const userService = new UserService();
    

    // Load the selected exam using the ID stored in localStorage
    let examID = localStorage.getItem("examID");
    let exam = examService.getExamById(examID);


    const user = JSON.parse(localStorage.getItem('activeUser'));

    // The callback runs only when the student actually finishes the exam
    // (submit or time up), so `results` is guaranteed to be populated.
    examUI.renderExamRunner(exam, (results) => {
        if (user.type != "") {
            results.userID = user.id;
            results.examId = examID;

            // Record the attempt on the exam (feeds the teacher's average).
            exam.updateStats(results);
            examService.saveExam(exam);

            // Record the attempt on the student's own history.
            const u = userService.findUserById(user.id);
            u.addExamResults(results);
            userService.saveUser(u);

            //const user = JSON.parse(localStorage.getItem('activeUser' ));
            localStorage.setItem('activeUser' , JSON.stringify(u) );

        }
    });

    

});