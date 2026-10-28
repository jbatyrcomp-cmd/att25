import os
import json
import urllib.request
import urllib.parse
import urllib.error
from http.server import BaseHTTPRequestHandler
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import api.db as db

BOT_TOKEN = (os.getenv("BOT_TOKEN") or "8999866914:AAHBbvxwd_IFwKgbW1fp1YEf1Xjmuj8oe_s").strip()


class handler(BaseHTTPRequestHandler):
    """Faylni to'g'ridan-to'g'ri saytda ko'rish va yuklab olish handleri."""

    def do_GET(self):
        query = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        mat_id_str = query.get("id", [None])[0]

        if not mat_id_str or not mat_id_str.isdigit():
            self.send_response(400)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write("Material ID raqami kiritilmadi".encode("utf-8"))
            return

        mat_id = int(mat_id_str)
        material = db.get_material_by_id(mat_id)

        if not material:
            self.send_response(404)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write("Bunday material topilmadi".encode("utf-8"))
            return

        file_id = material.get("telegram_file_id")
        if not file_id:
            self.send_response(404)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write("Fayl identifikatori topilmadi".encode("utf-8"))
            return

        # Telegram Bot API getFile orqali fayl yo'lini olish
        tg_url = f"https://api.telegram.org/bot{BOT_TOKEN}/getFile?file_id={file_id}"
        bot_link = f"https://t.me/att_upload_bot?start=get_{mat_id}"

        try:
            req = urllib.request.Request(tg_url)
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))

            if data.get("ok"):
                file_path = data["result"]["file_path"]
                direct_url = f"https://api.telegram.org/file/bot{BOT_TOKEN}/{file_path}"

                # Brauzerda to'g'ridan-to'g'ri ko'rish yoki yuklab olish uchun 302 Redirect
                self.send_response(302)
                self.send_header("Location", direct_url)
                self.send_header("Cache-Control", "public, max-age=3600")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                return

            else:
                # Fayl 20MB dan katta bo'lsa (Telegram Bot API cheklovi), Telegram Botga yo'naltirish
                self.send_response(302)
                self.send_header("Location", bot_link)
                self.end_headers()
                return

        except urllib.error.HTTPError as e:
            # Agar 400 Bad Request (file is too big) bo'lsa, Telegram botga yo'naltiramiz
            self.send_response(302)
            self.send_header("Location", bot_link)
            self.end_headers()
            return
        except Exception as e:
            # Boshqa xatoliklarda ham xavfsiz Telegram botga yo'naltirish
            self.send_response(302)
            self.send_header("Location", bot_link)
            self.end_headers()
            return
