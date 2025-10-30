# الگوی Decorator (تزئین‌کننده / دکوراتور)

## 🎯 هدف
الگوی Decorator یک الگوی طراحی ساختاری است که به شما اجازه می‌دهد رفتارهای جدیدی به اشیاء با قرار دادن آن‌ها در اشیاء wrapper ویژه که شامل رفتارها هستند، اضافه کنید.

## 🤔 مشکل
تصور کنید روی یک کتابخانه اطلاع‌رسانی کار می‌کنید که به برنامه‌ها اجازه می‌دهد کاربران را از رویدادهای مهم مطلع کنند.

نسخه اولیه کتابخانه بر اساس کلاس `Notifier` بود که فقط چند فیلد، یک سازنده و یک متد `send` داشت. این متد می‌توانست یک پیام از کلاینت دریافت کند و پیام را به لیستی از ایمیل‌ها ارسال کند.

در یک مقطع، متوجه می‌شوید که کاربران کتابخانه انتظار بیش از فقط اطلاع‌رسانی ایمیل را دارند. بسیاری از آن‌ها می‌خواهند در مورد مسائل حیاتی از طریق پیامک دریافت کنند. برخی دیگر می‌خواهند از طریق فیسبوک مطلع شوند و کاربران شرکتی می‌خواهند اعلان‌های Slack دریافت کنند.

## 💡 راه‌حل
گسترش یک کلاس اولین چیزی است که به ذهن می‌رسد زمانی که نیاز به تغییر رفتار یک شیء دارید. با این حال، وراثت چندین محدودیت جدی دارد که باید از آن‌ها آگاه باشید.

یکی از راه‌های غلبه بر این محدودیت‌ها استفاده از Aggregation یا Composition به جای Inheritance است. هر دو جایگزین تقریباً یکسان کار می‌کنند: یک شیء رفرنسی به شیء دیگر دارد و کار را به آن واگذار می‌کند، در حالی که با وراثت، خود شیء می‌تواند آن کار را انجام دهد و رفتار را از کلاس والد به ارث ببرد.

## 🏗️ ساختار

```
              ┌─────────────┐
              │  Component  │ (Interface)
              ├─────────────┤
              │ + operation()│
              └─────────────┘
                     △
                     │ implements
        ┌────────────┴────────────┐
        │                         │
  ┌──────────────┐        ┌──────────────┐
  │   Concrete   │        │   Decorator  │
  │  Component   │        │   (Abstract) │
  ├──────────────┤        ├──────────────┤
  │+ operation() │        │ - component  │
  └──────────────┘        │+ operation() │
                          └──────────────┘
                                 △
                                 │
                    ┌────────────┴────────────┐
                    │                         │
            ┌─────────────────┐      ┌─────────────────┐
            │ConcreteDecorator│      │ConcreteDecorator│
            │       A         │      │       B         │
            ├─────────────────┤      ├─────────────────┤
            │+ operation()    │      │+ operation()    │
            │+ extraBehavior()│      │+ extraBehavior()│
            └─────────────────┘      └─────────────────┘
```

## 👥 شرکت‌کنندگان

1. **Component**: رابط مشترک برای wrappers و اشیاء wrapped
2. **ConcreteComponent**: کلاس اشیاءی که wrapped می‌شوند
3. **Decorator**: کلاس پایه برای تمام decorators
4. **ConcreteDecorator**: decorators مشخص که رفتارهای اضافی را اضافه می‌کنند

## ⚖️ پیامدها

### مزایا ✅
- **انعطاف‌پذیری بیشتر**: می‌توانید رفتارهای جدید بدون ایجاد زیرکلاس‌های جدید اضافه کنید
- **مسئولیت‌های تقسیم شده**: می‌توانید چندین رفتار را با wrapping کردن شیء در چندین decorator اضافه کنید
- **ترکیب‌پذیری**: می‌توانید decorators را با هم ترکیب کنید
- **اصل تک مسئولیتی**: می‌توانید رفتار را بین چندین کلاس کوچک تقسیم کنید

### معایب ❌
- حذف یک wrapper خاص از پشته wrapper سخت است
- سخت است که decorator را طوری پیاده‌سازی کنید که رفتارش به ترتیب decorators در پشته وابسته نباشد

## 💻 مثال کد (C#)

```csharp
using System;

namespace DecoratorPattern
{
    // Component Interface - رابط اصلی قهوه
    public interface ICoffee
    {
        // محاسبه قیمت قهوه
        double Cost();
        
        // توضیحات قهوه
        string Description();
    }

    // Concrete Component - قهوه ساده پایه
    public class SimpleCoffee : ICoffee
    {
        public double Cost()
        {
            return 5000; // 5000 تومان
        }

        public string Description()
        {
            return "قهوه ساده";
        }
    }

    // Decorator Base - کلاس پایه دکوراتور
    public abstract class CoffeeDecorator : ICoffee
    {
        protected ICoffee _coffee;

        public CoffeeDecorator(ICoffee coffee)
        {
            _coffee = coffee;
        }

        public virtual double Cost()
        {
            return _coffee.Cost();
        }

        public virtual string Description()
        {
            return _coffee.Description();
        }
    }

    // Concrete Decorator - دکوراتور شیر
    public class MilkDecorator : CoffeeDecorator
    {
        public MilkDecorator(ICoffee coffee) : base(coffee) { }

        public override double Cost()
        {
            return _coffee.Cost() + 1000; // اضافه کردن 1000 تومان
        }

        public override string Description()
        {
            return _coffee.Description() + " + شیر 🥛";
        }
    }

    // Concrete Decorator - دکوراتور شکر
    public class SugarDecorator : CoffeeDecorator
    {
        public SugarDecorator(ICoffee coffee) : base(coffee) { }

        public override double Cost()
        {
            return _coffee.Cost() + 500; // اضافه کردن 500 تومان
        }

        public override string Description()
        {
            return _coffee.Description() + " + شکر 🧂";
        }
    }

    // Concrete Decorator - دکوراتور خامه
    public class WhippedCreamDecorator : CoffeeDecorator
    {
        public WhippedCreamDecorator(ICoffee coffee) : base(coffee) { }

        public override double Cost()
        {
            return _coffee.Cost() + 2000; // اضافه کردن 2000 تومان
        }

        public override string Description()
        {
            return _coffee.Description() + " + خامه ☁️";
        }
    }

    // Concrete Decorator - دکوراتور کارامل
    public class CaramelDecorator : CoffeeDecorator
    {
        public CaramelDecorator(ICoffee coffee) : base(coffee) { }

        public override double Cost()
        {
            return _coffee.Cost() + 1500; // اضافه کردن 1500 تومان
        }

        public override string Description()
        {
            return _coffee.Description() + " + کارامل 🍯";
        }
    }

    // Concrete Decorator - دکوراتور وانیل
    public class VanillaDecorator : CoffeeDecorator
    {
        public VanillaDecorator(ICoffee coffee) : base(coffee) { }

        public override double Cost()
        {
            return _coffee.Cost() + 1200; // اضافه کردن 1200 تومان
        }

        public override string Description()
        {
            return _coffee.Description() + " + وانیل 🌼";
        }
    }

    // برنامه اصلی
    class Program
    {
        static void Main(string[] args)
        {
            // تنظیم کدگذاری برای نمایش صحیح فارسی و ایموجی‌ها
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("☕ الگوی Decorator - سفارش قهوه\n");
            Console.WriteLine(new string('=', 60));

            // 1️⃣ قهوه ساده
            Console.WriteLine("\n1️⃣ قهوه ساده:");
            Console.WriteLine(new string('-', 60));
            ICoffee coffee1 = new SimpleCoffee();
            Console.WriteLine(coffee1.Description());
            Console.WriteLine($"💰 قیمت: {coffee1.Cost():N0} تومان");

            // 2️⃣ قهوه با شیر
            Console.WriteLine("\n2️⃣ قهوه با شیر:");
            Console.WriteLine(new string('-', 60));
            ICoffee coffee2 = new SimpleCoffee();
            coffee2 = new MilkDecorator(coffee2);
            Console.WriteLine(coffee2.Description());
            Console.WriteLine($"💰 قیمت: {coffee2.Cost():N0} تومان");

            // 3️⃣ قهوه با شیر و شکر
            Console.WriteLine("\n3️⃣ قهوه با شیر و شکر:");
            Console.WriteLine(new string('-', 60));
            ICoffee coffee3 = new SimpleCoffee();
            coffee3 = new MilkDecorator(coffee3);
            coffee3 = new SugarDecorator(coffee3);
            Console.WriteLine(coffee3.Description());
            Console.WriteLine($"💰 قیمت: {coffee3.Cost():N0} تومان");

            // 4️⃣ قهوه ویژه (با همه افزودنی‌ها)
            Console.WriteLine("\n4️⃣ قهوه ویژه (با همه افزودنی‌ها):");
            Console.WriteLine(new string('-', 60));
            ICoffee coffee4 = new SimpleCoffee();
            coffee4 = new MilkDecorator(coffee4);
            coffee4 = new SugarDecorator(coffee4);
            coffee4 = new WhippedCreamDecorator(coffee4);
            coffee4 = new CaramelDecorator(coffee4);
            coffee4 = new VanillaDecorator(coffee4);
            Console.WriteLine(coffee4.Description());
            Console.WriteLine($"💰 قیمت: {coffee4.Cost():N0} تومان");

            // 5️⃣ کاپوچینو (شیر + خامه)
            Console.WriteLine("\n5️⃣ کاپوچینو:");
            Console.WriteLine(new string('-', 60));
            ICoffee coffee5 = new SimpleCoffee();
            coffee5 = new MilkDecorator(coffee5);
            coffee5 = new WhippedCreamDecorator(coffee5);
            Console.WriteLine(coffee5.Description());
            Console.WriteLine($"💰 قیمت: {coffee5.Cost():N0} تومان");

            Console.WriteLine("\n" + new string('=', 60));
        }
    }
}
```

### 📤 خروجی برنامه:
```
☕ الگوی Decorator - سفارش قهوه

============================================================

1️⃣ قهوه ساده:
------------------------------------------------------------
قهوه ساده
💰 قیمت: 5,000 تومان

2️⃣ قهوه با شیر:
------------------------------------------------------------
قهوه ساده + شیر 🥛
💰 قیمت: 6,000 تومان

3️⃣ قهوه با شیر و شکر:
------------------------------------------------------------
قهوه ساده + شیر 🥛 + شکر 🧂
💰 قیمت: 6,500 تومان

4️⃣ قهوه ویژه (با همه افزودنی‌ها):
------------------------------------------------------------
قهوه ساده + شیر 🥛 + شکر 🧂 + خامه ☁️ + کارامل 🍯 + وانیل 🌼
💰 قیمت: 11,200 تومان

5️⃣ کاپوچینو:
------------------------------------------------------------
قهوه ساده + شیر 🥛 + خامه ☁️
💰 قیمت: 8,000 تومان

============================================================
```

## 🎯 مثال کاربردی واقعی

### مثال 1: فشرده‌سازی و رمزنگاری داده
```csharp
using System;

namespace DecoratorPattern.RealWorld
{
    // رابط منبع داده
    public interface IDataSource
    {
        void WriteData(string data);
        string ReadData();
    }

    // منبع داده فایل - Component اصلی
    public class FileDataSource : IDataSource
    {
        private string _filename;
        private string _data;

        public FileDataSource(string filename)
        {
            _filename = filename;
            _data = "";
        }

        public void WriteData(string data)
        {
            _data = data;
            Console.WriteLine($"💾 نوشتن داده در فایل {_filename}");
        }

        public string ReadData()
        {
            Console.WriteLine($"📖 خواندن داده از فایل {_filename}");
            return _data;
        }
    }

    // دکوراتور فشرده‌سازی
    public class CompressionDecorator : IDataSource
    {
        private IDataSource _source;

        public CompressionDecorator(IDataSource source)
        {
            _source = source;
        }

        public void WriteData(string data)
        {
            string compressed = $"[فشرده‌شده: {data}]";
            Console.WriteLine("🗜️ فشرده‌سازی داده...");
            _source.WriteData(compressed);
        }

        public string ReadData()
        {
            string data = _source.ReadData();
            Console.WriteLine("📦 باز کردن فشرده‌سازی...");
            return data.Replace("[فشرده‌شده: ", "").Replace("]", "");
        }
    }

    // دکوراتور رمزنگاری
    public class EncryptionDecorator : IDataSource
    {
        private IDataSource _source;

        public EncryptionDecorator(IDataSource source)
        {
            _source = source;
        }

        public void WriteData(string data)
        {
            string encrypted = $"[رمزنگاری‌شده: {data}]";
            Console.WriteLine("🔒 رمزنگاری داده...");
            _source.WriteData(encrypted);
        }

        public string ReadData()
        {
            string data = _source.ReadData();
            Console.WriteLine("🔓 رمزگشایی داده...");
            return data.Replace("[رمزنگاری‌شده: ", "").Replace("]", "");
        }
    }

    // استفاده از الگو
    class DataExample
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;
            
            Console.WriteLine("🔐 مثال فشرده‌سازی و رمزنگاری داده\n");
            Console.WriteLine(new string('=', 60));

            // ایجاد منبع داده فایل
            IDataSource file = new FileDataSource("data.txt");
            
            // اضافه کردن لایه رمزنگاری
            IDataSource encryptedFile = new EncryptionDecorator(file);
            
            // اضافه کردن لایه فشرده‌سازی
            IDataSource compressedEncrypted = new CompressionDecorator(encryptedFile);

            Console.WriteLine("\n📝 نوشتن داده:");
            Console.WriteLine(new string('-', 60));
            compressedEncrypted.WriteData("داده مهم");

            Console.WriteLine("\n📖 خواندن داده:");
            Console.WriteLine(new string('-', 60));
            string result = compressedEncrypted.ReadData();
            Console.WriteLine($"✅ داده نهایی: {result}");
            
            Console.WriteLine("\n" + new string('=', 60));
        }
    }
}
```

### 📤 خروجی مثال فشرده‌سازی:
```
🔐 مثال فشرده‌سازی و رمزنگاری داده

============================================================

📝 نوشتن داده:
------------------------------------------------------------
🗜️ فشرده‌سازی داده...
🔒 رمزنگاری داده...
💾 نوشتن داده در فایل data.txt

📖 خواندن داده:
------------------------------------------------------------
📖 خواندن داده از فایل data.txt
🔓 رمزگشایی داده...
📦 باز کردن فشرده‌سازی...
✅ داده نهایی: داده مهم

============================================================
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید مسئولیت‌های اضافی به اشیاء اضافه کنید بدون اینکه کد را تغییر دهید**
2. **زمانی که استفاده از وراثت غیرعملی یا غیرممکن است**
3. **زمانی که می‌خواهید رفتارها را به صورت پویا اضافه/حذف کنید**

---

> **یادآوری**: Decorator به شما اجازه می‌دهد رفتارها را لایه به لایه اضافه کنید! 🎁
