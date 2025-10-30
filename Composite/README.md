# الگوی Composite (مرکب / ترکیبی)

## 🎯 هدف
الگوی Composite یک الگوی طراحی ساختاری است که به شما اجازه می‌دهد اشیاء را در ساختارهای درختی ترکیب کنید و سپس با این ساختارها طوری کار کنید که انگار اشیاء منفرد هستند.

## 🤔 مشکل
استفاده از الگوی Composite فقط زمانی منطقی است که مدل اصلی برنامه شما می‌تواند به صورت یک درخت نمایش داده شود.

به عنوان مثال، تصور کنید دو نوع شیء دارید: `محصولات` و `جعبه‌ها`. یک جعبه می‌تواند شامل چندین محصول و همچنین تعدادی جعبه کوچک‌تر باشد. این جعبه‌های کوچک نیز می‌توانند محصولات یا حتی جعبه‌های کوچک‌تر داشته باشند و غیره.

فرض کنید می‌خواهید قیمت کل سفارش را محاسبه کنید. رویکرد مستقیم باز کردن همه جعبه‌ها، بررسی همه محصولات و محاسبه مجموع است. اما در دنیای واقعی، باید سطوح جعبه و محصول را بدانید و...

## 💡 راه‌حل
الگوی Composite پیشنهاد می‌کند که با محصولات و جعبه‌ها از طریق یک رابط مشترک که یک متد برای محاسبه قیمت کل اعلام می‌کند، کار کنید.

## 🏗️ ساختار

```
        ┌──────────────┐
        │  Component   │ (Interface)
        ├──────────────┤
        │ + operation()│
        └──────────────┘
               △
               │
      ┌────────┴────────┐
      │                 │
┌───────────┐    ┌─────────────┐
│   Leaf    │    │  Composite  │
├───────────┤    ├─────────────┤
│+operation()│    │ - children  │
└───────────┘    │ + add()     │
                 │ + remove()  │
                 │ + operation()│
                 └─────────────┘
                       │
                       │ contains
                       ↓
                 ┌──────────────┐
                 │  Component   │
                 └──────────────┘
```

## 👥 شرکت‌کنندگان

1. **Component**: رابط برای تمام اشیاء در ترکیب
2. **Leaf**: اشیاء برگ (پایانی) بدون فرزند
3. **Composite**: اشیاءی که فرزند دارند
4. **Client**: با اشیاء از طریق رابط Component کار می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **کار با ساختارهای درختی پیچیده**: می‌توانید با درخت‌های پیچیده راحت‌تر کار کنید
- **اصل باز/بسته**: انواع عناصر جدید را بدون شکستن کد موجود معرفی کنید
- **یکسان‌سازی**: می‌توانید با اشیاء مرکب و ساده به یک شکل رفتار کنید

### معایب ❌
- ممکن است ارائه یک رابط مشترک برای کلاس‌هایی که عملکردشان خیلی متفاوت است دشوار باشد

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;

namespace CompositePattern
{
    // Component - رابط اصلی برای تمام اجزای سیستم فایل
    public abstract class FileSystemComponent
    {
        protected string name;

        public FileSystemComponent(string name)
        {
            this.name = name;
        }

        // متد انتزاعی برای محاسبه حجم
        public abstract int GetSize();

        // متد انتزاعی برای نمایش ساختار
        public abstract void Display(string indent = "");
    }

    // Leaf - کلاس فایل که برگ درخت است و فرزندی ندارد
    public class File : FileSystemComponent
    {
        private int size;

        public File(string name, int size) : base(name)
        {
            this.size = size;
        }

        // بازگرداندن حجم فایل
        public override int GetSize()
        {
            return size;
        }

        // نمایش اطلاعات فایل
        public override void Display(string indent = "")
        {
            Console.WriteLine($"{indent}📄 {name} ({size} KB)");
        }
    }

    // Composite - کلاس دایرکتوری که می‌تواند فرزند داشته باشد
    public class Directory : FileSystemComponent
    {
        private List<FileSystemComponent> children;

        public Directory(string name) : base(name)
        {
            children = new List<FileSystemComponent>();
        }

        // افزودن یک جزء (فایل یا دایرکتوری) به دایرکتوری
        public Directory Add(FileSystemComponent component)
        {
            children.Add(component);
            return this;
        }

        // حذف یک جزء از دایرکتوری
        public void Remove(FileSystemComponent component)
        {
            children.Remove(component);
        }

        // محاسبه حجم کل با جمع حجم تمام فرزندان
        public override int GetSize()
        {
            int total = 0;
            foreach (var child in children)
            {
                total += child.GetSize();
            }
            return total;
        }

        // نمایش ساختار دایرکتوری و فرزندانش به صورت درختی
        public override void Display(string indent = "")
        {
            Console.WriteLine($"{indent}📁 {name}/ ({GetSize()} KB)");
            foreach (var child in children)
            {
                child.Display(indent + "  ");
            }
        }
    }

    // کلاس اصلی برای اجرای برنامه
    class Program
    {
        static void Main(string[] args)
        {
            // تنظیم کدگذاری برای نمایش صحیح یونیکد (ایموجی‌ها)
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🗂️ الگوی Composite - سیستم فایل\n");
            Console.WriteLine(new string('=', 60));

            // ایجاد فایل‌ها
            File file1 = new File("document.txt", 10);
            File file2 = new File("photo.jpg", 500);
            File file3 = new File("video.mp4", 5000);
            File file4 = new File("music.mp3", 300);
            File file5 = new File("report.pdf", 200);

            // ایجاد دایرکتوری اسناد و افزودن فایل‌ها
            Directory documents = new Directory("Documents");
            documents.Add(file1);
            documents.Add(file5);

            // ایجاد دایرکتوری تصاویر
            Directory pictures = new Directory("Pictures");
            pictures.Add(file2);

            // ایجاد دایرکتوری ویدیوها
            Directory videos = new Directory("Videos");
            videos.Add(file3);

            // ایجاد دایرکتوری موسیقی
            Directory music = new Directory("Music");
            music.Add(file4);

            // ایجاد دایرکتوری رسانه و افزودن زیرشاخه‌ها
            Directory media = new Directory("Media");
            media.Add(pictures);
            media.Add(videos);
            media.Add(music);

            // ایجاد دایرکتوری ریشه و افزودن دایرکتوری‌های اصلی
            Directory root = new Directory("Root");
            root.Add(documents);
            root.Add(media);

            // نمایش ساختار کامل سیستم فایل
            Console.WriteLine("\n📊 ساختار سیستم فایل:");
            Console.WriteLine(new string('-', 60));
            root.Display();

            // نمایش حجم کل
            Console.WriteLine($"\n\n💾 حجم کل: {root.GetSize()} KB");

            Console.WriteLine("\n\nبرای خروج یک کلید را فشار دهید...");
            Console.ReadKey();
        }
    }
}
```

### 📋 خروجی برنامه:
```
🗂️ الگوی Composite - سیستم فایل

============================================================

📊 ساختار سیستم فایل:
------------------------------------------------------------
📁 Root/ (6010 KB)
  📁 Documents/ (210 KB)
    📄 document.txt (10 KB)
    📄 report.pdf (200 KB)
  📁 Media/ (5800 KB)
    📁 Pictures/ (500 KB)
      📄 photo.jpg (500 KB)
    📁 Videos/ (5000 KB)
      📄 video.mp4 (5000 KB)
    📁 Music/ (300 KB)
      📄 music.mp3 (300 KB)


💾 حجم کل: 6010 KB

برای خروج یک کلید را فشار دهید...
```

## 🎯 مثال کاربردی واقعی

### مثال 1: ساختار سازمانی
```csharp
using System;
using System.Collections.Generic;

namespace CompositePattern.OrganizationalStructure
{
    // Component - رابط اصلی برای تمام کارمندان
    public abstract class Employee
    {
        protected string name;
        protected int salary;

        public Employee(string name, int salary)
        {
            this.name = name;
            this.salary = salary;
        }

        // محاسبه مجموع حقوق
        public abstract int GetSalary();

        // نمایش ساختار سازمانی
        public abstract void Display(string indent = "");
    }

    // Leaf - کلاس توسعه‌دهنده که برگ درخت است
    public class Developer : Employee
    {
        public Developer(string name, int salary) : base(name, salary)
        {
        }

        public override int GetSalary()
        {
            return salary;
        }

        public override void Display(string indent = "")
        {
            Console.WriteLine($"{indent}👨‍💻 {name} - توسعه‌دهنده (حقوق: {salary:N0} تومان)");
        }
    }

    // Composite - کلاس مدیر که می‌تواند زیرمجموعه داشته باشد
    public class Manager : Employee
    {
        private List<Employee> subordinates;

        public Manager(string name, int salary) : base(name, salary)
        {
            subordinates = new List<Employee>();
        }

        // افزودن کارمند به زیرمجموعه
        public void Add(Employee employee)
        {
            subordinates.Add(employee);
        }

        // محاسبه مجموع حقوق مدیر و تمام زیرمجموعه‌ها
        public override int GetSalary()
        {
            int total = salary;
            foreach (var emp in subordinates)
            {
                total += emp.GetSalary();
            }
            return total;
        }

        // نمایش مدیر و تمام زیرمجموعه‌های او
        public override void Display(string indent = "")
        {
            Console.WriteLine($"{indent}👔 {name} - مدیر (حقوق: {salary:N0} تومان)");
            foreach (var emp in subordinates)
            {
                emp.Display(indent + "  ");
            }
        }
    }

    // مثال استفاده
    class OrganizationalDemo
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🏢 الگوی Composite - ساختار سازمانی\n");
            Console.WriteLine(new string('=', 60));

            // ایجاد توسعه‌دهندگان
            Developer dev1 = new Developer("علی احمدی", 15000000);
            Developer dev2 = new Developer("سارا محمدی", 18000000);
            Developer dev3 = new Developer("رضا کریمی", 16000000);
            Developer dev4 = new Developer("مریم رضایی", 17000000);

            // ایجاد مدیران میانی
            Manager techLead1 = new Manager("حسین نوری", 25000000);
            techLead1.Add(dev1);
            techLead1.Add(dev2);

            Manager techLead2 = new Manager("فاطمه صادقی", 24000000);
            techLead2.Add(dev3);
            techLead2.Add(dev4);

            // ایجاد مدیر ارشد
            Manager cto = new Manager("محمد رحیمی", 40000000);
            cto.Add(techLead1);
            cto.Add(techLead2);

            // نمایش ساختار سازمانی
            Console.WriteLine("\n👥 ساختار سازمانی:");
            Console.WriteLine(new string('-', 60));
            cto.Display();

            // محاسبه هزینه کل حقوق
            Console.WriteLine($"\n\n💰 مجموع حقوق بخش فنی: {cto.GetSalary():N0} تومان");

            Console.WriteLine("\nبرای خروج یک کلید را فشار دهید...");
            Console.ReadKey();
        }
    }
}
```

### 📋 خروجی برنامه:
```
🏢 الگوی Composite - ساختار سازمانی

============================================================

👥 ساختار سازمانی:
------------------------------------------------------------
👔 محمد رحیمی - مدیر (حقوق: 40,000,000 تومان)
  👔 حسین نوری - مدیر (حقوق: 25,000,000 تومان)
    👨‍💻 علی احمدی - توسعه‌دهنده (حقوق: 15,000,000 تومان)
    👨‍💻 سارا محمدی - توسعه‌دهنده (حقوق: 18,000,000 تومان)
  👔 فاطمه صادقی - مدیر (حقوق: 24,000,000 تومان)
    👨‍💻 رضا کریمی - توسعه‌دهنده (حقوق: 16,000,000 تومان)
    👨‍💻 مریم رضایی - توسعه‌دهنده (حقوق: 17,000,000 تومان)


💰 مجموع حقوق بخش فنی: 155,000,000 تومان

برای خروج یک کلید را فشار دهید...
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که باید ساختار درختی اشیاء را پیاده‌سازی کنید**
2. **زمانی که می‌خواهید کد کلاینت با اشیاء ساده و پیچیده یکسان رفتار کند**

---

> **یادآوری**: Composite به شما کمک می‌کند با ساختارهای درختی به سادگی کار کنید! 🌳
