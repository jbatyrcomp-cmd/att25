from typing import List, Dict, Any
from telegram import InlineKeyboardButton, InlineKeyboardMarkup, ReplyKeyboardMarkup, KeyboardButton


def main_menu_keyboard() -> ReplyKeyboardMarkup:
    """Asosiy menyu klaviaturasi."""
    keyboard = [
        [KeyboardButton("➕ Yangi material qöşiş")],
        [KeyboardButton("📂 Bölimlar"), KeyboardButton("📚 Oxirgi materiallar")],
        [KeyboardButton("📊 Statistika"), KeyboardButton("ℹ️ Qöllanma")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True)


def categories_inline_keyboard(categories: List[Dict[str, Any]], prefix: str = "select_cat_") -> InlineKeyboardMarkup:
    """Bölimlar röyxati inline tugmalari."""
    keyboard = []
    for cat in categories:
        text = f"{cat.get('emoji', '📁')} {cat['name']}"
        callback = f"{prefix}{cat['id']}"
        keyboard.append([InlineKeyboardButton(text, callback_data=callback)])

    keyboard.append([InlineKeyboardButton("❌ Bekor qiliş", callback_data="cancel_action")])
    return InlineKeyboardMarkup(keyboard)


def skip_or_cancel_keyboard() -> ReplyKeyboardMarkup:
    """Ixtiyoriy maydonlar uçun ötkazib yuboriş va bekor qiliş klaviaturasi."""
    keyboard = [
        [KeyboardButton("⏩ Ötkazib yuboriş")],
        [KeyboardButton("❌ Bekor qiliş")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=True)


def cancel_keyboard() -> ReplyKeyboardMarkup:
    """Faqat bekor qiliş klaviaturasi."""
    keyboard = [
        [KeyboardButton("❌ Bekor qiliş")]
    ]
    return ReplyKeyboardMarkup(keyboard, resize_keyboard=True, one_time_keyboard=True)


def material_actions_keyboard(material: Dict[str, Any]) -> InlineKeyboardMarkup:
    """Bitta material uçun amallar klaviaturasi."""
    keyboard = []

    # Agar faylni bot qayta yuborishi mumkin bo'lsa
    keyboard.append([
        InlineKeyboardButton("📥 Faylni oliş", callback_data=f"get_file_{material['id']}")
    ])

    # Agar Google Cloud Storage URL mavjud bo'lsa
    if material.get("public_url"):
        keyboard.append([
            InlineKeyboardButton("☁️ Bulutdan oçiş (GCS)", url=material["public_url"])
        ])

    keyboard.append([
        InlineKeyboardButton("🔙 Bölimlar röyxatiga", callback_data="nav_categories")
    ])

    return InlineKeyboardMarkup(keyboard)


def after_upload_keyboard(material_id: int) -> InlineKeyboardMarkup:
    """Material muvaffaqiyatli yuklangandan keyingi tugmalar."""
    keyboard = [
        [InlineKeyboardButton("👀 Köriş", callback_data=f"view_mat_{material_id}")],
        [InlineKeyboardButton("➕ Yana material qöşiş", callback_data="upload_more")]
    ]
    return InlineKeyboardMarkup(keyboard)
