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

    // Load the selected exam using the ID stored in localStorage
    let examID = localStorage.getItem("examID");
    let exam = examService.getExamById(examID);

    const user = JSON.parse(localStorage.getItem('activeUser'));

    // Find the student's stored attempt for this exam.
    // Prefer a matching entry in the user's history; fall back to the
    // most recent attempt saved right after finishing the exam.
    const history = Array.isArray(user?.examsResults) ? user.examsResults : [];
    let results = history.find(
        r => r.examID === examID
    );

    if (!results) {
        results = JSON.parse(localStorage.getItem("lastResult"));
    }

    // Prefer the snapshot captured when the exam was submitted, so the review
    // reflects the exam exactly as the student took it — even if the teacher
    // has since edited or deleted it. Older attempts saved before snapshots
    // existed fall back to the current live exam.
    const examForReview = (results && results.examSnapshot)
        ? results.examSnapshot
        : exam;

    // Render the completed exam in read-only, color-coded review mode.
    examUI.renderExamResults(examForReview, results);

});
