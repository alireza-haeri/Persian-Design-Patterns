# الگوی Proxy (پروکسی / نماینده)

## 🎯 هدف
الگوی Proxy یک الگوی طراحی ساختاری است که به شما اجازه می‌دهد یک جایگزین یا placeholder برای یک شیء دیگر فراهم کنید. یک Proxy دسترسی به شیء اصلی را کنترل می‌کند و به شما امکان می‌دهد کاری را قبل یا بعد از رسیدن درخواست به شیء اصلی انجام دهید.

## 🤔 مشکل
چرا می‌خواهید دسترسی به یک شیء را کنترل کنید؟ مثال بزنیم: یک شیء بزرگ دارید که مقدار زیادی منابع سیستم مصرف می‌کند. شما گاهی به آن نیاز دارید، اما نه همیشه.

می‌توانید پیاده‌سازی lazy initialization را انجام دهید: شیء را فقط زمانی ایجاد کنید که واقعاً نیاز است. اما تمام کلاینت‌های شیء باید کد اولیه‌سازی تنبل را اجرا کنند. متأسفانه، این احتمالاً باعث تکرار کد زیادی شود.

## 💡 راه‌حل
الگوی Proxy پیشنهاد می‌کند یک کلاس proxy جدید با همان رابط شیء سرویس اصلی ایجاد کنید. سپس برنامه خود را به‌روزرسانی می‌کنید تا شیء proxy را به تمام کلاینت‌های شیء اصلی منتقل کند. پس از دریافت درخواست از کلاینت، proxy یک شیء سرویس واقعی ایجاد می‌کند و تمام کار را به آن واگذار می‌کند.

## 🏗️ ساختار

```
   ┌──────────────┐
   │    Client    │
   └──────────────┘
          │
          │ uses
          ↓
   ┌──────────────┐
   │ServiceInterface│
   ├──────────────┤
   │ + request()  │
   └──────────────┘
          △
          │ implements
    ┌─────┴─────┐
    │           │
┌─────────┐ ┌─────────┐
│  Proxy  │ │ Service │
├─────────┤ ├─────────┤
│-service │ │+request()│
│+request()│ └─────────┘
└─────────┘
    │
    └──────▶ delegates to
```

## 👥 شرکت‌کنندگان

1. **ServiceInterface**: رابط مشترک برای Service و Proxy
2. **Service**: کلاس سرویس واقعی
3. **Proxy**: نماینده‌ای که دسترسی به Service را کنترل می‌کند
4. **Client**: با ServiceInterface کار می‌کند

## 🔄 انواع Proxy

### 1. Virtual Proxy (پروکسی مجازی)
کنترل دسترسی به منابعی که گران هستند

### 2. Protection Proxy (پروکسی محافظ)
کنترل دسترسی بر اساس حقوق

### 3. Remote Proxy (پروکسی از راه دور)
نمایش یک شیء که در فضای آدرس دیگری است

### 4. Caching Proxy (پروکسی حافظه نهان)
ذخیره نتایج درخواست‌ها

## ⚖️ پیامدها

### مزایا ✅
- **کنترل دسترسی**: کنترل زمان و نحوه دسترسی به شیء
- **Lazy initialization**: ایجاد شیء فقط در صورت نیاز
- **Logging و Caching**: افزودن قابلیت‌های اضافی بدون تغییر سرویس
- **اصل باز/بسته**: می‌توانید proxies جدید معرفی کنید بدون تغییر سرویس

### معایب ❌
- کد ممکن است پیچیده‌تر شود
- پاسخ سرویس ممکن است با تأخیر همراه باشد

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod
import time

# Service Interface
class Image(ABC):
    @abstractmethod
    def display(self):
        pass

# Real Service
class RealImage(Image):
    def __init__(self, filename: str):
        self.filename = filename
        self._load_from_disk()
    
    def _load_from_disk(self):
        print(f"💿 بارگذاری تصویر از دیسک: {self.filename}")
        time.sleep(2)  # شبیه‌سازی بارگذاری
    
    def display(self):
        print(f"🖼️ نمایش تصویر: {self.filename}")

# Virtual Proxy
class ImageProxy(Image):
    def __init__(self, filename: str):
        self.filename = filename
        self._real_image = None
    
    def display(self):
        if self._real_image is None:
            print("⏳ تصویر هنوز بارگذاری نشده، در حال بارگذاری...")
            self._real_image = RealImage(self.filename)
        self._real_image.display()

# Protection Proxy
class ProtectedImageProxy(Image):
    def __init__(self, filename: str, user_role: str):
        self.filename = filename
        self.user_role = user_role
        self._real_image = None
    
    def display(self):
        if self.user_role != "admin":
            print("🚫 دسترسی رد شد! فقط ادمین می‌تواند این تصویر را ببیند.")
            return
        
        if self._real_image is None:
            self._real_image = RealImage(self.filename)
        self._real_image.display()

# Caching Proxy
class CachingImageProxy(Image):
    _cache = {}
    
    def __init__(self, filename: str):
        self.filename = filename
    
    def display(self):
        if self.filename in self._cache:
            print(f"⚡ نمایش تصویر از کش: {self.filename}")
        else:
            print(f"📥 بارگذاری و کش کردن تصویر: {self.filename}")
            self._cache[self.filename] = RealImage(self.filename)
        
        self._cache[self.filename].display()

# استفاده
if __name__ == "__main__":
    print("🎭 الگوی Proxy\n")
    print("=" * 60)
    
    # Virtual Proxy
    print("\n1️⃣ Virtual Proxy (Lazy Loading):")
    print("-" * 60)
    print("ایجاد proxy...")
    image1 = ImageProxy("photo1.jpg")
    print("Proxy ایجاد شد، اما تصویر واقعی هنوز بارگذاری نشده\n")
    
    print("اولین نمایش:")
    image1.display()
    
    print("\nدومین نمایش:")
    image1.display()
    
    # Protection Proxy
    print("\n\n2️⃣ Protection Proxy (Access Control):")
    print("-" * 60)
    
    print("کاربر عادی:")
    image2 = ProtectedImageProxy("secret.jpg", "user")
    image2.display()
    
    print("\nکاربر ادمین:")
    image3 = ProtectedImageProxy("secret.jpg", "admin")
    image3.display()
    
    # Caching Proxy
    print("\n\n3️⃣ Caching Proxy:")
    print("-" * 60)
    
    print("اولین درخواست:")
    image4 = CachingImageProxy("cached_photo.jpg")
    image4.display()
    
    print("\nدومین درخواست (از کش):")
    image5 = CachingImageProxy("cached_photo.jpg")
    image5.display()
```

## 🎯 مثال کاربردی واقعی

### مثال 1: Proxy برای API
```python
class DataService(ABC):
    @abstractmethod
    def get_data(self, user_id: int):
        pass

class RealDataService(DataService):
    def get_data(self, user_id: int):
        print(f"🌐 درخواست API برای کاربر {user_id}")
        time.sleep(1)  # شبیه‌سازی تأخیر شبکه
        return {"id": user_id, "name": f"کاربر {user_id}"}

class CachedDataServiceProxy(DataService):
    def __init__(self):
        self._service = RealDataService()
        self._cache = {}
    
    def get_data(self, user_id: int):
        if user_id in self._cache:
            print(f"⚡ بازگشت از کش برای کاربر {user_id}")
            return self._cache[user_id]
        
        data = self._service.get_data(user_id)
        self._cache[user_id] = data
        return data

# استفاده
service = CachedDataServiceProxy()
print(service.get_data(1))  # درخواست API
print(service.get_data(1))  # از کش
```

### مثال 2: Database Proxy
```python
class Database(ABC):
    @abstractmethod
    def query(self, sql: str):
        pass

class RealDatabase(Database):
    def query(self, sql: str):
        print(f"🗄️ اجرای کوئری: {sql}")
        return "نتیجه کوئری"

class DatabaseProxy(Database):
    def __init__(self, user_role: str):
        self._database = RealDatabase()
        self.user_role = user_role
        self._log = []
    
    def query(self, sql: str):
        # بررسی دسترسی
        if "DELETE" in sql.upper() or "DROP" in sql.upper():
            if self.user_role != "admin":
                print("🚫 دسترسی رد شد! فقط ادمین می‌تواند داده حذف کند.")
                return None
        
        # لاگ کردن
        self._log.append(f"{time.time()}: {sql}")
        
        # اجرای کوئری
        return self._database.query(sql)
    
    def show_logs(self):
        print("\n📋 تاریخچه کوئری‌ها:")
        for log in self._log:
            print(f"  {log}")
```

## 🔍 چه زمانی استفاده کنیم؟

1. **Lazy initialization** (Virtual Proxy)
2. **کنترل دسترسی** (Protection Proxy)
3. **Caching نتایج**
4. **Logging درخواست‌ها**
5. **شیء از راه دور** (Remote Proxy)

---

> **یادآوری**: Proxy یک نماینده هوشمند است که دسترسی به شیء را کنترل می‌کند! 🛡️
