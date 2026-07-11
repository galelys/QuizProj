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

    // A student may only take each exam once. If they already have a saved
    // result for this exam, send them to the read-only review instead of
    // letting them run it again (covers refresh / back button / direct URL).
    // Teachers are never blocked, so they can re-run an exam as many times
    // as they like.
    if (user.type === "student") {
        const history = Array.isArray(user.examsResults) ? user.examsResults : [];
        const alreadyTaken = history.some(
            r => r.examID === examID
        );
        if (alreadyTaken) {
            window.location.href = "./ExamResults.html";
            return;
        }
    }

    // The callback runs only when the student actually finishes the exam
    // (submit or time up), so `results` is guaranteed to be populated.
    examUI.renderExamRunner(exam, (results) => {
        // Only student attempts are persisted. A teacher can run an exam to
        // preview it, but nothing is written to the exam data or their account.
        if (user.type === "student") {
            results.userID = user.id;
            results.examID = examID;

            // Record the attempt on the exam (feeds the teacher's average).
            // This copy carries NO snapshot on purpose, so the exam does not
            // accumulate nested copies of itself on every attempt.
            exam.updateStats(results);
            examService.saveExam(exam);

            // Record the attempt on the student's own history WITH a snapshot
            // of the exam exactly as it was taken. This keeps the read-only
            // review correct even if the teacher later edits or deletes it.
            const resultForHistory = {
                ...results,
                examSnapshot: examService.createExamSnapshot(exam)
            };

            const u = userService.findUserById(user.id);
            u.addExamResults(resultForHistory);
            userService.saveUser(u);

            localStorage.setItem('activeUser' , JSON.stringify(u) );

        }
    });


});