# الگوی Proxy (پروکسی / نماینده)

## 🎯 هدف
الگوی Proxy یک الگوی طراحی ساختاری است که به شما اجازه می‌دهد یک جایگزین یا placeholder برای یک شیء دیگر فراهم کنید. یک Proxy دسترسی به شیء اصلی را کنترل می‌کند و به شما امکان می‌دهد کاری را قبل یا بعد از رسیدن درخواست به شیء اصلی انجام دهید.

## 🤔 مشکل
چرا می‌خواهید دسترسی به یک شیء را کنترل کنید؟ مثال بزنیم: یک شیء بزرگ دارید که مقدار زیادی منابع سیستم مصرف می‌کند. شما گاهی به آن نیاز دارید، اما نه همیشه.

می‌توانید پیاده‌سازی lazy initialization را انجام دهید: شیء را فقط زمانی ایجاد کنید که واقعاً نیاز است. اما تمام کلاینت‌های شیء باید کد اولیه‌سازی تنبل را اجرا کنند. متأسفانه، این احتمالاً باعث تکرار کد زیادی شود.

## 💡 راه‌حل
الگوی Proxy پیشنهاد می‌کند یک کلاس proxy جدید با همان رابط شیء سرویس اصلی ایجاد کنید. سپس برنامه خود را به‌روزرسانی می‌کنید تا شیء proxy را به تمام کلاینت‌های شیء اصلی منتقل کند. پس از دریافت درخواست از کلاینت، proxy یک شیء سرویس واقعی ایجاد می‌کند و تمام کار را به آن واگذار می‌کند.


## 👥 شرکت‌کنندگان

1. **ServiceInterface**: رابط مشترک برای Service و Proxy
2. **Service**: کلاس سرویس واقعی
3. **Proxy**: نماینده‌ای که دسترسی به Service را کنترل می‌کند
4. **Client**: با ServiceInterface کار می‌کند

## 🔄 انواع Proxy

### 1. Virtual Proxy (پروکسی مجازی)
کنترل دسترسی به منابعی که گران هستند

### 2. Protection Proxy (پروکسی محافظ)
کنترل دسترسی بر اساس حقوق

### 3. Remote Proxy (پروکسی از راه دور)
نمایش یک شیء که در فضای آدرس دیگری است

### 4. Caching Proxy (پروکسی حافظه نهان)
ذخیره نتایج درخواست‌ها

## ⚖️ پیامدها

### مزایا ✅
- **کنترل دسترسی**: کنترل زمان و نحوه دسترسی به شیء
- **Lazy initialization**: ایجاد شیء فقط در صورت نیاز
- **Logging و Caching**: افزودن قابلیت‌های اضافی بدون تغییر سرویس
- **اصل باز/بسته**: می‌توانید proxies جدید معرفی کنید بدون تغییر سرویس

### معایب ❌
- کد ممکن است پیچیده‌تر شود
- پاسخ سرویس ممکن است با تأخیر همراه باشد

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;
using System.Threading;

// رابط سرویس - تعریف عملیات مشترک بین سرویس واقعی و پروکسی
public interface IImage
{
    void Display();
}

// سرویس واقعی - کلاسی که عملیات واقعی را انجام می‌دهد
public class RealImage : IImage
{
    private string _filename;

    public RealImage(string filename)
    {
        _filename = filename;
        LoadFromDisk();
    }

    // متد خصوصی برای بارگذاری تصویر از دیسک
    private void LoadFromDisk()
    {
        Console.WriteLine($"💿 بارگذاری تصویر از دیسک: {_filename}");
        Thread.Sleep(2000); // شبیه‌سازی بارگذاری
    }

    public void Display()
    {
        Console.WriteLine($"🖼️ نمایش تصویر: {_filename}");
    }
}

// Virtual Proxy - پروکسی مجازی برای Lazy Loading
public class ImageProxy : IImage
{
    private string _filename;
    private RealImage _realImage;

    public ImageProxy(string filename)
    {
        _filename = filename;
        _realImage = null;
    }

    public void Display()
    {
        // ایجاد شیء واقعی فقط در صورت نیاز (Lazy Initialization)
        if (_realImage == null)
        {
            Console.WriteLine("⏳ تصویر هنوز بارگذاری نشده، در حال بارگذاری...");
            _realImage = new RealImage(_filename);
        }
        _realImage.Display();
    }
}

// Protection Proxy - پروکسی محافظ برای کنترل دسترسی
public class ProtectedImageProxy : IImage
{
    private string _filename;
    private string _userRole;
    private RealImage _realImage;

    public ProtectedImageProxy(string filename, string userRole)
    {
        _filename = filename;
        _userRole = userRole;
        _realImage = null;
    }

    public void Display()
    {
        // بررسی دسترسی کاربر
        if (_userRole != "admin")
        {
            Console.WriteLine("🚫 دسترسی رد شد! فقط ادمین می‌تواند این تصویر را ببیند.");
            return;
        }

        // ایجاد شیء واقعی در صورت داشتن دسترسی
        if (_realImage == null)
        {
            _realImage = new RealImage(_filename);
        }
        _realImage.Display();
    }
}

// Caching Proxy - پروکسی کش‌دار برای ذخیره نتایج
public class CachingImageProxy : IImage
{
    private string _filename;
    // کش استاتیک برای اشتراک بین تمام نمونه‌ها
    private static Dictionary<string, RealImage> _cache = new Dictionary<string, RealImage>();

    public CachingImageProxy(string filename)
    {
        _filename = filename;
    }

    public void Display()
    {
        // بررسی وجود تصویر در کش
        if (_cache.ContainsKey(_filename))
        {
            Console.WriteLine($"⚡ نمایش تصویر از کش: {_filename}");
        }
        else
        {
            Console.WriteLine($"📥 بارگذاری و کش کردن تصویر: {_filename}");
            _cache[_filename] = new RealImage(_filename);
        }

        _cache[_filename].Display();
    }
}

// کلاس اصلی برای نمایش مثال‌های استفاده
public class Program
{
    public static void Main(string[] args)
    {
        Console.OutputEncoding = System.Text.Encoding.UTF8;
        Console.WriteLine("🎭 الگوی Proxy\n");
        Console.WriteLine(new string('=', 60));

        // Virtual Proxy - بارگذاری تنبل
        Console.WriteLine("\n1️⃣ Virtual Proxy (Lazy Loading):");
        Console.WriteLine(new string('-', 60));
        Console.WriteLine("ایجاد proxy...");
        IImage image1 = new ImageProxy("photo1.jpg");
        Console.WriteLine("Proxy ایجاد شد، اما تصویر واقعی هنوز بارگذاری نشده\n");

        Console.WriteLine("اولین نمایش:");
        image1.Display();

        Console.WriteLine("\nدومین نمایش:");
        image1.Display();

        // Protection Proxy - کنترل دسترسی
        Console.WriteLine("\n\n2️⃣ Protection Proxy (Access Control):");
        Console.WriteLine(new string('-', 60));

        Console.WriteLine("کاربر عادی:");
        IImage image2 = new ProtectedImageProxy("secret.jpg", "user");
        image2.Display();

        Console.WriteLine("\nکاربر ادمین:");
        IImage image3 = new ProtectedImageProxy("secret.jpg", "admin");
        image3.Display();

        // Caching Proxy - کش کردن نتایج
        Console.WriteLine("\n\n3️⃣ Caching Proxy:");
        Console.WriteLine(new string('-', 60));

        Console.WriteLine("اولین درخواست:");
        IImage image4 = new CachingImageProxy("cached_photo.jpg");
        image4.Display();

        Console.WriteLine("\nدومین درخواست (از کش):");
        IImage image5 = new CachingImageProxy("cached_photo.jpg");
        image5.Display();
    }
}
```

### 📤 خروجی برنامه:
```
🎭 الگوی Proxy

============================================================

1️⃣ Virtual Proxy (Lazy Loading):
------------------------------------------------------------
ایجاد proxy...
Proxy ایجاد شد، اما تصویر واقعی هنوز بارگذاری نشده

اولین نمایش:
⏳ تصویر هنوز بارگذاری نشده، در حال بارگذاری...
💿 بارگذاری تصویر از دیسک: photo1.jpg
🖼️ نمایش تصویر: photo1.jpg

دومین نمایش:
🖼️ نمایش تصویر: photo1.jpg


2️⃣ Protection Proxy (Access Control):
------------------------------------------------------------
کاربر عادی:
🚫 دسترسی رد شد! فقط ادمین می‌تواند این تصویر را ببیند.

کاربر ادمین:
💿 بارگذاری تصویر از دیسک: secret.jpg
🖼️ نمایش تصویر: secret.jpg


3️⃣ Caching Proxy:
------------------------------------------------------------
اولین درخواست:
📥 بارگذاری و کش کردن تصویر: cached_photo.jpg
💿 بارگذاری تصویر از دیسک: cached_photo.jpg
🖼️ نمایش تصویر: cached_photo.jpg

دومین درخواست (از کش):
⚡ نمایش تصویر از کش: cached_photo.jpg
🖼️ نمایش تصویر: cached_photo.jpg
```

## 🎯 مثال کاربردی واقعی

### مثال 1: Proxy برای API
```csharp
using System;
using System.Collections.Generic;
using System.Threading;

// رابط سرویس داده
public interface IDataService
{
    Dictionary<string, object> GetData(int userId);
}

// سرویس واقعی که با API ارتباط برقرار می‌کند
public class RealDataService : IDataService
{
    public Dictionary<string, object> GetData(int userId)
    {
        Console.WriteLine($"🌐 درخواست API برای کاربر {userId}");
        Thread.Sleep(1000); // شبیه‌سازی تأخیر شبکه
        
        return new Dictionary<string, object>
        {
            { "id", userId },
            { "name", $"کاربر {userId}" }
        };
    }
}

// پروکسی کش‌دار برای سرویس داده
public class CachedDataServiceProxy : IDataService
{
    private RealDataService _service;
    private Dictionary<int, Dictionary<string, object>> _cache;

    public CachedDataServiceProxy()
    {
        _service = new RealDataService();
        _cache = new Dictionary<int, Dictionary<string, object>>();
    }

    public Dictionary<string, object> GetData(int userId)
    {
        // بررسی وجود داده در کش
        if (_cache.ContainsKey(userId))
        {
            Console.WriteLine($"⚡ بازگشت از کش برای کاربر {userId}");
            return _cache[userId];
        }

        // دریافت داده از سرویس واقعی و ذخیره در کش
        var data = _service.GetData(userId);
        _cache[userId] = data;
        return data;
    }
}

// نمونه استفاده
public class APIProxyExample
{
    public static void Example()
    {
        IDataService service = new CachedDataServiceProxy();
        
        Console.WriteLine("درخواست اول:");
        var data1 = service.GetData(1);
        Console.WriteLine($"دریافت شد: ID={data1["id"]}, Name={data1["name"]}\n");
        
        Console.WriteLine("درخواست دوم (از کش):");
        var data2 = service.GetData(1);
        Console.WriteLine($"دریافت شد: ID={data2["id"]}, Name={data2["name"]}");
    }
}
```

### مثال 2: Database Proxy
```csharp
using System;
using System.Collections.Generic;

// رابط دیتابیس
public interface IDatabase
{
    string Query(string sql);
}

// دیتابیس واقعی
public class RealDatabase : IDatabase
{
    public string Query(string sql)
    {
        Console.WriteLine($"🗄️ اجرای کوئری: {sql}");
        return "نتیجه کوئری";
    }
}

// پروکسی دیتابیس با قابلیت کنترل دسترسی و لاگ‌گیری
public class DatabaseProxy : IDatabase
{
    private RealDatabase _database;
    private string _userRole;
    private List<string> _log;

    public DatabaseProxy(string userRole)
    {
        _database = new RealDatabase();
        _userRole = userRole;
        _log = new List<string>();
    }

    public string Query(string sql)
    {
        // بررسی دسترسی برای عملیات حساس
        string upperSql = sql.ToUpper();
        if (upperSql.Contains("DELETE") || upperSql.Contains("DROP"))
        {
            if (_userRole != "admin")
            {
                Console.WriteLine("🚫 دسترسی رد شد! فقط ادمین می‌تواند داده حذف کند.");
                return null;
            }
        }

        // لاگ کردن کوئری
        string timestamp = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
        _log.Add($"{timestamp}: {sql}");

        // اجرای کوئری
        return _database.Query(sql);
    }

    public void ShowLogs()
    {
        Console.WriteLine("\n📋 تاریخچه کوئری‌ها:");
        foreach (var log in _log)
        {
            Console.WriteLine($"  {log}");
        }
    }
}

// نمونه استفاده
public class DatabaseProxyExample
{
    public static void Example()
    {
        Console.WriteLine("👤 کاربر عادی:");
        IDatabase userDb = new DatabaseProxy("user");
        userDb.Query("SELECT * FROM users");
        userDb.Query("DELETE FROM users WHERE id=1");
        
        Console.WriteLine("\n👨‍💼 کاربر ادمین:");
        DatabaseProxy adminDb = new DatabaseProxy("admin");
        adminDb.Query("SELECT * FROM users");
        adminDb.Query("DELETE FROM users WHERE id=1");
        adminDb.ShowLogs();
    }
}
```

## 🔍 چه زمانی استفاده کنیم؟

1. **Lazy initialization** (Virtual Proxy)
2. **کنترل دسترسی** (Protection Proxy)
3. **Caching نتایج**
4. **Logging درخواست‌ها**
5. **شیء از راه دور** (Remote Proxy)

---

> **یادآوری**: Proxy یک نماینده هوشمند است که دسترسی به شیء را کنترل می‌کند! 🛡️
