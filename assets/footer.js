/**
 * مدیریت مرکزی فوتر برای تمام صفحات
 * Centralized footer management for all pages
 */

function initFooter() {
    const footer = document.querySelector('footer');
    
    if (!footer) {
        return;
    }
    
    // محتوای فوتر
    const footerContent = `
        <div class="container">
            <p>طراحی شده توسط <a href="https://github.com/alireza-haeri" target="_blank">@alireza-haeri</a> برای برنامه‌نویسان فارسی‌زبان</p>
            <p>مرجع کامل الگوهای طراحی نرم‌افزار به زبان فارسی</p>
            <div class="footer-links">
                <a href="https://github.com/alireza-haeri/Dp" target="_blank">GitHub</a>
                <a href="https://refactoring.guru/design-patterns" target="_blank">Refactoring.Guru</a>
            </div>
        </div>
    `;
    
    footer.innerHTML = footerContent;
}

// اجرا بعد از بارگذاری صفحه
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooter);
} else {
    initFooter();
}
