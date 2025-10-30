# الگوی Memento (یادگار)

## 🎯 هدف
الگوی Memento یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد snapshot هایی از حالت یک شیء را ذخیره و بازیابی کنید بدون افشای جزئیات پیاده‌سازی آن.

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;

namespace MementoPattern
{
    // کلاس Memento - ذخیره‌ساز حالت شیء
    // این کلاس یک snapshot از وضعیت شیء را نگه می‌دارد
    public class Memento
    {
        private readonly string _state;
        private readonly DateTime _timestamp;

        // سازنده: حالت را دریافت و زمان را ثبت می‌کند
        public Memento(string state)
        {
            _state = state;
            _timestamp = DateTime.Now;
        }

        // دریافت حالت ذخیره شده
        public string GetState()
        {
            return _state;
        }

        // دریافت زمان ذخیره‌سازی
        public string GetTimestamp()
        {
            return _timestamp.ToString("yyyy-MM-dd HH:mm:ss");
        }
    }

    // کلاس TextEditor - شیء اصلی که حالت آن ذخیره می‌شود (Originator)
    // این کلاس می‌تواند حالت خود را ذخیره و بازیابی کند
    public class TextEditor
    {
        private string _content;

        // سازنده: مقداردهی اولیه محتوا
        public TextEditor()
        {
            _content = "";
        }

        // نوشتن متن جدید به محتوای موجود
        public void Write(string text)
        {
            _content += text;
            Console.WriteLine($"✍️ نوشته شد: {text}");
        }

        // دریافت محتوای فعلی
        public string GetContent()
        {
            return _content;
        }

        // ذخیره وضعیت فعلی در یک Memento
        public Memento Save()
        {
            Console.WriteLine($"💾 ذخیره وضعیت: {_content}");
            return new Memento(_content);
        }

        // بازیابی وضعیت از یک Memento
        public void Restore(Memento memento)
        {
            _content = memento.GetState();
            Console.WriteLine($"↩️ بازیابی به: {_content}");
        }
    }

    // کلاس History - مدیریت تاریخچه Memento ها (Caretaker)
    // این کلاس Memento ها را نگهداری می‌کند بدون دسترسی به محتوای آنها
    public class History
    {
        private readonly Stack<Memento> _mementos;

        // سازنده: ایجاد لیست برای نگهداری Memento ها
        public History()
        {
            _mementos = new Stack<Memento>();
        }

        // اضافه کردن Memento به تاریخچه
        public void Push(Memento memento)
        {
            _mementos.Push(memento);
        }

        // برداشتن آخرین Memento از تاریخچه
        public Memento Pop()
        {
            if (_mementos.Count > 0)
            {
                return _mementos.Pop();
            }
            return null;
        }
    }

    // برنامه اصلی - نمایش استفاده از الگوی Memento
    class Program
    {
        static void Main(string[] args)
        {
            // تنظیم کنسول برای نمایش فارسی
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🎯 الگوی Memento - مثال ویرایشگر متن با قابلیت Undo");
            Console.WriteLine("═══════════════════════════════════════════════════════\n");

            // ایجاد ویرایشگر و تاریخچه
            TextEditor editor = new TextEditor();
            History history = new History();

            // مرحله 1: نوشتن اولین متن و ذخیره
            Console.WriteLine("📝 مرحله 1: نوشتن متن اول");
            editor.Write("سلام ");
            history.Push(editor.Save());
            Console.WriteLine();

            // مرحله 2: اضافه کردن متن دوم و ذخیره
            Console.WriteLine("📝 مرحله 2: اضافه کردن متن دوم");
            editor.Write("دنیا!");
            history.Push(editor.Save());
            Console.WriteLine();

            // مرحله 3: اضافه کردن متن سوم (بدون ذخیره)
            Console.WriteLine("📝 مرحله 3: اضافه کردن متن سوم");
            editor.Write(" چطوری؟");
            Console.WriteLine($"📄 محتوای فعلی: {editor.GetContent()}");
            Console.WriteLine();

            // مرحله 4: بازگشت به وضعیت قبلی (Undo)
            Console.WriteLine("🔄 مرحله 4: بازگشت به وضعیت قبلی");
            Memento memento = history.Pop();
            if (memento != null)
            {
                editor.Restore(memento);
                Console.WriteLine($"📄 محتوای بعد از Undo: {editor.GetContent()}");
            }
            Console.WriteLine();

            // مرحله 5: بازگشت به وضعیت اولیه
            Console.WriteLine("🔄 مرحله 5: بازگشت به وضعیت اولیه");
            memento = history.Pop();
            if (memento != null)
            {
                editor.Restore(memento);
                Console.WriteLine($"📄 محتوای بعد از Undo دوم: {editor.GetContent()}");
            }

            Console.WriteLine("\n✅ اتمام نمایش الگوی Memento");
            Console.ReadKey();
        }
    }
}
```

### 📤 خروجی برنامه:
```
🎯 الگوی Memento - مثال ویرایشگر متن با قابلیت Undo
═══════════════════════════════════════════════════════

📝 مرحله 1: نوشتن متن اول
✍️ نوشته شد: سلام 
💾 ذخیره وضعیت: سلام 

📝 مرحله 2: اضافه کردن متن دوم
✍️ نوشته شد: دنیا!
💾 ذخیره وضعیت: سلام دنیا!

📝 مرحله 3: اضافه کردن متن سوم
✍️ نوشته شد:  چطوری؟
📄 محتوای فعلی: سلام دنیا! چطوری؟

🔄 مرحله 4: بازگشت به وضعیت قبلی
↩️ بازیابی به: سلام دنیا!
📄 محتوای بعد از Undo: سلام دنیا!

🔄 مرحله 5: بازگشت به وضعیت اولیه
↩️ بازیابی به: سلام 
📄 محتوای بعد از Undo دوم: سلام 

✅ اتمام نمایش الگوی Memento
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که می‌خواهید snapshot هایی از حالت شیء تولید کنید
2. زمانی که دسترسی مستقیم به فیلدهای شیء کپسوله‌سازی را نقض می‌کند
3. برای پیاده‌سازی Undo/Redo

---

> **یادآوری**: Memento حالت گذشته را ذخیره و بازیابی می‌کند! 📸
