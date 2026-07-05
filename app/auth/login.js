import { User } from "../../js/models/User.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded', function () {

    initThemeToggle();

    const userService = new UserService();

    // for "start" button 
    let btn_reg = document.getElementById('moveBTN');
    // for "login" button
    let btn_log = document.getElementById('loginBTN');

    let inputs = document.querySelectorAll('.inpt');

    // for error message in case we have log in issue
    let errorMsg = document.getElementById("loginError");
    errorMsg.style.visibility = "hidden";
    errorMsg.textContent = "";

    // get all inputs 



    // moving a page 
    btn_reg.addEventListener('click', goToRegister);
    btn_log.addEventListener('click', login);

    /*
    function for logging in 
    checks for empty input boxes 
    if not sends the information to be verified
    after that redirects to the intended page
    */
    function login() {
        console.log("login clicked");

        //hide the error message for another try
        errorMsg.style.visibility = "hidden";
        errorMsg.textContent = "";

        let isValid = true;

        // see if inputs are empty if yes then return
        inputs.forEach(e => {
            let val = e.value.trim();
            if (val === "") {
                e.classList.add("inpt-err");
                isValid = false;
            }
            else {
                e.classList.remove("inpt-err");
            }

        });
        if (!isValid) {
            return;
        }
        // see if the user is actually in there
        const id = document.getElementById('id').value;
        const password = document.getElementById('paswrd').value;

        let success = userService.login(id, password);

        if (success) {
            goToPage(id);
        } else {
            errorMsg.textContent = "Invalid ID or password!";
            errorMsg.style.visibility = "visible";
        }


    }



});

function goToRegister() {
    window.location.href = "./register.html";
}

function goToPage(id) {

    const userService = new UserService();
    const user = userService.findUserById(id);

    if (!user) return;

    const target =
        user.type === "teacher"
            ? "../teacher/home.html"
            : "../student/home.html";

    window.location.href = target + "?id=" + encodeURIComponent(id);
}

