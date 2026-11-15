import logging
from telegram import Update
from telegram.ext import ContextTypes

import database as db
from config import is_gcs_configured, STORAGE_MODE
from keyboards import main_menu_keyboard

logger = logging.getLogger(__name__)


def format_bytes(size_bytes: int) -> str:
    """Bayt hajmini MB yoki GB ga ötkaziş."""
    if not size_bytes:
        return "0 MB"
    mb = size_bytes / (1024 * 1024)
    if mb >= 1024:
        return f"{mb / 1024:.2f} GB"
    return f"{mb:.2f} MB"


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Botni işga tuşiriş (/start)."""
    user = update.effective_user
    db.upsert_user(
        telegram_id=user.id,
        username=user.username,
        first_name=user.first_name,
        last_name=user.last_name
    )

    if STORAGE_MODE == "telegram":
        storage_status = "☁️ Telegram Bulut Ombori (Bepul & Çeksiz)"
    elif is_gcs_configured():
        storage_status = "☁️ Google Cloud Storage (Faol)"
    else:
        storage_status = "📁 Lokal Server (storage/)"

    text = (
        f"👋 Assalomu alaykum, <b>{user.first_name}</b>!\n\n"
        f"🎯 Bu bot öquv videolari, hujjatlar, kitoblar va boşqa materiallarni "
        f"tartibli saqlaş va boşqariş uçun möljallangan.\n\n"
        f"<b>⚙️ Saqlaş holati:</b> {storage_status}\n\n"
        f"Quyidagi tugmalar orqali botdan foydalanişingiz mumkin:"
    )

    await update.message.reply_html(text, reply_markup=main_menu_keyboard())


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Foydalaniş böyiça qöllanma (/help)."""
    text = (
        "<b>📖 Botdan foydalaniş böyiça qöllanma:</b>\n\n"
        "<b>1️⃣ Material yuklaş tartibi:</b>\n"
        "• <b>➕ Yangi material qöşiş</b> tugmasini bosing\n"
        "• Material turiga mos bölimni tanlang (Video, Hujjat, Rasm va h.k.)\n"
        "• Material nomini kiriting\n"
        "• Qisqaça tavsif yozing\n"
        "• Joylayotgan şaxs ismini kiriting\n"
        "• Qöşimça izoh (komment) qoldiring yoki ötkazib yuboring\n"
        "• Faylni yuboring (video, PDF, rasm, audio va boşqalar)\n\n"
        "<b>2️⃣ Materiallarni köriş:</b>\n"
        "• <b>📂 Bölimlar</b> — barça bölimlar va ulardagi materiallar\n"
        "• <b>📚 Oxirgi materiallar</b> — eng oxirgi yuklangan fayllar\n\n"
        "<b>3️⃣ Fayllarni saqlaş:</b>\n"
        "Yuklangan barça materiallar xavfsiz holda bulutda (Google Cloud Storage) "
        "yoki lokal serverda arxivlanadi."
    )
    await update.message.reply_html(text, reply_markup=main_menu_keyboard())


async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Tizim statistikasini körsatiş (/stats)."""
    stats = db.get_stats()
    if STORAGE_MODE == "telegram":
        storage_type = "Telegram Buluti (Çeksiz & Bepul)"
    elif is_gcs_configured():
        storage_type = "Google Cloud Storage"
    else:
        storage_type = "Lokal Server"

    lines = [
        "<b>📊 Tizim Statistikasi:</b>\n",
        f"• 📚 Jami materiallar: <b>{stats['total_materials']} ta</b>",
        f"• 👥 Foydalanuvçilar: <b>{stats['total_users']} nafar</b>",
        f"• 💾 Jami fayllar hajmi: <b>{format_bytes(stats['total_bytes'])}</b>",
        f"• ☁️ Asosiy ombor: <b>{storage_type}</b>\n",
        "<b>📂 Bölimlar böyiça:</b>"
    ]

    for cat in stats["categories"]:
        lines.append(f"  {cat.get('emoji', '📁')} {cat['name']}: <b>{cat['count']} ta</b>")

    text = "\n".join(lines)
    await update.message.reply_html(text, reply_markup=main_menu_keyboard())
