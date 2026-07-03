/**this file is the dark mode file! */

export function initThemeToggle() {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
        document.body.classList.add("dark-mode");
    }

    const btn = document.getElementById("themeToggle");

    if (btn) {
        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("dark-mode") ? "dark" : "light"
            );
        });
    }
}