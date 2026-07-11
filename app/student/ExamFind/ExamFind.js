import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener("DOMContentLoaded", function () {
    // Initialize website theme functionality
    initThemeToggle();

    // Create service layer for exam data operations
    // and UI layer for rendering exam components
    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    // If nobody is signed in, send them to the login page instead of crashing.
    if (!activeUser) {
        window.location.href = "../../auth/login.html";
        return;
    }

    // Container that holds the generated exam cards/list
    const examListElement = document.getElementById("examList");

    // Search and clear buttons
    let searchBtn = document.getElementById("searchBTN");
    let clearBTN = document.getElementById("clearBTN");
    let backHomeBTN = document.getElementById("backHomeBTN");

    // allows the user to trigger search by pressing Enter
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            search();
        }
    });

    // attach button actions
    searchBtn.addEventListener("click", search);
    clearBTN.addEventListener("click", clear);
    backHomeBTN.addEventListener("click", () => {
        window.location.href = "../Home/home.html";
    });

    // re-filter whenever the category dropdown changes
    let categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.addEventListener('change', search);

    // display all exams available to the student
    examUI.renderExamList("student");
    // fill the category dropdown with the available categories
    examUI.renderCategoryFilter();

    /*
     * searches exams according to the value entered in the search bar
     */
    function search() {
        let searchVal = document.getElementById("searchBAR").value;

        // Filter and display matching exams using the shared search logic,
        // rendered with the student card layout.
        examUI.sorterList(searchVal, "student");
    }

    /**
     * clears the search input and reloads the full exam list.
     */
    function clear() {
        examUI.renderExamList("student");
        document.getElementById("searchBAR").value = "";
        // Reset the category dropdown back to "All" so it matches the full list.
        categoryFilter.value = "All";
    }

    /**
     * event listener for the exam buttons.
     * Instead of adding listeners to every exam button,
     * one listener handles all buttons inside the exam list.
     */
    examListElement.addEventListener("click", event => {
        // Retrieve the exam ID stored in the clicked button.
        const examID = event.target.dataset.id;

        if (!examID) {
            return;
        }

        // start the exam button //
        if (event.target.classList.contains("run-btn")) {
            // Save selected exam ID into local storage so the next page can load it
            localStorage.setItem("examID", examID);
            window.location.href = "../../ExamRunner/ExamRunner.html";
        }

        // view my answers button //
        if (event.target.classList.contains("view-answers-btn")) {
            // Save selected exam ID into local storage so the next page can load it
            localStorage.setItem("examID", examID);
            window.location.href = "../../ExamRunner/ExamResults.html";
        }
    });
});
