// file to dark mode!

export function initThemeToggle() {
    // see if there is already saved theme
    const saved = localStorage.getItem("theme");
    const btn = document.getElementById("themeToggle");
    // change to dark if there is a saved dark mode
    if (saved === "dark") {
        document.body.classList.add("dark-mode");
    }
    // function for changing the the buttons text 
    function updateButtonText(btn) {
        btn.textContent =
            document.body.classList.contains("dark-mode")
                ? "Light Mode"
                : "Dark Mode";
    }

    if (btn) {
        updateButtonText(btn);

        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("dark-mode")
                    ? "dark"
                    : "light"
            );

            updateButtonText(btn);
        });
    }
}