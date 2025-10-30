# 👷 الگوی سازنده (Builder)

## 🎯 هدف

الگوی **Builder** یک الگوی طراحی سازنده (Creational) است که به شما امکان می‌دهد **اشیاء پیچیده را گام به گام بسازید**. این الگو به شما اجازه می‌دهد انواع و نمایش‌های مختلف یک شیء را با استفاده از همان کد ساخت تولید کنید.

به عبارت ساده‌تر، Builder مانند یک **دستورالعمل ساخت قدم به قدم** است که به شما کمک می‌کند اشیاء پیچیده را به روشی منظم و خوانا بسازید، بدون اینکه نگران پیچیدگی سازنده‌ها (constructors) با پارامترهای زیاد باشید.

## 🤔 مشکل

تصور کنید می‌خواهید یک شیء پیچیده مثل `Computer` بسازید که ویژگی‌های زیادی دارد:
- CPU (پردازنده)
- RAM (حافظه)  
- Storage (حافظه ذخیره‌سازی)
- GPU (کارت گرافیک)
- Motherboard (مادربرد)
- PowerSupply (منبع تغذیه)
- و غیره...

### مشکلات رویکرد سنتی:

**1. سازنده با پارامترهای زیاد (Telescoping Constructor)**
```csharp
// خیلی طولانی و گیج‌کننده!
var computer = new Computer("Intel i9", "32GB", "1TB SSD", "RTX 4090", "ASUS", "850W", ...);
```
مشکلات:
- نمی‌دانیم هر پارامتر چیست
- ترتیب پارامترها را باید به خاطر بسپاریم
- پارامترهای اختیاری را باید null بدهیم

**2. سازنده‌های متعدد (Multiple Constructors)**
```csharp
public Computer(string cpu, string ram) { }
public Computer(string cpu, string ram, string storage) { }
public Computer(string cpu, string ram, string storage, string gpu) { }
// و ده‌ها سازنده دیگر...
```
مشکلات:
- تعداد سازنده‌ها انفجاری می‌شود
- کد تکراری زیاد
- نگهداری سخت

**3. استفاده از Setter ها**
```csharp
var computer = new Computer();
computer.CPU = "Intel i9";
computer.RAM = "32GB";
// ممکن است فراموش کنیم یکی را set کنیم!
```
مشکلات:
- شیء در حالت ناقص قابل استفاده است
- خطاهای runtime
- thread-safe نیست

## 💡 راه‌حل

الگوی Builder این مشکلات را حل می‌کند با:

1. **جداسازی کد ساخت**: منطق ساخت را از کلاس اصلی جدا می‌کند
2. **ساخت گام به گام**: می‌توانید فقط مراحلی که نیاز دارید را اجرا کنید
3. **خوانایی بالا**: کد واضح و قابل فهم است
4. **انعطاف‌پذیری**: می‌توانید Builder های مختلف برای ساخت‌های مختلف داشته باشید


## 💻 پیاده‌سازی با C#

### روش اول: Fluent Builder (پیشنهادی)

```csharp
// محصول - Product
public class Computer
{
    public string CPU { get; set; }
    public string RAM { get; set; }
    public string Storage { get; set; }
    public string GPU { get; set; }

    public void Display() => 
        Console.WriteLine($"💻 کامپیوتر: CPU={CPU}, RAM={RAM}, Storage={Storage}, GPU={GPU}");
}

// رابط Builder
public interface IComputerBuilder
{
    IComputerBuilder SetCPU(string cpu);
    IComputerBuilder SetRAM(string ram);
    IComputerBuilder SetStorage(string storage);
    IComputerBuilder SetGPU(string gpu);
    Computer Build();
}

// Concrete Builder برای کامپیوتر گیمینگ
public class GamingComputerBuilder : IComputerBuilder
{
    private readonly Computer _computer = new();

    public IComputerBuilder SetCPU(string cpu)
    {
        _computer.CPU = cpu;
        return this;
    }

    public IComputerBuilder SetRAM(string ram)
    {
        _computer.RAM = ram;
        return this;
    }

    public IComputerBuilder SetStorage(string storage)
    {
        _computer.Storage = storage;
        return this;
    }

    public IComputerBuilder SetGPU(string gpu)
    {
        _computer.GPU = gpu;
        return this;
    }

    public Computer Build() => _computer;
}

// استفاده - Method Chaining (Fluent Interface)
var gamingPC = new GamingComputerBuilder()
    .SetCPU("Intel i9-13900K")
    .SetRAM("32GB DDR5")
    .SetStorage("2TB NVMe SSD")
    .SetGPU("RTX 4090")
    .Build();

gamingPC.Display();
// خروجی: 💻 کامپیوتر: CPU=Intel i9-13900K, RAM=32GB DDR5, Storage=2TB NVMe SSD, GPU=RTX 4090
```

### روش دوم: با Director (هماهنگ‌کننده)

```csharp
// Concrete Builder برای کامپیوتر اداری
public class OfficeComputerBuilder : IComputerBuilder
{
    private readonly Computer _computer = new();

    public IComputerBuilder SetCPU(string cpu)
    {
        _computer.CPU = cpu;
        return this;
    }

    public IComputerBuilder SetRAM(string ram)
    {
        _computer.RAM = ram;
        return this;
    }

    public IComputerBuilder SetStorage(string storage)
    {
        _computer.Storage = storage;
        return this;
    }

    public IComputerBuilder SetGPU(string gpu)
    {
        _computer.GPU = gpu;
        return this;
    }

    public Computer Build() => _computer;
}

// Director - مدیریت مراحل ساخت از پیش تعریف شده
public class ComputerDirector
{
    private IComputerBuilder _builder;

    public ComputerDirector(IComputerBuilder builder)
    {
        _builder = builder;
    }

    public void ChangeBuilder(IComputerBuilder builder) => _builder = builder;

    public Computer MakeGamingPC()
    {
        return _builder
            .SetCPU("Intel i9-13900K")
            .SetRAM("32GB DDR5")
            .SetStorage("2TB NVMe SSD")
            .SetGPU("RTX 4090")
            .Build();
    }

    public Computer MakeOfficePC()
    {
        return _builder
            .SetCPU("Intel i5-12400")
            .SetRAM("16GB DDR4")
            .SetStorage("512GB SSD")
            .SetGPU("Intel UHD 730")
            .Build();
    }
}

// استفاده از Director
var director = new ComputerDirector(new GamingComputerBuilder());

var gaming = director.MakeGamingPC();
gaming.Display();

director.ChangeBuilder(new OfficeComputerBuilder());
var office = director.MakeOfficePC();
office.Display();
```

## 🎯 مثال کاربردی: سازنده پیام ایمیل

```csharp
public class Email
{
    public string To { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
    public List<string> Attachments { get; set; } = new();
    
    public void Send() => 
        Console.WriteLine($"📧 ایمیل به {To} با موضوع '{Subject}' ارسال شد");
}

public class EmailBuilder
{
    private readonly Email _email = new();

    public EmailBuilder To(string address)
    {
        _email.To = address;
        return this;
    }

    public EmailBuilder Subject(string subject)
    {
        _email.Subject = subject;
        return this;
    }

    public EmailBuilder Body(string body)
    {
        _email.Body = body;
        return this;
    }

    public EmailBuilder Attach(string file)
    {
        _email.Attachments.Add(file);
        return this;
    }

    public Email Build() => _email;
}

// استفاده
var email = new EmailBuilder()
    .To("user@example.com")
    .Subject("گزارش ماهانه")
    .Body("متن گزارش...")
    .Attach("report.pdf")
    .Attach("chart.png")
    .Build();

email.Send();
```

## ⚖️ مزایا و معایب

### مزایا ✅

1. **خوانایی کد بالا**: کد خیلی واضح و قابل فهم است
2. **کنترل بیشتر روی فرآیند ساخت**: می‌توانید هر مرحله را جداگانه کنترل کنید
3. **استفاده مجدد از کد**: Builder ها قابل استفاده مجدد هستند
4. **اصل تک مسئولیتی**: کد ساخت از منطق کسب‌وکار جدا است
5. **ساخت اشیاء پیچیده**: برای اشیاء با پیکربندی پیچیده ایده‌آل است
6. **عدم نیاز به Telescoping Constructor**: از سازنده‌های طولانی خلاص می‌شوید
7. **Immutability**: می‌توان اشیاء immutable ساخت

### معایب ❌

1. **افزایش تعداد کلاس‌ها**: برای هر نوع محصول یک Builder نیاز است
2. **پیچیدگی کد**: برای اشیاء ساده، بیش از حد پیچیده است
3. **کد بیشتر**: نسبت به سازنده معمولی، کد بیشتری نیاز دارد

## 🔍 چه زمانی استفاده کنیم؟

### ✅ استفاده کنید وقتی:

1. **پارامترهای زیاد**: شیء شما پارامترهای زیادی دارد (بیشتر از 4-5 تا)
2. **پارامترهای اختیاری**: بسیاری از پارامترها اختیاری هستند
3. **ساخت پیچیده**: فرآیند ساخت چندین مرحله دارد
4. **نمایش‌های مختلف**: می‌خواهید نمایش‌های مختلف یک شیء بسازید
5. **Fluent Interface**: می‌خواهید API خوانا و روان داشته باشید
6. **اشیاء Immutable**: می‌خواهید اشیاء غیرقابل تغییر بسازید

### ❌ استفاده نکنید وقتی:

1. **شیء ساده**: شیء پارامترهای کمی دارد
2. **بدون تنوع**: نیاز به Builder های مختلف ندارید
3. **ساخت ساده**: فرآیند ساخت پیچیده نیست

## 🎯 کاربردهای واقعی

1. **StringBuilder در .NET**: ساخت رشته‌های پیچیده
2. **Query Builders**: LINQ, Entity Framework
3. **HTTP Request Builders**: ساخت درخواست‌های HTTP
4. **UI Builders**: ساخت رابط کاربری (Android, SwiftUI)
5. **Configuration Builders**: پیکربندی برنامه‌ها
6. **Test Data Builders**: ساخت داده‌های تست
7. **Document Builders**: ساخت PDF, Word, Excel

## 💡 نکات پیاده‌سازی

1. **Fluent Interface**: همیشه `this` را برگردانید تا Method Chaining ممکن شود
2. **Validation در Build()**: اعتبارسنجی را در متد Build انجام دهید
3. **Builder داخلی (Nested Builder)**: می‌توانید Builder را درون کلاس محصول بگذارید:
   ```csharp
   public class Computer 
   {
       public class Builder 
       {
           // ...
       }
   }
   ```
4. **Reset Method**: اگر می‌خواهید Builder را دوباره استفاده کنید، یک متد Reset اضافه کنید
5. **Required vs Optional**: برای فیلدهای اجباری، می‌توانید آن‌ها را در سازنده Builder بگذارید

## 🔑 نکته کلیدی

> **یادآوری**: Builder برای ساخت اشیاء **پیچیده** با مراحل **متعدد** است. اگر شیء ساده است، از سازنده معمولی استفاده کنید!
>
> در C#، می‌توانید از **Object Initializer** هم استفاده کنید:
> ```csharp
> var computer = new Computer { CPU = "i9", RAM = "32GB" };
> ```
> اما Builder خوانایی بهتری دارد و می‌توانید validation و logic اضافه کنید.

---

**[🏠 بازگشت به صفحه اصلی](../index.html)**
