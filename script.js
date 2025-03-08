import { db, collection, addDoc } from "./firebase-config.js";

// تفعيل الوضع الداكن
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    
    // حفظ التفضيل في localStorage
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
});

// استعادة تفضيل الوضع الداكن عند التحميل
window.addEventListener('load', () => {
    const isDarkMode = localStorage.getItem("darkMode") === 'true';
    if (isDarkMode) document.body.classList.add("dark-mode");
});
