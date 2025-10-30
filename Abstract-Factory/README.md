# الگوی Abstract Factory (کارخانه انتزاعی)

## 🎯 هدف
الگوی Abstract Factory یک الگوی طراحی سازنده است که به شما اجازه می‌دهد خانواده‌هایی از اشیاء مرتبط یا وابسته را بدون مشخص کردن کلاس‌های مشخص آن‌ها تولید کنید.

## 🤔 مشکل
تصور کنید یک فروشگاه مبلمان شبیه‌ساز دارید. کد شما شامل کلاس‌هایی است که نشان‌دهنده:
- خانواده‌ای از محصولات مرتبط است، مثلاً: `صندلی` + `مبل` + `میز قهوه`
- چندین نوع مختلف از این خانواده. به عنوان مثال، محصولات `صندلی` + `مبل` + `میز قهوه` در این سبک‌ها موجود است: `مدرن`، `ویکتوریا`، `هنری`

شما به راهی نیاز دارید که اشیاء مبلمان را طوری ایجاد کنید که با دیگر اشیاء همان خانواده مطابقت داشته باشند. مشتریان زمانی ناراحت می‌شوند که مبلمان نامطابق دریافت می‌کنند.

## 💡 راه‌حل
اولین کاری که الگوی Abstract Factory پیشنهاد می‌کند این است که به صورت صریح رابط‌هایی برای هر محصول متمایز از خانواده محصولات اعلام کنید. سپس می‌توانید تمام انواع محصولات را پیروی از این رابط‌ها کنید.

گام بعدی اعلام Abstract Factory است - یک رابط با لیستی از متدهای ایجاد برای تمام محصولاتی که بخشی از خانواده محصول هستند.

## 🏗️ ساختار

```
                    ┌──────────────────────┐
                    │  AbstractFactory     │
                    ├──────────────────────┤
                    │ +createProductA()    │
                    │ +createProductB()    │
                    └──────────────────────┘
                             △
                             │ implements
              ┌──────────────┴──────────────┐
              │                             │
    ┌─────────────────────┐      ┌─────────────────────┐
    │ ConcreteFactory1    │      │ ConcreteFactory2    │
    ├─────────────────────┤      ├─────────────────────┤
    │ +createProductA()   │      │ +createProductA()   │
    │ +createProductB()   │      │ +createProductB()   │
    └─────────────────────┘      └─────────────────────┘
              │                             │
              │creates                      │creates
              ↓                             ↓
    ┌─────────────────────┐      ┌─────────────────────┐
    │  ProductA1          │      │  ProductA2          │
    └─────────────────────┘      └─────────────────────┘
              │                             │
              └─────────┬───────────────────┘
                        │implements
                 ┌──────────────┐
                 │  ProductA    │ (Interface)
                 └──────────────┘
```

## 👥 شرکت‌کنندگان

1. **AbstractFactory**: رابطی برای ایجاد محصولات انتزاعی اعلام می‌کند
2. **ConcreteFactory**: متدهای ایجاد را برای تولید محصولات مشخص پیاده‌سازی می‌کند
3. **AbstractProduct**: رابط برای یک نوع محصول
4. **ConcreteProduct**: محصول خاص که توسط کارخانه متناظر ایجاد می‌شود
5. **Client**: فقط از طریق رابط‌های انتزاعی با کارخانه‌ها و محصولات کار می‌کند

## 🔄 نحوه همکاری
- معمولاً در زمان اجرا فقط یک نمونه از ConcreteFactory ایجاد می‌شود
- AbstractFactory ایجاد اشیاء محصول را به زیرکلاس‌های ConcreteFactory واگذار می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **سازگاری محصولات**: اطمینان می‌دهید که محصولات از یک خانواده با هم سازگار هستند
- **جداسازی از کلاس‌های مشخص**: کد کلاینت را از کلاس‌های مشخص محصول جدا می‌کند
- **اصل تک مسئولیتی**: کد ایجاد محصول را در یک مکان متمرکز می‌کنید
- **اصل باز/بسته**: معرفی انواع جدید محصولات بدون شکستن کد موجود

### معایب ❌
- پیچیدگی کد افزایش می‌یابد زیرا رابط‌ها و کلاس‌های زیادی معرفی می‌شوند
- اضافه کردن محصول جدید به خانواده نیازمند تغییر در تمام کارخانه‌ها است

## 💻 مثال کد (C#)

```csharp
using System;

namespace AbstractFactoryPattern
{
    // Abstract Products - محصولات انتزاعی
    public interface IChair
    {
        string SitOn();
    }

    public interface ISofa
    {
        string LieOn();
    }

    public interface ICoffeeTable
    {
        string PutOn();
    }

    // Concrete Products - Modern Style
    public class ModernChair : IChair
    {
        public string SitOn()
        {
            return "🪑 نشستن روی صندلی مدرن و شیک";
        }
    }

    public class ModernSofa : ISofa
    {
        public string LieOn()
        {
            return "🛋️ دراز کشیدن روی مبل مدرن";
        }
    }

    public class ModernCoffeeTable : ICoffeeTable
    {
        public string PutOn()
        {
            return "☕ قرار دادن فنجان روی میز قهوه مدرن";
        }
    }

    // Concrete Products - Victorian Style
    public class VictorianChair : IChair
    {
        public string SitOn()
        {
            return "🪑 نشستن روی صندلی ویکتوریایی کلاسیک";
        }
    }

    public class VictorianSofa : ISofa
    {
        public string LieOn()
        {
            return "🛋️ دراز کشیدن روی مبل ویکتوریایی تزئین شده";
        }
    }

    public class VictorianCoffeeTable : ICoffeeTable
    {
        public string PutOn()
        {
            return "☕ قرار دادن فنجان روی میز قهوه ویکتوریایی منبت‌کاری شده";
        }
    }

    // Concrete Products - Art Deco Style
    public class ArtDecoChair : IChair
    {
        public string SitOn()
        {
            return "🪑 نشستن روی صندلی آرت دکو هنری";
        }
    }

    public class ArtDecoSofa : ISofa
    {
        public string LieOn()
        {
            return "🛋️ دراز کشیدن روی مبل آرت دکو با طراحی هندسی";
        }
    }

    public class ArtDecoCoffeeTable : ICoffeeTable
    {
        public string PutOn()
        {
            return "☕ قرار دادن فنجان روی میز قهوه آرت دکو";
        }
    }

    // Abstract Factory - کارخانه انتزاعی
    public interface IFurnitureFactory
    {
        IChair CreateChair();
        ISofa CreateSofa();
        ICoffeeTable CreateCoffeeTable();
    }

    // Concrete Factories - کارخانه‌های مشخص
    public class ModernFurnitureFactory : IFurnitureFactory
    {
        public IChair CreateChair()
        {
            return new ModernChair();
        }

        public ISofa CreateSofa()
        {
            return new ModernSofa();
        }

        public ICoffeeTable CreateCoffeeTable()
        {
            return new ModernCoffeeTable();
        }
    }

    public class VictorianFurnitureFactory : IFurnitureFactory
    {
        public IChair CreateChair()
        {
            return new VictorianChair();
        }

        public ISofa CreateSofa()
        {
            return new VictorianSofa();
        }

        public ICoffeeTable CreateCoffeeTable()
        {
            return new VictorianCoffeeTable();
        }
    }

    public class ArtDecoFurnitureFactory : IFurnitureFactory
    {
        public IChair CreateChair()
        {
            return new ArtDecoChair();
        }

        public ISofa CreateSofa()
        {
            return new ArtDecoSofa();
        }

        public ICoffeeTable CreateCoffeeTable()
        {
            return new ArtDecoCoffeeTable();
        }
    }

    // Client Code - کد کلاینت
    class Program
    {
        static void FurnishRoom(IFurnitureFactory factory)
        {
            IChair chair = factory.CreateChair();
            ISofa sofa = factory.CreateSofa();
            ICoffeeTable table = factory.CreateCoffeeTable();

            Console.WriteLine(chair.SitOn());
            Console.WriteLine(sofa.LieOn());
            Console.WriteLine(table.PutOn());
            Console.WriteLine();
        }

        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🏭 الگوی Abstract Factory - فروشگاه مبلمان\n");
            Console.WriteLine(new string('=', 60));

            Console.WriteLine("\n🎨 دکوراسیون مدرن:");
            Console.WriteLine(new string('-', 60));
            IFurnitureFactory modernFactory = new ModernFurnitureFactory();
            FurnishRoom(modernFactory);

            Console.WriteLine("👑 دکوراسیون ویکتوریایی:");
            Console.WriteLine(new string('-', 60));
            IFurnitureFactory victorianFactory = new VictorianFurnitureFactory();
            FurnishRoom(victorianFactory);

            Console.WriteLine("🎭 دکوراسیون آرت دکو:");
            Console.WriteLine(new string('-', 60));
            IFurnitureFactory artDecoFactory = new ArtDecoFurnitureFactory();
            FurnishRoom(artDecoFactory);

            Console.WriteLine(new string('=', 60));
        }
    }
}
```

### 📤 خروجی برنامه:
```
🏭 الگوی Abstract Factory - فروشگاه مبلمان

============================================================

🎨 دکوراسیون مدرن:
------------------------------------------------------------
🪑 نشستن روی صندلی مدرن و شیک
🛋️ دراز کشیدن روی مبل مدرن
☕ قرار دادن فنجان روی میز قهوه مدرن

👑 دکوراسیون ویکتوریایی:
------------------------------------------------------------
🪑 نشستن روی صندلی ویکتوریایی کلاسیک
🛋️ دراز کشیدن روی مبل ویکتوریایی تزئین شده
☕ قرار دادن فنجان روی میز قهوه ویکتوریایی منبت‌کاری شده

🎭 دکوراسیون آرت دکو:
------------------------------------------------------------
🪑 نشستن روی صندلی آرت دکو هنری
🛋️ دراز کشیدن روی مبل آرت دکو با طراحی هندسی
☕ قرار دادن فنجان روی میز قهوه آرت دکو

============================================================
```

## 🎯 مثال کاربردی واقعی

### مثال 1: رابط کاربری چند پلتفرمی
```csharp
// Abstract Products
public interface IButton
{
    string Render();
}

public interface ICheckbox
{
    string Render();
}

// Concrete Products - Windows
public class WindowsButton : IButton
{
    public string Render()
    {
        return "🖱️ دکمه ویندوزی رندر شد";
    }
}

public class WindowsCheckbox : ICheckbox
{
    public string Render()
    {
        return "☑️ چک‌باکس ویندوزی رندر شد";
    }
}

// Concrete Products - MacOS
public class MacOSButton : IButton
{
    public string Render()
    {
        return "🖱️ دکمه MacOS رندر شد";
    }
}

public class MacOSCheckbox : ICheckbox
{
    public string Render()
    {
        return "☑️ چک‌باکس MacOS رندر شد";
    }
}

// Abstract Factory
public interface IGUIFactory
{
    IButton CreateButton();
    ICheckbox CreateCheckbox();
}

// Concrete Factories
public class WindowsFactory : IGUIFactory
{
    public IButton CreateButton()
    {
        return new WindowsButton();
    }

    public ICheckbox CreateCheckbox()
    {
        return new WindowsCheckbox();
    }
}

public class MacOSFactory : IGUIFactory
{
    public IButton CreateButton()
    {
        return new MacOSButton();
    }

    public ICheckbox CreateCheckbox()
    {
        return new MacOSCheckbox();
    }
}
```

### مثال 2: سیستم پایگاه داده
```csharp
// Abstract Products
public interface IConnection
{
    string Connect();
}

public interface IQuery
{
    string Execute();
}

// Concrete Products - MySQL
public class MySQLConnection : IConnection
{
    public string Connect()
    {
        return "🔌 اتصال به MySQL برقرار شد";
    }
}

public class MySQLQuery : IQuery
{
    public string Execute()
    {
        return "✅ کوئری MySQL اجرا شد";
    }
}

// Concrete Products - PostgreSQL
public class PostgreSQLConnection : IConnection
{
    public string Connect()
    {
        return "🔌 اتصال به PostgreSQL برقرار شد";
    }
}

public class PostgreSQLQuery : IQuery
{
    public string Execute()
    {
        return "✅ کوئری PostgreSQL اجرا شد";
    }
}

// Abstract Factory
public interface IDatabaseFactory
{
    IConnection CreateConnection();
    IQuery CreateQuery();
}

// Concrete Factories
public class MySQLFactory : IDatabaseFactory
{
    public IConnection CreateConnection()
    {
        return new MySQLConnection();
    }

    public IQuery CreateQuery()
    {
        return new MySQLQuery();
    }
}

public class PostgreSQLFactory : IDatabaseFactory
{
    public IConnection CreateConnection()
    {
        return new PostgreSQLConnection();
    }

    public IQuery CreateQuery()
    {
        return new PostgreSQLQuery();
    }
}
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که سیستم باید مستقل از نحوه ایجاد، ترکیب و نمایش محصولات باشد**
2. **زمانی که سیستم باید با چندین خانواده از محصولات پیکربندی شود**
3. **زمانی که می‌خواهید خانواده‌ای از محصولات مرتبط را ارائه دهید و می‌خواهید اطمینان حاصل کنید که فقط با هم استفاده می‌شوند**
4. **زمانی که می‌خواهید کتابخانه‌ای از محصولات را ارائه دهید و فقط می‌خواهید رابط‌های آن‌ها را نشان دهید نه پیاده‌سازی‌ها**

## 📚 ارتباط با الگوهای دیگر

- **Abstract Factory** معمولاً با **Factory Method** پیاده‌سازی می‌شود، اما می‌تواند با **Prototype** هم پیاده‌سازی شود
- **Abstract Factory** می‌تواند به عنوان جایگزینی برای **Facade** عمل کند
- **Abstract Factory** می‌تواند با **Bridge** استفاده شود
- **Abstract Factory**، **Builder** و **Prototype** همگی می‌توانند با **Singleton** پیاده‌سازی شوند

## 🎓 نکات پیاده‌سازی

1. محصولات را به عنوان رابط‌های جداگانه نگاشت کنید
2. کارخانه‌های مشخص برای هر نوع محصول ایجاد کنید
3. کد کلاینت فقط با رابط‌های انتزاعی کار کند
4. در نظر بگیرید از Singleton برای کارخانه‌ها استفاده کنید
5. از نام‌گذاری مناسب برای وضوح استفاده کنید

---

> **یادآوری**: Abstract Factory تضمین می‌کند که محصولاتی که با هم کار می‌کنند، با هم ایجاد شوند! 🎨
