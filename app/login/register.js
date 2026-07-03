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
    // see if inputs are empty
    inputs.forEach(e => {
        let val = e.value.trim();
        if(val === ""){
            e.style.border = "1px solid red";
            return;
        }
        else{
            e.style.border = ""; 
        }
        
    });

    // make a user
    const newUser = new User(
        document.getElementById("userName").value,
        document.getElementById("paswrd").value,
        document.getElementById("btnradio1").checked ? "teacher" : "student",
        document.getElementById("id").value
    );
    // send to be added? 
    
    //localStorage.setItem("user", JSON.stringify(newUser));

    console.log('newUser');






}

