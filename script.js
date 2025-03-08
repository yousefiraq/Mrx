// تفعيل الوضع الداكن مع التخزين المحلي
document.getElementById("darkModeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
});

// استعادة الوضع الداكن عند التحميل
window.addEventListener('load', () => {
    if (localStorage.getItem("darkMode") === 'true') {
        document.body.classList.add("dark-mode");
    }
});

// تأثيرات الشعار
document.querySelector('.iraq-logo').addEventListener('mouseover', function() {
    this.style.transform = 'rotate(360deg)';
});

document.querySelector('.iraq-logo').addEventListener('mouseout', function() {
    this.style.transform = 'rotate(0deg)';
});
