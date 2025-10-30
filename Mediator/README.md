# الگوی Mediator (میانجی / واسط)

## 🎯 هدف
الگوی Mediator یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد وابستگی‌های آشفته بین اشیاء را کاهش دهید. این الگو ارتباط مستقیم بین اشیاء را محدود می‌کند و آن‌ها را مجبور می‌کند فقط از طریق یک شیء میانجی همکاری کنند.

## 💻 مثال کد (Python)

```python
from abc import ABC, abstractmethod

class ChatMediator(ABC):
    @abstractmethod
    def send_message(self, message: str, user: 'User'):
        pass

class ChatRoom(ChatMediator):
    def __init__(self):
        self.users = []
    
    def add_user(self, user: 'User'):
        self.users.append(user)
    
    def send_message(self, message: str, sender: 'User'):
        for user in self.users:
            if user != sender:
                user.receive(message, sender.name)

class User:
    def __init__(self, name: str, mediator: ChatMediator):
        self.name = name
        self.mediator = mediator
    
    def send(self, message: str):
        print(f"💬 {self.name}: {message}")
        self.mediator.send_message(message, self)
    
    def receive(self, message: str, sender: str):
        print(f"📨 {self.name} دریافت کرد از {sender}: {message}")

# استفاده
chatroom = ChatRoom()
user1 = User("علی", chatroom)
user2 = User("رضا", chatroom)
user3 = User("سارا", chatroom)

chatroom.add_user(user1)
chatroom.add_user(user2)
chatroom.add_user(user3)

user1.send("سلام به همه!")
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که تغییر برخی کلاس‌ها سخت است زیرا به کلاس‌های زیادی وابسته‌اند
2. زمانی که نمی‌توانید یک کامپوننت را در برنامه دیگری استفاده کنید
3. زمانی که خود را مجبور می‌بینید تعداد زیادی زیرکلاس ایجاد کنید

---

> **یادآوری**: Mediator ارتباط بین اشیاء را متمرکز می‌کند! 🤝
