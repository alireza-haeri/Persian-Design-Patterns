# الگوی Singleton (تک‌نمونه)

## 🎯 هدف
الگوی Singleton یک الگوی طراحی سازنده است که تضمین می‌کند یک کلاس تنها یک نمونه (instance) دارد و یک نقطه دسترسی سراسری به آن نمونه فراهم می‌کند.

## 🤔 مشکل
الگوی Singleton دو مشکل را به طور همزمان حل می‌کند (که اصل تک مسئولیتی را نقض می‌کند):

1. **تضمین وجود تنها یک نمونه از کلاس**: چرا کسی می‌خواهد تعداد نمونه‌های یک کلاس را کنترل کند؟ رایج‌ترین دلیل، کنترل دسترسی به یک منبع مشترک است - مثل یک پایگاه داده یا یک فایل.

2. **ارائه نقطه دسترسی سراسری**: درست مثل یک متغیر سراسری، الگوی Singleton به شما اجازه می‌دهد به برخی از اشیاء از هر جای برنامه دسترسی داشته باشید. با این حال، همچنین از بازنویسی آن نمونه توسط کد دیگر محافظت می‌کند.

## 💡 راه‌حل
تمام پیاده‌سازی‌های Singleton این دو مرحله مشترک را دارند:

1. **سازنده پیش‌فرض را خصوصی کنید** تا از ایجاد نمونه با عملگر `new` جلوگیری شود
2. **یک متد ساخت استاتیک ایجاد کنید** که به عنوان سازنده عمل می‌کند و در پشت صحنه، سازنده خصوصی را برای ایجاد شیء فراخوانی می‌کند و آن را در یک فیلد استاتیک ذخیره می‌کند

## 🏗️ ساختار

```
        ┌─────────────────────────┐
        │      Singleton          │
        ├─────────────────────────┤
        │ - instance: Singleton   │ (static)
        │ - data                  │
        ├─────────────────────────┤
        │ - Singleton()           │ (private)
        │ + getInstance()         │ (static)
        │ + businessLogic()       │
        └─────────────────────────┘
                    △
                    │
                    │ returns single instance
                    │
              ┌──────────┐
              │  Client  │
              └──────────┘
```

## 👥 شرکت‌کنندگان

1. **Singleton**: کلاسی که تنها یک نمونه دارد
   - سازنده خصوصی
   - متد استاتیک `getInstance()` برای دسترسی به نمونه
   - فیلد استاتیک برای نگهداری نمونه

## 🔄 نحوه همکاری
کلاینت‌ها به Singleton فقط از طریق متد `getInstance()` دسترسی دارند.

## ⚖️ پیامدها

### مزایا ✅
- **تضمین یک نمونه**: اطمینان از وجود تنها یک نمونه از کلاس
- **نقطه دسترسی سراسری**: دسترسی آسان از هر جای برنامه
- **اولیه‌سازی تنبل (Lazy Initialization)**: Singleton فقط زمانی ایجاد می‌شود که برای اولین بار درخواست شود
- **کنترل دسترسی**: کنترل دقیق‌تر روی نمونه

### معایب ❌
- **نقض اصل تک مسئولیتی**: کلاس هم منطق کسب‌وکار و هم مدیریت چرخه حیات خود را کنترل می‌کند
- **مشکلات چندنخی (Multithreading)**: نیاز به مدیریت ویژه در محیط چندنخی
- **پنهان کردن وابستگی‌ها**: وابستگی‌ها در امضای متد ظاهر نمی‌شوند
- **دشواری در تست**: سخت‌تر برای تست واحد (Unit Testing)
- **استفاده بیش از حد**: ممکن است به عنوان متغیر سراسری سوءاستفاده شود

## 💻 مثال کد (Python)

```python
from threading import Lock, Thread
import time

# ❌ پیاده‌سازی ساده (غیر thread-safe)
class SingletonSimple:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            print("🔨 ایجاد نمونه جدید...")
            cls._instance = super().__new__(cls)
        return cls._instance

# ✅ پیاده‌سازی Thread-Safe
class SingletonThreadSafe:
    _instance = None
    _lock = Lock()
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                # Double-checked locking
                if cls._instance is None:
                    print("🔨 ایجاد نمونه جدید (Thread-Safe)...")
                    cls._instance = super().__new__(cls)
        return cls._instance

# 🎯 پیاده‌سازی با Metaclass (پایتونیک)
class SingletonMeta(type):
    _instances = {}
    _lock = Lock()
    
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            with cls._lock:
                if cls not in cls._instances:
                    instance = super().__call__(*args, **kwargs)
                    cls._instances[cls] = instance
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        # این فقط یک بار اجرا می‌شود
        print("🗄️ اتصال به پایگاه داده...")
        self.connection = "Connected to DB"
        self.data = []
    
    def query(self, sql):
        print(f"📊 اجرای کوئری: {sql}")
        return f"نتیجه کوئری: {sql}"
    
    def insert(self, data):
        self.data.append(data)
        print(f"✅ داده ذخیره شد: {data}")

# 🎯 مثال کاربردی: Logger
class Logger(metaclass=SingletonMeta):
    def __init__(self):
        self.log_file = "app.log"
        print(f"📝 Logger آماده شد (فایل: {self.log_file})")
    
    def log(self, level, message):
        timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
        log_message = f"[{timestamp}] [{level}] {message}"
        print(log_message)
        # در واقعیت به فایل می‌نویسیم
        # with open(self.log_file, 'a') as f:
        #     f.write(log_message + '\n')
    
    def info(self, message):
        self.log("INFO", message)
    
    def error(self, message):
        self.log("ERROR", message)
    
    def warning(self, message):
        self.log("WARNING", message)

# 🎯 مثال کاربردی: مدیریت پیکربندی
class ConfigurationManager(metaclass=SingletonMeta):
    def __init__(self):
        print("⚙️ بارگذاری تنظیمات...")
        self.settings = {
            "database_host": "localhost",
            "database_port": 5432,
            "api_key": "secret_key_123",
            "debug_mode": True,
            "max_connections": 100
        }
    
    def get(self, key, default=None):
        return self.settings.get(key, default)
    
    def set(self, key, value):
        self.settings[key] = value
        print(f"✏️ تنظیمات به‌روز شد: {key} = {value}")
    
    def display_all(self):
        print("\n📋 تمام تنظیمات:")
        for key, value in self.settings.items():
            print(f"  {key}: {value}")

# استفاده
if __name__ == "__main__":
    print("🎯 الگوی Singleton در عمل\n")
    print("=" * 60)
    
    # تست ساده
    print("\n1️⃣ تست Singleton ساده:")
    print("-" * 60)
    s1 = SingletonSimple()
    s2 = SingletonSimple()
    print(f"s1 و s2 یکسان هستند؟ {s1 is s2}")
    print(f"آدرس s1: {id(s1)}")
    print(f"آدرس s2: {id(s2)}")
    
    # تست Database
    print("\n\n2️⃣ تست Database Singleton:")
    print("-" * 60)
    db1 = Database()
    db1.insert("کاربر 1")
    
    db2 = Database()
    db2.insert("کاربر 2")
    
    print(f"\ndb1 و db2 یکسان هستند؟ {db1 is db2}")
    print(f"داده‌های db1: {db1.data}")
    print(f"داده‌های db2: {db2.data}")
    
    # تست Logger
    print("\n\n3️⃣ تست Logger Singleton:")
    print("-" * 60)
    logger1 = Logger()
    logger1.info("برنامه شروع شد")
    
    logger2 = Logger()
    logger2.error("خطایی رخ داد")
    
    logger1.warning("هشدار")
    print(f"\nlogger1 و logger2 یکسان هستند؟ {logger1 is logger2}")
    
    # تست Configuration Manager
    print("\n\n4️⃣ تست Configuration Manager:")
    print("-" * 60)
    config1 = ConfigurationManager()
    print(f"Database Host: {config1.get('database_host')}")
    
    config2 = ConfigurationManager()
    config2.set('database_port', 3306)
    
    config1.display_all()
    print(f"\nconfig1 و config2 یکسان هستند؟ {config1 is config2}")
    
    # تست Thread-Safety
    print("\n\n5️⃣ تست Thread-Safety:")
    print("-" * 60)
    
    def create_singleton():
        singleton = Database()
        print(f"Thread {Thread.current_thread().name}: {id(singleton)}")
    
    threads = []
    for i in range(5):
        t = Thread(target=create_singleton, name=f"Thread-{i+1}")
        threads.append(t)
        t.start()
    
    for t in threads:
        t.join()
    
    print("\n✅ همه نخ‌ها به همان نمونه دسترسی دارند!")
```

## 🎯 مثال کاربردی واقعی

### مثال 1: Cache Manager
```python
class CacheManager(metaclass=SingletonMeta):
    def __init__(self):
        self.cache = {}
        print("💾 Cache Manager فعال شد")
    
    def set(self, key, value, ttl=None):
        self.cache[key] = {
            'value': value,
            'ttl': ttl,
            'timestamp': time.time()
        }
    
    def get(self, key):
        if key in self.cache:
            item = self.cache[key]
            # بررسی انقضا
            if item['ttl']:
                if time.time() - item['timestamp'] > item['ttl']:
                    del self.cache[key]
                    return None
            return item['value']
        return None
    
    def clear(self):
        self.cache.clear()
        print("🧹 Cache پاک شد")

# استفاده در بخش‌های مختلف برنامه
cache = CacheManager()
cache.set('user_123', {'name': 'علی', 'age': 25})

# در جای دیگر برنامه
cache2 = CacheManager()
user = cache2.get('user_123')  # همان داده
```

### مثال 2: Connection Pool
```python
class ConnectionPool(metaclass=SingletonMeta):
    def __init__(self, max_connections=5):
        self.max_connections = max_connections
        self.connections = []
        self.available = []
        print(f"🏊 Connection Pool با {max_connections} اتصال ایجاد شد")
    
    def get_connection(self):
        if self.available:
            return self.available.pop()
        elif len(self.connections) < self.max_connections:
            conn = self._create_connection()
            self.connections.append(conn)
            return conn
        else:
            raise Exception("تمام اتصالات در حال استفاده هستند")
    
    def release_connection(self, conn):
        self.available.append(conn)
    
    def _create_connection(self):
        return f"Connection-{len(self.connections) + 1}"

# استفاده
pool = ConnectionPool(max_connections=3)
conn1 = pool.get_connection()
conn2 = pool.get_connection()
pool.release_connection(conn1)
```

### مثال 3: Application State
```python
class ApplicationState(metaclass=SingletonMeta):
    def __init__(self):
        self.user = None
        self.is_authenticated = False
        self.theme = "light"
        self.language = "fa"
        print("🌐 وضعیت برنامه مقداردهی شد")
    
    def login(self, username):
        self.user = username
        self.is_authenticated = True
        print(f"👤 کاربر {username} وارد شد")
    
    def logout(self):
        self.user = None
        self.is_authenticated = False
        print("👋 کاربر خارج شد")
    
    def set_theme(self, theme):
        self.theme = theme
        print(f"🎨 تم به {theme} تغییر کرد")

# استفاده در UI
state = ApplicationState()
state.login("علی")

# در کامپوننت دیگر
state2 = ApplicationState()
print(f"کاربر فعلی: {state2.user}")  # علی
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که کلاس باید دقیقاً یک نمونه داشته باشد**:
   - مدیریت پایگاه داده
   - سیستم لاگ
   - مدیریت پیکربندی
   - Cache Manager
   - Connection Pool

2. **زمانی که نیاز به دسترسی سراسری به یک منبع دارید**
3. **زمانی که می‌خواهید اولیه‌سازی را به تعویق بیندازید**

## ⚠️ چه زمانی استفاده نکنیم؟

1. **زمانی که نیاز به چندین نمونه دارید**
2. **زمانی که وضعیت مشترک مشکل‌ساز است**
3. **در تست‌های واحد** (مگر با دقت خاص)
4. **به عنوان جایگزین برای متغیرهای سراسری**

## 📚 ارتباط با الگوهای دیگر

- کلاس **Facade** اغلب می‌تواند به **Singleton** تبدیل شود
- **Flyweight** شبیه **Singleton** است اگر فقط یک شیء Flyweight داشته باشید
- **Abstract Factory**، **Builder** و **Prototype** می‌توانند به عنوان **Singleton** پیاده‌سازی شوند

## 🎓 نکات پیاده‌سازی

### در Python:
```python
# روش 1: با Metaclass (توصیه می‌شود)
class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class MyClass(metaclass=SingletonMeta):
    pass

# روش 2: با Decorator
def singleton(cls):
    instances = {}
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class MyClass:
    pass

# روش 3: با __new__
class MySingleton:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
```

### نکات مهم:
1. **Thread-Safety**: از Lock استفاده کنید
2. **Lazy Initialization**: نمونه را فقط زمانی ایجاد کنید که نیاز است
3. **Serialization**: مراقب باشید سریالیزاسیون نمونه جدید ایجاد نکند
4. **Testing**: برای تست‌پذیری، از Dependency Injection استفاده کنید

---

> **هشدار**: Singleton را با احتیاط استفاده کنید! استفاده بیش از حد می‌تواند کد را سخت‌تر برای تست و نگهداری کند. 🎯
