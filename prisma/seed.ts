import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@residency24.com" },
    update: {},
    create: {
      email: "admin@residency24.com",
      passwordHash,
      name: "مدیر سیستم",
      role: "ADMIN",
    },
  });

  // Create default system prompt
  await prisma.prompt.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "پرامت اصلی سیستم",
      type: "SYSTEM",
      content: `تو یک مشاور متخصص در زمینه ثبت شرکت و ویزای امارات متحده عربی هستی.
نام تو "مشاور هوشمند Residency24" است.

وظیفه تو:
- پاسخ دادن به سوالات کاربران درباره ثبت شرکت در امارات
- راهنمایی درباره انواع ویزای امارات
- ارائه اطلاعات دقیق و به‌روز
- پاسخ‌ها به زبان فارسی باشد
- اگر سوالی خارج از حوزه ثبت شرکت و ویزای امارات بود، مودبانه بگو که فقط در این حوزه‌ها می‌توانی کمک کنی

نکات مهم:
- همیشه به فارسی پاسخ بده
- اطلاعات دقیق و مختصر ارائه بده
- اگر از چیزی مطمئن نیستی، صادقانه بگو
- کاربر را تشویق کن برای اطلاعات دقیق‌تر با مشاور حقوقی مشورت کند`,
      isActive: true,
      version: 1,
    },
  });

  // Create default knowledge base prompt
  await prisma.prompt.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "اطلاعات ثبت شرکت",
      type: "KNOWLEDGE",
      content: `# اطلاعات ثبت شرکت در امارات

## انواع شرکت‌ها
### شرکت در مناطق آزاد (Free Zone)
- مالکیت 100% خارجی مجاز
- معافیت مالیاتی
- هزینه: از 5,000 تا 50,000 درهم

### شرکت در سرزمین اصلی (Mainland)
- مالکیت 100% خارجی از 2020
- امکان فعالیت در کل امارات
- هزینه: از 15,000 تا 100,000 درهم

### شرکت آفشور (Offshore)
- مناسب برای هلدینگ
- معافیت مالیاتی کامل
- هزینه: از 10,000 تا 25,000 درهم`,
      isActive: true,
      version: 1,
    },
  });

  // Create default knowledge base for visas
  await prisma.prompt.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "اطلاعات ویزا",
      type: "KNOWLEDGE",
      content: `# اطلاعات ویزای امارات

## ویزای طلایی (Golden Visa)
- مدت: 5 یا 10 سال
- بدون نیاز به اسپانسر
- سرمایه‌گذاری حداقل 2 میلیون درهم
- هزینه: از 2,000 تا 4,000 درهم

## ویزای اقامت
- مدت: 1، 2 یا 3 سال
- هزینه: از 3,000 تا 7,000 درهم

## ویزای گرین
- مدت: 5 سال
- برای خوداشتغال‌ها و فریلنسرها
- حداقل حقوق: 15,000 درهم

## ویزای فریلنسر
- مدت: 1-3 سال
- هزینه: از 7,500 تا 20,000 درهم`,
      isActive: true,
      version: 1,
    },
  });

  console.log("Seed completed successfully!");
  console.log("Admin: admin@residency24.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
