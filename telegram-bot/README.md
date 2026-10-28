# 🤖 Material Joylash Telegram Boti (Telegram Ombori bilan)

Video, PDF hujjatlar, kitoblar, taqdimotlar, infografika va audio materiallarni Telegram orqali qabul qilib, **Telegram Bulut Ombori**da mutlaqo bepul, cheksiz va xavfsiz tartibli saqlaydigan Telegram bot.

---

## 🌟 Nega Telegram Ombori?
* ✅ **100% Bepul va Cheksiz:** Google Cloud kabi bank kartasi yoki to'lov talab qilinmaydi.
* ✅ **Server diskini to'ldirmaydi:** Katta video va fayllar to'g'ridan-to'g'ri Telegramning qudratli serverlarida saqlanadi.
* ✅ **Bir zumda saqlash va yuklash:** Telegram `file_id` orqali fayllarni sekund ichida qayta yuboradi.
* ✅ **Zaxira kanal imkoniyati:** Xohlasangiz, yuklangan har bir fayl avtomatik o'zingizning shaxsiy Telegram kanalingizga ham tushib boradi.

---

## 🔄 Bot Ishlash Mexanizmi

Foydalanuvchi botni ishga tushirganda qulay wizard (so'rovnoma) ishlaydi:
1. **📂 1-qadam (Bo'lim tanlash)**: Video darsliklar, Hujjatlar & Kitoblar, Rasmlar, Audio yoki Boshqa.
2. **📝 2-qadam (Nomi)**: Material sarlavhasi kiritiladi.
3. **📋 3-qadam (Tavsifi)**: Material nima haqida ekanligi yoziladi.
4. **👤 4-qadam (Kim joylayotgani)**: Joylovchi / muallif ismi kiritiladi.
5. **💬 5-qadam (Komment)**: Qo'shimcha izoh (ixtiyoriy, *⏩ O'tkazib yuborish* mumkin).
6. **📎 6-qadam (Fayl yuklash)**: Video (.mp4), Hujjat (.pdf, .docx), Rasm (.jpg, .png), Audio (.mp3) yoki arxiv fayl yuboriladi.
7. **☁️ Saqlash**: Fayl bir zumda Telegram bulutiga biriktiriladi va SQLite bazasiga yoziladi.
8. **📊 Ko'rish va yuklab olish**: Foydalanuvchilar istalgan paytda bo'limlar bo'yicha ko'rib, bitta tugma bilan faylni qabul qilishlari mumkin.

---

## 📂 Loyiha Tuzilmasi

```
telegram-bot/
├── bot.py                  # Asosiy ishga tushirish fayli
├── config.py               # Konfiguratsiya va sozlamalar
├── database.py             # SQLite ma'lumotlar bazasi va so'rovlar
├── cloud_storage.py        # Ombor boshqaruvi (Telegram / Lokal / GCS)
├── keyboards.py            # Reply va Inline klaviaturalar
├── states.py               # Dialog bosqichlari (ConversationHandler)
├── handlers/
│   ├── start.py            # /start, /help, /stats buyruqlari
│   ├── upload_wizard.py    # Ketma-ket material so'rash va fayl yuklash
│   └── materials_viewer.py # Bo'limlar, ro'yxatlar va faylni foydalanuvchiga yuborish
├── storage/                # Zaxira lokal papka (kerak bo'lsa)
├── temp/                   # Vaqtinchalik fayllar papkasi
├── requirements.txt        # Kerakli Python kutubxonalari
├── .env                    # Bot tokeni va sozlamalar
├── .env.example            # Sozlamalar namunasi
└── README.md
```

---

## 🚀 Ishga Tushirish (Atigi 2 qadam!)

### 1-qadam: Telegram Bot Token olish

1. Telegramda [@BotFather](https://t.me/BotFather) botiga kiring.
2. `/newbot` buyrug'ini yuboring.
3. Bot nomini kiriting (masalan: `Mening Materiallar Botim`).
4. Bot username kiriting (masalan: `my_edu_materials_bot`).
5. BotFather bergan **HTTP API Token**ni nusxalab oling.
6. `telegram-bot/.env` faylini oching va tokenni joylang:
   ```env
   BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   STORAGE_MODE=telegram
   ```

---

### 2-qadam: Botni Ishga Tushirish

Terminalda `telegram-bot` papkasida buyruqni bering:

```bash
cd telegram-bot
python bot.py
```

Konsolda quvonarli xabar chiqadi:
```
============================================================
🤖 Telegram Bot muvaffaqiyatli ishga tushdi!
📁 Saqlash rejimi: Telegram Bulut Ombori (100% Bepul & Cheksiz)
To'xtatish uchun: Ctrl + C
============================================================
```

Endi Telegramda botingizga `/start` yuborib, to'liq foydalanishingiz mumkin! 🎉
