from typing import List, Dict, Any
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton


def main_menu_keyboard() -> ReplyKeyboardMarkup:
    """Asosiy menyu klaviaturasi."""
    keyboard = [
        [KeyboardButton("➕ Yangi material qo'shish")],
        [KeyboardButton("📂 Bo'limlar"), KeyboardButton("📚 Oxirgi materiallar")],
        [KeyboardButton("📊 Statistika"), KeyboardButton("ℹ️ Qo'llanma")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)


def categories_inline_keyboard(categories: List[Dict[str, Any]], prefix: str = "select_cat_") -> InlineKeyboardMarkup:
    """Bo'limlar ro'yxati inline tugmalari."""
    keyboard = []
    for cat in categories:
        text = f"{cat.get('emoji', '📁')} {cat['name']}"
        callback = f"{prefix}{cat['id']}"
        keyboard.append([InlineKeyboardButton(text, callback_data=callback)])

    keyboard.append([InlineKeyboardButton("❌ Bekor qilish", callback_data="cancel_action")])
    return InlineKeyboardMarkup(keyboard)


def skip_or_cancel_keyboard() -> ReplyKeyboardMarkup:
    """Ixtiyoriy maydonlar uchun o'tkazib yuborish va bekor qilish klaviaturasi."""
    keyboard = [
        [KeyboardButton("⏩ O'tkazib yuborish")],
        [KeyboardButton("❌ Bekor qilish")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=True)


def cancel_keyboard() -> ReplyKeyboardMarkup:
    """Faqat bekor qilish klaviaturasi."""
    keyboard = [
        [KeyboardButton("❌ Bekor qilish")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=True)


def material_actions_keyboard(material: Dict[str, Any]) -> InlineKeyboardMarkup:
    """Bitta material uchun amallar klaviaturasi."""
    keyboard = []

    # Agar faylni bot qayta yuborishi mumkin bo'lsa
    keyboard.append([
        InlineKeyboardButton("📥 Faylni olish", callback_data=f"get_file_{material['id']}")
    ])

    # Agar Google Cloud Storage URL mavjud bo'lsa
    if material.get("public_url"):
        keyboard.append([
            InlineKeyboardButton("☁️ Bulutdan ochish (GCS)", url=material["public_url"])
        ])

    keyboard.append([
        InlineKeyboardButton("🔙 Bo'limlar ro'yxatiga", callback_data="nav_categories")
    ])

    return InlineKeyboardMarkup(keyboard)


def after_upload_keyboard(material_id: int) -> InlineKeyboardMarkup:
    """Material muvaffaqiyatli yuklangandan keyingi tugmalar."""
    keyboard = [
        [InlineKeyboardButton("👀 Ko'rish", callback_data=f"view_mat_{material_id}")],
        [InlineKeyboardButton("➕ Yana material qo'shish", callback_data="upload_more")]
    ]
    return InlineKeyboardMarkup(keyboard)
