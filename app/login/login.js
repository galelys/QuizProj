

document.addEventListener('DOMContentLoaded' , function(){

    // for "start" button 
    let btn_reg = document.getElementById('moveBTN');
    // for "login" button
    let btn_log = document.getElementById('loginBTN');



    // moving a page 
    btn_reg.addEventListener('click', goToRegister);
    btn_log.addEventListener('click' , login);
    
    function login(){
        // see if the user is actually in there
        const usrn = document.getElementById('userName')?.value;
        const pass = document.getElementById('paswrd')?.value;

        // check 

        // if yes then go to register


    }



});
function goToRegister() {
    window.location.href = "./register.html";
}


