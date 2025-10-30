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

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

# Implementation Interface
class Device(ABC):
    @abstractmethod
    def is_enabled(self) -> bool:
        pass
    
    @abstractmethod
    def enable(self):
        pass
    
    @abstractmethod
    def disable(self):
        pass
    
    @abstractmethod
    def get_volume(self) -> int:
        pass
    
    @abstractmethod
    def set_volume(self, percent: int):
        pass
    
    @abstractmethod
    def get_channel(self) -> int:
        pass
    
    @abstractmethod
    def set_channel(self, channel: int):
        pass

# Concrete Implementations
class TV(Device):
    def __init__(self):
        self._on = False
        self._volume = 30
        self._channel = 1
    
    def is_enabled(self) -> bool:
        return self._on
    
    def enable(self):
        self._on = True
        print("📺 تلویزیون روشن شد")
    
    def disable(self):
        self._on = False
        print("📺 تلویزیون خاموش شد")
    
    def get_volume(self) -> int:
        return self._volume
    
    def set_volume(self, percent: int):
        self._volume = max(0, min(percent, 100))
        print(f"🔊 صدای تلویزیون: {self._volume}%")
    
    def get_channel(self) -> int:
        return self._channel
    
    def set_channel(self, channel: int):
        self._channel = channel
        print(f"📡 کانال تلویزیون: {self._channel}")

class Radio(Device):
    def __init__(self):
        self._on = False
        self._volume = 30
        self._channel = 881  # فرکانس رادیو
    
    def is_enabled(self) -> bool:
        return self._on
    
    def enable(self):
        self._on = True
        print("📻 رادیو روشن شد")
    
    def disable(self):
        self._on = False
        print("📻 رادیو خاموش شد")
    
    def get_volume(self) -> int:
        return self._volume
    
    def set_volume(self, percent: int):
        self._volume = max(0, min(percent, 100))
        print(f"🔊 صدای رادیو: {self._volume}%")
    
    def get_channel(self) -> int:
        return self._channel
    
    def set_channel(self, channel: int):
        self._channel = channel
        print(f"📻 فرکانس رادیو: {self._channel} AM")

# Abstraction
class RemoteControl:
    def __init__(self, device: Device):
        self.device = device
    
    def toggle_power(self):
        if self.device.is_enabled():
            self.device.disable()
        else:
            self.device.enable()
    
    def volume_down(self):
        current = self.device.get_volume()
        self.device.set_volume(current - 10)
    
    def volume_up(self):
        current = self.device.get_volume()
        self.device.set_volume(current + 10)
    
    def channel_down(self):
        current = self.device.get_channel()
        self.device.set_channel(current - 1)
    
    def channel_up(self):
        current = self.device.get_channel()
        self.device.set_channel(current + 1)

# Refined Abstraction
class AdvancedRemoteControl(RemoteControl):
    def mute(self):
        print("🔇 سکوت...")
        self.device.set_volume(0)

# استفاده
if __name__ == "__main__":
    print("🎮 الگوی Bridge - کنترل از راه دور\n")
    print("=" * 60)
    
    print("\n📺 کنترل تلویزیون:")
    print("-" * 60)
    tv = TV()
    remote = RemoteControl(tv)
    remote.toggle_power()
    remote.volume_up()
    remote.channel_up()
    remote.toggle_power()
    
    print("\n\n📻 کنترل رادیو:")
    print("-" * 60)
    radio = Radio()
    remote = RemoteControl(radio)
    remote.toggle_power()
    remote.volume_up()
    remote.channel_up()
    
    print("\n\n🎛️ کنترل پیشرفته تلویزیون:")
    print("-" * 60)
    tv2 = TV()
    advanced_remote = AdvancedRemoteControl(tv2)
    advanced_remote.toggle_power()
    advanced_remote.volume_up()
    advanced_remote.mute()
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم ارسال پیام
```python
class MessageSender(ABC):
    @abstractmethod
    def send(self, message: str):
        pass

class EmailSender(MessageSender):
    def send(self, message: str):
        print(f"📧 ارسال ایمیل: {message}")

class SMSSender(MessageSender):
    def send(self, message: str):
        print(f"📱 ارسال پیامک: {message}")

class Message:
    def __init__(self, sender: MessageSender):
        self.sender = sender
    
    def send(self, text: str):
        self.sender.send(text)

class UrgentMessage(Message):
    def send(self, text: str):
        text = f"⚠️ فوری: {text}"
        self.sender.send(text)
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید کلاس را به چند بعد مستقل تقسیم کنید**
2. **زمانی که نیاز دارید Abstraction و Implementation را در زمان اجرا تغییر دهید**
3. **برای جلوگیری از انفجار کلاس‌ها (class explosion)**

---

> **یادآوری**: Bridge به شما کمک می‌کند کد را منعطف و قابل توسعه نگه دارید! 🌉
