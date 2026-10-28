import os
import json
import urllib.request
import urllib.parse
from http.server import BaseHTTPRequestHandler
import sys

# api/db import
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import api.db as db

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()


def tg_api_call(method: str, params: dict) -> dict:
    """Telegram Bot API ga to'g'ridan-to'g'ri HTTP so'rov yuborish."""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/{method}"
    data = json.dumps(params).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"Telegram API xatolik ({method}): {e}")
        return {"ok": False, "error": str(e)}


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


def get_main_keyboard():
    return {
        "keyboard": [
            [{"text": "➕ Yangi material qo'shish"}],
            [{"text": "📂 Bo'limlar"}, {"text": "📚 Oxirgi materiallar"}],
            [{"text": "📊 Statistika"}, {"text": "ℹ️ Qo'llanma"}]
        ],
        "resize_keyboard": True
    }


def get_categories_keyboard(prefix="cat_"):
    categories = db.get_categories()
    inline = []
    for cat in categories:
        inline.append([{
            "text": f"{cat.get('emoji', '📁')} {cat['name']}",
            "callback_data": f"{prefix}{cat['id']}"
        }])
    inline.append([{"text": "❌ Bekor qilish", "callback_data": "cancel"}])
    return {"inline_keyboard": inline}


def handle_telegram_update(update: dict):
    """Telegram xabarini tahlil qilish va javob berish."""
    # 1. Callback Query (Tugma bosilganda)
    if "callback_query" in update:
        cq = update["callback_query"]
        chat_id = cq["message"]["chat"]["id"]
        data = cq.get("data", "")
        cq_id = cq["id"]

        tg_api_call("answerCallbackQuery", {"callback_query_id": cq_id})

        if data == "cancel":
            db.clear_user_state(chat_id)
            tg_api_call("sendMessage", {
                "chat_id": chat_id,
                "text": "❌ Material yuklash bekor qilindi.",
                "reply_markup": get_main_keyboard()
            })
            return

        if data.startswith("cat_"):
            cat_id = int(data.replace("cat_", ""))
            category = db.get_category_by_id(cat_id)
            if category:
                db.set_user_state(chat_id, "TITLE", {
                    "category_id": cat_id,
                    "category_name": category["name"],
                    "category_emoji": category.get("emoji", "📁")
                })
                tg_api_call("sendMessage", {
                    "chat_id": chat_id,
                    "text": (
                        f"✅ Bo'lim tanlandi: <b>{category.get('emoji', '📁')} {category['name']}</b>\n\n"
                        f"📝 <b>2-qadam: Material nomini (sarlavhasini) kiriting:</b>\n"
                        f"<i>(Masalan: Python asoslari - 1-dars yoki Tarmoq xavfsizligi)</i>"
                    ),
                    "parse_mode": "HTML",
                    "reply_markup": {
                        "keyboard": [[{"text": "❌ Bekor qilish"}]],
                        "resize_keyboard": True
                    }
                })
            return

        if data.startswith("view_cat_"):
            cat_id = int(data.replace("view_cat_", ""))
            category = db.get_category_by_id(cat_id)
            materials = db.get_materials(category_id=cat_id, limit=15)
            if not materials:
                tg_api_call("sendMessage", {
                    "chat_id": chat_id,
                    "text": f"<b>{category['emoji']} {category['name']}</b> bo'limida hozircha materiallar yo'q.",
                    "parse_mode": "HTML"
                })
            else:
                inline = []
                for m in materials:
                    inline.append([{
                        "text": f"📄 {m['name'][:25]} ({format_bytes(m.get('file_size'))})",
                        "callback_data": f"get_file_{m['id']}"
                    }])
                tg_api_call("sendMessage", {
                    "chat_id": chat_id,
                    "text": f"<b>{category['emoji']} {category['name']}</b> materiallari:\nFaylni olish uchun tanlang:",
                    "parse_mode": "HTML",
                    "reply_markup": {"inline_keyboard": inline}
                })
            return

        if data.startswith("get_file_"):
            mat_id = int(data.replace("get_file_", ""))
            material = db.get_material_by_id(mat_id)
            if material and material.get("telegram_file_id"):
                file_id = material["telegram_file_id"]
                file_type = (material.get("file_type") or "").lower()
                caption = f"📄 <b>{material['name']}</b>\n👤 {material['uploader_name']}\n🏢 att25.uz"

                if file_type in [".mp4", ".mov", ".avi", ".mkv"]:
                    tg_api_call("sendVideo", {"chat_id": chat_id, "video": file_id, "caption": caption, "parse_mode": "HTML"})
                elif file_type in [".mp3", ".wav", ".ogg", ".m4a"]:
                    tg_api_call("sendAudio", {"chat_id": chat_id, "audio": file_id, "caption": caption, "parse_mode": "HTML"})
                elif file_type in [".jpg", ".jpeg", ".png", ".webp"]:
                    tg_api_call("sendPhoto", {"chat_id": chat_id, "photo": file_id, "caption": caption, "parse_mode": "HTML"})
                else:
                    tg_api_call("sendDocument", {"chat_id": chat_id, "document": file_id, "caption": caption, "parse_mode": "HTML"})
            return

    # 2. Xabar kelganda
    if "message" not in update:
        return

    msg = update["message"]
    chat_id = msg["chat"]["id"]
    from_user = msg.get("from", {})
    text = msg.get("text", "").strip()

    # Foydalanuvchini bazaga yozish
    db.upsert_user(
        chat_id,
        from_user.get("username"),
        from_user.get("first_name"),
        from_user.get("last_name")
    )

    # Bekor qilish
    if text == "❌ Bekor qilish" or text == "/cancel":
        db.clear_user_state(chat_id)
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": "❌ Amaliyot bekor qilindi.",
            "reply_markup": get_main_keyboard()
        })
        return

    # /start
    if text == "/start":
        db.clear_user_state(chat_id)
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                f"👋 Assalomu alaykum, <b>{from_user.get('first_name', 'Foydalanuvchi')}</b>!\n\n"
                f"🎯 <b>att25.uz</b> materiallar botiga xush kelibsiz.\n"
                f"Bu yerda video, hujjat, rasm va audio materiallarni tartibli joylashingiz mumkin.\n\n"
                f"<b>🌐 Rasmiy sayt:</b> <a href='https://att25.uz'>att25.uz</a>\n"
                f"<b>🖥️ Admin Dashboard:</b> <a href='https://att25.uz/admin'>att25.uz/admin</a>\n"
                f"<b>☁️ Ombor:</b> Telegram Buluti (Doimiy 24/7)\n\n"
                f"Kerakli menyuni tanlang:"
            ),
            "parse_mode": "HTML",
            "reply_markup": get_main_keyboard()
        })
        return

    # /help yoki "ℹ️ Qo'llanma"
    if text in ["/help", "ℹ️ Qo'llanma"]:
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                "<b>📖 Botdan foydalanish bo'yicha qo'llanma:</b>\n\n"
                "1. <b>➕ Yangi material qo'shish</b> tugmasini bosing\n"
                "2. Bo'limni tanlang (Video, Hujjat, Rasm, Audio, Boshqa)\n"
                "3. Material nomini kiriting\n"
                "4. Tavsifini yozing\n"
                "5. Ismingizni kiriting\n"
                "6. Qo'shimcha izoh qoldiring (yoki o'tkazib yuboring)\n"
                "7. Faylni yuboring!\n\n"
                "Barcha materiallarni <a href='https://att25.uz/admin'>att25.uz/admin</a> da ko'rishingiz mumkin."
            ),
            "parse_mode": "HTML",
            "reply_markup": get_main_keyboard()
        })
        return

    # /stats yoki "📊 Statistika"
    if text in ["/stats", "📊 Statistika"]:
        stats = db.get_stats()
        lines = [
            "<b>📊 att25.uz Platformasi Statistikasi:</b>\n",
            f"• 📚 Jami materiallar: <b>{stats['total_materials']} ta</b>",
            f"• 👥 Foydalanuvchilar: <b>{stats['total_users']} nafar</b>",
            f"• 💾 Fayllar umumiy hajmi: <b>{format_bytes(stats['total_bytes'])}</b>",
            f"• ☁️ Ombor: <b>Telegram Cloud (Vercel Serverless)</b>\n",
            "<b>📂 Bo'limlar bo'yicha:</b>"
        ]
        for cat in stats["categories"]:
            lines.append(f"  {cat.get('emoji', '📁')} {cat['name']}: <b>{cat['count']} ta</b>")

        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": "\n".join(lines),
            "parse_mode": "HTML",
            "reply_markup": get_main_keyboard()
        })
        return

    # "📂 Bo'limlar"
    if text in ["/categories", "📂 Bo'limlar"]:
        categories = db.get_categories()
        inline = []
        for cat in categories:
            inline.append([{
                "text": f"{cat.get('emoji', '📁')} {cat['name']}",
                "callback_data": f"view_cat_{cat['id']}"
            }])
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": "<b>📂 Qaysi bo'limdagi materiallarni ko'rmoqchisiz?</b>",
            "parse_mode": "HTML",
            "reply_markup": {"inline_keyboard": inline}
        })
        return

    # "📚 Oxirgi materiallar"
    if text in ["/recent", "📚 Oxirgi materiallar"]:
        materials = db.get_materials(limit=10)
        if not materials:
            tg_api_call("sendMessage", {
                "chat_id": chat_id,
                "text": "📚 Hozircha materiallar yo'q. Birinchi bo'lib qo'shing!",
                "reply_markup": get_main_keyboard()
            })
        else:
            inline = []
            for m in materials:
                inline.append([{
                    "text": f"{m.get('category_emoji', '📁')} {m['name'][:25]}",
                    "callback_data": f"get_file_{m['id']}"
                }])
            tg_api_call("sendMessage", {
                "chat_id": chat_id,
                "text": "<b>📚 Eng so'nggi 10 ta material:</b>",
                "parse_mode": "HTML",
                "reply_markup": {"inline_keyboard": inline}
            })
        return

    # Wizard boshlash ("➕ Yangi material qo'shish")
    if text == "➕ Yangi material qo'shish" or text == "/upload":
        db.clear_user_state(chat_id)
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                "<b>➕ Yangi material qo'shish</b>\n\n"
                "<b>📂 1-qadam:</b> Material qaysi bo'limga tegishli ekanligini tanlang:"
            ),
            "parse_mode": "HTML",
            "reply_markup": get_categories_keyboard(prefix="cat_")
        })
        return

    # Wizard holatlarini tekshirish (User State)
    user_state = db.get_user_state(chat_id)
    if not user_state:
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": "Iltimos, quyidagi menyudan foydalaning:",
            "reply_markup": get_main_keyboard()
        })
        return

    state = user_state["state"]
    state_data = user_state["data"]

    # TITLE holati
    if state == "TITLE":
        if len(text) < 2:
            tg_api_call("sendMessage", {"chat_id": chat_id, "text": "⚠️ Material nomi juda qisqa. Qaytadan kiriting:"})
            return
        state_data["name"] = text
        db.set_user_state(chat_id, "DESCRIPTION", state_data)
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                f"✅ Nomi: <b>{text}</b>\n\n"
                f"📋 <b>3-qadam: Material tavsifini yozing:</b>\n"
                f"<i>(Material nima haqida, unda nimalar mavjud?)</i>"
            ),
            "parse_mode": "HTML",
            "reply_markup": {
                "keyboard": [[{"text": "❌ Bekor qilish"}]],
                "resize_keyboard": True
            }
        })
        return

    # DESCRIPTION holati
    if state == "DESCRIPTION":
        state_data["description"] = text
        db.set_user_state(chat_id, "UPLOADER", state_data)
        suggested_name = from_user.get("first_name", "Foydalanuvchi")
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                f"👤 <b>4-qadam: Kim joylayapti? (Muallif yoki sizning ismingiz):</b>\n"
                f"<i>Masalan: {suggested_name}</i>"
            ),
            "parse_mode": "HTML",
            "reply_markup": {
                "keyboard": [[{"text": "❌ Bekor qilish"}]],
                "resize_keyboard": True
            }
        })
        return

    # UPLOADER holati
    if state == "UPLOADER":
        state_data["uploader_name"] = text
        db.set_user_state(chat_id, "COMMENT", state_data)
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                f"💬 <b>5-qadam: Qo'shimcha izoh (komment):</b>\n"
                f"<i>(Auditoriya, eslatma yoki qo'shimcha ma'lumot)</i>\n\n"
                f"Agar izoh bo'lmasa, <b>⏩ O'tkazib yuborish</b> tugmasini bosing:"
            ),
            "parse_mode": "HTML",
            "reply_markup": {
                "keyboard": [
                    [{"text": "⏩ O'tkazib yuborish"}],
                    [{"text": "❌ Bekor qilish"}]
                ],
                "resize_keyboard": True
            }
        })
        return

    # COMMENT holati
    if state == "COMMENT":
        if text in ["⏩ O'tkazib yuborish", "/skip"]:
            state_data["comment"] = ""
        else:
            state_data["comment"] = text

        db.set_user_state(chat_id, "FILE", state_data)
        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": (
                f"📎 <b>6-qadam: Endi faylni yuboring!</b>\n\n"
                f"<b>Tayyor ma'lumotlar:</b>\n"
                f"• Bo'lim: {state_data.get('category_emoji', '📁')} {state_data.get('category_name')}\n"
                f"• Nomi: <b>{state_data['name']}</b>\n"
                f"• Joylovchi: <b>{state_data['uploader_name']}</b>\n\n"
                f"Faylni (Video, Hujjat, PDF, Rasm, Audio) yuboring:"
            ),
            "parse_mode": "HTML",
            "reply_markup": {
                "keyboard": [[{"text": "❌ Bekor qilish"}]],
                "resize_keyboard": True
            }
        })
        return

    # FILE holati
    if state == "FILE":
        file_obj = None
        file_name = None
        file_type = ""
        file_size = 0
        telegram_file_id = None

        if "video" in msg:
            file_obj = msg["video"]
            telegram_file_id = file_obj["file_id"]
            file_name = file_obj.get("file_name", f"video_{file_obj.get('file_unique_id')}.mp4")
            file_size = file_obj.get("file_size", 0)
            file_type = ".mp4"
        elif "document" in msg:
            file_obj = msg["document"]
            telegram_file_id = file_obj["file_id"]
            file_name = file_obj.get("file_name", f"doc_{file_obj.get('file_unique_id')}")
            file_size = file_obj.get("file_size", 0)
            if "." in file_name:
                file_type = "." + file_name.rsplit(".", 1)[1].lower()
            else:
                file_type = ".bin"
        elif "photo" in msg:
            file_obj = msg["photo"][-1]
            telegram_file_id = file_obj["file_id"]
            file_name = f"photo_{file_obj.get('file_unique_id')}.jpg"
            file_size = file_obj.get("file_size", 0)
            file_type = ".jpg"
        elif "audio" in msg:
            file_obj = msg["audio"]
            telegram_file_id = file_obj["file_id"]
            file_name = file_obj.get("file_name", f"audio_{file_obj.get('file_unique_id')}.mp3")
            file_size = file_obj.get("file_size", 0)
            file_type = ".mp3"
        elif "voice" in msg:
            file_obj = msg["voice"]
            telegram_file_id = file_obj["file_id"]
            file_name = f"voice_{file_obj.get('file_unique_id')}.ogg"
            file_size = file_obj.get("file_size", 0)
            file_type = ".ogg"
        else:
            tg_api_call("sendMessage", {
                "chat_id": chat_id,
                "text": "⚠️ Iltimos, haqiqiy fayl (video, hujjat, rasm, audio) yuboring:"
            })
            return

        # Bazaga saqlash
        mat_id = db.save_material(
            category_id=state_data["category_id"],
            name=state_data["name"],
            description=state_data.get("description"),
            uploader_name=state_data["uploader_name"],
            comment=state_data.get("comment"),
            file_name=file_name,
            file_size=file_size,
            file_type=file_type,
            storage_type="telegram",
            storage_path=f"tg://{telegram_file_id}",
            telegram_file_id=telegram_file_id,
            telegram_user_id=chat_id,
            telegram_username=from_user.get("username")
        )

        db.clear_user_state(chat_id)

        summary = (
            "🎉 <b>Material muvaffaqiyatli saqlandi!</b>\n\n"
            f"<b>📂 Bo'lim:</b> {state_data.get('category_emoji', '📁')} {state_data.get('category_name')}\n"
            f"<b>📝 Nomi:</b> {state_data['name']}\n"
            f"<b>📋 Tavsif:</b> {state_data.get('description') or 'Yo\'q'}\n"
            f"<b>👤 Joylovchi:</b> {state_data['uploader_name']}\n"
            f"<b>💬 Izoh:</b> {state_data.get('comment') or 'Yo\'q'}\n"
            f"<b>📎 Fayl:</b> {file_name} ({format_bytes(file_size)})\n"
            f"<b>🏢 Saqlandi:</b> ☁️ Telegram Buluti & att25.uz\n"
            f"<b>🆔 Raqami:</b> #MAT_{mat_id}\n\n"
            f"Ko'rish uchun: <a href='https://att25.uz/admin'>att25.uz/admin</a>"
        )

        tg_api_call("sendMessage", {
            "chat_id": chat_id,
            "text": summary,
            "parse_mode": "HTML",
            "reply_markup": get_main_keyboard()
        })


class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Function Handler."""

    def do_GET(self):
        query_params = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)

        # Webhook o'rnatish imkoniyati: GET /api/webhook?set_webhook=1
        if "set_webhook" in query_params:
            webhook_url = "https://att25.uz/api/webhook"
            res = tg_api_call("setWebhook", {"url": webhook_url})
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({
                "action": "setWebhook",
                "webhook_url": webhook_url,
                "telegram_response": res
            }, indent=2).encode("utf-8"))
            return

        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        response = {
            "status": "online",
            "service": "att25 Telegram Bot Webhook",
            "domain": "att25.uz",
            "database": "Neon PostgreSQL Connected"
        }
        self.wfile.write(json.dumps(response).encode("utf-8"))

    def do_POST(self):
        content_length = int(self.headers.get("Content-Length", 0))
        post_data = self.rfile.read(content_length)

        try:
            update = json.loads(post_data.decode("utf-8"))
            handle_telegram_update(update)
        except Exception as e:
            print(f"Update qayta ishlashda xato: {e}")

        # Telegram har doim 200 OK kutadi
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps({"ok": True}).encode("utf-8"))
