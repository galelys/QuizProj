import { User } from "../../js/models/User.js";
import { UserService } from "../../js/services/UserService.js";
import { initThemeToggle } from "../../js/ui/theme.js";


function settup_route(){

}
    // dark mode button initialization 
let menuButton = document.getElementById('menuBTNS');


menuButton.innerHTML = ` 
        <button id="createBTN" class="base-btn">Create</button>
        <button id="ExamsListBTN" class="base-btn">Exams</button>
        <button id="homeBTN" class="base-btn" >Home</button>`
    ;
    // create Exam button 
    let create_bth = document.getElementById('createBTN');

    // Exams list button
    let examsLst_bth = document.getElementById('ExamsListBTN');

        // Exams list button
    let home_bth = document.getElementById('homeBTN');

    create_bth.addEventListener('click' , GoToCreate);
    examsLst_bth.addEventListener('click' , GoToList);
    home_bth.addEventListener('click' , GoToHome);

    function GoToCreate(){
        window.location.href = "../create/createExam.html";
       // document.getElementById("contentFrame").src = "create/createExam.html";
    }

    function GoToList(){
        //document.getElementById("contentFrame").src = "./ExamsList/ExamsList.html";
        window.location.href = "../ExamsList/ExamsList.html";
    }

    function GoToHome(){
        window.location.href = "../Home/home.html";
    }
