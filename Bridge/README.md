# الگوی Bridge (پل)

## 🎯 هدف
الگوی Bridge یک الگوی طراحی ساختاری است که به شما اجازه می‌دهد یک کلاس بزرگ یا مجموعه‌ای از کلاس‌های نزدیک به هم را به دو سلسله‌مراتب جداگانه - انتزاع (abstraction) و پیاده‌سازی (implementation) - تقسیم کنید که می‌توانند مستقل از یکدیگر توسعه یابند.

## 🤔 مشکل
فرض کنید یک کلاس هندسی `Shape` با دو زیرکلاس دارید: `Circle` و `Square`. می‌خواهید این سلسله‌مراتب کلاس را برای ترکیب رنگ‌ها گسترش دهید، بنابراین قصد دارید زیرکلاس‌های `Red` و `Blue` ایجاد کنید. با این حال، از آنجا که قبلاً دو زیرکلاس دارید، باید چهار ترکیب کلاسی مانند `BlueCircle` و `RedSquare` ایجاد کنید.

اضافه کردن انواع جدید شکل و رنگ به سلسله‌مراتب باعث رشد نمایی آن می‌شود. به عنوان مثال، برای اضافه کردن شکل مثلث، باید دو زیرکلاس معرفی کنید، یکی برای هر رنگ.

## 💡 راه‌حل
Bridge سعی می‌کند این مشکل را با تغییر از وراثت به ترکیب شیء حل کند. این بدان معناست که یکی از ابعاد را به یک سلسله‌مراتب کلاسی جداگانه استخراج می‌کنید، به طوری که کلاس‌های اصلی به یک شیء از سلسله‌مراتب جدید ارجاع می‌دهند، به جای داشتن تمام حالت و رفتارهای آن در یک کلاس.

## 🏗️ ساختار

```
        ┌─────────────────┐
        │   Abstraction   │
        ├─────────────────┤           ┌──────────────────┐
        │ - implementor   │──────────▶│ Implementation   │
        │ + operation()   │           │   (Interface)    │
        └─────────────────┘           ├──────────────────┤
               △                      │+ operationImpl() │
               │                      └──────────────────┘
               │                               △
    ┌──────────┴──────────┐                   │
    │                     │          ┌────────┴────────┐
┌───────────────┐  ┌───────────────┐│                 │
│RefinedAbstract│  │RefinedAbstract││  ┌──────────────────────┐
│   ion A       │  │   ion B       ││  │ConcreteImplementation│
└───────────────┘  └───────────────┘│  │        A             │
                                    │  └──────────────────────┘
                                    │
                                    │  ┌──────────────────────┐
                                    └──│ConcreteImplementation│
                                       │        B             │
                                       └──────────────────────┘
```

## 👥 شرکت‌کنندگان

1. **Abstraction**: رابط سطح بالا برای کنترل
2. **RefinedAbstraction**: انواع مختلف منطق کنترل
3. **Implementation**: رابط برای همه پیاده‌سازی‌های مشخص
4. **ConcreteImplementation**: حاوی کد پلتفرم خاص

## ⚖️ پیامدها

### مزایا ✅
- **جداسازی Abstraction از Implementation**: می‌توانید مستقل از یکدیگر تغییر دهید
- **اصل باز/بسته**: می‌توانید Abstractions و Implementations جدید را مستقل معرفی کنید
- **اصل تک مسئولیتی**: می‌توانید روی منطق سطح بالا در Abstraction و جزئیات پلتفرم در Implementation تمرکز کنید
- **پنهان‌سازی جزئیات**: می‌توانید جزئیات پیاده‌سازی را از کلاینت پنهان کنید

### معایب ❌
- ممکن است کد را برای کلاس‌های بسیار cohesive پیچیده‌تر کند

## 💻 مثال کد (C#)

```csharp
using System;

namespace BridgePattern
{
    // Implementation Interface
    // رابط پیاده‌سازی - تعریف عملیات پایه برای تمام دستگاه‌ها
    public interface IDevice
    {
        bool IsEnabled();
        void Enable();
        void Disable();
        int GetVolume();
        void SetVolume(int percent);
        int GetChannel();
        void SetChannel(int channel);
    }

    // Concrete Implementation - تلویزیون
    // پیاده‌سازی مشخص برای دستگاه تلویزیون
    public class TV : IDevice
    {
        private bool _on;
        private int _volume;
        private int _channel;

        public TV()
        {
            _on = false;
            _volume = 30;
            _channel = 1;
        }

        public bool IsEnabled()
        {
            return _on;
        }

        public void Enable()
        {
            _on = true;
            Console.WriteLine("📺 تلویزیون روشن شد");
        }

        public void Disable()
        {
            _on = false;
            Console.WriteLine("📺 تلویزیون خاموش شد");
        }

        public int GetVolume()
        {
            return _volume;
        }

        public void SetVolume(int percent)
        {
            _volume = Math.Max(0, Math.Min(percent, 100));
            Console.WriteLine($"🔊 صدای تلویزیون: {_volume}%");
        }

        public int GetChannel()
        {
            return _channel;
        }

        public void SetChannel(int channel)
        {
            _channel = channel;
            Console.WriteLine($"📡 کانال تلویزیون: {_channel}");
        }
    }

    // Concrete Implementation - رادیو
    // پیاده‌سازی مشخص برای دستگاه رادیو
    public class Radio : IDevice
    {
        private bool _on;
        private int _volume;
        private int _channel;

        public Radio()
        {
            _on = false;
            _volume = 30;
            _channel = 881; // فرکانس رادیو
        }

        public bool IsEnabled()
        {
            return _on;
        }

        public void Enable()
        {
            _on = true;
            Console.WriteLine("📻 رادیو روشن شد");
        }

        public void Disable()
        {
            _on = false;
            Console.WriteLine("📻 رادیو خاموش شد");
        }

        public int GetVolume()
        {
            return _volume;
        }

        public void SetVolume(int percent)
        {
            _volume = Math.Max(0, Math.Min(percent, 100));
            Console.WriteLine($"🔊 صدای رادیو: {_volume}%");
        }

        public int GetChannel()
        {
            return _channel;
        }

        public void SetChannel(int channel)
        {
            _channel = channel;
            Console.WriteLine($"📻 فرکانس رادیو: {_channel} AM");
        }
    }

    // Abstraction - کنترل از راه دور
    // انتزاع اصلی که با دستگاه‌ها از طریق رابط کار می‌کند
    public class RemoteControl
    {
        protected IDevice device;

        public RemoteControl(IDevice device)
        {
            this.device = device;
        }

        public void TogglePower()
        {
            if (device.IsEnabled())
            {
                device.Disable();
            }
            else
            {
                device.Enable();
            }
        }

        public void VolumeDown()
        {
            int current = device.GetVolume();
            device.SetVolume(current - 10);
        }

        public void VolumeUp()
        {
            int current = device.GetVolume();
            device.SetVolume(current + 10);
        }

        public void ChannelDown()
        {
            int current = device.GetChannel();
            device.SetChannel(current - 1);
        }

        public void ChannelUp()
        {
            int current = device.GetChannel();
            device.SetChannel(current + 1);
        }
    }

    // Refined Abstraction - کنترل پیشرفته
    // انتزاع تصفیه‌شده با قابلیت‌های اضافی
    public class AdvancedRemoteControl : RemoteControl
    {
        public AdvancedRemoteControl(IDevice device) : base(device)
        {
        }

        public void Mute()
        {
            Console.WriteLine("🔇 سکوت...");
            device.SetVolume(0);
        }
    }

    // Client Code
    class Program
    {
        static void Main(string[] args)
        {
            // تنظیم کنسول برای نمایش درست فارسی
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🎮 الگوی Bridge - کنترل از راه دور\n");
            Console.WriteLine(new string('=', 60));

            // استفاده از کنترل معمولی با تلویزیون
            Console.WriteLine("\n📺 کنترل تلویزیون:");
            Console.WriteLine(new string('-', 60));
            TV tv = new TV();
            RemoteControl remote = new RemoteControl(tv);
            remote.TogglePower();
            remote.VolumeUp();
            remote.ChannelUp();
            remote.TogglePower();

            // استفاده از کنترل معمولی با رادیو
            Console.WriteLine("\n\n📻 کنترل رادیو:");
            Console.WriteLine(new string('-', 60));
            Radio radio = new Radio();
            remote = new RemoteControl(radio);
            remote.TogglePower();
            remote.VolumeUp();
            remote.ChannelUp();

            // استفاده از کنترل پیشرفته با تلویزیون
            Console.WriteLine("\n\n🎛️ کنترل پیشرفته تلویزیون:");
            Console.WriteLine(new string('-', 60));
            TV tv2 = new TV();
            AdvancedRemoteControl advancedRemote = new AdvancedRemoteControl(tv2);
            advancedRemote.TogglePower();
            advancedRemote.VolumeUp();
            advancedRemote.Mute();

            Console.WriteLine("\n\n✅ اجرای موفقیت‌آمیز الگوی Bridge!");
        }
    }
}
```

### 📤 خروجی برنامه:
```
🎮 الگوی Bridge - کنترل از راه دور

============================================================

📺 کنترل تلویزیون:
------------------------------------------------------------
📺 تلویزیون روشن شد
🔊 صدای تلویزیون: 40%
📡 کانال تلویزیون: 2
📺 تلویزیون خاموش شد


📻 کنترل رادیو:
------------------------------------------------------------
📻 رادیو روشن شد
🔊 صدای رادیو: 40%
📻 فرکانس رادیو: 882 AM


🎛️ کنترل پیشرفته تلویزیون:
------------------------------------------------------------
📺 تلویزیون روشن شد
🔊 صدای تلویزیون: 40%
🔇 سکوت...
🔊 صدای تلویزیون: 0%


✅ اجرای موفقیت‌آمیز الگوی Bridge!
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم ارسال پیام
```csharp
// Implementation Interface - رابط ارسال کننده پیام
public interface IMessageSender
{
    void Send(string message);
}

// Concrete Implementation - ارسال ایمیل
public class EmailSender : IMessageSender
{
    public void Send(string message)
    {
        Console.WriteLine($"📧 ارسال ایمیل: {message}");
    }
}

// Concrete Implementation - ارسال پیامک
public class SMSSender : IMessageSender
{
    public void Send(string message)
    {
        Console.WriteLine($"📱 ارسال پیامک: {message}");
    }
}

// Abstraction - پیام
public class Message
{
    protected IMessageSender sender;

    public Message(IMessageSender sender)
    {
        this.sender = sender;
    }

    public virtual void Send(string text)
    {
        sender.Send(text);
    }
}

// Refined Abstraction - پیام فوری
public class UrgentMessage : Message
{
    public UrgentMessage(IMessageSender sender) : base(sender)
    {
    }

    public override void Send(string text)
    {
        text = $"⚠️ فوری: {text}";
        sender.Send(text);
    }
}
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید کلاس را به چند بعد مستقل تقسیم کنید**
2. **زمانی که نیاز دارید Abstraction و Implementation را در زمان اجرا تغییر دهید**
3. **برای جلوگیری از انفجار کلاس‌ها (class explosion)**

---

> **یادآوری**: Bridge به شما کمک می‌کند کد را منعطف و قابل توسعه نگه دارید! 🌉
