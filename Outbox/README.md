# الگوی Outbox (ارسال مطمئن پیام)

## 🎯 هدف
Outbox تضمین می‌کند **تغییرات پایگاه داده** و **انتشار پیام** با هم اتفاق بیفتند و پیام هرگز گم نشود. رویداد ابتدا در جدولی به نام Outbox ذخیره می‌شود و سپس به صورت قابل اطمینان به پیام‌رسان (Kafka/RabbitMQ/Service Bus) ارسال می‌گردد.

## 💻 مثال کد (C#)

```csharp
public class OutboxMessage
{
    public Guid Id { get; init; } = Guid.NewGuid();
    public string Type { get; init; } = default!;
    public string Payload { get; init; } = default!;
    public DateTime OccurredOn { get; init; } = DateTime.UtcNow;
    public DateTime? ProcessedOn { get; set; }
}

// در لایه Application هنگام ذخیره تراکنش
public async Task SaveOrder(Order order)
{
    using var tx = await _db.Database.BeginTransactionAsync();

    _db.Orders.Add(order);
    _db.OutboxMessages.Add(new OutboxMessage
    {
        Type = nameof(OrderCreated),
        Payload = JsonSerializer.Serialize(new OrderCreated(order.Id, order.Total))
    });

    await _db.SaveChangesAsync();
    await tx.CommitAsync(); // داده و پیام در یک تراکنش ذخیره می‌شوند
}

// پردازشگر Outbox (Worker)
public async Task ProcessOutbox()
{
    var pending = await _db.OutboxMessages
        .Where(x => x.ProcessedOn == null)
        .OrderBy(x => x.OccurredOn)
        .Take(50)
        .ToListAsync();

    foreach (var message in pending)
    {
        await _bus.PublishAsync(message.Type, message.Payload); // ارسال به پیام‌رسان
        message.ProcessedOn = DateTime.UtcNow;
    }

    await _db.SaveChangesAsync();
}
```

## 🔍 چه زمانی استفاده کنیم؟
1. زمانی که رویداد باید **حتماً منتشر** شود (پرداخت، سفارش، ایمیل مهم)
2. در معماری **Microservices** برای **اتمام تراکنش توزیع‌شده** بدون دو-فاز
3. وقتی می‌خواهید از **دوگانگی داده (DB + Message Broker)** جلوگیری کنید
4. کنار **CQRS/Event Sourcing** برای انتشار مطمئن رویدادهای دامنه

## ✅ مزایا
- جلوگیری از **گم‌شدن پیام** حتی در صورت کرش یا قطع شبکه
- عدم نیاز به **Distributed Transaction**؛ همه‌چیز در یک تراکنش محلی ثبت می‌شود
- امکان **Re-try** و **Ordering** پیام‌ها
- ساده کردن **همگام‌سازی سرویس‌ها**

## ❌ معایب
- نیاز به **جدول Outbox** و **Job پردازشگر دوره‌ای**
- امکان ایجاد **Lag** بین ثبت رویداد و ارسال پیام
- نیاز به **مانیتورینگ و پاک‌سازی** منظم Outbox

## 🔑 نکات کلیدی
- Outbox را معمولاً با **Polling Publisher** (یا Debezium/CDC) تخلیه کنید.
- پیام‌ها را **Idempotent** پردازش کنید؛ ممکن است دوباره ارسال شوند.
- رکوردهای پردازش‌شده را بر اساس **Retention Policy** پاک کنید یا آرشیو کنید.
- در هر سرویس جدولی جداگانه برای Outbox داشته باشید تا **جداسازی سرویس‌ها** حفظ شود.
