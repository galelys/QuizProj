import { User } from "../../js/models/User.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){
    initThemeToggle();
    
    
    // back to log in button 
    let btn_back = document.getElementById('backLogBTN');
    // button for submitting a new user 
    let registration_btn =  document.getElementById('regiBTN');
    
    btn_back.addEventListener('click' , goToLogin);
    registration_btn.addEventListener('click' , registser);

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

function registser(){
    const userService = new UserService();

    let inputs = document.querySelectorAll('.inpt');
    let isValid = true;

    // see if inputs are empty if yes then return
    inputs.forEach(e => {
        let val = e.value.trim();
        if(val === ""){
            e.style.border = "1px solid red";
            isValid = false;
        }
        else{
            e.style.border = ""; 
        }
        
    });
    if (!isValid) {
        return; 
    }
    // creation of a new user
    let userType =  document.getElementById("btnradio1").checked ? "teacher" : "student";
    let id =document.getElementById("id").value 
    // make a user
    const newUser = new User(
        document.getElementById("userName").value,
        document.getElementById("paswrd").value,
        userType,
        id
    );
    
    console.log(newUser);

    // send to be added to local storage
    userService.addUser(newUser);

    // go to the next page 
    goToPage(id);

}

/* function to redirect the user to its intended page */
function goToPage(id) {
    const userService = new UserService();
    const user = userService.findUserById(id);

    if (!user) return;

    if (user.type === "student") {
        window.location.href =
            "../student/home.html?value=" + encodeURIComponent(JSON.stringify(user));
    }
    else{
        window.location.href =
            "../teacher/home.html?value=" + encodeURIComponent(JSON.stringify(user));
    }
}