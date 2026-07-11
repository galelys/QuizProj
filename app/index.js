import { initThemeToggle } from "../js/ui/theme.js";

document.addEventListener('DOMContentLoaded' , function(){

    initThemeToggle();
    

    // for "start" button 
    let btn_strt = document.getElementById('strtBTN');
    // moving a page 
    btn_strt.addEventListener('click',function(){
        window.location.href='auth/login.html';

    });
    


});