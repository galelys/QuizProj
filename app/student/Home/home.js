import { UserService } from "../../../js/services/UserService.js";
import { User } from "../../../js/models/user.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    const userService = new UserService();

    let user = JSON.parse(localStorage.getItem("activeUser"));

    if (!user) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) {
            user = userService.findUserById(id);
        }
    }

    if (!user) {
        window.location.href = "../../auth/login.html";
        return;
    }

    document.getElementById("title").textContent = `Hello, ${user.name}`;

    //Exams array for the student
    const results = Array.isArray(user.examsResults)
        ? user.examsResults
        : [];


    displayCompletedExams(results);

    displayPreviousGrades(results);

    displayAverageGrade(results);


    //search exam button
    const searchExamsButton = document.getElementById("searchExamsBTN");

    searchExamsButton.addEventListener("click", goToSearchExams);
});


function displayCompletedExams(results) {
    const list = document.getElementById("completedExamsList");

    list.innerHTML = "";

    //if not completed exams the array is empty
    if (results.length === 0) {
        list.innerHTML = "<li>No completed exams yet.</li>";
        return;
    }

    results.forEach(result => {
        const item = document.createElement("li");

        item.textContent = result.examTitle || "Unknown";

        list.appendChild(item);
    });

}

function displayPreviousGrades(results) {
    const list = document.getElementById("gradesList");

    list.innerHTML = "";

    if (results.length === 0) {
        list.innerHTML = "<li>No grades yet.</li>";
        return;
    }

    results.forEach(result => {
        const item = document.createElement("li");

        item.textContent =
            `${result.examTitle} - ${result.percentage}`;

        list.appendChild(item);
    });
}

function displayAverageGrade(results) {

    const averageElement = document.getElementById("averageGrade");

    if (results.length === 0) {
        averageElement.textContent = "No grades yet.";
        return;
    }

    let sum = 0;

    results.forEach(result => {
        sum += result.percentage;
    });

    const average = sum / results.length;

    averageElement.textContent = average.toFixed(2) + "%";
}

function goToSearchExams() {
    window.location.href = "../ExamFind/ExamFind.html";
}