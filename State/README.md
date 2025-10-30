# الگوی State (وضعیت / حالت)

## 🎯 هدف
الگوی State یک الگوی طراحی رفتاری است که به یک شیء اجازه می‌دهد رفتار خود را تغییر دهد وقتی وضعیت داخلی آن تغییر می‌کند. به نظر می‌رسد شیء کلاس خود را تغییر داده است.

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

class State(ABC):
    @abstractmethod
    def insert_coin(self, machine):
        pass
    
    @abstractmethod
    def eject_coin(self, machine):
        pass
    
    @abstractmethod
    def dispense(self, machine):
        pass

class NoCoinState(State):
    def insert_coin(self, machine):
        print("💰 سکه وارد شد")
        machine.set_state(machine.has_coin_state)
    
    def eject_coin(self, machine):
        print("❌ سکه‌ای وجود ندارد")
    
    def dispense(self, machine):
        print("❌ لطفاً ابتدا سکه وارد کنید")

class HasCoinState(State):
    def insert_coin(self, machine):
        print("⚠️ قبلاً سکه وارد شده است")
    
    def eject_coin(self, machine):
        print("💸 سکه برگردانده شد")
        machine.set_state(machine.no_coin_state)
    
    def dispense(self, machine):
        print("🥤 نوشیدنی در حال خروج...")
        machine.set_state(machine.no_coin_state)

class VendingMachine:
    def __init__(self):
        self.no_coin_state = NoCoinState()
        self.has_coin_state = HasCoinState()
        self.current_state = self.no_coin_state
    
    def set_state(self, state: State):
        self.current_state = state
    
    def insert_coin(self):
        self.current_state.insert_coin(self)
    
    def eject_coin(self):
        self.current_state.eject_coin(self)
    
    def dispense(self):
        self.current_state.dispense(self)

# استفاده
machine = VendingMachine()
machine.insert_coin()
machine.dispense()
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که شیء رفتار متفاوتی بسته به وضعیت فعلی دارد
2. زمانی که کلاس شما دارای دستورات شرطی بزرگ است
3. زمانی که کد تکراری زیادی در حالت‌های مشابه دارید

---

> **یادآوری**: State رفتار شیء را بسته به وضعیت آن تغییر می‌دهد! 🔄
