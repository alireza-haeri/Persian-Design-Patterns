# الگوی Command (فرمان / دستور)

## 🎯 هدف
الگوی Command یک الگوی طراحی رفتاری است که یک درخواست را به عنوان یک شیء مستقل که حاوی تمام اطلاعات درخواست است، تبدیل می‌کند. این تبدیل به شما اجازه می‌دهد درخواست‌ها را پارامتری کنید، اجرای آن‌ها را به تعویق بیندازید، صف کنید و عملیات قابل بازگشت را پشتیبانی کنید.

## 🤔 مشکل
تصور کنید در حال کار روی یک برنامه ویرایشگر متن جدید هستید. وظیفه فعلی شما ایجاد نوار ابزار با دکمه‌هایی برای عملیات مختلف ویرایشگر است. شما یک کلاس `Button` بسیار خوب ایجاد کردید که می‌تواند برای دکمه‌های نوار ابزار و همچنین دکمه‌های عمومی در دیالوگ‌های مختلف استفاده شود.

مشکل اینجاست: کد منطق تجاری را کجا قرار دهیم؟

## 💡 راه‌حل
طراحی نرم‌افزار خوب اغلب بر اساس اصل جداسازی نگرانی‌ها است که معمولاً منجر به تقسیم برنامه به لایه‌ها می‌شود. الگوی Command پیشنهاد می‌کند که اشیاء GUI نباید درخواست‌ها را مستقیماً ارسال کنند. به جای آن، باید تمام جزئیات درخواست را در یک کلاس فرمان جداگانه قرار دهید.

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

# Command Interface
class Command(ABC):
    @abstractmethod
    def execute(self):
        pass
    
    @abstractmethod
    def undo(self):
        pass

# Receiver
class Light:
    def __init__(self, location: str):
        self.location = location
        self.is_on = False
    
    def turn_on(self):
        self.is_on = True
        print(f"💡 چراغ {self.location} روشن شد")
    
    def turn_off(self):
        self.is_on = False
        print(f"💡 چراغ {self.location} خاموش شد")

# Concrete Commands
class LightOnCommand(Command):
    def __init__(self, light: Light):
        self.light = light
    
    def execute(self):
        self.light.turn_on()
    
    def undo(self):
        self.light.turn_off()

class LightOffCommand(Command):
    def __init__(self, light: Light):
        self.light = light
    
    def execute(self):
        self.light.turn_off()
    
    def undo(self):
        self.light.turn_on()

# Invoker
class RemoteControl:
    def __init__(self):
        self.history = []
    
    def execute_command(self, command: Command):
        command.execute()
        self.history.append(command)
    
    def undo_last(self):
        if self.history:
            command = self.history.pop()
            command.undo()
            print("↩️ عملیات قبلی لغو شد")
        else:
            print("⚠️ تاریخچه‌ای برای بازگشت وجود ندارد")

# استفاده
if __name__ == "__main__":
    print("🎮 الگوی Command - کنترل از راه دور\n")
    
    living_room_light = Light("اتاق نشیمن")
    bedroom_light = Light("اتاق خواب")
    
    living_on = LightOnCommand(living_room_light)
    living_off = LightOffCommand(living_room_light)
    bedroom_on = LightOnCommand(bedroom_light)
    
    remote = RemoteControl()
    
    remote.execute_command(living_on)
    remote.execute_command(bedroom_on)
    remote.execute_command(living_off)
    
    remote.undo_last()
    remote.undo_last()
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید عملیات را پارامتری کنید**
2. **زمانی که می‌خواهید عملیات را صف کنید یا زمان‌بندی کنید**
3. **زمانی که می‌خواهید عملیات Undo/Redo را پیاده‌سازی کنید**

---

> **یادآوری**: Command درخواست‌ها را به اشیاء تبدیل می‌کند! 🎯
