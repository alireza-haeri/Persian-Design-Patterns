# الگوی Iterator (تکرارگر / پیمایشگر)

## 🎯 هدف
الگوی Iterator یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد عناصر یک مجموعه را بدون افشای نمایش زیرین آن (لیست، پشته، درخت و غیره) پیمایش کنید.

## 🤔 مشکل
مجموعه‌ها یکی از پرکاربردترین انواع داده در برنامه‌نویسی هستند. با این حال، یک مجموعه فقط یک ظرف برای گروهی از اشیاء است.

بیشتر مجموعه‌ها عناصر خود را در لیست‌های ساده ذخیره می‌کنند. اما برخی از آن‌ها بر اساس پشته‌ها، درخت‌ها، نمودارها و دیگر ساختارهای داده پیچیده هستند.

بدون توجه به اینکه یک مجموعه چگونه ساختار داده شده است، باید راهی برای دسترسی به عناصر آن فراهم کند تا کد دیگر بتواند از این عناصر استفاده کند.

## 💡 راه‌حل
ایده اصلی الگوی Iterator این است که رفتار پیمایش یک مجموعه را به یک شیء جداگانه به نام iterator منتقل کنید.

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections;
using System.Collections.Generic;

// رابط Iterator - برای پیمایش مجموعه
public interface IBookIterator
{
    bool HasNext();
    string Next();
    void Reset();
}

// رابط Collection - برای ایجاد Iterator
public interface IBookCollection
{
    void AddBook(string book);
    IBookIterator CreateIterator();
    int Count { get; }
}

// Concrete Iterator - پیاده‌سازی واقعی Iterator
public class BookIterator : IBookIterator
{
    private readonly List<string> _books;
    private int _position = 0;

    public BookIterator(List<string> books)
    {
        _books = books;
    }

    // بررسی وجود عنصر بعدی
    public bool HasNext()
    {
        return _position < _books.Count;
    }

    // دریافت عنصر بعدی
    public string Next()
    {
        if (!HasNext())
        {
            throw new InvalidOperationException("عنصر دیگری برای پیمایش وجود ندارد");
        }
        
        string book = _books[_position];
        _position++;
        return book;
    }

    // بازنشانی موقعیت به ابتدا
    public void Reset()
    {
        _position = 0;
    }
}

// Reverse Iterator - پیمایش معکوس
public class ReverseBookIterator : IBookIterator
{
    private readonly List<string> _books;
    private int _position;

    public ReverseBookIterator(List<string> books)
    {
        _books = books;
        _position = books.Count - 1;
    }

    public bool HasNext()
    {
        return _position >= 0;
    }

    public string Next()
    {
        if (!HasNext())
        {
            throw new InvalidOperationException("عنصر دیگری برای پیمایش وجود ندارد");
        }
        
        string book = _books[_position];
        _position--;
        return book;
    }

    public void Reset()
    {
        _position = _books.Count - 1;
    }
}

// Concrete Collection - مجموعه کتاب‌ها
public class BookCollection : IBookCollection, IEnumerable<string>
{
    private readonly List<string> _books = new List<string>();

    // افزودن کتاب به مجموعه
    public void AddBook(string book)
    {
        _books.Add(book);
        Console.WriteLine($"✅ کتاب '{book}' به مجموعه اضافه شد");
    }

    // تعداد کتاب‌ها
    public int Count => _books.Count;

    // ایجاد Iterator پیش‌فرض (از اول به آخر)
    public IBookIterator CreateIterator()
    {
        return new BookIterator(_books);
    }

    // ایجاد Iterator معکوس (از آخر به اول)
    public IBookIterator CreateReverseIterator()
    {
        return new ReverseBookIterator(_books);
    }

    // پیاده‌سازی IEnumerable برای پشتیبانی از foreach
    public IEnumerator<string> GetEnumerator()
    {
        return _books.GetEnumerator();
    }

    IEnumerator IEnumerable.GetEnumerator()
    {
        return GetEnumerator();
    }
}

// استفاده از الگو
class Program
{
    static void Main()
    {
        Console.WriteLine("📚 الگوی Iterator - مجموعه کتاب\n");
        Console.WriteLine(new string('=', 60));

        // ایجاد مجموعه و افزودن کتاب‌ها
        BookCollection collection = new BookCollection();
        Console.WriteLine("\n📖 افزودن کتاب‌ها به مجموعه:");
        Console.WriteLine(new string('-', 60));
        collection.AddBook("شازده کوچولو");
        collection.AddBook("صد سال تنهایی");
        collection.AddBook("بوف کور");
        collection.AddBook("گلستان سعدی");
        collection.AddBook("مثنوی معنوی");

        Console.WriteLine($"\n📊 تعداد کتاب‌ها: {collection.Count}");

        // روش 1: استفاده از Iterator دستی (از اول به آخر)
        Console.WriteLine("\n🔄 پیمایش از اول به آخر (با Iterator دستی):");
        Console.WriteLine(new string('-', 60));
        IBookIterator iterator = collection.CreateIterator();
        int bookNumber = 1;
        while (iterator.HasNext())
        {
            string book = iterator.Next();
            Console.WriteLine($"📖 {bookNumber}. {book}");
            bookNumber++;
        }

        // روش 2: استفاده از Iterator معکوس (از آخر به اول)
        Console.WriteLine("\n🔄 پیمایش از آخر به اول (با Iterator معکوس):");
        Console.WriteLine(new string('-', 60));
        IBookIterator reverseIterator = collection.CreateReverseIterator();
        bookNumber = 1;
        while (reverseIterator.HasNext())
        {
            string book = reverseIterator.Next();
            Console.WriteLine($"📖 {bookNumber}. {book}");
            bookNumber++;
        }

        // روش 3: استفاده از foreach (به لطف IEnumerable)
        Console.WriteLine("\n🔄 پیمایش با foreach:");
        Console.WriteLine(new string('-', 60));
        bookNumber = 1;
        foreach (string book in collection)
        {
            Console.WriteLine($"📖 {bookNumber}. {book}");
            bookNumber++;
        }

        // نمایش قابلیت Reset
        Console.WriteLine("\n🔄 بازنشانی Iterator و پیمایش مجدد:");
        Console.WriteLine(new string('-', 60));
        iterator.Reset();
        Console.WriteLine($"📖 اولین کتاب: {iterator.Next()}");
        Console.WriteLine($"📖 دومین کتاب: {iterator.Next()}");
    }
}

/* خروجی:
📚 الگوی Iterator - مجموعه کتاب

============================================================

📖 افزودن کتاب‌ها به مجموعه:
------------------------------------------------------------
✅ کتاب 'شازده کوچولو' به مجموعه اضافه شد
✅ کتاب 'صد سال تنهایی' به مجموعه اضافه شد
✅ کتاب 'بوف کور' به مجموعه اضافه شد
✅ کتاب 'گلستان سعدی' به مجموعه اضافه شد
✅ کتاب 'مثنوی معنوی' به مجموعه اضافه شد

📊 تعداد کتاب‌ها: 5

🔄 پیمایش از اول به آخر (با Iterator دستی):
------------------------------------------------------------
📖 1. شازده کوچولو
📖 2. صد سال تنهایی
📖 3. بوف کور
📖 4. گلستان سعدی
📖 5. مثنوی معنوی

🔄 پیمایش از آخر به اول (با Iterator معکوس):
------------------------------------------------------------
📖 1. مثنوی معنوی
📖 2. گلستان سعدی
📖 3. بوف کور
📖 4. صد سال تنهایی
📖 5. شازده کوچولو

🔄 پیمایش با foreach:
------------------------------------------------------------
📖 1. شازده کوچولو
📖 2. صد سال تنهایی
📖 3. بوف کور
📖 4. گلستان سعدی
📖 5. مثنوی معنوی

🔄 بازنشانی Iterator و پیمایش مجدد:
------------------------------------------------------------
📖 اولین کتاب: شازده کوچولو
📖 دومین کتاب: صد سال تنهایی
*/
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که می‌خواهید جزئیات پیمایش مجموعه را پنهان کنید**
2. **زمانی که می‌خواهید از چندین نوع پیمایش پشتیبانی کنید**
3. **زمانی که می‌خواهید رابط یکنواختی برای پیمایش ساختارهای مختلف داشته باشید**

---

> **یادآوری**: Iterator به شما اجازه می‌دهد مجموعه‌ها را بدون دانستن ساختار داخلی آن‌ها پیمایش کنید! 🔄
