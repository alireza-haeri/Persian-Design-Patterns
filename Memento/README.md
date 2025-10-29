# الگوی Memento (یادگار)

## 🎯 هدف
الگوی Memento یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد snapshot هایی از حالت یک شیء را ذخیره و بازیابی کنید بدون افشای جزئیات پیاده‌سازی آن.

## 💻 مثال کد (Python)

```python
from datetime import datetime

class Memento:
    def __init__(self, state: str):
        self._state = state
        self._timestamp = datetime.now()
    
    def get_state(self) -> str:
        return self._state
    
    def get_timestamp(self) -> str:
        return self._timestamp.strftime("%Y-%m-%d %H:%M:%S")

class TextEditor:
    def __init__(self):
        self._content = ""
    
    def write(self, text: str):
        self._content += text
        print(f"✍️ نوشته شد: {text}")
    
    def get_content(self) -> str:
        return self._content
    
    def save(self) -> Memento:
        print(f"💾 ذخیره وضعیت: {self._content}")
        return Memento(self._content)
    
    def restore(self, memento: Memento):
        self._content = memento.get_state()
        print(f"↩️ بازیابی به: {self._content}")

class History:
    def __init__(self):
        self._mementos = []
    
    def push(self, memento: Memento):
        self._mementos.append(memento)
    
    def pop(self) -> Memento:
        if self._mementos:
            return self._mementos.pop()
        return None

# استفاده
editor = TextEditor()
history = History()

editor.write("سلام ")
history.push(editor.save())

editor.write("دنیا!")
history.push(editor.save())

editor.write(" چطوری؟")
print(f"📄 محتوا: {editor.get_content()}")

memento = history.pop()
editor.restore(memento)
print(f"📄 محتوا: {editor.get_content()}")
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که می‌خواهید snapshot هایی از حالت شیء تولید کنید
2. زمانی که دسترسی مستقیم به فیلدهای شیء کپسوله‌سازی را نقض می‌کند
3. برای پیاده‌سازی Undo/Redo

---

> **یادآوری**: Memento حالت گذشته را ذخیره و بازیابی می‌کند! 📸
