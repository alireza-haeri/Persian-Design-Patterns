# الگوی Adapter (آداپتور / تبدیل‌گر)

## 🎯 هدف
الگوی Adapter یک الگوی طراحی ساختاری است که به اشیاء با رابط‌های ناسازگار اجازه می‌دهد با هم همکاری کنند.

## 🤔 مشکل
تصور کنید برنامه‌ای برای نمایش داده‌های بازار سهام دارید. برنامه شما داده‌ها را از منابع مختلف به فرمت XML دانلود می‌کند و نمودارها و دیاگرام‌های زیبایی نمایش می‌دهد.

در یک مرحله، تصمیم می‌گیرید برنامه را با یک کتابخانه تحلیل شخص ثالث هوشمند بهبود دهید. اما مشکلی وجود دارد: کتابخانه تحلیل فقط با داده به فرمت JSON کار می‌کند.

شما نمی‌توانید مستقیماً از کتابخانه تحلیل استفاده کنید زیرا فرمت داده انتظار دارد که با فرمت برنامه شما سازگار نیست.

## 💡 راه‌حل
می‌توانید یک آداپتور ایجاد کنید. این یک شیء ویژه است که یک رابط یک شیء را به گونه‌ای تبدیل می‌کند که شیء دیگر بتواند آن را درک کند.

آداپتور یکی از اشیاء را می‌پوشاند تا پیچیدگی تبدیل را پنهان کند. شیء پوشش داده شده حتی از آداپتور اطلاعی ندارد.

## 🏗️ ساختار

```
   ┌──────────┐                  ┌──────────────┐
   │  Client  │─────uses────────▶│    Target    │
   └──────────┘                  │  (Interface) │
                                 ├──────────────┤
                                 │ + request()  │
                                 └──────────────┘
                                         △
                                         │ implements
                                         │
                                 ┌───────────────┐
                                 │    Adapter    │
                                 ├───────────────┤
                                 │ - adaptee     │
                                 │ + request()   │
                                 └───────────────┘
                                         │
                                         │ uses
                                         ↓
                                 ┌───────────────────┐
                                 │     Adaptee       │
                                 ├───────────────────┤
                                 │+ specificRequest()│
                                 └───────────────────┘
```

## 👥 شرکت‌کنندگان

1. **Client**: کلاسی که از رابط Target استفاده می‌کند
2. **Target**: رابطی که Client استفاده می‌کند
3. **Adapter**: رابط Target را به Adaptee تبدیل می‌کند
4. **Adaptee**: کلاسی با رابط ناسازگار که نیاز به تطبیق دارد

## ⚖️ پیامدها

### مزایا ✅
- **اصل تک مسئولیتی**: می‌توانید رابط را از منطق تجاری جدا کنید
- **اصل باز/بسته**: می‌توانید آداپتورهای جدید بدون شکستن کد موجود اضافه کنید
- **افزایش قابلیت استفاده مجدد**: می‌توانید از کلاس‌های موجود با رابط‌های متفاوت استفاده کنید

### معایب ❌
- پیچیدگی کلی کد افزایش می‌یابد

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

# Target Interface
class MediaPlayer(ABC):
    @abstractmethod
    def play(self, audio_type: str, filename: str):
        pass

# Adaptee 1 - کلاس موجود با رابط متفاوت
class MP3Player:
    def play_mp3(self, filename: str):
        print(f"🎵 پخش فایل MP3: {filename}")

# Adaptee 2
class MP4Player:
    def play_mp4(self, filename: str):
        print(f"🎬 پخش فایل MP4: {filename}")

# Adaptee 3
class VLCPlayer:
    def play_vlc(self, filename: str):
        print(f"📀 پخش فایل VLC: {filename}")

# Adapter
class MediaAdapter(MediaPlayer):
    def __init__(self, audio_type: str):
        self.audio_type = audio_type
        
        if audio_type == "mp4":
            self.player = MP4Player()
        elif audio_type == "vlc":
            self.player = VLCPlayer()
    
    def play(self, audio_type: str, filename: str):
        if audio_type == "mp4":
            self.player.play_mp4(filename)
        elif audio_type == "vlc":
            self.player.play_vlc(filename)

# Client
class AudioPlayer(MediaPlayer):
    def play(self, audio_type: str, filename: str):
        # پخش داخلی mp3
        if audio_type == "mp3":
            mp3_player = MP3Player()
            mp3_player.play_mp3(filename)
        
        # استفاده از آداپتور برای فرمت‌های دیگر
        elif audio_type in ["mp4", "vlc"]:
            adapter = MediaAdapter(audio_type)
            adapter.play(audio_type, filename)
        
        else:
            print(f"❌ فرمت {audio_type} پشتیبانی نمی‌شود")

# استفاده
if __name__ == "__main__":
    print("🎧 الگوی Adapter - پخش‌کننده صوتی\n")
    print("=" * 60)
    
    player = AudioPlayer()
    
    print("\n📀 پخش فایل‌های مختلف:")
    print("-" * 60)
    player.play("mp3", "آهنگ_محلی.mp3")
    player.play("mp4", "ویدیو_موزیک.mp4")
    player.play("vlc", "فیلم.vlc")
    player.play("avi", "فیلم.avi")
```

## 🎯 مثال کاربردی واقعی

### مثال 1: تبدیل واحد دما
```python
class FahrenheitSensor:
    """سنسور قدیمی که دما را به فارنهایت می‌دهد"""
    def get_temperature(self) -> float:
        return 98.6  # فارنهایت

class CelsiusInterface(ABC):
    @abstractmethod
    def get_celsius_temperature(self) -> float:
        pass

class TemperatureAdapter(CelsiusInterface):
    def __init__(self, sensor: FahrenheitSensor):
        self.sensor = sensor
    
    def get_celsius_temperature(self) -> float:
        fahrenheit = self.sensor.get_temperature()
        celsius = (fahrenheit - 32) * 5/9
        return round(celsius, 1)

# استفاده
sensor = FahrenheitSensor()
adapter = TemperatureAdapter(sensor)
print(f"🌡️ دما: {adapter.get_celsius_temperature()}°C")
```

### مثال 2: سیستم پرداخت
```python
# سیستم پرداخت قدیمی
class OldPaymentSystem:
    def make_payment(self, amount):
        print(f"💰 پرداخت {amount} ریال از طریق سیستم قدیمی")

# رابط جدید
class ModernPaymentProcessor(ABC):
    @abstractmethod
    def process_payment(self, amount, currency):
        pass

# آداپتور
class PaymentAdapter(ModernPaymentProcessor):
    def __init__(self, old_system: OldPaymentSystem):
        self.old_system = old_system
    
    def process_payment(self, amount, currency):
        if currency == "USD":
            amount *= 42000  # تبدیل به ریال
        self.old_system.make_payment(amount)

# استفاده
old_system = OldPaymentSystem()
adapter = PaymentAdapter(old_system)
adapter.process_payment(100, "USD")
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید از کلاس موجود استفاده کنید اما رابط آن با بقیه کد سازگار نیست**
2. **زمانی که می‌خواهید چندین کلاس زیر با عملکرد مشابه را استفاده مجدد کنید**
3. **برای یکپارچه‌سازی کتابخانه‌های شخص ثالث**
4. **برای کار با سیستم‌های قدیمی (Legacy Systems)**

---

> **یادآوری**: Adapter مانند یک مترجم عمل می‌کند و به اشیاء مختلف اجازه می‌دهد با هم صحبت کنند! 🔌
