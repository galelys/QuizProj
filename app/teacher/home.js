import { User } from "../../js/models/User.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){

    initThemeToggle();
    
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    console.log(id);

    const userService = new UserService();
    const user = userService.findUserById(id);

    console.log(user);
    
    document.getElementById('title').textContent += user.name;


});


