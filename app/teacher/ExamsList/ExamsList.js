import { Question } from "../../../js/models/Question.js";
import { Exam } from "../../../js/models/exam.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { ExamUI } from "../../../js/ui/ExamUI.js";
import { initThemeToggle } from "../../../js/ui/theme.js";
import { UserService } from "../../../js/services/UserService.js";


document.addEventListener('DOMContentLoaded', function () {
    // Initialize website theme functionalit
    initThemeToggle();

    // Create service layer for exam data operations
    // and UI layer for rendering exam components
    const examService = new ExamService();
    const examUI = new ExamUI(examService);

    const userService = new UserService();
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    // If nobody is signed in, send them to the login page instead of crashing.
    if (!activeUser) {
        window.location.href = "../../auth/login.html";
        return;
    }
    const user = userService.findUserById(activeUser.id);

    // Container that holds the generated exam cards/list
    const examListElement = document.getElementById("examList");

    // Search and clear buttons
    let searchBtn = document.getElementById("searchBTN");
    let clearBTN = document.getElementById("clearBTN");

    // Import button + its hidden file input
    let importBtn = document.getElementById("importBTN");
    let importFileInput = document.getElementById("importFile");

    // Clicking the visible button opens the file picker
    importBtn.addEventListener("click", () => importFileInput.click());
    // When a file is chosen, read and import it
    importFileInput.addEventListener("change", importExam);

    // added key listener for enter for when using search and then pressing enter
    // allows the user to trigger search by pressing Enter
    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            search();
        }
    });

    // attach button actions
    searchBtn.addEventListener('click', search);
    clearBTN.addEventListener('click', clear);

    // re-filter whenever the category dropdown changes
    let categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.addEventListener('change', search);

    // display all exams created by the teacher
    examUI.renderExamList("teacher");
    examUI.renderCategoryFilter();

    /*
     * searches exams according to the value entered in the search bar
     */
    function search() {
        let searchVal = document.getElementById("searchBAR").value;

        // Filter and display matching exams. An empty search box still
        // applies the selected category (empty text matches every title).
        examUI.sorterList(searchVal, "teacher");

    }
    /**
     * clears the search input and reloads the full exam list.
     */

    function clear() {
        examUI.renderExamList("teacher");
        document.getElementById("searchBAR").value = "";
        // Reset the category dropdown back to "All" so it matches the full list.
        categoryFilter.value = "All";

    }

    /**
     * event listener for the exams buttons
     * Instead of adding listeners to every exam button,
     * one listener handles all buttons inside the exam list
     */

    examListElement.addEventListener("click", event => {
        // Retrieve the exam ID stored in the clicked button.
        const examID = event.target.dataset.id;

        //  run the exam button //
        if (event.target.classList.contains("run-btn")) {
            const exam = examService.getExamById(examID);
            // Save selected exam ID into local storage so the next page can load it
            localStorage.setItem("examID", examID);
            window.location.href = "../../ExamRunner/ExamRunner.html";


        }

        // the edit button //
        if (event.target.classList.contains("edit-btn")) {
            const exam = examService.getExamById(examID);

            // Save selected exam ID into local storage so the next page can load it
            localStorage.setItem("examID", examID);
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
            examService.deleteExam(examID);
            //remove the exam for all users
            userService.removeExamResultsFromAllUsers(examID);
            // Refresh displayed list
            examUI.renderExamList("teacher");

        }

        // the export exam button //
        if (event.target.classList.contains("export-btn")) {
            const exam = examService.getExamById(examID);
            // Convert exam object into JSON file.
            exportExam(exam)
        }
        // the export exam button //
        if (event.target.classList.contains("statistics-btn")) {
            localStorage.setItem("examID", examID);
            window.location.href = "../Statistics/ExamStats.html";
        }


    });

    /**
    * Imports an exam from a JSON file selected by the user.
    * Reads the file, parses the JSON, rebuilds it as an Exam
    * object (with fresh ids so it never overwrites an existing exam),
    * saves it to localStorage, and refreshes the list.
    */
    function importExam(event) {
        // The file the user picked
        const file = event.target.files[0];
        if (!file) { return; }

        const reader = new FileReader();

        reader.onload = e => {
            try {
                // Make sure we still have a valid signed-in user before importing.
                if (!user) {
                    alert("You must be signed in to import an exam.");
                    return;
                }

                // Turn the file text back into an object
                const data = JSON.parse(e.target.result);

                // Rebuild a clean Exam object from the raw data.
                // Uses the module-level `user` (a real User instance with addExamCreation).
                const exam = new Exam(data.title, user.id);
                // New id so importing the same file twice does not overwrite
                exam.id = crypto.randomUUID();
                exam.createdAt = data.createdAt || new Date().toISOString();
                exam.timeLimit = data.timeLimit || 0;
                exam.category = data.category || "";

                // Rebuild each question
                exam.questions = (data.questions || []).map(q => {
                    const question = new Question(
                        q.text,
                        q.answers,
                        q.correctAnswerIndex,
                        q.difficulty
                    );
                    return question;
                });

                // Save the imported exam and refresh the list
                user.addExamCreation(exam.id);
                userService.saveUser(user);
                localStorage.setItem("activeUser", JSON.stringify(user));
                // Save the imported exam and refresh the list
                examService.saveExam(exam);
                examUI.renderExamList("teacher");

                alert("Exam was added successfully");
            } catch (err) {
                // The file was not valid exam JSON
                alert("Invalid exam file.");
            }

            // Reset the input so the same file can be imported again
            event.target.value = "";
        };

        // Read the file as text (triggers reader.onload above)
        reader.readAsText(file);
    }

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