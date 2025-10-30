# الگوی Mediator (میانجی / واسط)

## 🎯 هدف
الگوی Mediator یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد وابستگی‌های آشفته بین اشیاء را کاهش دهید. این الگو ارتباط مستقیم بین اشیاء را محدود می‌کند و آن‌ها را مجبور می‌کند فقط از طریق یک شیء میانجی همکاری کنند.

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;

// رابط میانجی چت - وظیفه ارسال پیام را تعریف می‌کند
public interface IChatMediator
{
    void SendMessage(string message, User sender);
    void AddUser(User user);
}

// پیاده‌سازی میانجی چت - اتاق گفتگو
public class ChatRoom : IChatMediator
{
    private List<User> users;

    public ChatRoom()
    {
        users = new List<User>();
    }

    // افزودن کاربر به اتاق گفتگو
    public void AddUser(User user)
    {
        users.Add(user);
    }

    // ارسال پیام به تمام کاربران به جز فرستنده
    public void SendMessage(string message, User sender)
    {
        foreach (User user in users)
        {
            // پیام را به همه به جز فرستنده ارسال می‌کند
            if (user != sender)
            {
                user.Receive(message, sender.Name);
            }
        }
    }
}

// کلاس کاربر - شرکت‌کننده در گفتگو
public class User
{
    public string Name { get; private set; }
    private IChatMediator mediator;

    public User(string name, IChatMediator mediator)
    {
        Name = name;
        this.mediator = mediator;
    }

    // ارسال پیام از طریق میانجی
    public void Send(string message)
    {
        Console.WriteLine($"💬 {Name}: {message}");
        mediator.SendMessage(message, this);
    }

    // دریافت پیام از میانجی
    public void Receive(string message, string senderName)
    {
        Console.WriteLine($"📨 {Name} دریافت کرد از {senderName}: {message}");
    }
}

// برنامه اصلی
class Program
{
    static void Main(string[] args)
    {
        // ایجاد اتاق گفتگو (میانجی)
        ChatRoom chatroom = new ChatRoom();

        // ایجاد کاربران
        User user1 = new User("علی", chatroom);
        User user2 = new User("رضا", chatroom);
        User user3 = new User("سارا", chatroom);

        // افزودن کاربران به اتاق گفتگو
        chatroom.AddUser(user1);
        chatroom.AddUser(user2);
        chatroom.AddUser(user3);

        // ارسال پیام‌ها
        user1.Send("سلام به همه!");
        Console.WriteLine();
        user2.Send("سلام علی! چطوری؟");
        Console.WriteLine();
        user3.Send("درود بر همگی!");
    }
}
```

**خروجی برنامه:**
```
💬 علی: سلام به همه!
📨 رضا دریافت کرد از علی: سلام به همه!
📨 سارا دریافت کرد از علی: سلام به همه!

💬 رضا: سلام علی! چطوری؟
📨 علی دریافت کرد از رضا: سلام علی! چطوری؟
📨 سارا دریافت کرد از رضا: سلام علی! چطوری؟

💬 سارا: درود بر همگی!
📨 علی دریافت کرد از سارا: درود بر همگی!
📨 رضا دریافت کرد از سارا: درود بر همگی!
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که تغییر برخی کلاس‌ها سخت است زیرا به کلاس‌های زیادی وابسته‌اند
2. زمانی که نمی‌توانید یک کامپوننت را در برنامه دیگری استفاده کنید
3. زمانی که خود را مجبور می‌بینید تعداد زیادی زیرکلاس ایجاد کنید

---

> **یادآوری**: Mediator ارتباط بین اشیاء را متمرکز می‌کند! 🤝
