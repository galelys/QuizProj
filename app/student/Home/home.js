import { UserService } from "../../../js/services/UserService.js";
import { User } from "../../../js/models/user.js";
import { initThemeToggle } from "../../../js/ui/theme.js";

document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();

    const userService = new UserService();

    let user = JSON.parse(localStorage.getItem("activeUser"));

    if (!user) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get("id");

        if (id) {
            user = userService.findUserById(id);
        }
    }

    if (!user) {
        window.location.href = "../../auth/login.html";
        return;
    }

    document.getElementById("title").textContent = `Hello, ${user.name}`;
});