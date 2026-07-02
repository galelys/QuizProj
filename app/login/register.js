
document.addEventListener('DOMContentLoaded' , function(){
    let btn_back = document.getElementById('backLogBTN');

    btn_back.addEventListener('click' , goToLogin);

});

function goToLogin() {
    window.location.href = "login.html";
}