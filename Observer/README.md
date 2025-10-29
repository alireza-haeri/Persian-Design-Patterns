# الگوی Observer (ناظر / مشاهده‌گر)

## 🎯 هدف
الگوی Observer یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد یک مکانیسم اشتراک تعریف کنید تا اشیاء متعددی را از رویدادهایی که برای شیءای که مشاهده می‌کنند رخ می‌دهد، مطلع کنید.

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

class Observer(ABC):
    @abstractmethod
    def update(self, temperature: float):
        pass

class Subject:
    def __init__(self):
        self._observers = []
        self._temperature = 0
    
    def attach(self, observer: Observer):
        self._observers.append(observer)
        print(f"✅ ناظر جدید اضافه شد")
    
    def detach(self, observer: Observer):
        self._observers.remove(observer)
    
    def notify(self):
        for observer in self._observers:
            observer.update(self._temperature)
    
    def set_temperature(self, temp: float):
        print(f"🌡️ دمای جدید: {temp}°C")
        self._temperature = temp
        self.notify()

class PhoneDisplay(Observer):
    def update(self, temperature: float):
        print(f"📱 نمایشگر موبایل: دما {temperature}°C است")

class TVDisplay(Observer):
    def update(self, temperature: float):
        print(f"📺 نمایشگر TV: دما {temperature}°C است")

# استفاده
weather_station = Subject()

phone = PhoneDisplay()
tv = TVDisplay()

weather_station.attach(phone)
weather_station.attach(tv)

weather_station.set_temperature(25)
weather_station.set_temperature(30)
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که تغییر در حالت یک شیء نیاز به تغییر اشیاء دیگر دارد
2. زمانی که برخی اشیاء باید اشیاء دیگر را فقط برای مدت محدودی مشاهده کنند
3. برای پیاده‌سازی Event Handling

---

> **یادآوری**: Observer یک سیستم اشتراک/اطلاع‌رسانی ایجاد می‌کند! 👁️
