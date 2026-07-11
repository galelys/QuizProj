import { UserService } from "../../../js/services/UserService.js";
import { ExamService } from "../../../js/services/ExamService.js";
import { User } from "../../../js/models/user.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    const userService = new UserService();
    const examService = new ExamService();

    // Try to get the currently logged-in user from localStorage
    let user = JSON.parse(localStorage.getItem("activeUser"));

    // If there is no active user, try getting the user ID from the URL
    if (!user) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) { user = userService.findUserById(id); }
    }

    // If no user was found, redirect to login page
    if (!user) {
        window.location.href = "../../auth/login.html";
        return;
    }
    // Display personalized greeting message
    document.getElementById("title").textContent = `Hello, ${user.name}`;

    // Get the user's completed exams.
    // If examsResults does not exist or is not an array,
    // create an empty array instead to avoid errors.
    const results = Array.isArray(user.examsResults) ? user.examsResults : [];


    // Display all completed exams
    displayCompletedExams(results, examService);
    // Display previous exam grades
    displayPreviousGrades(results, examService);
    // Calculate and display average grade
    displayAverageGrade(examService, user.id);


});

// Display completed exams list //
function displayCompletedExams(results, examService) {
    const list = document.getElementById("completedExamsList");

    list.innerHTML = "";

    //if not completed exams the array is empty
    if (results.length === 0) {
        list.innerHTML = "<li>No completed exams yet.</li>";
        return;
    }

    // Create a list item for every completed exam
    results.forEach(result => {
        const exam = examService.getExamById(result.examID);
        const item = document.createElement("li");

        item.textContent = exam ? exam.title : "Unknown";

        list.appendChild(item);
    });

}

/* Display previous exam grades*/
function displayPreviousGrades(results, examService) {
    const list = document.getElementById("gradesList");

    list.innerHTML = "";
    // Handle case where no exams were completed
    if (results.length === 0) {
        list.innerHTML = "<li>No grades yet.</li>";
        return;
    }
    // Add every exam and its grade to the list
    results.forEach(result => {
        const exam = examService.getExamById(result.examID);

        const grade = Math.round(

            (result.score / result.examMaxScore) * 100

        );

        const item = document.createElement("li");

        item.textContent =
            `${exam ? exam.title : "Unknown"} - ${grade}`;

        list.appendChild(item);
    });
}

/* Calculate student's average grade */
function displayAverageGrade(examService, userID) {
    const averageElement =
        document.getElementById("averageGrade");

    const exams = examService.getAllExams();

    const average =
        examService.calculateExamAverage(exams, userID);

    if (average === null) {
        averageElement.textContent = "No grades yet.";
        return;
    }

    averageElement.textContent = average.toFixed(2);
}

function goToSearchExams() {
    window.location.href = "../ExamFind/ExamFind.html";
}