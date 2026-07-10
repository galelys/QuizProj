import { User } from "../../../js/models/user.js";
import { UserService } from "../../../js/services/UserService.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener('DOMContentLoaded', function () {

    const userService = new UserService();
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    const user = userService.findUserById(activeUser.id);

    // dark mode button initialization 
    initThemeToggle();

    // writing welcome <user name> on the page
   

    document.getElementById('title').textContent += user.name;
    let dash = document.getElementById('dashboard');

  /*  dash.innerHTML = `
        <div id="tests">

        
        </div>
    `;*/



});


