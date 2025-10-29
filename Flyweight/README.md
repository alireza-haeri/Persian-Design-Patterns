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

## 💻 مثال کد (Python)

```python
from typing import Dict

# Flyweight
class TreeType:
    """حالت ذاتی (intrinsic) - اطلاعات مشترک بین درخت‌ها"""
    def __init__(self, name: str, color: str, texture: str):
        self.name = name
        self.color = color
        self.texture = texture
    
    def draw(self, x: int, y: int):
        print(f"🌳 کشیدن درخت {self.name} با رنگ {self.color} در ({x}, {y})")

# Flyweight Factory
class TreeFactory:
    _tree_types: Dict[str, TreeType] = {}
    
    @classmethod
    def get_tree_type(cls, name: str, color: str, texture: str) -> TreeType:
        key = f"{name}_{color}_{texture}"
        
        if key not in cls._tree_types:
            print(f"✨ ایجاد نوع درخت جدید: {name}")
            cls._tree_types[key] = TreeType(name, color, texture)
        else:
            print(f"♻️ استفاده مجدد از نوع درخت موجود: {name}")
        
        return cls._tree_types[key]
    
    @classmethod
    def get_total_types(cls) -> int:
        return len(cls._tree_types)

# Context Object
class Tree:
    """حالت بیرونی (extrinsic) - اطلاعات منحصربه‌فرد هر درخت"""
    def __init__(self, x: int, y: int, tree_type: TreeType):
        self.x = x
        self.y = y
        self.tree_type = tree_type
    
    def draw(self):
        self.tree_type.draw(self.x, self.y)

# Client
class Forest:
    def __init__(self):
        self.trees = []
    
    def plant_tree(self, x: int, y: int, name: str, color: str, texture: str):
        tree_type = TreeFactory.get_tree_type(name, color, texture)
        tree = Tree(x, y, tree_type)
        self.trees.append(tree)
    
    def draw(self):
        print("\n🌲 رسم جنگل:")
        print("-" * 60)
        for tree in self.trees:
            tree.draw()
        print(f"\n📊 تعداد درخت‌ها: {len(self.trees)}")
        print(f"📦 تعداد انواع درخت (Flyweights): {TreeFactory.get_total_types()}")
        print(f"💾 صرفه‌جویی حافظه: {len(self.trees) - TreeFactory.get_total_types()} شیء")

# استفاده
if __name__ == "__main__":
    print("🌳 الگوی Flyweight - جنگل")
    print("=" * 60)
    
    forest = Forest()
    
    print("\n🌱 کاشت درخت‌ها:")
    print("-" * 60)
    
    # کاشت درخت‌های مختلف
    forest.plant_tree(10, 20, "بلوط", "سبز", "texture1")
    forest.plant_tree(50, 30, "کاج", "سبز تیره", "texture2")
    forest.plant_tree(80, 40, "بلوط", "سبز", "texture1")  # استفاده مجدد
    forest.plant_tree(100, 50, "افرا", "زرد", "texture3")
    forest.plant_tree(120, 60, "کاج", "سبز تیره", "texture2")  # استفاده مجدد
    forest.plant_tree(140, 70, "بلوط", "سبز", "texture1")  # استفاده مجدد
    forest.plant_tree(160, 80, "صنوبر", "سبز", "texture4")
    forest.plant_tree(180, 90, "بلوط", "سبز", "texture1")  # استفاده مجدد
    
    # رسم جنگل
    forest.draw()
```

## 🎯 مثال کاربردی واقعی

### مثال 1: سیستم متن (کاراکترها)
```python
class Character:
    """Flyweight - اطلاعات مشترک کاراکتر"""
    def __init__(self, char: str, font: str, size: int):
        self.char = char
        self.font = font
        self.size = size
    
    def display(self, row: int, col: int, color: str):
        print(f"'{self.char}' در ({row},{col}) با فونت {self.font}، اندازه {self.size}، رنگ {color}")

class CharacterFactory:
    _characters: Dict[str, Character] = {}
    
    @classmethod
    def get_character(cls, char: str, font: str, size: int) -> Character:
        key = f"{char}_{font}_{size}"
        if key not in cls._characters:
            cls._characters[key] = Character(char, font, size)
        return cls._characters[key]

class TextEditor:
    def __init__(self):
        self.characters = []
    
    def insert(self, char: str, font: str, size: int, 
               row: int, col: int, color: str):
        character = CharacterFactory.get_character(char, font, size)
        self.characters.append((character, row, col, color))
    
    def render(self):
        for char, row, col, color in self.characters:
            char.display(row, col, color)
```

### مثال 2: سیستم آیکون
```python
class Icon:
    """Flyweight برای آیکون‌ها"""
    def __init__(self, icon_type: str, image_data: bytes):
        self.icon_type = icon_type
        self.image_data = image_data  # داده تصویر (حجیم)
    
    def render(self, x: int, y: int):
        print(f"🎨 رندر آیکون {self.icon_type} در ({x}, {y})")

class IconFactory:
    _icons: Dict[str, Icon] = {}
    
    @classmethod
    def get_icon(cls, icon_type: str) -> Icon:
        if icon_type not in cls._icons:
            # بارگذاری تصویر از دیسک (عملیات گران)
            image_data = cls._load_image(icon_type)
            cls._icons[icon_type] = Icon(icon_type, image_data)
        return cls._icons[icon_type]
    
    @staticmethod
    def _load_image(icon_type: str) -> bytes:
        print(f"💿 بارگذاری تصویر {icon_type} از دیسک...")
        return b"image_data"  # شبیه‌سازی
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
