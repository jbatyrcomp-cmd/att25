import os
import json
import urllib.parse
from http.server import BaseHTTPRequestHandler
import sys

# api/db import
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import api.db as db


class handler(BaseHTTPRequestHandler):
    """Vercel Serverless Admin API Handler."""

    def _set_headers(self, status=200, content_type="application/json"):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        action = params.get("action", ["stats"])[0]

        try:
            if action == "stats":
                data = db.get_stats()
                self._set_headers(200)
                self.wfile.write(json.dumps(data, ensure_ascii=False).encode("utf-8"))

            elif action == "materials":
                cat_id = params.get("category_id", [None])[0]
                search = params.get("search", [None])[0]
                limit = int(params.get("limit", [50])[0])
                offset = int(params.get("offset", [0])[0])

                if cat_id:
                    cat_id = int(cat_id)

                materials = db.get_materials(category_id=cat_id, search=search, limit=limit, offset=offset)
                self._set_headers(200)
                self.wfile.write(json.dumps(materials, ensure_ascii=False).encode("utf-8"))

            elif action == "categories":
                categories = db.get_categories()
                self._set_headers(200)
                self.wfile.write(json.dumps(categories, ensure_ascii=False).encode("utf-8"))

            elif action == "material":
                mat_id = int(params.get("id", [0])[0])
                material = db.get_material_by_id(mat_id)
                if material:
                    self._set_headers(200)
                    self.wfile.write(json.dumps(material, ensure_ascii=False).encode("utf-8"))
                else:
                    self._set_headers(404)
                    self.wfile.write(json.dumps({"error": "Material topilmadi"}).encode("utf-8"))

            else:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": f"Noma'lum amal: {action}"}).encode("utf-8"))

        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed.query)
        action = params.get("action", [""])[0]

        content_length = int(self.headers.get("Content-Length", 0))
        body = {}
        if content_length > 0:
            try:
                body = json.loads(self.rfile.read(content_length).decode("utf-8"))
            except Exception:
                pass

        try:
            if action == "delete_material":
                mat_id = int(params.get("id", [body.get("id", 0)])[0])
                if mat_id:
                    success = db.delete_material(mat_id)
                    self._set_headers(200)
                    self.wfile.write(json.dumps({"ok": success, "deleted_id": mat_id}).encode("utf-8"))
                else:
                    self._set_headers(400)
                    self.wfile.write(json.dumps({"error": "Material ID berilmadi"}).encode("utf-8"))

            else:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": f"Noma'lum POST amal: {action}"}).encode("utf-8"))

        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
