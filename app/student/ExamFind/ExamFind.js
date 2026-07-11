import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    const examListElement = document.getElementById("examList");

    examUI.renderExamList("student");

    examListElement.addEventListener("click", event => {
        const examID = event.target.dataset.id;

        if (!examID) {
            return;
        }

        if (event.target.classList.contains("run-btn")) {
            localStorage.setItem("examID", examID);

            window.location.href =
                "../../ExamRunner/ExamRunner.html";
        }

        if (event.target.classList.contains("view-answers-btn")) {
            localStorage.setItem("examID", examID);

            window.location.href =
                "../../ExamRunner/ExamResults.html";
        }
    });
});