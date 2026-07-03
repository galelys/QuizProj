import { User } from "../../js/models/User.js";
import { UserService } from "../../js/services/UserService.js";


document.addEventListener('DOMContentLoaded' , function(){
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

function registser(){
    // 1 see that every thing is submitted +
    // 2 send to be added to the localstorege 
    // will return false if already exists return true if added 
    // continue to next page or stay and do err

    // get all inputs 
    let inputs = document.querySelectorAll('.inpt');
    let isValid = true;

    // see if inputs are empty if yes then return
    inputs.forEach(e => {
        let val = e.value.trim();
        if(val === ""){
            e.style.border = "1px solid red";
            return;
            isValid = false;

        }
        else{
            e.style.border = ""; 
        }
        
    });
    if (!isValid) {
        return; 
    }

    let userType =  document.getElementById("btnradio1").checked ? "teacher" : "student"; 
    // make a user
    const newUser = new User(
        document.getElementById("userName").value,
        document.getElementById("paswrd").value,
        userType,
        document.getElementById("id").value
    );
    
    console.log(newUser);

    // send to be added
    const userService = new UserService();
    userService.addUser(newUser);

    // go to the next page 
    // teacher
    if(userType === "teacher"){
        window.location.href = "../teacher/home.html";

    }
    else{ // student
        window.location.href = "../student/home.html";
    }


    

}

