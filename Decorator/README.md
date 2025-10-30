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

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

# Component Interface
class Coffee(ABC):
    @abstractmethod
    def cost(self) -> float:
        pass
    
    @abstractmethod
    def description(self) -> str:
        pass

# Concrete Component
class SimpleCoffee(Coffee):
    def cost(self) -> float:
        return 5000  # 5000 تومان
    
    def description(self) -> str:
        return "قهوه ساده"

# Decorator Base
class CoffeeDecorator(Coffee):
    def __init__(self, coffee: Coffee):
        self._coffee = coffee
    
    def cost(self) -> float:
        return self._coffee.cost()
    
    def description(self) -> str:
        return self._coffee.description()

# Concrete Decorators
class MilkDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 1000  # اضافه کردن 1000 تومان
    
    def description(self) -> str:
        return self._coffee.description() + " + شیر 🥛"

class SugarDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 500  # اضافه کردن 500 تومان
    
    def description(self) -> str:
        return self._coffee.description() + " + شکر 🧂"

class WhippedCreamDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 2000  # اضافه کردن 2000 تومان
    
    def description(self) -> str:
        return self._coffee.description() + " + خامه ☁️"

class CaramelDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 1500  # اضافه کردن 1500 تومان
    
    def description(self) -> str:
        return self._coffee.description() + " + کارامل 🍯"

class VanillaDecorator(CoffeeDecorator):
    def cost(self) -> float:
        return self._coffee.cost() + 1200  # اضافه کردن 1200 تومان
    
    def description(self) -> str:
        return self._coffee.description() + " + وانیل 🌼"

# استفاده
if __name__ == "__main__":
    print("☕ الگوی Decorator - سفارش قهوه\n")
    print("=" * 60)
    
    # قهوه ساده
    print("\n1️⃣ قهوه ساده:")
    print("-" * 60)
    coffee1 = SimpleCoffee()
    print(f"{coffee1.description()}")
    print(f"💰 قیمت: {coffee1.cost():,} تومان")
    
    # قهوه با شیر
    print("\n2️⃣ قهوه با شیر:")
    print("-" * 60)
    coffee2 = SimpleCoffee()
    coffee2 = MilkDecorator(coffee2)
    print(f"{coffee2.description()}")
    print(f"💰 قیمت: {coffee2.cost():,} تومان")
    
    # قهوه با شیر و شکر
    print("\n3️⃣ قهوه با شیر و شکر:")
    print("-" * 60)
    coffee3 = SimpleCoffee()
    coffee3 = MilkDecorator(coffee3)
    coffee3 = SugarDecorator(coffee3)
    print(f"{coffee3.description()}")
    print(f"💰 قیمت: {coffee3.cost():,} تومان")
    
    # قهوه ویژه (با همه افزودنی‌ها)
    print("\n4️⃣ قهوه ویژه (با همه افزودنی‌ها):")
    print("-" * 60)
    coffee4 = SimpleCoffee()
    coffee4 = MilkDecorator(coffee4)
    coffee4 = SugarDecorator(coffee4)
    coffee4 = WhippedCreamDecorator(coffee4)
    coffee4 = CaramelDecorator(coffee4)
    coffee4 = VanillaDecorator(coffee4)
    print(f"{coffee4.description()}")
    print(f"💰 قیمت: {coffee4.cost():,} تومان")
    
    # کاپوچینو (شیر + خامه)
    print("\n5️⃣ کاپوچینو:")
    print("-" * 60)
    coffee5 = SimpleCoffee()
    coffee5 = MilkDecorator(coffee5)
    coffee5 = WhippedCreamDecorator(coffee5)
    print(f"{coffee5.description()}")
    print(f"💰 قیمت: {coffee5.cost():,} تومان")
```

## 🎯 مثال کاربردی واقعی

### مثال 1: فشرده‌سازی و رمزنگاری داده
```python
class DataSource(ABC):
    @abstractmethod
    def write_data(self, data: str):
        pass
    
    @abstractmethod
    def read_data(self) -> str:
        pass

class FileDataSource(DataSource):
    def __init__(self, filename: str):
        self.filename = filename
        self.data = ""
    
    def write_data(self, data: str):
        self.data = data
        print(f"💾 نوشتن داده در فایل {self.filename}")
    
    def read_data(self) -> str:
        print(f"📖 خواندن داده از فایل {self.filename}")
        return self.data

class CompressionDecorator(DataSource):
    def __init__(self, source: DataSource):
        self._source = source
    
    def write_data(self, data: str):
        compressed = f"[فشرده‌شده: {data}]"
        print("🗜️ فشرده‌سازی داده...")
        self._source.write_data(compressed)
    
    def read_data(self) -> str:
        data = self._source.read_data()
        print("📦 باز کردن فشرده‌سازی...")
        return data.replace("[فشرده‌شده: ", "").replace("]", "")

class EncryptionDecorator(DataSource):
    def __init__(self, source: DataSource):
        self._source = source
    
    def write_data(self, data: str):
        encrypted = f"[رمزنگاری‌شده: {data}]"
        print("🔒 رمزنگاری داده...")
        self._source.write_data(encrypted)
    
    def read_data(self) -> str:
        data = self._source.read_data()
        print("🔓 رمزگشایی داده...")
        return data.replace("[رمزنگاری‌شده: ", "").replace("]", "")

# استفاده
file = FileDataSource("data.txt")
encrypted_file = EncryptionDecorator(file)
compressed_encrypted = CompressionDecorator(encrypted_file)

compressed_encrypted.write_data("داده مهم")
result = compressed_encrypted.read_data()
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید مسئولیت‌های اضافی به اشیاء اضافه کنید بدون اینکه کد را تغییر دهید**
2. **زمانی که استفاده از وراثت غیرعملی یا غیرممکن است**
3. **زمانی که می‌خواهید رفتارها را به صورت پویا اضافه/حذف کنید**

---

> **یادآوری**: Decorator به شما اجازه می‌دهد رفتارها را لایه به لایه اضافه کنید! 🎁
