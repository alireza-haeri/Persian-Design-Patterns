/**
 * اسکریپت‌های مشترک برای تمام صفحات الگوهای طراحی
 * Design Patterns Repository - Common Scripts
 */

// تابع تغییر تم (روشن/تاریک)
function toggleTheme() {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = html.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        html.removeAttribute('data-theme');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        
        // به‌روزرسانی Mermaid در صورت وجود
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'default' });
            loadContent && loadContent();
        }
    } else {
        html.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        
        // به‌روزرسانی Mermaid در صورت وجود
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'dark' });
            loadContent && loadContent();
        }
    }
}

// بارگذاری تم ذخیره شده هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const themeIcon = document.getElementById('theme-icon');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.textContent = '☀️';
        }
        
        // تنظیم Mermaid برای تم تاریک
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'dark' });
        }
    } else {
        if (themeIcon) {
            themeIcon.textContent = '🌙';
        }
        
        // تنظیم Mermaid برای تم روشن
        if (typeof mermaid !== 'undefined') {
            mermaid.initialize({ startOnLoad: false, theme: 'default' });
        }
    }
});

/**
 * تابع بارگذاری محتوای README.md و تبدیل آن به HTML
 * این تابع فقط در صفحات الگوها استفاده می‌شود
 */
async function loadContent() {
    try {
        // بارگذاری فایل README.md
        const response = await fetch('README.md');
        const text = await response.text();
        
        // حذف عنوان اصلی (چون در header نمایش داده می‌شود)
        let content = text.replace(/^# .+\n\n/, '');
        
        // تنظیمات marked برای تبدیل Markdown به HTML
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            },
            breaks: true,
            gfm: true
        });
        
        // تبدیل Markdown به HTML
        let html = marked.parse(content);
        
        // تقسیم محتوا به بخش‌ها بر اساس h2
        html = html.replace(/<h2/g, '</section><section><h2');
        html = '<section>' + html + '</section>';
        html = html.replace('<section></section>', '');
        
        // قرار دادن محتوا در صفحه
        document.getElementById('content').innerHTML = html;
        
        // پیدا کردن و تبدیل نمودارهای Mermaid
        const mermaidBlocks = document.querySelectorAll('.language-mermaid');
        mermaidBlocks.forEach((block) => {
            const code = block.textContent;
            const div = document.createElement('div');
            div.className = 'mermaid';
            div.textContent = code;
            block.parentElement.replaceWith(div);
        });
        
        // رندر کردن نمودارهای Mermaid
        if (typeof mermaid !== 'undefined') {
            await mermaid.run();
        }
        
        // Syntax highlighting برای کدها
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
        
    } catch (error) {
        console.error('خطا در بارگذاری محتوا:', error);
        document.getElementById('content').innerHTML = 
            '<section><p>خطا در بارگذاری محتوا. لطفاً صفحه را مجدداً بارگذاری کنید.</p></section>';
    }
}
