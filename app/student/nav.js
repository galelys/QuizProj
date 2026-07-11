import { User } from "../../js/models/user.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";


// Get the container where the navigation buttons will be displayed
let menuButton = document.getElementById('menuBTNS');

// Create the navigation menu dynamically
menuButton.innerHTML = ` 
              <button id="homeBTN" class="base-btn" >Home</button>
              <button id="ExamsFindBTN" class="base-btn">Exams</button>
              <button id="logOutBTN" class="base-btn red-btn">Log Out</button>
        `
    ;


// Get references to buttons //

// Exams Find button
let examsFnd_bth = document.getElementById('ExamsFindBTN');

// Exams list button
let home_bth = document.getElementById('homeBTN');


// log out button 
let out_bth = document.getElementById('logOutBTN');

// Register button events // 
examsFnd_bth.addEventListener('click', GoToFind);
home_bth.addEventListener('click', GoToHome);
out_bth.addEventListener('click', GoToLogIn);


// Navigation functions//

function GoToFind() {
    window.location.href = "../ExamFind/ExamFind.html";
}

function GoToHome() {
    window.location.href = "../Home/home.html";
}

function GoToLogIn() {
    const confirmed = confirm("Are you sure you want to log out?");

    if (!confirmed) { return; }
    // Remove the currently logged-in user from local storage
    localStorage.removeItem('activeUser');
    // Redirect the user to the login page    
    window.location.href = "../../auth/login.html";

}
