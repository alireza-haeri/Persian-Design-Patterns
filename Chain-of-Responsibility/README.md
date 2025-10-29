# الگوی Chain of Responsibility (زنجیره مسئولیت)

## 🎯 هدف
الگوی Chain of Responsibility یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد درخواست‌ها را در یک زنجیره از handler ها (دست‌گیرنده‌ها) منتقل کنید. پس از دریافت درخواست، هر handler تصمیم می‌گیرد که آن را پردازش کند یا به handler بعدی در زنجیره منتقل کند.

## 🤔 مشکل
تصور کنید در حال کار روی یک سیستم سفارش آنلاین هستید. می‌خواهید دسترسی به سیستم را محدود کنید تا فقط کاربران احراز هویت شده بتوانند سفارش ایجاد کنند. همچنین، کاربرانی که مجوزهای اداری دارند باید دسترسی کامل به تمام سفارش‌ها داشته باشند.

بعد از کمی برنامه‌ریزی، متوجه می‌شوید که این بررسی‌ها باید به صورت ترتیبی انجام شوند. برنامه می‌تواند سعی کند کاربر را با سیستم احراز هویت کند هر بار که درخواستی حاوی اعتبارنامه کاربر دریافت می‌کند.

## 💡 راه‌حل
مثل بسیاری از الگوهای طراحی رفتاری دیگر، Chain of Responsibility بر تبدیل رفتارهای خاص به اشیاء مستقل به نام handlers متکی است. در مورد ما، هر بررسی باید به کلاس خودش منتقل شود که دارای یک متد واحد است که بررسی را انجام می‌دهد.

## 🏗️ ساختار

```
   ┌──────────┐
   │  Client  │
   └──────────┘
        │
        │ sends request
        ↓
   ┌──────────────┐
   │   Handler    │ (Interface)
   ├──────────────┤
   │ + setNext()  │
   │ + handle()   │
   └──────────────┘
          △
          │ implements
    ┌─────┴─────┬─────────┐
    │           │         │
┌─────────┐ ┌─────────┐ ┌─────────┐
│Handler1 │ │Handler2 │ │Handler3 │
├─────────┤ ├─────────┤ ├─────────┤
│-next    │─│-next    │─│-next    │
│+handle()│ │+handle()│ │+handle()│
└─────────┘ └─────────┘ └─────────┘
```

## 👥 شرکت‌کنندگان

1. **Handler**: رابط مشترک برای تمام handlers
2. **ConcreteHandler**: handlers مشخص که درخواست را پردازش یا منتقل می‌کنند
3. **Client**: درخواست را به زنجیره ارسال می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **جفت‌شدگی سست**: فرستنده و گیرنده را جدا می‌کند
- **انعطاف‌پذیری**: می‌توانید ترتیب handlers را تغییر دهید
- **اصل تک مسئولیتی**: می‌توانید کلاس‌های عملیات را از کلاس‌های فراخوانی جدا کنید
- **اصل باز/بسته**: handlers جدید بدون شکستن کد موجود

### معایب ❌
- برخی درخواست‌ها ممکن است بدون پردازش بمانند
- دیباگ زنجیره می‌تواند سخت باشد

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod
from typing import Optional

# Handler Interface
class Handler(ABC):
    def __init__(self):
        self._next_handler: Optional[Handler] = None
    
    def set_next(self, handler: 'Handler') -> 'Handler':
        self._next_handler = handler
        return handler
    
    @abstractmethod
    def handle(self, request: dict) -> Optional[str]:
        if self._next_handler:
            return self._next_handler.handle(request)
        return None

# Concrete Handlers
class AuthenticationHandler(Handler):
    def handle(self, request: dict) -> Optional[str]:
        if not request.get('username') or not request.get('password'):
            return "❌ خطای احراز هویت: نام کاربری یا رمز عبور وارد نشده"
        
        if request.get('password') != 'secret123':
            return "❌ خطای احراز هویت: رمز عبور اشتباه است"
        
        print("✅ احراز هویت موفق")
        return super().handle(request)

class AuthorizationHandler(Handler):
    def handle(self, request: dict) -> Optional[str]:
        user_role = request.get('role', 'user')
        
        if request.get('admin_required', False) and user_role != 'admin':
            return "❌ خطای مجوز: نیاز به دسترسی ادمین"
        
        print("✅ مجوز تأیید شد")
        return super().handle(request)

class ValidationHandler(Handler):
    def handle(self, request: dict) -> Optional[str]:
        if not request.get('data'):
            return "❌ خطای اعتبارسنجی: داده خالی است"
        
        if len(request.get('data', '')) < 5:
            return "❌ خطای اعتبارسنجی: داده باید حداقل 5 کاراکتر باشد"
        
        print("✅ اعتبارسنجی موفق")
        return super().handle(request)

class ProcessHandler(Handler):
    def handle(self, request: dict) -> Optional[str]:
        print(f"✅ پردازش درخواست: {request.get('data')}")
        return "درخواست با موفقیت پردازش شد! 🎉"

# استفاده
if __name__ == "__main__":
    print("🔗 الگوی Chain of Responsibility\n")
    print("=" * 60)
    
    # ساخت زنجیره
    auth = AuthenticationHandler()
    authz = AuthorizationHandler()
    validation = ValidationHandler()
    process = ProcessHandler()
    
    auth.set_next(authz).set_next(validation).set_next(process)
    
    # تست 1: درخواست معتبر
    print("\n📤 تست 1: درخواست معتبر")
    print("-" * 60)
    request1 = {
        'username': 'ali',
        'password': 'secret123',
        'role': 'user',
        'data': 'سفارش محصول'
    }
    result = auth.handle(request1)
    print(f"📥 نتیجه: {result}")
    
    # تست 2: رمز عبور اشتباه
    print("\n\n📤 تست 2: رمز عبور اشتباه")
    print("-" * 60)
    request2 = {
        'username': 'reza',
        'password': 'wrong',
        'data': 'سفارش محصول'
    }
    result = auth.handle(request2)
    print(f"📥 نتیجه: {result}")
    
    # تست 3: نیاز به دسترسی ادمین
    print("\n\n📤 تست 3: نیاز به دسترسی ادمین")
    print("-" * 60)
    request3 = {
        'username': 'sara',
        'password': 'secret123',
        'role': 'user',
        'admin_required': True,
        'data': 'حذف کاربر'
    }
    result = auth.handle(request3)
    print(f"📥 نتیجه: {result}")
    
    # تست 4: داده نامعتبر
    print("\n\n📤 تست 4: داده نامعتبر")
    print("-" * 60)
    request4 = {
        'username': 'mehdi',
        'password': 'secret123',
        'role': 'user',
        'data': 'کم'
    }
    result = auth.handle(request4)
    print(f"📥 نتیجه: {result}")
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم پشتیبانی مشتری
```python
class SupportHandler(Handler):
    pass

class Level1Support(SupportHandler):
    def handle(self, request: dict) -> Optional[str]:
        if request.get('priority') == 'low':
            return f"✅ پشتیبانی سطح 1: {request.get('issue')} حل شد"
        print("🔄 انتقال به سطح 2...")
        return super().handle(request)

class Level2Support(SupportHandler):
    def handle(self, request: dict) -> Optional[str]:
        if request.get('priority') == 'medium':
            return f"✅ پشتیبانی سطح 2: {request.get('issue')} حل شد"
        print("🔄 انتقال به مدیر...")
        return super().handle(request)

class ManagerSupport(SupportHandler):
    def handle(self, request: dict) -> Optional[str]:
        return f"✅ مدیر: {request.get('issue')} حل شد (اولویت بالا)"
```

### مثال 2: سیستم لاگ
```python
class Logger(Handler):
    pass

class ConsoleLogger(Logger):
    def handle(self, request: dict) -> Optional[str]:
        level = request.get('level')
        if level in ['INFO', 'DEBUG']:
            print(f"📺 Console: {request.get('message')}")
        return super().handle(request)

class FileLogger(Logger):
    def handle(self, request: dict) -> Optional[str]:
        level = request.get('level')
        if level in ['WARNING', 'ERROR']:
            print(f"📁 File: {request.get('message')}")
        return super().handle(request)

class EmailLogger(Logger):
    def handle(self, request: dict) -> Optional[str]:
        level = request.get('level')
        if level == 'CRITICAL':
            print(f"📧 Email: {request.get('message')}")
        return super().handle(request)
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که برنامه باید انواع مختلف درخواست‌ها را به روش‌های مختلف پردازش کند**
2. **زمانی که ترتیب handlers مهم است**
3. **زمانی که مجموعه handlers و ترتیب آن‌ها باید در زمان اجرا تغییر کند**

---

> **یادآوری**: Chain of Responsibility درخواست را در زنجیره منتقل می‌کند تا handler مناسب آن را پردازش کند! 🔗
