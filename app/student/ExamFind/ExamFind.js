import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    const examListElement =
        document.getElementById("examList");

    examUI.renderExamList("student");

    examListElement.addEventListener("click", event => {
        if (!event.target.classList.contains("run-btn")) {
            return;
        }

        const examId = event.target.dataset.id;

        localStorage.setItem("examID", examId);

        window.location.href =
            "../../ExamRunner/ExamRunner.html";
    });
});