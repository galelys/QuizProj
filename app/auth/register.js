import { User } from "../../js/models/user.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded', function () {
    initThemeToggle();


    // back to log in button 
    let btn_back = document.getElementById('backLogBTN');
    // button for submitting a new user 
    let registration_btn = document.getElementById('regiBTN');

    btn_back.addEventListener('click', goToLogin);
    registration_btn.addEventListener('click', register);

});

function goToLogin() {
    window.location.href = "login.html";
}

/*the function works like this :
    see if any input is empty 
    creates a user 
    adds the new user to the local storage 
    redirects to the relevent page 
*/

function register() {
    const userService = new UserService();

    let inputs = document.querySelectorAll('.inpt');
    let isValid = true;
    //restarting the error message field
    const errorMsg = document.getElementById("registerError");

    errorMsg.textContent = "";

    errorMsg.style.visibility = "hidden";

    document.getElementById("id").classList.remove("inpt-err");

    // see if inputs are empty if yes then return
    inputs.forEach(e => {
        let val = e.value.trim();
        if (val === "") {
            e.style.border = "1px solid red";
            isValid = false;
        }
        else {
            e.style.border = "";
        }

    });
    if (!isValid) {
        return;
    }
    // creation of a new user
    let userType = document.getElementById("btnradio1").checked ? "teacher" : "student";
    let id = document.getElementById("id").value
    // make a user
    const newUser = new User(
        document.getElementById("userName").value,
        document.getElementById("paswrd").value,
        userType,
        id
    );

    console.log(newUser);
    const wasAdded = userService.addUser(newUser);

    if (!wasAdded) {

        const errorMsg = document.getElementById("registerError");

        errorMsg.textContent = "A user with this ID already exists.";

        errorMsg.style.visibility = "visible";

        document.getElementById("id").classList.add("inpt-err");

        return;

    }

    goToPage(id);

}

/* function to redirect the user to its intended page */
function goToPage(id) {

    const userService = new UserService();
    const user = userService.findUserById(id);
    localStorage.setItem("activeUser", JSON.stringify(user));
    if (!user) return;


    const target =
        user.type === "teacher"
            ? "../teacher/Home/home.html"
            : "../student/Home/home.html";

    window.location.href = target + "?id=" + encodeURIComponent(id);
}