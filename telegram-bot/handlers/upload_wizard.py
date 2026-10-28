import os
import logging
from pathlib import Path
from telegram import Update, ReplyKeyboardRemove
from telegram.ext import (
    ContextTypes,
    ConversationHandler,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    filters
)

import database as db
from config import (
    TEMP_DIR,
    MAX_FILE_SIZE_BYTES,
    MAX_FILE_SIZE_MB,
    STORAGE_MODE,
    ARCHIVE_CHANNEL_ID
)
from cloud_storage import storage_manager
from keyboards import (
    categories_inline_keyboard,
    cancel_keyboard,
    skip_or_cancel_keyboard,
    main_menu_keyboard,
    after_upload_keyboard
)
from states import CATEGORY, TITLE, DESCRIPTION, UPLOADER, COMMENT, FILE

logger = logging.getLogger(__name__)


def format_bytes(size_bytes: int) -> str:
    if not size_bytes:
        return "0 KB"
    kb = size_bytes / 1024
    if kb < 1024:
        return f"{kb:.1f} KB"
    mb = kb / 1024
    if mb < 1024:
        return f"{mb:.1f} MB"
    return f"{mb / 1024:.2f} GB"


async def start_upload_wizard(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """1-qadam: Bo'lim tanlashni so'rash."""
    user = update.effective_user
    db.upsert_user(
        telegram_id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name
    )

    context.user_data["upload"] = {}
    categories = db.get_categories()

    text = (
        "<b>➕ Yangi material qo'shish</b>\n\n"
        "<b>📂 1-qadam:</b> Material qaysi bo'limga tegishli ekanligini tanlang:"
    )

    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.message.reply_html(
            text,
            reply_markup=categories_inline_keyboard(categories, prefix="wizard_cat_")
        )
    else:
        await update.message.reply_html(
            text,
            reply_markup=categories_inline_keyboard(categories, prefix="wizard_cat_")
        )

    return CATEGORY


async def category_selected(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Bo'lim tanlandi -> 2-qadam: Nomini so'rash."""
    query = update.callback_query
    await query.answer()

    cat_id = int(query.data.replace("wizard_cat_", ""))
    category = db.get_category_by_id(cat_id)

    if not category:
        await query.message.reply_text("❌ Bo'lim topilmadi. Qaytadan urinib ko'ring.")
        return ConversationHandler.END

    context.user_data["upload"]["category_id"] = cat_id
    context.user_data["upload"]["category_name"] = category["name"]
    context.user_data["upload"]["category_emoji"] = category.get("emoji", "📁")
    context.user_data["upload"]["gcs_folder"] = category.get("gcs_folder", "other")

    text = (
        f"✅ Bo'lim tanlandi: <b>{category.get('emoji', '📁')} {category['name']}</b>\n\n"
        f"📝 <b>2-qadam: Material nomini (sarlavhasini) kiriting:</b>\n"
        f"<i>(Masalan: Python asoslari - 1-dars yoki Sun'iy intellekt qo'llanmasi)</i>"
    )

    await query.edit_message_text(text, parse_mode="HTML")
    await query.message.reply_text("Davom etish uchun nomini yozing:", reply_markup=cancel_keyboard())
    return TITLE


async def title_received(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Nomi kiritildi -> 3-qadam: Tavsif so'rash."""
    text = update.message.text.strip()
    if text == "❌ Bekor qilish":
        return await cancel_upload(update, context)

    if len(text) < 2:
        await update.message.reply_text("⚠️ Material nomi juda qisqa. Iltimos, to'liqroq nom kiriting:")
        return TITLE

    context.user_data["upload"]["name"] = text

    prompt = (
        f"✅ Nomi: <b>{text}</b>\n\n"
        f"📋 <b>3-qadam: Material tavsifini yozing:</b>\n"
        f"<i>(Material nima haqida, qanday ma'lumotlar berilgan?)</i>"
    )

    await update.message.reply_html(prompt, reply_markup=cancel_keyboard())
    return DESCRIPTION


async def description_received(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Tavsif kiritildi -> 4-qadam: Kim joylayotganini so'rash."""
    text = update.message.text.strip()
    if text == "❌ Bekor qilish":
        return await cancel_upload(update, context)

    context.user_data["upload"]["description"] = text
    user = update.effective_user
    suggested_name = user.full_name or user.first_name or "Foydalanuvchi"

    prompt = (
        f"👤 <b>4-qadam: Kim joylayapti? (Muallif yoki sizning ismingiz):</b>\n"
        f"<i>Masalan: {suggested_name}</i>"
    )

    await update.message.reply_html(prompt, reply_markup=cancel_keyboard())
    return UPLOADER


async def uploader_received(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Joylovchi kiritildi -> 5-qadam: Izoh (komment) so'rash."""
    text = update.message.text.strip()
    if text == "❌ Bekor qilish":
        return await cancel_upload(update, context)

    context.user_data["upload"]["uploader_name"] = text

    prompt = (
        f"💬 <b>5-qadam: Qo'shimcha izoh (komment):</b>\n"
        f"<i>(Qo'shimcha eslatma, auditoriya yoki tavsiyalar)</i>\n\n"
        f"Agar izoh bo'lmasa, <b>⏩ O'tkazib yuborish</b> tugmasini bosing:"
    )

    await update.message.reply_html(prompt, reply_markup=skip_or_cancel_keyboard())
    return COMMENT


async def comment_received(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Izoh kiritildi yoki o'tkazib yuborildi -> 6-qadam: Fayl so'rash."""
    text = update.message.text.strip()
    if text == "❌ Bekor qilish":
        return await cancel_upload(update, context)

    if text in ["⏩ O'tkazib yuborish", "/skip"]:
        context.user_data["upload"]["comment"] = ""
    else:
        context.user_data["upload"]["comment"] = text

    upload_data = context.user_data["upload"]
    prompt = (
        f"📎 <b>6-qadam: Endi faylni yuklang!</b>\n\n"
        f"<b>Kiritilgan ma'lumotlar:</b>\n"
        f"• Bo'lim: {upload_data['category_emoji']} {upload_data['category_name']}\n"
        f"• Nomi: <b>{upload_data['name']}</b>\n"
        f"• Joylovchi: <b>{upload_data['uploader_name']}</b>\n\n"
        f"Faylni (Video, Hujjat, PDF, Rasm, Audio) yuboring.\n"
        f"<i>⚠️ Maksimal hajm: {MAX_FILE_SIZE_MB} MB</i>"
    )

    await update.message.reply_html(prompt, reply_markup=cancel_keyboard())
    return FILE


async def file_received(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Faylni qabul qilish, bulutga/lokalga yuklash va bazaga saqlash."""
    message = update.message

    if message.text == "❌ Bekor qilish":
        return await cancel_upload(update, context)

    file_obj = None
    file_name = None
    file_type = ""
    file_size = 0
    telegram_file_id = None
    mime_type = None

    # Fayl turini aniqlash
    if message.video:
        file_obj = message.video
        telegram_file_id = file_obj.file_id
        file_name = file_obj.file_name or f"video_{file_obj.file_unique_id}.mp4"
        file_size = file_obj.file_size or 0
        mime_type = file_obj.mime_type or "video/mp4"
        file_type = Path(file_name).suffix.lower() or ".mp4"
    elif message.document:
        file_obj = message.document
        telegram_file_id = file_obj.file_id
        file_name = file_obj.file_name or f"doc_{file_obj.file_unique_id}"
        file_size = file_obj.file_size or 0
        mime_type = file_obj.mime_type
        file_type = Path(file_name).suffix.lower()
    elif message.photo:
        # Eng yuqori sifatli rasmni olish
        file_obj = message.photo[-1]
        telegram_file_id = file_obj.file_id
        file_name = f"photo_{file_obj.file_unique_id}.jpg"
        file_size = file_obj.file_size or 0
        mime_type = "image/jpeg"
        file_type = ".jpg"
    elif message.audio:
        file_obj = message.audio
        telegram_file_id = file_obj.file_id
        file_name = file_obj.file_name or f"audio_{file_obj.file_unique_id}.mp3"
        file_size = file_obj.file_size or 0
        mime_type = file_obj.mime_type or "audio/mpeg"
        file_type = Path(file_name).suffix.lower() or ".mp3"
    elif message.voice:
        file_obj = message.voice
        telegram_file_id = file_obj.file_id
        file_name = f"voice_{file_obj.file_unique_id}.ogg"
        file_size = file_obj.file_size or 0
        mime_type = "audio/ogg"
        file_type = ".ogg"
    else:
        await message.reply_text(
            "⚠️ Iltimos, haqiqiy fayl (video, hujjat, rasm, audio) yuboring:",
            reply_markup=cancel_keyboard()
        )
        return FILE

    # Hajm tekshiruvi
    if file_size > MAX_FILE_SIZE_BYTES:
        await message.reply_text(
            f"❌ Fayl hajmi juda katta ({format_bytes(file_size)}).\n"
            f"Maksimal ruxsat etilgan hajm: {MAX_FILE_SIZE_MB} MB.\n"
            f"Iltimos, kichikroq hajmli fayl yuboring:",
            reply_markup=cancel_keyboard()
        )
        return FILE

    status_msg = await message.reply_text("⏳ Fayl qabul qilinmoqda va saqlanmoqda... Iltimos, kuting...")

    upload_data = context.user_data.get("upload", {})
    temp_file_path = None

    try:
        # 1. Telegram Storage rejimida ishlash (100% Bepul, bir zumda saqlanadi)
        if STORAGE_MODE == "telegram":
            # Agar arxiv kanali sozlangan bo'lsa, xabarni kanalga ham nusxalash
            if ARCHIVE_CHANNEL_ID:
                try:
                    await message.forward(chat_id=ARCHIVE_CHANNEL_ID)
                except Exception as e:
                    logger.warning(f"Arxiv kanaliga nusxalashda xato: {e}")

            upload_result = {
                "storage_type": "telegram",
                "storage_path": f"tg://{telegram_file_id}",
                "public_url": None,
                "file_size": file_size
            }
            storage_icon = "☁️ Telegram Bulut Ombori (Bepul & Cheksiz)"

        # 2. GCS yoki Lokal rejimda ishlash
        else:
            tg_file = await context.bot.get_file(telegram_file_id)
            temp_file_path = TEMP_DIR / f"temp_{telegram_file_id}_{file_name}"
            await tg_file.download_to_drive(custom_path=str(temp_file_path))

            upload_result = storage_manager.upload_file(
                local_file_path=temp_file_path,
                folder_name=upload_data.get("gcs_folder", "other"),
                original_file_name=file_name,
                content_type=mime_type
            )
            if upload_result["storage_type"] == "gcs":
                storage_icon = "☁️ Google Cloud Storage"
            else:
                storage_icon = "📁 Lokal Server (storage/)"

        user = update.effective_user
        # Bazaga yozish
        material_id = db.save_material(
            category_id=upload_data["category_id"],
            name=upload_data["name"],
            description=upload_data.get("description"),
            uploader_name=upload_data["uploader_name"],
            comment=upload_data.get("comment"),
            file_name=file_name,
            file_size=upload_result["file_size"],
            file_type=file_type,
            storage_type=upload_result["storage_type"],
            storage_path=upload_result["storage_path"],
            public_url=upload_result.get("public_url"),
            telegram_file_id=telegram_file_id,
            telegram_user_id=user.id,
            telegram_username=user.username
        )

        # Temp faylni tozalash (agar mavjud bo'lsa)
        if temp_file_path and temp_file_path.exists():
            temp_file_path.unlink()

        size_str = format_bytes(upload_result["file_size"])

        summary = (
            "🎉 <b>Material muvaffaqiyatli saqlandi!</b>\n\n"
            f"<b>📂 Bo'lim:</b> {upload_data['category_emoji']} {upload_data['category_name']}\n"
            f"<b>📝 Nomi:</b> {upload_data['name']}\n"
            f"<b>📋 Tavsif:</b> {upload_data.get('description') or 'Yo\'q'}\n"
            f"<b>👤 Joylovchi:</b> {upload_data['uploader_name']}\n"
            f"<b>💬 Izoh:</b> {upload_data.get('comment') or 'Yo\'q'}\n"
            f"<b>📎 Fayl:</b> {file_name} ({size_str})\n"
            f"<b>🏢 Saqlandi:</b> {storage_icon}\n"
            f"<b>🆔 Raqami:</b> #MAT_{material_id}"
        )

        await status_msg.delete()
        await message.reply_html(
            summary,
            reply_markup=main_menu_keyboard()
        )
        await message.reply_text(
            "Amallar:",
            reply_markup=after_upload_keyboard(material_id)
        )

        context.user_data.pop("upload", None)
        return ConversationHandler.END

    except Exception as e:
        logger.error(f"Fayl yuklashda xatolik: {e}", exc_info=True)
        if temp_file_path and temp_file_path.exists():
            temp_file_path.unlink()
        await status_msg.edit_text(f"❌ Faylni saqlashda xatolik yuz berdi: {str(e)}")
        return ConversationHandler.END


async def cancel_upload(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    """Yuklash jarayonini bekor qilish."""
    context.user_data.pop("upload", None)
    text = "❌ Material yuklash bekor qilindi."

    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.message.reply_text(text, reply_markup=main_menu_keyboard())
    else:
        await update.message.reply_text(text, reply_markup=main_menu_keyboard())

    return ConversationHandler.END


def get_upload_conversation_handler() -> ConversationHandler:
    """Material yuklash wizardi uchun ConversationHandler ni yig'ish."""
    return ConversationHandler(
        entry_points=[
            MessageHandler(filters.Regex("^➕ Yangi material qo'shish$"), start_upload_wizard),
            CommandHandler("upload", start_upload_wizard),
            CallbackQueryHandler(start_upload_wizard, pattern="^upload_more$")
        ],
        states={
            CATEGORY: [
                CallbackQueryHandler(category_selected, pattern="^wizard_cat_"),
                CallbackQueryHandler(cancel_upload, pattern="^cancel_action$")
            ],
            TITLE: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, title_received)
            ],
            DESCRIPTION: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, description_received)
            ],
            UPLOADER: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, uploader_received)
            ],
            COMMENT: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, comment_received),
                CommandHandler("skip", comment_received)
            ],
            FILE: [
                MessageHandler(
                    filters.VIDEO | filters.Document.ALL | filters.PHOTO | filters.AUDIO | filters.VOICE,
                    file_received
                ),
                MessageHandler(filters.TEXT & ~filters.COMMAND, file_received)
            ]
        },
        fallbacks=[
            CommandHandler("cancel", cancel_upload),
            MessageHandler(filters.Regex("^❌ Bekor qilish$"), cancel_upload),
            CallbackQueryHandler(cancel_upload, pattern="^cancel_action$")
        ],
        allow_reentry=True
    )
