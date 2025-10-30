# الگوی Visitor (بازدیدکننده)

## 🎯 هدف
الگوی Visitor یک الگوی طراحی رفتاری است که به شما اجازه می‌دهد الگوریتم‌های جدید را از اشیاءی که روی آن‌ها عمل می‌کنند جدا کنید.

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;

namespace VisitorPattern
{
    // رابط Visitor - بازدیدکننده
    public interface IVisitor
    {
        void VisitBook(Book book);
        void VisitFruit(Fruit fruit);
    }

    // رابط Element - عنصر قابل بازدید
    public interface IShoppingItem
    {
        void Accept(IVisitor visitor);
    }

    // Concrete Element - کتاب
    public class Book : IShoppingItem
    {
        public int Price { get; set; }
        public string ISBN { get; set; }

        public Book(int price, string isbn)
        {
            Price = price;
            ISBN = isbn;
        }

        public void Accept(IVisitor visitor)
        {
            visitor.VisitBook(this);
        }
    }

    // Concrete Element - میوه
    public class Fruit : IShoppingItem
    {
        public int PricePerKg { get; set; }
        public double Weight { get; set; }

        public Fruit(int pricePerKg, double weight)
        {
            PricePerKg = pricePerKg;
            Weight = weight;
        }

        public void Accept(IVisitor visitor)
        {
            visitor.VisitFruit(this);
        }
    }

    // Concrete Visitor - محاسبه‌گر قیمت
    public class PriceCalculator : IVisitor
    {
        public double Total { get; private set; }

        public PriceCalculator()
        {
            Total = 0;
        }

        public void VisitBook(Book book)
        {
            int cost = book.Price;
            Total += cost;
            Console.WriteLine($"📚 کتاب (ISBN: {book.ISBN}): {cost:N0} تومان");
        }

        public void VisitFruit(Fruit fruit)
        {
            double cost = fruit.PricePerKg * fruit.Weight;
            Total += cost;
            Console.WriteLine($"🍎 میوه: {cost:N0} تومان ({fruit.Weight} کیلو)");
        }
    }

    // برنامه اصلی
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("👤 الگوی Visitor - محاسبه قیمت خرید\n");
            Console.WriteLine(new string('=', 60));

            // ایجاد لیست خرید
            List<IShoppingItem> items = new List<IShoppingItem>
            {
                new Book(50000, "123-456"),
                new Fruit(20000, 2.5),
                new Book(30000, "789-012")
            };

            // ایجاد بازدیدکننده محاسبه قیمت
            PriceCalculator calculator = new PriceCalculator();

            Console.WriteLine("\n🛒 اقلام خرید:");
            Console.WriteLine(new string('-', 60));

            // بازدید از تمام اقلام
            foreach (var item in items)
            {
                item.Accept(calculator);
            }

            Console.WriteLine(new string('-', 60));
            Console.WriteLine($"\n💰 مجموع: {calculator.Total:N0} تومان");
            Console.WriteLine(new string('=', 60));
        }
    }
}
```

### 📤 خروجی برنامه:
```
👤 الگوی Visitor - محاسبه قیمت خرید

============================================================

🛒 اقلام خرید:
------------------------------------------------------------
📚 کتاب (ISBN: 123-456): 50,000 تومان
🍎 میوه: 50,000 تومان (2.5 کیلو)
📚 کتاب (ISBN: 789-012): 30,000 تومان
------------------------------------------------------------

💰 مجموع: 130,000 تومان
============================================================
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که می‌خواهید عملیاتی روی تمام عناصر یک ساختار پیچیده انجام دهید
2. زمانی که می‌خواهید منطق کمکی را از کلاس‌های اصلی جدا کنید
3. زمانی که رفتار فقط در برخی کلاس‌ها معنادار است

---

> **یادآوری**: Visitor عملیات جدید را بدون تغییر کلاس‌ها اضافه می‌کند! 👤
