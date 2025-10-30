# الگوی Flyweight (وزن سبک)

## 🎯 هدف
الگوی Flyweight یک الگوی طراحی ساختاری است که به شما امکان می‌دهد اشیاء بیشتری را در RAM موجود جای دهید با اشتراک‌گذاری قسمت‌های مشترک حالت بین اشیاء متعدد به جای نگه‌داشتن تمام داده‌ها در هر شیء.

## 🤔 مشکل
تصور کنید تصمیم گرفتید یک بازی ویدیویی ساده بسازید: بازیکن‌ها می‌توانند در نقشه حرکت کنند و به یکدیگر شلیک کنند. شما تصمیم گرفتید یک سیستم ذرات واقع‌گرایانه پیاده‌سازی کنید و آن را به ویژگی متمایز بازی تبدیل کنید. مقادیر عظیمی از گلوله، موشک و شظیه‌های انفجار باید در سراسر نقشه پرواز کنند و تجربه‌ای هیجان‌انگیز برای بازیکن ایجاد کنند.

پس از اتمام آن، آخرین commit را push کردید، بازی را build کردید و آن را برای یک دوست ارسال کردید. با اینکه بازی بر روی دستگاه شما به خوبی اجرا می‌شد، دوست شما نتوانست مدت زیادی بازی کند. بازی در دستگاه او بعد از چند دقیقه crash می‌کرد. چندین ساعت صرف بررسی logs دیباگ کردید و دریافتید که بازی به دلیل حافظه ناکافی crash می‌کند.

## 💡 راه‌حل
الگوی Flyweight پیشنهاد می‌کند که نگه‌داری حالت intrinsic (ذاتی) را در شیء متوقف کنید. به جای آن، این حالت را به متدهای خاصی که به آن وابسته هستند منتقل کنید. فقط حالت intrinsic در شیء باقی می‌ماند و آن را در contexts مختلف قابل استفاده مجدد می‌کند.

به عنوان نتیجه، تعداد کمتری از این اشیاء نیاز دارید زیرا آن‌ها فقط در حالت intrinsic متفاوت هستند که نسبت به extrinsic تنوع بسیار کمتری دارد.

## 🏗️ ساختار

```
   ┌──────────────┐
   │FlyweightFactory│
   ├──────────────┤
   │- flyweights  │
   │+ getFlyweight()│
   └──────────────┘
          │
          │ creates & manages
          ↓
   ┌──────────────┐
   │  Flyweight   │ (Interface)
   ├──────────────┤
   │+ operation(  │
   │  extrinsic)  │
   └──────────────┘
          △
          │ implements
          │
   ┌──────────────────┐
   │ConcreteFlyweight │
   ├──────────────────┤
   │- intrinsicState  │
   │+ operation(      │
   │  extrinsic)      │
   └──────────────────┘
```

## 👥 شرکت‌کنندگان

1. **Flyweight**: حالت intrinsic (ذاتی و مشترک) را ذخیره می‌کند
2. **ConcreteFlyweight**: پیاده‌سازی Flyweight
3. **FlyweightFactory**: Flyweights را ایجاد و مدیریت می‌کند
4. **Client**: حالت extrinsic (بیرونی و منحصربه‌فرد) را نگه‌داری می‌کند

## ⚖️ پیامدها

### مزایا ✅
- **کاهش استفاده از حافظه**: زمانی که برنامه باید اشیاء مشابه زیادی ایجاد کند
- **بهبود کارایی**: به خصوص زمانی که حافظه محدود است

### معایب ❌
- **پیچیدگی کد**: کد ممکن است پیچیده‌تر شود
- **نیاز به تفکیک حالت**: باید حالت intrinsic و extrinsic را تشخیص دهید
- **عدم thread-safety**: نیاز به مدیریت ویژه در محیط چندنخی

## 💻 مثال کد (C#)

```csharp
using System;
using System.Collections.Generic;

namespace FlyweightPattern
{
    // Flyweight - حالت ذاتی (intrinsic) - اطلاعات مشترک بین درخت‌ها
    public class TreeType
    {
        public string Name { get; private set; }
        public string Color { get; private set; }
        public string Texture { get; private set; }

        public TreeType(string name, string color, string texture)
        {
            Name = name;
            Color = color;
            Texture = texture;
        }

        // متد رسم درخت با استفاده از موقعیت بیرونی
        public void Draw(int x, int y)
        {
            Console.WriteLine($"🌳 کشیدن درخت {Name} با رنگ {Color} در ({x}, {y})");
        }
    }

    // Flyweight Factory - مدیریت و ایجاد Flyweights
    public class TreeFactory
    {
        // دیکشنری برای نگهداری انواع درخت‌های ایجاد شده
        private static Dictionary<string, TreeType> _treeTypes = new Dictionary<string, TreeType>();

        // دریافت یا ایجاد نوع درخت
        public static TreeType GetTreeType(string name, string color, string texture)
        {
            string key = $"{name}_{color}_{texture}";

            if (!_treeTypes.ContainsKey(key))
            {
                Console.WriteLine($"✨ ایجاد نوع درخت جدید: {name}");
                _treeTypes[key] = new TreeType(name, color, texture);
            }
            else
            {
                Console.WriteLine($"♻️ استفاده مجدد از نوع درخت موجود: {name}");
            }

            return _treeTypes[key];
        }

        // دریافت تعداد کل انواع درخت‌های ایجاد شده
        public static int GetTotalTypes()
        {
            return _treeTypes.Count;
        }
    }

    // Context Object - حالت بیرونی (extrinsic) - اطلاعات منحصربه‌فرد هر درخت
    public class Tree
    {
        // موقعیت درخت (extrinsic state)
        public int X { get; private set; }
        public int Y { get; private set; }
        
        // ارجاع به Flyweight (intrinsic state)
        private TreeType _treeType;

        public Tree(int x, int y, TreeType treeType)
        {
            X = x;
            Y = y;
            _treeType = treeType;
        }

        // رسم درخت با استفاده از Flyweight
        public void Draw()
        {
            _treeType.Draw(X, Y);
        }
    }

    // Client - مدیریت مجموعه درخت‌ها
    public class Forest
    {
        private List<Tree> _trees = new List<Tree>();

        // کاشت درخت جدید در جنگل
        public void PlantTree(int x, int y, string name, string color, string texture)
        {
            TreeType treeType = TreeFactory.GetTreeType(name, color, texture);
            Tree tree = new Tree(x, y, treeType);
            _trees.Add(tree);
        }

        // رسم تمام درخت‌های جنگل
        public void Draw()
        {
            Console.WriteLine("\n🌲 رسم جنگل:");
            Console.WriteLine(new string('-', 60));
            
            foreach (var tree in _trees)
            {
                tree.Draw();
            }

            // نمایش آمار صرفه‌جویی حافظه
            Console.WriteLine($"\n📊 تعداد درخت‌ها: {_trees.Count}");
            Console.WriteLine($"📦 تعداد انواع درخت (Flyweights): {TreeFactory.GetTotalTypes()}");
            Console.WriteLine($"💾 صرفه‌جویی حافظه: {_trees.Count - TreeFactory.GetTotalTypes()} شیء");
        }
    }

    // برنامه اصلی
    class Program
    {
        static void Main(string[] args)
        {
            // تنظیم کدگذاری برای نمایش صحیح فارسی
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🌳 الگوی Flyweight - جنگل");
            Console.WriteLine(new string('=', 60));

            // ایجاد جنگل
            Forest forest = new Forest();

            Console.WriteLine("\n🌱 کاشت درخت‌ها:");
            Console.WriteLine(new string('-', 60));

            // کاشت درخت‌های مختلف
            forest.PlantTree(10, 20, "بلوط", "سبز", "texture1");
            forest.PlantTree(50, 30, "کاج", "سبز تیره", "texture2");
            forest.PlantTree(80, 40, "بلوط", "سبز", "texture1");      // استفاده مجدد
            forest.PlantTree(100, 50, "افرا", "زرد", "texture3");
            forest.PlantTree(120, 60, "کاج", "سبز تیره", "texture2"); // استفاده مجدد
            forest.PlantTree(140, 70, "بلوط", "سبز", "texture1");      // استفاده مجدد
            forest.PlantTree(160, 80, "صنوبر", "سبز", "texture4");
            forest.PlantTree(180, 90, "بلوط", "سبز", "texture1");      // استفاده مجدد

            // رسم جنگل و نمایش آمار
            forest.Draw();

            Console.WriteLine("\nبرای خروج کلیدی را فشار دهید...");
            Console.ReadKey();
        }
    }
}
```

### 📤 خروجی برنامه:
```
🌳 الگوی Flyweight - جنگل
============================================================

🌱 کاشت درخت‌ها:
------------------------------------------------------------
✨ ایجاد نوع درخت جدید: بلوط
✨ ایجاد نوع درخت جدید: کاج
♻️ استفاده مجدد از نوع درخت موجود: بلوط
✨ ایجاد نوع درخت جدید: افرا
♻️ استفاده مجدد از نوع درخت موجود: کاج
♻️ استفاده مجدد از نوع درخت موجود: بلوط
✨ ایجاد نوع درخت جدید: صنوبر
♻️ استفاده مجدد از نوع درخت موجود: بلوط

🌲 رسم جنگل:
------------------------------------------------------------
🌳 کشیدن درخت بلوط با رنگ سبز در (10, 20)
🌳 کشیدن درخت کاج با رنگ سبز تیره در (50, 30)
🌳 کشیدن درخت بلوط با رنگ سبز در (80, 40)
🌳 کشیدن درخت افرا با رنگ زرد در (100, 50)
🌳 کشیدن درخت کاج با رنگ سبز تیره در (120, 60)
🌳 کشیدن درخت بلوط با رنگ سبز در (140, 70)
🌳 کشیدن درخت صنوبر با رنگ سبز در (160, 80)
🌳 کشیدن درخت بلوط با رنگ سبز در (180, 90)

📊 تعداد درخت‌ها: 8
📦 تعداد انواع درخت (Flyweights): 4
💾 صرفه‌جویی حافظه: 4 شیء
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم متن (کاراکترها)
```csharp
// Flyweight - اطلاعات مشترک کاراکتر
public class Character
{
    public char Char { get; private set; }
    public string Font { get; private set; }
    public int Size { get; private set; }

    public Character(char ch, string font, int size)
    {
        Char = ch;
        Font = font;
        Size = size;
    }

    public void Display(int row, int col, string color)
    {
        Console.WriteLine($"'{Char}' در ({row},{col}) با فونت {Font}، اندازه {Size}، رنگ {color}");
    }
}

// Factory برای مدیریت کاراکترها
public class CharacterFactory
{
    private static Dictionary<string, Character> _characters = new Dictionary<string, Character>();

    public static Character GetCharacter(char ch, string font, int size)
    {
        string key = $"{ch}_{font}_{size}";
        
        if (!_characters.ContainsKey(key))
        {
            _characters[key] = new Character(ch, font, size);
        }
        
        return _characters[key];
    }
}

// ویرایشگر متن که از Flyweight استفاده می‌کند
public class TextEditor
{
    private List<(Character character, int row, int col, string color)> _characters = 
        new List<(Character, int, int, string)>();

    public void Insert(char ch, string font, int size, int row, int col, string color)
    {
        Character character = CharacterFactory.GetCharacter(ch, font, size);
        _characters.Add((character, row, col, color));
    }

    public void Render()
    {
        foreach (var (character, row, col, color) in _characters)
        {
            character.Display(row, col, color);
        }
    }
}
```

### مثال 2: سیستم آیکون
```csharp
// Flyweight برای آیکون‌ها
public class Icon
{
    public string IconType { get; private set; }
    public byte[] ImageData { get; private set; }

    public Icon(string iconType, byte[] imageData)
    {
        IconType = iconType;
        ImageData = imageData; // داده تصویر (حجیم)
    }

    public void Render(int x, int y)
    {
        Console.WriteLine($"🎨 رندر آیکون {IconType} در ({x}, {y})");
    }
}

// Factory برای مدیریت آیکون‌ها
public class IconFactory
{
    private static Dictionary<string, Icon> _icons = new Dictionary<string, Icon>();

    public static Icon GetIcon(string iconType)
    {
        if (!_icons.ContainsKey(iconType))
        {
            // بارگذاری تصویر از دیسک (عملیات گران)
            byte[] imageData = LoadImage(iconType);
            _icons[iconType] = new Icon(iconType, imageData);
        }
        
        return _icons[iconType];
    }

    private static byte[] LoadImage(string iconType)
    {
        Console.WriteLine($"💿 بارگذاری تصویر {iconType} از دیسک...");
        // شبیه‌سازی بارگذاری تصویر
        return new byte[1024]; 
    }
}
```

## 🔍 چه زمانی استفاده کنیم؟

1. **زمانی که برنامه باید تعداد زیادی شیء ایجاد کند**
2. **زمانی که ذخیره‌سازی تمام اشیاء RAM زیادی مصرف می‌کند**
3. **زمانی که بیشتر حالت شیء extrinsic است**
4. **زمانی که می‌توانید اشیاء مشابه را با تعداد کمی شیء مشترک جایگزین کنید**

## 📝 نکات مهم

### تفاوت Intrinsic و Extrinsic:
- **Intrinsic (ذاتی)**: حالتی که بین اشیاء مشترک است و در Flyweight ذخیره می‌شود
- **Extrinsic (بیرونی)**: حالتی که بین اشیاء متفاوت است و توسط Client نگهداری می‌شود

---

> **یادآوری**: Flyweight با اشتراک‌گذاری هوشمندانه، حافظه را بهینه می‌کند! 🪶
