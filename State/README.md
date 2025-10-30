# الگوی State (وضعیت / حالت)

## 🎯 هدف
الگوی State یک الگوی طراحی رفتاری است که به یک شیء اجازه می‌دهد رفتار خود را تغییر دهد وقتی وضعیت داخلی آن تغییر می‌کند. به نظر می‌رسد شیء کلاس خود را تغییر داده است.

## 💻 مثال کد (C#)

```csharp
using System;

namespace StatePattern
{
    // رابط State - وضعیت
    public interface IState
    {
        void InsertCoin(VendingMachine machine);
        void EjectCoin(VendingMachine machine);
        void Dispense(VendingMachine machine);
    }

    // Concrete State - وضعیت بدون سکه
    public class NoCoinState : IState
    {
        public void InsertCoin(VendingMachine machine)
        {
            Console.WriteLine("💰 سکه وارد شد");
            machine.SetState(machine.HasCoinState);
        }

        public void EjectCoin(VendingMachine machine)
        {
            Console.WriteLine("❌ سکه‌ای وجود ندارد");
        }

        public void Dispense(VendingMachine machine)
        {
            Console.WriteLine("❌ لطفاً ابتدا سکه وارد کنید");
        }
    }

    // Concrete State - وضعیت دارای سکه
    public class HasCoinState : IState
    {
        public void InsertCoin(VendingMachine machine)
        {
            Console.WriteLine("⚠️ قبلاً سکه وارد شده است");
        }

        public void EjectCoin(VendingMachine machine)
        {
            Console.WriteLine("💸 سکه برگردانده شد");
            machine.SetState(machine.NoCoinState);
        }

        public void Dispense(VendingMachine machine)
        {
            Console.WriteLine("🥤 نوشیدنی در حال خروج...");
            machine.SetState(machine.NoCoinState);
        }
    }

    // Context - دستگاه فروش خودکار
    public class VendingMachine
    {
        public IState NoCoinState { get; private set; }
        public IState HasCoinState { get; private set; }
        private IState _currentState;

        public VendingMachine()
        {
            NoCoinState = new NoCoinState();
            HasCoinState = new HasCoinState();
            _currentState = NoCoinState;
        }

        public void SetState(IState state)
        {
            _currentState = state;
        }

        public void InsertCoin()
        {
            _currentState.InsertCoin(this);
        }

        public void EjectCoin()
        {
            _currentState.EjectCoin(this);
        }

        public void Dispense()
        {
            _currentState.Dispense(this);
        }
    }

    // برنامه اصلی
    class Program
    {
        static void Main(string[] args)
        {
            Console.OutputEncoding = System.Text.Encoding.UTF8;

            Console.WriteLine("🎭 الگوی State - دستگاه فروش خودکار\n");
            Console.WriteLine(new string('=', 60));

            VendingMachine machine = new VendingMachine();

            Console.WriteLine("\n🔄 سناریو 1: وارد کردن سکه و دریافت نوشیدنی");
            Console.WriteLine(new string('-', 60));
            machine.InsertCoin();
            machine.Dispense();

            Console.WriteLine("\n🔄 سناریو 2: تلاش برای دریافت نوشیدنی بدون سکه");
            Console.WriteLine(new string('-', 60));
            machine.Dispense();

            Console.WriteLine("\n🔄 سناریو 3: وارد کردن و برگرداندن سکه");
            Console.WriteLine(new string('-', 60));
            machine.InsertCoin();
            machine.EjectCoin();

            Console.WriteLine("\n" + new string('=', 60));
        }
    }
}
```

### 📤 خروجی برنامه:
```
🎭 الگوی State - دستگاه فروش خودکار

============================================================

🔄 سناریو 1: وارد کردن سکه و دریافت نوشیدنی
------------------------------------------------------------
💰 سکه وارد شد
🥤 نوشیدنی در حال خروج...

🔄 سناریو 2: تلاش برای دریافت نوشیدنی بدون سکه
------------------------------------------------------------
❌ لطفاً ابتدا سکه وارد کنید

🔄 سناریو 3: وارد کردن و برگرداندن سکه
------------------------------------------------------------
💰 سکه وارد شد
💸 سکه برگردانده شد

============================================================
```

## 🔍 چه زمانی استفاده کنیم؟

1. زمانی که شیء رفتار متفاوتی بسته به وضعیت فعلی دارد
2. زمانی که کلاس شما دارای دستورات شرطی بزرگ است
3. زمانی که کد تکراری زیادی در حالت‌های مشابه دارید

---

> **یادآوری**: State رفتار شیء را بسته به وضعیت آن تغییر می‌دهد! 🔄
