import os
import logging
from pathlib import Path
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes

import database as db
from config import BASE_DIR
from keyboards import material_actions_keyboard, main_menu_keyboard

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


async def show_categories_menu(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Bo'limlar ro'yxatini ko'rsatish."""
    categories = db.get_categories()
    stats = {cat["id"]: cat["count"] for cat in db.get_stats()["categories"]}

    keyboard = []
    for cat in categories:
        count = stats.get(cat["id"], 0)
        btn_text = f"{cat.get('emoji', '📁')} {cat['name']} ({count})"
        keyboard.append([InlineKeyboardButton(btn_text, callback_data=f"list_cat_{cat['id']}")])

    text = "<b>📂 Qaysi bo'limdagi materiallarni ko'rmoqchisiz?</b>\nKerakli bo'limni tanlang:"
    markup = InlineKeyboardMarkup(keyboard)

    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(text, parse_mode="HTML", reply_markup=markup)
    else:
        await update.message.reply_html(text, reply_markup=markup)


async def category_materials_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Tanlangan bo'limdagi materiallarni ko'rsatish."""
    query = update.callback_query
    await query.answer()

    cat_id = int(query.data.replace("list_cat_", ""))
    category = db.get_category_by_id(cat_id)
    materials = db.get_materials_by_category(cat_id, limit=20)

    if not category:
        await query.edit_message_text("❌ Bo'lim topilmadi.")
        return

    if not materials:
        keyboard = [[InlineKeyboardButton("🔙 Bo'limlar ro'yxatiga", callback_data="nav_categories")]]
        await query.edit_message_text(
            f"<b>{category.get('emoji', '📁')} {category['name']}</b> bo'limida hozircha materiallar yo'q.\n\n"
            f"<i>Birinchi bo'lib material qo'shish uchun quyidagi menyudan foydalaning!</i>",
            parse_mode="HTML",
            reply_markup=InlineKeyboardMarkup(keyboard)
        )
        return

    keyboard = []
    for mat in materials:
        size_str = format_bytes(mat.get("file_size") or 0)
        title = mat["name"]
        if len(title) > 28:
            title = title[:25] + "..."
        keyboard.append([
            InlineKeyboardButton(f"📄 {title} ({size_str})", callback_data=f"mat_detail_{mat['id']}")
        ])

    keyboard.append([InlineKeyboardButton("🔙 Bo'limlarga qaytish", callback_data="nav_categories")])

    text = (
        f"<b>{category.get('emoji', '📁')} {category['name']}</b>\n"
        f"<i>Jami materiallar: {len(materials)} ta</i>\n\n"
        f"Batafsil ma'lumot va faylni olish uchun material ustiga bosing:"
    )

    await query.edit_message_text(text, parse_mode="HTML", reply_markup=InlineKeyboardMarkup(keyboard))


async def recent_materials_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Oxirgi yuklangan materiallar ro'yxati."""
    materials = db.get_recent_materials(limit=10)

    if not materials:
        await update.message.reply_html(
            "📚 Hozircha hech qanday material yuklanmagan.\n"
            "Material qo'shish uchun <b>➕ Yangi material qo'shish</b> tugmasini bosing.",
            reply_markup=main_menu_keyboard()
        )
        return

    keyboard = []
    for mat in materials:
        cat_emoji = mat.get("category_emoji", "📁")
        title = mat["name"]
        if len(title) > 25:
            title = title[:22] + "..."
        keyboard.append([
            InlineKeyboardButton(f"{cat_emoji} {title}", callback_data=f"mat_detail_{mat['id']}")
        ])

    text = "<b>📚 Eng oxirgi yuklangan 10 ta material:</b>\nKo'rmoqchi bo'lgan faylingizni tanlang:"
    await update.message.reply_html(text, reply_markup=InlineKeyboardMarkup(keyboard))


async def material_detail_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Materialning to'liq kartasi."""
    query = update.callback_query
    await query.answer()

    mat_id = int(query.data.replace("mat_detail_", "").replace("view_mat_", ""))
    material = db.get_material_by_id(mat_id)

    if not material:
        await query.edit_message_text("❌ Material topilmadi yoki o'chirilgan.")
        return

    size_str = format_bytes(material.get("file_size") or 0)
    if material.get("storage_type") == "telegram":
        storage_display = "☁️ Telegram Buluti (Cheksiz)"
    elif material.get("storage_type") == "gcs":
        storage_display = "☁️ Google Cloud Storage"
    else:
        storage_display = "📁 Lokal Server"

    text = (
        f"<b>{material.get('category_emoji', '📁')} {material['name']}</b>\n\n"
        f"<b>📂 Bo'lim:</b> {material.get('category_name')}\n"
        f"<b>📋 Tavsif:</b> {material.get('description') or 'Ko\'rsatilmagan'}\n"
        f"<b>👤 Joylovchi:</b> {material.get('uploader_name')}\n"
        f"<b>💬 Izoh:</b> {material.get('comment') or 'Yo\'q'}\n\n"
        f"<b>📎 Fayl nomi:</b> <code>{material.get('file_name')}</code>\n"
        f"<b>📊 Hajmi:</b> {size_str}\n"
        f"<b>🏢 Saqlangan joy:</b> {storage_display}\n"
        f"<b>📅 Sana:</b> {material.get('created_at')}\n"
        f"<b>🆔 Raqami:</b> #MAT_{material['id']}"
    )

    await query.edit_message_text(
        text,
        parse_mode="HTML",
        reply_markup=material_actions_keyboard(material)
    )


async def send_file_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Foydalanuvchiga faylni yuborish."""
    query = update.callback_query
    await query.answer("⏳ Fayl tayyorlanmoqda...")

    mat_id = int(query.data.replace("get_file_", ""))
    material = db.get_material_by_id(mat_id)

    if not material:
        await query.message.reply_text("❌ Material topilmadi.")
        return

    chat_id = query.message.chat_id
    caption = f"📄 <b>{material['name']}</b>\n👤 {material['uploader_name']}"

    # 1. Telegram file_id orqali tez yuborish
    if material.get("telegram_file_id"):
        try:
            file_id = material["telegram_file_id"]
            file_type = (material.get("file_type") or "").lower()

            if file_type in [".mp4", ".mov", ".avi", ".mkv", ".webm"]:
                await context.bot.send_video(chat_id=chat_id, video=file_id, caption=caption, parse_mode="HTML")
            elif file_type in [".mp3", ".wav", ".ogg", ".m4a"]:
                await context.bot.send_audio(chat_id=chat_id, audio=file_id, caption=caption, parse_mode="HTML")
            elif file_type in [".jpg", ".jpeg", ".png", ".webp"]:
                await context.bot.send_photo(chat_id=chat_id, photo=file_id, caption=caption, parse_mode="HTML")
            else:
                await context.bot.send_document(chat_id=chat_id, document=file_id, caption=caption, parse_mode="HTML")
            return
        except Exception as e:
            logger.warning(f"Telegram file_id orqali yuborishda xato: {e}. Zaxira usulga o'tilmoqda.")

    # 2. Agar lokal fayl bo'lsa
    if material.get("storage_type") == "local":
        local_path = BASE_DIR / material["storage_path"]
        if local_path.exists():
            with open(local_path, "rb") as f:
                await context.bot.send_document(
                    chat_id=chat_id,
                    document=f,
                    filename=material.get("file_name", "material"),
                    caption=caption,
                    parse_mode="HTML"
                )
            return

    # 3. Agar faqat URL bo'lsa
    if material.get("public_url"):
        await query.message.reply_html(
            f"📥 Faylni to'g'ridan-to'g'ri bulutdan yuklab olishingiz mumkin:\n\n"
            f"🔗 <a href='{material['public_url']}'>Yuklab olish havolasi (GCS)</a>"
        )
    else:
        await query.message.reply_text("❌ Fayl mavjud emas yoki yuklab bo'lmadi.")
