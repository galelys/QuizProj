import { User } from "../../js/models/User.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){
    // dark mode button initialization 
    initThemeToggle();
    // create button 
    let create_bth = document.getElementById('createBTN');


    
    // pulling the information aout this user 
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    // updating the console that its working 
    console.log(id);
    // verifing 
    const userService = new UserService();
    const user = userService.findUserById(id);

    console.log(user);
    // writing welcome <user name> on the page
    document.getElementById('title').textContent += user.name;

    create_bth.addEventListener('click' , GoToCreate);

    function GoToCreate(){
        window.location.href = "./create/createExam.html";
        //document.getElementById("contentFrame").src = "./create/createExam.html";
    }

    
});


