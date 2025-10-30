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

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

# Abstract Products
class Chair(ABC):
    @abstractmethod
    def sit_on(self) -> str:
        pass

class Sofa(ABC):
    @abstractmethod
    def lie_on(self) -> str:
        pass

class CoffeeTable(ABC):
    @abstractmethod
    def put_on(self) -> str:
        pass

# Concrete Products - Modern Style
class ModernChair(Chair):
    def sit_on(self) -> str:
        return "🪑 نشستن روی صندلی مدرن و شیک"

class ModernSofa(Sofa):
    def lie_on(self) -> str:
        return "🛋️ دراز کشیدن روی مبل مدرن"

class ModernCoffeeTable(CoffeeTable):
    def put_on(self) -> str:
        return "☕ قرار دادن فنجان روی میز قهوه مدرن"

# Concrete Products - Victorian Style
class VictorianChair(Chair):
    def sit_on(self) -> str:
        return "🪑 نشستن روی صندلی ویکتوریایی کلاسیک"

class VictorianSofa(Sofa):
    def lie_on(self) -> str:
        return "🛋️ دراز کشیدن روی مبل ویکتوریایی تزئین شده"

class VictorianCoffeeTable(CoffeeTable):
    def put_on(self) -> str:
        return "☕ قرار دادن فنجان روی میز قهوه ویکتوریایی منبت‌کاری شده"

# Concrete Products - Art Deco Style
class ArtDecoChair(Chair):
    def sit_on(self) -> str:
        return "🪑 نشستن روی صندلی آرت دکو هنری"

class ArtDecoSofa(Sofa):
    def lie_on(self) -> str:
        return "🛋️ دراز کشیدن روی مبل آرت دکو با طراحی هندسی"

class ArtDecoCoffeeTable(CoffeeTable):
    def put_on(self) -> str:
        return "☕ قرار دادن فنجان روی میز قهوه آرت دکو"

# Abstract Factory
class FurnitureFactory(ABC):
    @abstractmethod
    def create_chair(self) -> Chair:
        pass
    
    @abstractmethod
    def create_sofa(self) -> Sofa:
        pass
    
    @abstractmethod
    def create_coffee_table(self) -> CoffeeTable:
        pass

# Concrete Factories
class ModernFurnitureFactory(FurnitureFactory):
    def create_chair(self) -> Chair:
        return ModernChair()
    
    def create_sofa(self) -> Sofa:
        return ModernSofa()
    
    def create_coffee_table(self) -> CoffeeTable:
        return ModernCoffeeTable()

class VictorianFurnitureFactory(FurnitureFactory):
    def create_chair(self) -> Chair:
        return VictorianChair()
    
    def create_sofa(self) -> Sofa:
        return VictorianSofa()
    
    def create_coffee_table(self) -> CoffeeTable:
        return VictorianCoffeeTable()

class ArtDecoFurnitureFactory(FurnitureFactory):
    def create_chair(self) -> Chair:
        return ArtDecoChair()
    
    def create_sofa(self) -> Sofa:
        return ArtDecoSofa()
    
    def create_coffee_table(self) -> CoffeeTable:
        return ArtDecoCoffeeTable()

# Client Code
def furnish_room(factory: FurnitureFactory):
    chair = factory.create_chair()
    sofa = factory.create_sofa()
    table = factory.create_coffee_table()
    
    print(chair.sit_on())
    print(sofa.lie_on())
    print(table.put_on())
    print()

if __name__ == "__main__":
    print("🏭 الگوی Abstract Factory - فروشگاه مبلمان\n")
    print("=" * 60)
    
    print("\n🎨 دکوراسیون مدرن:")
    print("-" * 60)
    modern_factory = ModernFurnitureFactory()
    furnish_room(modern_factory)
    
    print("👑 دکوراسیون ویکتوریایی:")
    print("-" * 60)
    victorian_factory = VictorianFurnitureFactory()
    furnish_room(victorian_factory)
    
    print("🎭 دکوراسیون آرت دکو:")
    print("-" * 60)
    artdeco_factory = ArtDecoFurnitureFactory()
    furnish_room(artdeco_factory)
```

## 🎯 مثال کاربردی واقعی

### مثال 1: رابط کاربری چند پلتفرمی
```python
class Button(ABC):
    @abstractmethod
    def render(self) -> str:
        pass

class Checkbox(ABC):
    @abstractmethod
    def render(self) -> str:
        pass

class WindowsButton(Button):
    def render(self) -> str:
        return "🖱️ دکمه ویندوزی رندر شد"

class MacOSButton(Button):
    def render(self) -> str:
        return "🖱️ دکمه MacOS رندر شد"

class WindowsCheckbox(Checkbox):
    def render(self) -> str:
        return "☑️ چک‌باکس ویندوزی رندر شد"

class MacOSCheckbox(Checkbox):
    def render(self) -> str:
        return "☑️ چک‌باکس MacOS رندر شد"

class GUIFactory(ABC):
    @abstractmethod
    def create_button(self) -> Button:
        pass
    
    @abstractmethod
    def create_checkbox(self) -> Checkbox:
        pass

class WindowsFactory(GUIFactory):
    def create_button(self) -> Button:
        return WindowsButton()
    
    def create_checkbox(self) -> Checkbox:
        return WindowsCheckbox()

class MacOSFactory(GUIFactory):
    def create_button(self) -> Button:
        return MacOSButton()
    
    def create_checkbox(self) -> Checkbox:
        return MacOSCheckbox()
```

### مثال 2: سیستم پایگاه داده
```python
class Connection(ABC):
    @abstractmethod
    def connect(self) -> str:
        pass

class Query(ABC):
    @abstractmethod
    def execute(self) -> str:
        pass

class MySQLConnection(Connection):
    def connect(self) -> str:
        return "🔌 اتصال به MySQL برقرار شد"

class PostgreSQLConnection(Connection):
    def connect(self) -> str:
        return "🔌 اتصال به PostgreSQL برقرار شد"

class DatabaseFactory(ABC):
    @abstractmethod
    def create_connection(self) -> Connection:
        pass
    
    @abstractmethod
    def create_query(self) -> Query:
        pass
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
