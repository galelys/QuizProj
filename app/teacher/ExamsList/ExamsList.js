import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";



document.addEventListener('DOMContentLoaded', function () {
    // Initialize website theme functionalit
    initThemeToggle();

    // Create service layer for exam data operations
    // and UI layer for rendering exam components
    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    // Container that holds the generated exam cards/list
    const examListElement = document.getElementById("examList");

    // Search and clear buttons
    let searchBtn = document.getElementById("searchBTN");
    let CLRBtn = document.getElementById("clearBTN");

    // added key listener for enter for when using search and then pressing enter
    // allows the user to trigger search by pressing Enter
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            console.log("Enter pressed");
            search();
        }
    });

    // attach button actions
    searchBtn.addEventListener('click', search);
    clearBTN.addEventListener('click', clear);

    // display all exams created by the teacher
    examUI.renderExamList("teacher");

    /*
     * searches exams according to the value entered in the search bar
     */
    function search() {
        let searchVal = document.getElementById("searchBAR").value;
        // Do nothing if the search input is empty.
        if (searchVal === "") {
            return;
        }

        // Filter and display matching exams
        examUI.sorterListTeacher(searchVal);
    }
    /**
     * clears the search input and reloads the full exam list.
     */

    function clear() {
        examUI.renderExamList("teacher");
        document.getElementById("searchBAR").value = "";

    }

    /**
     * event listener for the exams buttons
     * Instead of adding listeners to every exam button,
     * one listener handles all buttons inside the exam list
     */

    examListElement.addEventListener("click", event => {
        // Retrieve the exam ID stored in the clicked button.
        const examId = event.target.dataset.id;

        //  run the exam button //
        if (event.target.classList.contains("run-btn")) {
            const exam = examService.getExamById(examId);
            // Save selected exam ID into local storage so the next page can load it
            localStorage.setItem("examID", examId);
            window.location.href = "../../ExamRunner/ExamRunner.html";


        }

        // the edit button //
        if (event.target.classList.contains("edit-btn")) {
            const exam = examService.getExamById(examId);

            // Save selected exam ID into local storage so the next page can load it
            localStorage.setItem("examID", examId);
            window.location.href = "../Edit/Edit.html";

            //examUI.renderExamRunner(exam);
        }
        // the delete exam button  //
        if (event.target.classList.contains("delete-btn")) {
            // Ask for confirmation before permanently deleting
            const confirmed = confirm("Are you sure you want to delete this exam?");

            if (!confirmed) {
                return;
            }
            // Remove exam from storage
            examService.deleteExam(examId);
            // Refresh displayed list
            examUI.renderExamList("teacher");
        }

        // the export exam button //
        if (event.target.classList.contains("export-btn")) {
            const exam = examService.getExamById(examId);
            // Convert exam object into JSON file.
            exportExam(exam)
        }

    });

    /**
    * Exports an exam object into a downloadable JSON file.
    */
    function exportExam(exam) {

        // Convert JavaScript object into formatted JSON text
        const json = JSON.stringify(exam, null, 2);

        // Create a file-like object containing the JSON data
        const blob = new Blob([json], {
            type: "application/json"
        });

        // Generate temporary URL for the file
        const url = URL.createObjectURL(blob);

        // Create invisible download link
        const a = document.createElement("a");
        a.href = url;

        // Set downloaded file name
        a.download = `${exam.title}.json`;

        // Trigger browser download
        a.click();

        // Release memory used by the temporary URL
        URL.revokeObjectURL(url);
    }

});