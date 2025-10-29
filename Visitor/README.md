# الگوی Visitor (بازدیدکننده)

## 🎯 هدف
الگوی Visitor یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد الگوریتم‌های جدید را از اشیاءی که روی آن‌ها عمل می‌کنند جدا کنید.

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

class Visitor(ABC):
    @abstractmethod
    def visit_book(self, book):
        pass
    
    @abstractmethod
    def visit_fruit(self, fruit):
        pass

class ShoppingItem(ABC):
    @abstractmethod
    def accept(self, visitor: Visitor):
        pass

class Book(ShoppingItem):
    def __init__(self, price: int, isbn: str):
        self.price = price
        self.isbn = isbn
    
    def accept(self, visitor: Visitor):
        visitor.visit_book(self)

class Fruit(ShoppingItem):
    def __init__(self, price_per_kg: int, weight: float):
        self.price_per_kg = price_per_kg
        self.weight = weight
    
    def accept(self, visitor: Visitor):
        visitor.visit_fruit(self)

class PriceCalculator(Visitor):
    def __init__(self):
        self.total = 0
    
    def visit_book(self, book):
        cost = book.price
        self.total += cost
        print(f"📚 کتاب: {cost:,} تومان")
    
    def visit_fruit(self, fruit):
        cost = fruit.price_per_kg * fruit.weight
        self.total += cost
        print(f"🍎 میوه: {cost:,.0f} تومان ({fruit.weight} کیلو)")

# استفاده
items = [
    Book(50000, "123-456"),
    Fruit(20000, 2.5),
    Book(30000, "789-012")
]

calculator = PriceCalculator()
for item in items:
    item.accept(calculator)

print(f"\n💰 مجموع: {calculator.total:,.0f} تومان")
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که می‌خواهید عملیاتی روی تمام عناصر یک ساختار پیچیده انجام دهید
2. زمانی که می‌خواهید منطق کمکی را از کلاس‌های اصلی جدا کنید
3. زمانی که رفتار فقط در برخی کلاس‌ها معنادار است

---

> **یادآوری**: Visitor عملیات جدید را بدون تغییر کلاس‌ها اضافه می‌کند! 👤
