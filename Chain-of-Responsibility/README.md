# الگوی Chain of Responsibility (زنجیره مسئولیت)

## 🎯 هدف
الگوی Chain of Responsibility یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد درخواست‌ها را در یک زنجیره از handler ها (دست‌گیرنده‌ها) منتقل کنید. پس از دریافت درخواست، هر handler تصمیم می‌گیرد که آن را پردازش کند یا به handler بعدی در زنجیره منتقل کند.

## 🤔 مشکل
تصور کنید در حال کار روی یک سیستم سفارش آنلاین هستید. می‌خواهید دسترسی به سیستم را محدود کنید تا فقط کاربران احراز هویت شده بتوانند سفارش ایجاد کنند. همچنین، کاربرانی که مجوزهای اداری دارند باید دسترسی کامل به تمام سفارش‌ها داشته باشند.

بعد از کمی برنامه‌ریزی، متوجه می‌شوید که این بررسی‌ها باید به صورت ترتیبی انجام شوند. برنامه می‌تواند سعی کند کاربر را با سیستم احراز هویت کند هر بار که درخواستی حاوی اعتبارنامه کاربر دریافت می‌کند.

## 💡 راه‌حل
مثل بسیاری از الگوهای طراحی رفتاری دیگر، Chain of Responsibility بر تبدیل رفتارهای خاص به اشیاء مستقل به نام handlers متکی است. در مورد ما، هر بررسی باید به کلاس خودش منتقل شود که دارای یک متد واحد است که بررسی را انجام می‌دهد.


## ⚖️ پیامدها

### مزایا ✅
- **جفت‌شدگی سست**: فرستنده و گیرنده را جدا می‌کند
- **انعطاف‌پذیری**: می‌توانید ترتیب handlers را تغییر دهید
- **اصل تک مسئولیتی**: می‌توانید کلاس‌های عملیات را از کلاس‌های فراخوانی جدا کنید
- **اصل باز/بسته**: handlers جدید بدون شکستن کد موجود

### معایب ❌
- برخی درخواست‌ها ممکن است بدون پردازش بمانند
- دیباگ زنجیره می‌تواند سخت باشد

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;

namespace ChainOfResponsibilityPattern
{
    // کلاس درخواست برای نگهداری اطلاعات درخواست
    public class Request
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public bool AdminRequired { get; set; }
        public string Data { get; set; }

        public Request()
        {
            Role = "user"; // مقدار پیش‌فرض
            AdminRequired = false;
        }
    }

    // رابط Handler - تعریف رابط مشترک برای تمام دست‌گیرنده‌ها
    public abstract class Handler
    {
        // نگهداری مرجع به handler بعدی در زنجیره
        protected Handler _nextHandler;

        // تنظیم handler بعدی و بازگشت آن برای ایجاد زنجیره روان
        public Handler SetNext(Handler handler)
        {
            _nextHandler = handler;
            return handler;
        }

        // متد انتزاعی برای پردازش درخواست
        public abstract string Handle(Request request);
    }

    // Handler احراز هویت - بررسی اعتبار کاربری
    public class AuthenticationHandler : Handler
    {
        public override string Handle(Request request)
        {
            // بررسی وجود نام کاربری و رمز عبور
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
            {
                return "❌ خطای احراز هویت: نام کاربری یا رمز عبور وارد نشده";
            }

            // بررسی صحت رمز عبور
            if (request.Password != "secret123")
            {
                return "❌ خطای احراز هویت: رمز عبور اشتباه است";
            }

            Console.WriteLine("✅ احراز هویت موفق");

            // انتقال درخواست به handler بعدی در زنجیره
            if (_nextHandler != null)
            {
                return _nextHandler.Handle(request);
            }

            return null;
        }
    }

    // Handler مجوزدهی - بررسی سطح دسترسی کاربر
    public class AuthorizationHandler : Handler
    {
        public override string Handle(Request request)
        {
            // بررسی نیاز به دسترسی ادمین
            if (request.AdminRequired && request.Role != "admin")
            {
                return "❌ خطای مجوز: نیاز به دسترسی ادمین";
            }

            Console.WriteLine("✅ مجوز تأیید شد");

            // انتقال درخواست به handler بعدی
            if (_nextHandler != null)
            {
                return _nextHandler.Handle(request);
            }

            return null;
        }
    }

    // Handler اعتبارسنجی - بررسی صحت داده‌ها
    public class ValidationHandler : Handler
    {
        public override string Handle(Request request)
        {
            // بررسی خالی نبودن داده
            if (string.IsNullOrEmpty(request.Data))
            {
                return "❌ خطای اعتبارسنجی: داده خالی است";
            }

            // بررسی طول داده
            if (request.Data.Length < 5)
            {
                return "❌ خطای اعتبارسنجی: داده باید حداقل 5 کاراکتر باشد";
            }

            Console.WriteLine("✅ اعتبارسنجی موفق");

            // انتقال درخواست به handler بعدی
            if (_nextHandler != null)
            {
                return _nextHandler.Handle(request);
            }

            return null;
        }
    }

    // Handler پردازش نهایی - پردازش درخواست معتبر
    public class ProcessHandler : Handler
    {
        public override string Handle(Request request)
        {
            Console.WriteLine($"✅ پردازش درخواست: {request.Data}");
            return "درخواست با موفقیت پردازش شد! 🎉";
        }
    }

    // برنامه اصلی
    class Program
    {
        static void Main(string[] args)
        {
            // تنظیم کدگذاری برای نمایش صحیح فارسی
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🔗 الگوی Chain of Responsibility\n");
            Console.WriteLine("============================================================");

            // ساخت زنجیره مسئولیت
            var auth = new AuthenticationHandler();
            var authz = new AuthorizationHandler();
            var validation = new ValidationHandler();
            var process = new ProcessHandler();

            // اتصال handler ها به یکدیگر برای ایجاد زنجیره
            auth.SetNext(authz).SetNext(validation).SetNext(process);

            // تست 1: درخواست معتبر
            Console.WriteLine("\n📤 تست 1: درخواست معتبر");
            Console.WriteLine("------------------------------------------------------------");
            var request1 = new Request
            {
                Username = "ali",
                Password = "secret123",
                Role = "user",
                Data = "سفارش محصول"
            };
            string result = auth.Handle(request1);
            Console.WriteLine($"📥 نتیجه: {result}");

            // تست 2: رمز عبور اشتباه
            Console.WriteLine("\n\n📤 تست 2: رمز عبور اشتباه");
            Console.WriteLine("------------------------------------------------------------");
            var request2 = new Request
            {
                Username = "reza",
                Password = "wrong",
                Data = "سفارش محصول"
            };
            result = auth.Handle(request2);
            Console.WriteLine($"📥 نتیجه: {result}");

            // تست 3: نیاز به دسترسی ادمین
            Console.WriteLine("\n\n📤 تست 3: نیاز به دسترسی ادمین");
            Console.WriteLine("------------------------------------------------------------");
            var request3 = new Request
            {
                Username = "sara",
                Password = "secret123",
                Role = "user",
                AdminRequired = true,
                Data = "حذف کاربر"
            };
            result = auth.Handle(request3);
            Console.WriteLine($"📥 نتیجه: {result}");

            // تست 4: داده نامعتبر
            Console.WriteLine("\n\n📤 تست 4: داده نامعتبر");
            Console.WriteLine("------------------------------------------------------------");
            var request4 = new Request
            {
                Username = "mehdi",
                Password = "secret123",
                Role = "user",
                Data = "کم"
            };
            result = auth.Handle(request4);
            Console.WriteLine($"📥 نتیجه: {result}");

            Console.WriteLine("\n\nبرای خروج کلیدی را فشار دهید...");
            Console.ReadKey();
        }
    }
}
```

### 📤 خروجی برنامه:
```
🔗 الگوی Chain of Responsibility

============================================================

📤 تست 1: درخواست معتبر
------------------------------------------------------------
✅ احراز هویت موفق
✅ مجوز تأیید شد
✅ اعتبارسنجی موفق
✅ پردازش درخواست: سفارش محصول
📥 نتیجه: درخواست با موفقیت پردازش شد! 🎉


📤 تست 2: رمز عبور اشتباه
------------------------------------------------------------
📥 نتیجه: ❌ خطای احراز هویت: رمز عبور اشتباه است


📤 تست 3: نیاز به دسترسی ادمین
------------------------------------------------------------
✅ احراز هویت موفق
📥 نتیجه: ❌ خطای مجوز: نیاز به دسترسی ادمین


📤 تست 4: داده نامعتبر
------------------------------------------------------------
✅ احراز هویت موفق
✅ مجوز تأیید شد
📥 نتیجه: ❌ خطای اعتبارسنجی: داده باید حداقل 5 کاراکتر باشد

برای خروج کلیدی را فشار دهید...
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم پشتیبانی مشتری
```csharp
// کلاس درخواست پشتیبانی
public class SupportRequest
{
    public string Priority { get; set; }  // low, medium, high
    public string Issue { get; set; }
}

// کلاس پایه برای پشتیبانی
public abstract class SupportHandler : Handler
{
    public abstract string Handle(SupportRequest request);
}

// پشتیبانی سطح 1 - مسائل ساده
public class Level1Support : Handler
{
    public override string Handle(Request request)
    {
        var supportRequest = request as SupportRequest;
        if (supportRequest?.Priority == "low")
        {
            return $"✅ پشتیبانی سطح 1: {supportRequest.Issue} حل شد";
        }
        
        Console.WriteLine("🔄 انتقال به سطح 2...");
        return _nextHandler?.Handle(request);
    }
}

// پشتیبانی سطح 2 - مسائل متوسط
public class Level2Support : Handler
{
    public override string Handle(Request request)
    {
        var supportRequest = request as SupportRequest;
        if (supportRequest?.Priority == "medium")
        {
            return $"✅ پشتیبانی سطح 2: {supportRequest.Issue} حل شد";
        }
        
        Console.WriteLine("🔄 انتقال به مدیر...");
        return _nextHandler?.Handle(request);
    }
}

// پشتیبانی مدیریتی - مسائل بحرانی
public class ManagerSupport : Handler
{
    public override string Handle(Request request)
    {
        var supportRequest = request as SupportRequest;
        return $"✅ مدیر: {supportRequest.Issue} حل شد (اولویت بالا)";
    }
}
```

### مثال 2: سیستم لاگ
```csharp
// کلاس درخواست لاگ
public class LogRequest
{
    public string Level { get; set; }     // INFO, DEBUG, WARNING, ERROR, CRITICAL
    public string Message { get; set; }
}

// لاگر کنسول - نمایش پیام‌های INFO و DEBUG
public class ConsoleLogger : Handler
{
    public override string Handle(Request request)
    {
        var logRequest = request as LogRequest;
        if (logRequest != null && 
            (logRequest.Level == "INFO" || logRequest.Level == "DEBUG"))
        {
            Console.WriteLine($"📺 Console: {logRequest.Message}");
        }
        
        return _nextHandler?.Handle(request);
    }
}

// لاگر فایل - ذخیره هشدارها و خطاها
public class FileLogger : Handler
{
    public override string Handle(Request request)
    {
        var logRequest = request as LogRequest;
        if (logRequest != null && 
            (logRequest.Level == "WARNING" || logRequest.Level == "ERROR"))
        {
            Console.WriteLine($"📁 File: {logRequest.Message}");
        }
        
        return _nextHandler?.Handle(request);
    }
}

// لاگر ایمیل - ارسال خطاهای بحرانی
public class EmailLogger : Handler
{
    public override string Handle(Request request)
    {
        var logRequest = request as LogRequest;
        if (logRequest != null && logRequest.Level == "CRITICAL")
        {
            Console.WriteLine($"📧 Email: {logRequest.Message}");
        }
        
        return _nextHandler?.Handle(request);
    }
}
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که برنامه باید انواع مختلف درخواست‌ها را به روش‌های مختلف پردازش کند**
2. **زمانی که ترتیب handlers مهم است**
3. **زمانی که مجموعه handlers و ترتیب آن‌ها باید در زمان اجرا تغییر کند**

---

> **یادآوری**: Chain of Responsibility درخواست را در زنجیره منتقل می‌کند تا handler مناسب آن را پردازش کند! 🔗
