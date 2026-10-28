import os
from pathlib import Path
from dotenv import load_dotenv

# Asosiy papkalar
BASE_DIR = Path(__file__).resolve().parent
TEMP_DIR = BASE_DIR / "temp"
STORAGE_DIR = BASE_DIR / "storage"
CREDENTIALS_DIR = BASE_DIR / "credentials"
DB_PATH = BASE_DIR / "materials.db"

# Papkalar mavjudligini ta'minlash
TEMP_DIR.mkdir(parents=True, exist_ok=True)
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
CREDENTIALS_DIR.mkdir(parents=True, exist_ok=True)

# .env yuklash
load_dotenv(BASE_DIR / ".env")

BOT_TOKEN = os.getenv("BOT_TOKEN", "").strip()

# Google Cloud Storage
GCS_BUCKET_NAME = os.getenv("GCS_BUCKET_NAME", "").strip()
GCS_PROJECT_ID = os.getenv("GCS_PROJECT_ID", "").strip()

credentials_env = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "credentials/gcs-key.json").strip()
if os.path.isabs(credentials_env):
    GOOGLE_APPLICATION_CREDENTIALS = Path(credentials_env)
else:
    GOOGLE_APPLICATION_CREDENTIALS = (BASE_DIR / credentials_env).resolve()

# Saqlash rejimi: 'telegram' (100% Bepul va Cheksiz), 'local' (Kompyuterda) yoki 'gcs' (Google Cloud)
STORAGE_MODE = os.getenv("STORAGE_MODE", "telegram").strip().lower()

# Ixtiyoriy: Materiallarni nusxasini yopiq kanalga ham tashlash uchun kanal ID si (masalan: -1001234567890)
ARCHIVE_CHANNEL_ID = os.getenv("ARCHIVE_CHANNEL_ID", "").strip()

# Fayl hajmi cheklovi
MAX_FILE_SIZE_MB = int(os.getenv("MAX_FILE_SIZE_MB", "50"))
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

# Adminlar
admin_ids_str = os.getenv("ADMIN_USER_IDS", "").strip()
ADMIN_USER_IDS = [
    int(x.strip()) for x in admin_ids_str.split(",") if x.strip().isdigit()
]


def is_gcs_configured() -> bool:
    """GCS kaliti va bucket nomi to'g'ri sozlanganligini tekshiradi."""
    if not GCS_BUCKET_NAME or GCS_BUCKET_NAME == "your-materials-bucket-name":
        return False
    if not GOOGLE_APPLICATION_CREDENTIALS.exists():
        return False
    return True
