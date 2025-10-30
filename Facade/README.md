# الگوی Facade (نما / واسط)

## 🎯 هدف
الگوی Facade یک الگوی طراحی ساختاری است که یک رابط ساده‌شده به یک کتابخانه، فریمورک یا مجموعه پیچیده‌ای از کلاس‌ها ارائه می‌دهد.

## 🤔 مشکل
تصور کنید باید کد خود را با مجموعه گسترده‌ای از اشیاء متعلق به یک کتابخانه یا فریمورک پیچیده کار کنید. معمولاً باید تمام آن اشیاء را مقداردهی کنید، وابستگی‌ها را پیگیری کنید، متدها را به ترتیب صحیح اجرا کنید و غیره.

در نتیجه، منطق تجاری کلاس‌های شما به شدت به جزئیات پیاده‌سازی کلاس‌های شخص ثالث وابسته می‌شود و درک و نگهداری آن را دشوار می‌کند.

## 💡 راه‌حل
Facade کلاسی است که یک رابط ساده به یک زیرسیستم پیچیده که شامل بسیاری از قسمت‌های متحرک است، ارائه می‌دهد. یک facade ممکن است عملکرد محدودی نسبت به کار مستقیم با زیرسیستم ارائه دهد. با این حال، فقط آن ویژگی‌هایی را شامل می‌شود که برای کلاینت‌ها واقعاً مهم هستند.

## 🏗️ ساختار

```
   ┌──────────┐
   │  Client  │
   └──────────┘
        │
        │ uses
        ↓
   ┌──────────────────┐
   │     Facade       │
   ├──────────────────┤
   │ + operation()    │
   └──────────────────┘
        │
        │ delegates to
        ↓
   ┌─────────────────────────────┐
   │      Complex Subsystem      │
   │  ┌────────┐  ┌────────┐    │
   │  │Class A │  │Class B │    │
   │  └────────┘  └────────┘    │
   │  ┌────────┐  ┌────────┐    │
   │  │Class C │  │Class D │    │
   │  └────────┘  └────────┘    │
   └─────────────────────────────┘
```

## 👥 شرکت‌کنندگان

1. **Facade**: دسترسی راحت به بخش خاصی از عملکرد زیرسیستم را فراهم می‌کند
2. **Complex Subsystem**: زیرسیستم پیچیده با کلاس‌های متعدد
3. **Client**: از Facade به جای فراخوانی مستقیم اشیاء زیرسیستم استفاده می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **ساده‌سازی**: کد شما را از پیچیدگی زیرسیستم جدا می‌کند
- **جفت‌شدگی سست (Loose Coupling)**: وابستگی کمتری به زیرسیستم پیچیده
- **نقطه ورود واحد**: یک نقطه ورود به زیرسیستم

### معایب ❌
- Facade می‌تواند به یک شیء خدای (God Object) وابسته به تمام کلاس‌های برنامه تبدیل شود

## 💻 مثال کد (C#)

```csharp
using System;

namespace FacadePattern
{
    // زیرسیستم پیچیده - سینمای خانگی

    // کلاس آمپلی‌فایر
    public class Amplifier
    {
        public void On()
        {
            Console.WriteLine("🔊 آمپلی‌فایر روشن شد");
        }

        public void Off()
        {
            Console.WriteLine("🔊 آمپلی‌فایر خاموش شد");
        }

        public void SetVolume(int level)
        {
            Console.WriteLine($"🔊 تنظیم صدا روی {level}");
        }
    }

    // کلاس پخش‌کننده DVD
    public class DVDPlayer
    {
        public void On()
        {
            Console.WriteLine("📀 پخش‌کننده DVD روشن شد");
        }

        public void Off()
        {
            Console.WriteLine("📀 پخش‌کننده DVD خاموش شد");
        }

        public void Play(string movie)
        {
            Console.WriteLine($"📀 پخش فیلم: {movie}");
        }

        public void Stop()
        {
            Console.WriteLine("📀 توقف پخش");
        }
    }

    // کلاس پروژکتور
    public class Projector
    {
        public void On()
        {
            Console.WriteLine("📽️ پروژکتور روشن شد");
        }

        public void Off()
        {
            Console.WriteLine("📽️ پروژکتور خاموش شد");
        }

        public void WideScreenMode()
        {
            Console.WriteLine("📽️ حالت صفحه وسیع فعال شد");
        }
    }

    // کلاس نورپردازی
    public class Lights
    {
        public void Dim(int level)
        {
            Console.WriteLine($"💡 نور کم شد به {level}%");
        }

        public void On()
        {
            Console.WriteLine("💡 نور روشن شد");
        }
    }

    // کلاس پرده
    public class Screen
    {
        public void Down()
        {
            Console.WriteLine("🎬 پرده پایین آمد");
        }

        public void Up()
        {
            Console.WriteLine("🎬 پرده بالا رفت");
        }
    }

    // کلاس سیستم صوتی
    public class SoundSystem
    {
        public void On()
        {
            Console.WriteLine("🎵 سیستم صوتی روشن شد");
        }

        public void Off()
        {
            Console.WriteLine("🎵 سیستم صوتی خاموش شد");
        }

        public void SetSurroundSound()
        {
            Console.WriteLine("🎵 صدای فراگیر فعال شد");
        }
    }

    // Facade - رابط ساده‌شده
    public class HomeTheaterFacade
    {
        private readonly Amplifier _amplifier;
        private readonly DVDPlayer _dvdPlayer;
        private readonly Projector _projector;
        private readonly Lights _lights;
        private readonly Screen _screen;
        private readonly SoundSystem _soundSystem;

        public HomeTheaterFacade()
        {
            _amplifier = new Amplifier();
            _dvdPlayer = new DVDPlayer();
            _projector = new Projector();
            _lights = new Lights();
            _screen = new Screen();
            _soundSystem = new SoundSystem();
        }

        public void WatchMovie(string movie)
        {
            Console.WriteLine("\n🎬 آماده‌سازی برای تماشای فیلم...\n");
            _lights.Dim(10);
            _screen.Down();
            _projector.On();
            _projector.WideScreenMode();
            _amplifier.On();
            _amplifier.SetVolume(5);
            _soundSystem.On();
            _soundSystem.SetSurroundSound();
            _dvdPlayer.On();
            _dvdPlayer.Play(movie);
            Console.WriteLine("\n✅ همه چیز آماده است! لذت ببرید! 🍿\n");
        }

        public void EndMovie()
        {
            Console.WriteLine("\n🛑 خاموش کردن سینمای خانگی...\n");
            _dvdPlayer.Stop();
            _dvdPlayer.Off();
            _soundSystem.Off();
            _amplifier.Off();
            _projector.Off();
            _screen.Up();
            _lights.On();
            Console.WriteLine("\n✅ همه چیز خاموش شد. خوش گذشت! 👋\n");
        }
    }

    // برنامه اصلی
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🏠 الگوی Facade - سینمای خانگی");
            Console.WriteLine(new string('=', 60));

            HomeTheaterFacade homeTheater = new HomeTheaterFacade();

            // تماشای فیلم
            homeTheater.WatchMovie("مردانی که زنی را دوست داشتند");

            Console.WriteLine("\nبرای پایان فیلم Enter را فشار دهید...");
            Console.ReadLine();

            // پایان فیلم
            homeTheater.EndMovie();

            Console.WriteLine(new string('=', 60));
        }
    }
}
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم سفارش آنلاین
```csharp
using System;

namespace FacadePattern.RealWorld
{
    // کلاس‌های زیرسیستم
    public class Inventory
    {
        public bool CheckStock(string productId)
        {
            Console.WriteLine($"📦 بررسی موجودی محصول {productId}");
            return true;
        }
    }

    public class Payment
    {
        public bool ProcessPayment(decimal amount)
        {
            Console.WriteLine($"💳 پردازش پرداخت {amount:N0} تومان");
            return true;
        }
    }

    public class Shipping
    {
        public void ArrangeShipping(string address)
        {
            Console.WriteLine($"🚚 ترتیب ارسال به آدرس: {address}");
        }
    }

    public class Notification
    {
        public void SendConfirmation(string email)
        {
            Console.WriteLine($"📧 ارسال ایمیل تایید به {email}");
        }
    }

    // Facade - رابط ساده برای سیستم سفارش
    public class OrderFacade
    {
        private readonly Inventory _inventory;
        private readonly Payment _payment;
        private readonly Shipping _shipping;
        private readonly Notification _notification;

        public OrderFacade()
        {
            _inventory = new Inventory();
            _payment = new Payment();
            _shipping = new Shipping();
            _notification = new Notification();
        }

        public bool PlaceOrder(string productId, decimal amount, 
                              string address, string email)
        {
            Console.WriteLine("\n🛒 شروع فرآیند سفارش...\n");

            if (!_inventory.CheckStock(productId))
            {
                Console.WriteLine("❌ محصول موجود نیست");
                return false;
            }

            if (!_payment.ProcessPayment(amount))
            {
                Console.WriteLine("❌ پرداخت ناموفق");
                return false;
            }

            _shipping.ArrangeShipping(address);
            _notification.SendConfirmation(email);

            Console.WriteLine("\n✅ سفارش با موفقیت ثبت شد!\n");
            return true;
        }
    }

    // استفاده
    class OrderDemo
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            OrderFacade orderSystem = new OrderFacade();
            orderSystem.PlaceOrder("P123", 150000, 
                "تهران، خیابان ولیعصر", "user@example.com");
        }
    }
}
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که نیاز به رابط ساده به زیرسیستم پیچیده دارید**
2. **زمانی که می‌خواهید زیرسیستم را لایه‌بندی کنید**
3. **زمانی که می‌خواهید وابستگی به زیرسیستم را کاهش دهید**

---

> **یادآوری**: Facade پیچیدگی را پنهان می‌کند و رابط ساده ارائه می‌دهد! 🏛️
