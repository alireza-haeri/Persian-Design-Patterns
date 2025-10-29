# الگوی Builder (سازنده)

## 🎯 هدف
الگوی Builder یک الگوی طراحی سازنده است که به شما امکان می‌دهد اشیاء پیچیده را گام به گام بسازید. این الگو به شما اجازه می‌دهد انواع و نمایش‌های مختلف یک شیء را با استفاده از همان کد ساخت تولید کنید.

## 🤔 مشکل
تصور کنید یک شیء پیچیده دارید که نیاز به اولیه‌سازی دشوار و گام به گام فیلدها و اشیاء تو در تو زیادی دارد. چنین کد اولیه‌سازی معمولاً در یک سازنده (constructor) غول‌پیکر با پارامترهای زیاد دفن شده است.

برای مثال، بیایید فکر کنیم چگونه یک شیء `خانه` می‌سازیم. برای ساختن یک خانه ساده، باید چهار دیوار و یک کف بسازید، یک در نصب کنید، یک جفت پنجره نصب کنید و یک سقف بسازید. اما اگر خواستید خانه بزرگ‌تر و روشن‌تری با حیاط و سایر امکانات (مثل سیستم گرمایش، لوله‌کشی و برق) داشته باشید چطور؟

## 💡 راه‌حل
الگوی Builder پیشنهاد می‌کند که کد ساخت شیء را از کلاس خودش خارج کنید و آن را به اشیاء جداگانه‌ای به نام سازنده (builders) منتقل کنید.

الگو ساخت شیء را به مجموعه‌ای از مراحل سازمان‌دهی می‌کند. برای ایجاد یک شیء، این مراحل را روی یک شیء سازنده اجرا می‌کنید. نکته مهم این است که لازم نیست همه مراحل را فراخوانی کنید. فقط می‌توانید مراحلی را که برای تولید پیکربندی خاصی از یک شیء لازم است فراخوانی کنید.

## 🏗️ ساختار

```
                    ┌──────────────┐
                    │   Director   │
                    ├──────────────┤
                    │ +construct() │
                    └──────────────┘
                           │
                           │ uses
                           ↓
                    ┌──────────────┐
                    │   Builder    │ (Interface)
                    ├──────────────┤
                    │ +buildPartA()│
                    │ +buildPartB()│
                    │ +getResult() │
                    └──────────────┘
                           △
                           │ implements
              ┌────────────┴────────────┐
              │                         │
    ┌──────────────────┐      ┌──────────────────┐
    │ ConcreteBuilder1 │      │ ConcreteBuilder2 │
    ├──────────────────┤      ├──────────────────┤
    │ +buildPartA()    │      │ +buildPartA()    │
    │ +buildPartB()    │      │ +buildPartB()    │
    │ +getResult()     │      │ +getResult()     │
    └──────────────────┘      └──────────────────┘
              │                         │
              │ creates                 │ creates
              ↓                         ↓
       ┌──────────┐              ┌──────────┐
       │ Product1 │              │ Product2 │
       └──────────┘              └──────────┘
```

## 👥 شرکت‌کنندگان

1. **Builder**: رابط انتزاعی برای ایجاد قسمت‌های شیء Product
2. **ConcreteBuilder**: پیاده‌سازی Builder و قسمت‌های محصول را می‌سازد و مونتاژ می‌کند
3. **Director**: اشیاء را با استفاده از رابط Builder می‌سازد
4. **Product**: شیء پیچیده‌ای که در حال ساخت است

## 🔄 نحوه همکاری
- کلاینت یک شیء Director ایجاد می‌کند و آن را با شیء Builder مورد نظر پیکربندی می‌کند
- Director مسئول اطلاع رسانی به builder است که چه قسمت‌هایی از محصول باید ساخته شوند
- Builder درخواست‌ها از director را مدیریت می‌کند و قسمت‌ها را به محصول اضافه می‌کند
- کلاینت محصول را از builder بازیابی می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **ساخت گام به گام**: می‌توانید اشیاء را گام به گام بسازید، مراحل ساخت را به تعویق بیندازید یا مراحل را به صورت بازگشتی اجرا کنید
- **استفاده مجدد از کد**: می‌توانید از همان کد ساخت برای ساختن نمایش‌های مختلف محصولات استفاده کنید
- **اصل تک مسئولیتی**: می‌توانید کد ساخت پیچیده را از منطق تجاری محصول جدا کنید
- **خوانایی بهتر**: کد ساخت پیچیده قابل خواندن‌تر و قابل نگهداری‌تر می‌شود

### معایب ❌
- پیچیدگی کلی کد افزایش می‌یابد زیرا الگو نیاز به ایجاد کلاس‌های جدید متعددی دارد

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod
from typing import List

# Product
class House:
    def __init__(self):
        self.parts: List[str] = []
    
    def add(self, part: str):
        self.parts.append(part)
    
    def show(self) -> str:
        return "\n".join([f"  - {part}" for part in self.parts])

# Builder Interface
class HouseBuilder(ABC):
    @abstractmethod
    def reset(self):
        pass
    
    @abstractmethod
    def build_walls(self):
        pass
    
    @abstractmethod
    def build_doors(self):
        pass
    
    @abstractmethod
    def build_windows(self):
        pass
    
    @abstractmethod
    def build_roof(self):
        pass
    
    @abstractmethod
    def build_garage(self):
        pass
    
    @abstractmethod
    def get_house(self) -> House:
        pass

# Concrete Builder 1
class ConcreteHouseBuilder(HouseBuilder):
    def __init__(self):
        self.house = House()
    
    def reset(self):
        self.house = House()
    
    def build_walls(self):
        self.house.add("🧱 دیوارهای آجری محکم")
    
    def build_doors(self):
        self.house.add("🚪 در چوبی زیبا")
    
    def build_windows(self):
        self.house.add("🪟 پنجره‌های دوجداره")
    
    def build_roof(self):
        self.house.add("🏠 سقف شیروانی")
    
    def build_garage(self):
        self.house.add("🚗 گاراژ دو ماشینه")
    
    def get_house(self) -> House:
        house = self.house
        self.reset()
        return house

# Concrete Builder 2
class VillaBuilder(HouseBuilder):
    def __init__(self):
        self.house = House()
    
    def reset(self):
        self.house = House()
    
    def build_walls(self):
        self.house.add("🏛️ دیوارهای سنگی لوکس")
    
    def build_doors(self):
        self.house.add("🚪 درهای چوبی منبت‌کاری شده")
    
    def build_windows(self):
        self.house.add("🪟 پنجره‌های فرانسوی بزرگ")
    
    def build_roof(self):
        self.house.add("🏰 سقف گنبدی شکل")
    
    def build_garage(self):
        self.house.add("🚗 گاراژ چهار ماشینه")
    
    def get_house(self) -> House:
        house = self.house
        self.reset()
        return house

# Concrete Builder 3
class CottageBuilder(HouseBuilder):
    def __init__(self):
        self.house = House()
    
    def reset(self):
        self.house = House()
    
    def build_walls(self):
        self.house.add("🪵 دیوارهای چوبی دنج")
    
    def build_doors(self):
        self.house.add("🚪 در کوچک و ساده")
    
    def build_windows(self):
        self.house.add("🪟 پنجره‌های کوچک")
    
    def build_roof(self):
        self.house.add("🏡 سقف کاهگلی")
    
    def build_garage(self):
        # کلبه نیازی به گاراژ ندارد
        pass
    
    def get_house(self) -> House:
        house = self.house
        self.reset()
        return house

# Director
class Director:
    def __init__(self):
        self._builder = None
    
    def set_builder(self, builder: HouseBuilder):
        self._builder = builder
    
    def build_minimal_house(self):
        """خانه ساده با حداقل امکانات"""
        self._builder.build_walls()
        self._builder.build_doors()
        self._builder.build_roof()
    
    def build_full_featured_house(self):
        """خانه کامل با تمام امکانات"""
        self._builder.build_walls()
        self._builder.build_doors()
        self._builder.build_windows()
        self._builder.build_roof()
        self._builder.build_garage()

# استفاده
if __name__ == "__main__":
    print("🏗️ الگوی Builder - ساخت خانه\n")
    print("=" * 60)
    
    director = Director()
    
    # ساخت خانه معمولی
    print("\n🏠 خانه معمولی (با تمام امکانات):")
    print("-" * 60)
    concrete_builder = ConcreteHouseBuilder()
    director.set_builder(concrete_builder)
    director.build_full_featured_house()
    house1 = concrete_builder.get_house()
    print(house1.show())
    
    # ساخت ویلا
    print("\n🏰 ویلای لوکس (با تمام امکانات):")
    print("-" * 60)
    villa_builder = VillaBuilder()
    director.set_builder(villa_builder)
    director.build_full_featured_house()
    house2 = villa_builder.get_house()
    print(house2.show())
    
    # ساخت کلبه ساده
    print("\n🏡 کلبه ساده (حداقلی):")
    print("-" * 60)
    cottage_builder = CottageBuilder()
    director.set_builder(cottage_builder)
    director.build_minimal_house()
    house3 = cottage_builder.get_house()
    print(house3.show())
    
    # ساخت سفارشی بدون Director
    print("\n🎨 خانه سفارشی (بدون Director):")
    print("-" * 60)
    custom_builder = ConcreteHouseBuilder()
    custom_builder.build_walls()
    custom_builder.build_doors()
    custom_builder.build_windows()
    # بدون سقف و گاراژ!
    house4 = custom_builder.get_house()
    print(house4.show())
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سازنده کوئری SQL
```python
class SQLQuery:
    def __init__(self):
        self.query_parts = []
    
    def __str__(self):
        return " ".join(self.query_parts)

class SQLQueryBuilder:
    def __init__(self):
        self.query = SQLQuery()
    
    def select(self, *fields):
        self.query.query_parts.append(f"SELECT {', '.join(fields)}")
        return self
    
    def from_table(self, table):
        self.query.query_parts.append(f"FROM {table}")
        return self
    
    def where(self, condition):
        self.query.query_parts.append(f"WHERE {condition}")
        return self
    
    def order_by(self, field):
        self.query.query_parts.append(f"ORDER BY {field}")
        return self
    
    def limit(self, count):
        self.query.query_parts.append(f"LIMIT {count}")
        return self
    
    def build(self) -> SQLQuery:
        return self.query

# استفاده
query = (SQLQueryBuilder()
    .select("name", "email", "age")
    .from_table("users")
    .where("age > 18")
    .order_by("name")
    .limit(10)
    .build())

print(f"📊 کوئری: {query}")
```

### مثال 2: سازنده ایمیل
```python
class Email:
    def __init__(self):
        self.to = []
        self.cc = []
        self.subject = ""
        self.body = ""
        self.attachments = []

class EmailBuilder:
    def __init__(self):
        self.email = Email()
    
    def add_to(self, address):
        self.email.to.append(address)
        return self
    
    def add_cc(self, address):
        self.email.cc.append(address)
        return self
    
    def set_subject(self, subject):
        self.email.subject = subject
        return self
    
    def set_body(self, body):
        self.email.body = body
        return self
    
    def attach(self, filename):
        self.email.attachments.append(filename)
        return self
    
    def build(self) -> Email:
        return self.email

# استفاده
email = (EmailBuilder()
    .add_to("user@example.com")
    .add_cc("manager@example.com")
    .set_subject("گزارش ماهانه")
    .set_body("متن پیام...")
    .attach("report.pdf")
    .build())
```

## 🔍 چه زمانی استفاده کنیم؟

1. **برای خلاص شدن از سازنده تلسکوپی**: وقتی سازنده با پارامترهای زیاد دارید
2. **زمانی که می‌خواهید کد شما بتواند نمایش‌های مختلف محصول را بسازد**
3. **برای ساخت اشیاء پیچیده**: زمانی که ساخت شیء مراحل متعدد و پیچیده‌ای دارد
4. **برای ساخت درخت‌های Composite یا اشیاء پیچیده دیگر**

## 📚 ارتباط با الگوهای دیگر

- **Builder** روی ساخت اشیاء پیچیده گام به گام تمرکز دارد. **Abstract Factory** روی خانواده‌های اشیاء مرتبط تمرکز دارد
- **Builder** می‌تواند با **Singleton** برای ساخت زیرسیستم‌های پیچیده استفاده شود
- **Builder** اغلب با **Composite** استفاده می‌شود تا درخت‌های پیچیده بسازد
- می‌توانید **Builder** را با **Bridge** ترکیب کنید: Director در نقش abstraction و Builders در نقش implementations

## 🎓 نکات پیاده‌سازی

1. مراحل ساخت مشترک را در رابط Builder بیان کنید
2. Concrete builder برای هر نمایش محصول ایجاد کنید
3. در نظر بگیرید از Director برای کپسوله کردن روش‌های مختلف ساخت استفاده کنید
4. از Fluent Interface (method chaining) برای خوانایی بهتر استفاده کنید
5. محصول نهایی را فقط پس از تکمیل ساخت برگردانید

---

> **یادآوری**: Builder به شما کمک می‌کند اشیاء پیچیده را به صورت واضح و گام به گام بسازید! 🏗️
