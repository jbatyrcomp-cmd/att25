import sys
import logging

# Windows konsolida Unicode/Emoji xatoliklarini oldini olish
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters
)

import config
import database as db
from handlers.start import start_command, help_command, stats_command
from handlers.materials_viewer import (
    show_categories_menu,
    category_materials_callback,
    recent_materials_handler,
    material_detail_callback,
    send_file_callback
)
from handlers.upload_wizard import get_upload_conversation_handler

# Logging sozlamalari
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger("telegram_bot")


def main() -> None:
    """Botni ishga tushirish asosiy funksiyasi."""
    logger.info("🚀 Bot ishga tushirilmoqda...")

    # Token tekshiruvi
    if not config.BOT_TOKEN or config.BOT_TOKEN == "YOUR_TELEGRAM_BOT_TOKEN_HERE":
        print("\n" + "="*60)
        print("❌ XATOLIK: BOT_TOKEN ko'rsatilmagan!")
        print("Iltimos, '.env' faylini oching va @BotFather dan olingan")
        print("tokenni BOT_TOKEN=... qatoriga yozing.")
        print("="*60 + "\n")
        sys.exit(1)

    # Ma'lumotlar bazasini initsializatsiya qilish
    db.init_db()
    logger.info("✅ SQLite ma'lumotlar bazasi tayyor.")

    # Application qurish
    app = ApplicationBuilder().token(config.BOT_TOKEN).build()

    # 1. Asosiy wizard (Material yuklash dialogi)
    app.add_handler(get_upload_conversation_handler())

    # 2. Asosiy komandalar
    app.add_handler(CommandHandler("start", start_command))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("stats", stats_command))
    app.add_handler(CommandHandler("categories", show_categories_menu))

    # 3. Asosiy menyu tugmalari
    app.add_handler(MessageHandler(filters.Regex("^📂 Bo'limlar$"), show_categories_menu))
    app.add_handler(MessageHandler(filters.Regex("^📚 Oxirgi materiallar$"), recent_materials_handler))
    app.add_handler(MessageHandler(filters.Regex("^📊 Statistika$"), stats_command))
    app.add_handler(MessageHandler(filters.Regex("^ℹ️ Qo'llanma$"), help_command))

    # 4. Callback query handlerlari
    app.add_handler(CallbackQueryHandler(show_categories_menu, pattern="^nav_categories$"))
    app.add_handler(CallbackQueryHandler(category_materials_callback, pattern="^list_cat_"))
    app.add_handler(CallbackQueryHandler(material_detail_callback, pattern="^(mat_detail_|view_mat_)"))
    app.add_handler(CallbackQueryHandler(send_file_callback, pattern="^get_file_"))

    print("\n" + "="*60)
    print("🤖 Telegram Bot muvaffaqiyatli ishga tushdi!")
    if config.STORAGE_MODE == "telegram":
        mode_text = "Telegram Bulut Ombori (100% Bepul & Cheksiz)"
    elif config.is_gcs_configured():
        mode_text = "Google Cloud Storage"
    else:
        mode_text = "Lokal Papka (storage/)"
    print(f"📁 Saqlash rejimi: {mode_text}")
    print("To'xtatish uchun: Ctrl + C")
    print("="*60 + "\n")

    # Polling boshlash
    app.run_polling()


if __name__ == "__main__":
    main()
