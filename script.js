import { db, collection, addDoc } from "./firebase-config.js";

// تفعيل الوضع الداكن
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// استعادة الوضع الداكن
window.addEventListener('load', () => {
    if (localStorage.getItem("darkMode") === 'true') {
        document.body.classList.add("dark-mode");
    }
});
