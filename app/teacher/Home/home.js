import { User } from "../../../js/models/User.js";
import { UserService } from "../../../js/services/UserService.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){

    // dark mode button initialization 
    initThemeToggle();

    // writing welcome <user name> on the page
    const user = JSON.parse(localStorage.getItem('activeUser'));
    
    document.getElementById('title').textContent += user.name;

    
    
});


