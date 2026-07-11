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


    // Display all pending exams
    displayPendingExams( examService,results);
    // Display previous exam grades
    displayPreviousGrades(results, examService);
    // Calculate and display average grade
    displayAverageGrade(examService, user.id, results);


});



// Display pending exams list //
function displayPendingExams( examService,results) {
    const list = document.getElementById("completedExamsList");
    let exams = examService.getAllExams();

    list.innerHTML = "";

    const completedExamIDs = new Set(

        results.map(result => result.examID)

    );

    const pendingExams = exams.filter(

        exam => !completedExamIDs.has(exam.id)

    );

    //if not completed exams the array is empty
    if (pendingExams.length === 0) {
        list.innerHTML = "<li>No pending exams yet.</li>";
        return;
    }

    // Create a list item for every completed exam
    pendingExams.forEach(exam => {
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
        //const exam = examService.getExamById(result.examID);

        const grade = result.examMaxScore > 0
            ? Math.round((result.score / result.examMaxScore) * 100)
            : 0;

        const item = document.createElement("li");

        item.textContent =
            `${result.examSnapshot.title} - ${grade}`;

        list.appendChild(item);
    });
}

/* Calculate student's average grade */
function displayAverageGrade(examService, userID, results) {
    const averageElement =
        document.getElementById("averageGrade");

    // No completed attempts means there is no average to show. This also
    // avoids reporting a misleading "0.00" for a student who hasn't taken
    // any exam yet (calculateExamAverage returns 0 in that case).
    if (!results || results.length === 0) {
        averageElement.textContent = "No grades yet.";
        return;
    }

    const exams = examService.getAllExams();

    const average =
        examService.calculateExamAverage(exams, userID);

    averageElement.textContent = average.toFixed(2);
}

function goToSearchExams() {
    window.location.href = "../ExamFind/ExamFind.html";
}