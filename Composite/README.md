# الگوی Composite (مرکب / ترکیبی)

## 🎯 هدف
الگوی Composite یک الگوی طراحی ساختاری است که به شما اجازه می‌دهد اشیاء را در ساختارهای درختی ترکیب کنید و سپس با این ساختارها طوری کار کنید که انگار اشیاء منفرد هستند.

## 🤔 مشکل
استفاده از الگوی Composite فقط زمانی منطقی است که مدل اصلی برنامه شما می‌تواند به صورت یک درخت نمایش داده شود.

به عنوان مثال، تصور کنید دو نوع شیء دارید: `محصولات` و `جعبه‌ها`. یک جعبه می‌تواند شامل چندین محصول و همچنین تعدادی جعبه کوچک‌تر باشد. این جعبه‌های کوچک نیز می‌توانند محصولات یا حتی جعبه‌های کوچک‌تر داشته باشند و غیره.

فرض کنید می‌خواهید قیمت کل سفارش را محاسبه کنید. رویکرد مستقیم باز کردن همه جعبه‌ها، بررسی همه محصولات و محاسبه مجموع است. اما در دنیای واقعی، باید سطوح جعبه و محصول را بدانید و...

## 💡 راه‌حل
الگوی Composite پیشنهاد می‌کند که با محصولات و جعبه‌ها از طریق یک رابط مشترک که یک متد برای محاسبه قیمت کل اعلام می‌کند، کار کنید.

## 🏗️ ساختار

```
        ┌──────────────┐
        │  Component   │ (Interface)
        ├──────────────┤
        │ + operation()│
        └──────────────┘
               △
               │
      ┌────────┴────────┐
      │                 │
┌───────────┐    ┌─────────────┐
│   Leaf    │    │  Composite  │
├───────────┤    ├─────────────┤
│+operation()│    │ - children  │
└───────────┘    │ + add()     │
                 │ + remove()  │
                 │ + operation()│
                 └─────────────┘
                       │
                       │ contains
                       ↓
                 ┌──────────────┐
                 │  Component   │
                 └──────────────┘
```

## 👥 شرکت‌کنندگان

1. **Component**: رابط برای تمام اشیاء در ترکیب
2. **Leaf**: اشیاء برگ (پایانی) بدون فرزند
3. **Composite**: اشیاءی که فرزند دارند
4. **Client**: با اشیاء از طریق رابط Component کار می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **کار با ساختارهای درختی پیچیده**: می‌توانید با درخت‌های پیچیده راحت‌تر کار کنید
- **اصل باز/بسته**: انواع عناصر جدید را بدون شکستن کد موجود معرفی کنید
- **یکسان‌سازی**: می‌توانید با اشیاء مرکب و ساده به یک شکل رفتار کنید

### معایب ❌
- ممکن است ارائه یک رابط مشترک برای کلاس‌هایی که عملکردشان خیلی متفاوت است دشوار باشد

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod
from typing import List

# Component
class FileSystemComponent(ABC):
    def __init__(self, name: str):
        self.name = name
    
    @abstractmethod
    def get_size(self) -> int:
        pass
    
    @abstractmethod
    def display(self, indent: str = ""):
        pass

# Leaf
class File(FileSystemComponent):
    def __init__(self, name: str, size: int):
        super().__init__(name)
        self.size = size
    
    def get_size(self) -> int:
        return self.size
    
    def display(self, indent: str = ""):
        print(f"{indent}📄 {self.name} ({self.size} KB)")

# Composite
class Directory(FileSystemComponent):
    def __init__(self, name: str):
        super().__init__(name)
        self.children: List[FileSystemComponent] = []
    
    def add(self, component: FileSystemComponent):
        self.children.append(component)
        return self
    
    def remove(self, component: FileSystemComponent):
        self.children.remove(component)
    
    def get_size(self) -> int:
        total = 0
        for child in self.children:
            total += child.get_size()
        return total
    
    def display(self, indent: str = ""):
        print(f"{indent}📁 {self.name}/ ({self.get_size()} KB)")
        for child in self.children:
            child.display(indent + "  ")

# استفاده
if __name__ == "__main__":
    print("🗂️ الگوی Composite - سیستم فایل\n")
    print("=" * 60)
    
    # ایجاد فایل‌ها
    file1 = File("document.txt", 10)
    file2 = File("photo.jpg", 500)
    file3 = File("video.mp4", 5000)
    file4 = File("music.mp3", 300)
    file5 = File("report.pdf", 200)
    
    # ایجاد دایرکتوری‌ها
    documents = Directory("Documents")
    documents.add(file1)
    documents.add(file5)
    
    media = Directory("Media")
    pictures = Directory("Pictures")
    pictures.add(file2)
    
    videos = Directory("Videos")
    videos.add(file3)
    
    music = Directory("Music")
    music.add(file4)
    
    media.add(pictures)
    media.add(videos)
    media.add(music)
    
    root = Directory("Root")
    root.add(documents)
    root.add(media)
    
    # نمایش ساختار
    print("\n📊 ساختار سیستم فایل:")
    print("-" * 60)
    root.display()
    
    print(f"\n\n💾 حجم کل: {root.get_size()} KB")
```

## 🎯 مثال کاربردی واقعی

### مثال 1: ساختار سازمانی
```python
class Employee(ABC):
    def __init__(self, name: str, salary: int):
        self.name = name
        self.salary = salary
    
    @abstractmethod
    def get_salary(self) -> int:
        pass
    
    @abstractmethod
    def display(self, indent: str = ""):
        pass

class Developer(Employee):
    def get_salary(self) -> int:
        return self.salary
    
    def display(self, indent: str = ""):
        print(f"{indent}👨‍💻 {self.name} - توسعه‌دهنده (حقوق: {self.salary})")

class Manager(Employee):
    def __init__(self, name: str, salary: int):
        super().__init__(name, salary)
        self.subordinates: List[Employee] = []
    
    def add(self, employee: Employee):
        self.subordinates.append(employee)
    
    def get_salary(self) -> int:
        total = self.salary
        for emp in self.subordinates:
            total += emp.get_salary()
        return total
    
    def display(self, indent: str = ""):
        print(f"{indent}👔 {self.name} - مدیر (حقوق: {self.salary})")
        for emp in self.subordinates:
            emp.display(indent + "  ")
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که باید ساختار درختی اشیاء را پیاده‌سازی کنید**
2. **زمانی که می‌خواهید کد کلاینت با اشیاء ساده و پیچیده یکسان رفتار کند**

---

> **یادآوری**: Composite به شما کمک می‌کند با ساختارهای درختی به سادگی کار کنید! 🌳
