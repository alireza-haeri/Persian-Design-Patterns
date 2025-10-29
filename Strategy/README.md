# الگوی Strategy (استراتژی / راهبرد)

## 🎯 هدف
الگوی Strategy یک الگوی طراحی رفتاری است که خانواده‌ای از الگوریتم‌ها را تعریف می‌کند، هر کدام را در کلاس جداگانه قرار می‌دهد و اشیاء آن‌ها را قابل تعویض می‌کند.

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

class PaymentStrategy(ABC):
    @abstractmethod
    def pay(self, amount: int):
        pass

class CreditCardStrategy(PaymentStrategy):
    def __init__(self, card_number: str):
        self.card_number = card_number
    
    def pay(self, amount: int):
        print(f"💳 پرداخت {amount:,} تومان با کارت {self.card_number}")

class PayPalStrategy(PaymentStrategy):
    def __init__(self, email: str):
        self.email = email
    
    def pay(self, amount: int):
        print(f"🌐 پرداخت {amount:,} تومان با PayPal ({self.email})")

class CryptoStrategy(PaymentStrategy):
    def __init__(self, wallet: str):
        self.wallet = wallet
    
    def pay(self, amount: int):
        print(f"₿ پرداخت {amount:,} تومان با کریپتو ({self.wallet})")

class ShoppingCart:
    def __init__(self):
        self.items = []
        self.payment_strategy = None
    
    def add_item(self, item: str, price: int):
        self.items.append((item, price))
    
    def set_payment_strategy(self, strategy: PaymentStrategy):
        self.payment_strategy = strategy
    
    def checkout(self):
        total = sum(price for _, price in self.items)
        print(f"\n🛒 مجموع: {total:,} تومان")
        if self.payment_strategy:
            self.payment_strategy.pay(total)
        else:
            print("❌ روش پرداخت انتخاب نشده")

# استفاده
cart = ShoppingCart()
cart.add_item("کتاب", 50000)
cart.add_item("قلم", 10000)

cart.set_payment_strategy(CreditCardStrategy("1234-5678-9012-3456"))
cart.checkout()
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که می‌خواهید انواع مختلف یک الگوریتم را استفاده کنید
2. زمانی که کلاس‌های زیادی دارید که فقط در رفتارشان متفاوت هستند
3. زمانی که می‌خواهید الگوریتم را از کلاینت جدا کنید

---

> **یادآوری**: Strategy به شما اجازه می‌دهد الگوریتم را در زمان اجرا تغییر دهید! 🎯
