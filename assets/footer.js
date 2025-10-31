/**
 * مدیریت مرکزی فوتر برای تمام صفحات
 * Centralized footer management for all pages
 */

function initFooter() {
    const footer = document.querySelector('footer');
    
    if (!footer) {
        return;
    }
    
    // تشخیص URL فعلی ریپو از context
    const currentRepoUrl = document.querySelector('link[rel="canonical"]')?.href || 
                          window.location.origin + window.location.pathname.split('/')[1] || 
                          'https://github.com/alireza-haeri/Dp';
    
    // استخراج نام ریپو از URL
    const repoPath = window.location.pathname.split('/').filter(p => p)[0] || 'Dp';
    const githubRepoUrl = `https://github.com/alireza-haeri/${repoPath}`;
    
    // محتوای فوتر
    const footerContent = `
        <div class="container">
            <p>طراحی شده توسط <a href="https://github.com/alireza-haeri" target="_blank" rel="noopener noreferrer">@alireza-haeri</a> برای برنامه‌نویسان فارسی‌زبان</p>
            <p>مرجع کامل الگوهای طراحی نرم‌افزار به زبان فارسی</p>
            <div class="footer-links">
                <a href="${githubRepoUrl}" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://refactoring.guru/design-patterns" target="_blank" rel="noopener noreferrer">Refactoring.Guru</a>
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
