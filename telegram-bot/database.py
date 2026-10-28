import sqlite3
from typing import List, Dict, Optional, Any
from config import DB_PATH

DEFAULT_CATEGORIES = [
    {
        "name": "Video darsliklar",
        "emoji": "📹",
        "gcs_folder": "videos",
        "allowed_types": ".mp4,.avi,.mkv,.mov,.webm",
        "description": "Video darsliklar, kurslar va roliklar"
    },
    {
        "name": "Hujjatlar & Kitoblar",
        "emoji": "📄",
        "gcs_folder": "documents",
        "allowed_types": ".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.epub",
        "description": "PDF kitoblar, taqdimotlar, konspektlar"
    },
    {
        "name": "Rasmlar & Infografika",
        "emoji": "🖼️",
        "gcs_folder": "images",
        "allowed_types": ".jpg,.jpeg,.png,.gif,.webp,.svg",
        "description": "Infografikalar, diagrammalar va rasmlar"
    },
    {
        "name": "Audio materiallar",
        "emoji": "🎵",
        "gcs_folder": "audio",
        "allowed_types": ".mp3,.wav,.ogg,.m4a,.aac",
        "description": "Audio darslar, podkastlar, ma'ruzalar"
    },
    {
        "name": "Boshqa materiallar",
        "emoji": "📦",
        "gcs_folder": "other",
        "allowed_types": "*",
        "description": "Arxivlar (.zip, .rar), kodlar va boshqalar"
    }
]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Ma'lumotlar bazasi jadvallarini yaratadi va boshlang'ich bo'limlarni kiritadi."""
    with get_connection() as conn:
        cursor = conn.cursor()

        # Bo'limlar jadvali
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                emoji TEXT,
                gcs_folder TEXT NOT NULL,
                allowed_types TEXT,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Materiallar jadvali
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS materials (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT,
                uploader_name TEXT NOT NULL,
                comment TEXT,
                tags TEXT,
                file_name TEXT NOT NULL,
                file_size INTEGER,
                file_type TEXT,
                storage_type TEXT DEFAULT 'local',
                storage_path TEXT NOT NULL,
                public_url TEXT,
                telegram_file_id TEXT,
                telegram_user_id INTEGER,
                telegram_username TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id)
            )
        """)

        # Foydalanuvchilar jadvali
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                telegram_id INTEGER UNIQUE NOT NULL,
                username TEXT,
                first_name TEXT,
                last_name TEXT,
                is_admin BOOLEAN DEFAULT 0,
                materials_count INTEGER DEFAULT 0,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Standart bo'limlar mavjudligini tekshirish
        cursor.execute("SELECT COUNT(*) as cnt FROM categories")
        if cursor.fetchone()["cnt"] == 0:
            for cat in DEFAULT_CATEGORIES:
                cursor.execute("""
                    INSERT INTO categories (name, emoji, gcs_folder, allowed_types, description)
                    VALUES (?, ?, ?, ?, ?)
                """, (cat["name"], cat["emoji"], cat["gcs_folder"], cat["allowed_types"], cat["description"]))

        conn.commit()


def get_categories() -> List[Dict[str, Any]]:
    """Barcha bo'limlarni qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories ORDER BY id ASC")
        return [dict(row) for row in cursor.fetchall()]


def get_category_by_id(category_id: int) -> Optional[Dict[str, Any]]:
    """ID bo'yicha bo'limni qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM categories WHERE id = ?", (category_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def upsert_user(telegram_id: int, username: Optional[str], first_name: Optional[str], last_name: Optional[str]) -> Dict[str, Any]:
    """Foydalanuvchini bazaga qo'shadi yoki oxirgi faolligini yangilaydi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (telegram_id, username, first_name, last_name, last_active)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(telegram_id) DO UPDATE SET
                username = excluded.username,
                first_name = excluded.first_name,
                last_name = excluded.last_name,
                last_active = CURRENT_TIMESTAMP
        """, (telegram_id, username, first_name, last_name))
        conn.commit()

        cursor.execute("SELECT * FROM users WHERE telegram_id = ?", (telegram_id,))
        return dict(cursor.fetchone())


def save_material(
    category_id: int,
    name: str,
    description: Optional[str],
    uploader_name: str,
    comment: Optional[str],
    file_name: str,
    file_size: int,
    file_type: str,
    storage_type: str,
    storage_path: str,
    public_url: Optional[str] = None,
    telegram_file_id: Optional[str] = None,
    telegram_user_id: Optional[int] = None,
    telegram_username: Optional[str] = None,
    tags: Optional[str] = None,
) -> int:
    """Yangi materialni saqlaydi va id raqamini qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO materials (
                category_id, name, description, uploader_name, comment,
                tags, file_name, file_size, file_type, storage_type,
                storage_path, public_url, telegram_file_id,
                telegram_user_id, telegram_username
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            category_id, name, description, uploader_name, comment,
            tags, file_name, file_size, file_type, storage_type,
            storage_path, public_url, telegram_file_id,
            telegram_user_id, telegram_username
        ))
        material_id = cursor.lastrowid

        # Foydalanuvchi hisoblagichini oshirish
        if telegram_user_id:
            cursor.execute("""
                UPDATE users SET materials_count = materials_count + 1
                WHERE telegram_id = ?
            """, (telegram_user_id,))

        conn.commit()
        return material_id


def get_material_by_id(material_id: int) -> Optional[Dict[str, Any]]:
    """ID bo'yicha material ma'lumotlarini bo'limi bilan birga qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.*, c.name AS category_name, c.emoji AS category_emoji
            FROM materials m
            JOIN categories c ON m.category_id = c.id
            WHERE m.id = ?
        """, (material_id,))
        row = cursor.fetchone()
        return dict(row) if row else None


def get_materials_by_category(category_id: int, limit: int = 15, offset: int = 0) -> List[Dict[str, Any]]:
    """Bo'lim bo'yicha materiallar ro'yxatini qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.*, c.name AS category_name, c.emoji AS category_emoji
            FROM materials m
            JOIN categories c ON m.category_id = c.id
            WHERE m.category_id = ?
            ORDER BY m.id DESC
            LIMIT ? OFFSET ?
        """, (category_id, limit, offset))
        return [dict(row) for row in cursor.fetchall()]


def get_recent_materials(limit: int = 10) -> List[Dict[str, Any]]:
    """Eng oxirgi qo'shilgan materiallarni qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.*, c.name AS category_name, c.emoji AS category_emoji
            FROM materials m
            JOIN categories c ON m.category_id = c.id
            ORDER BY m.id DESC
            LIMIT ?
        """, (limit,))
        return [dict(row) for row in cursor.fetchall()]


def search_materials(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Materiallarni nomi, tavsifi yoki uploader nomi bo'yicha qidiradi."""
    like_q = f"%{query}%"
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT m.*, c.name AS category_name, c.emoji AS category_emoji
            FROM materials m
            JOIN categories c ON m.category_id = c.id
            WHERE m.name LIKE ? OR m.description LIKE ? OR m.uploader_name LIKE ? OR m.comment LIKE ?
            ORDER BY m.id DESC
            LIMIT ?
        """, (like_q, like_q, like_q, like_q, limit))
        return [dict(row) for row in cursor.fetchall()]


def get_stats() -> Dict[str, Any]:
    """Umumiy statistika ma'lumotlarini qaytaradi."""
    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) as total_materials FROM materials")
        total_materials = cursor.fetchone()["total_materials"]

        cursor.execute("SELECT COUNT(*) as total_users FROM users")
        total_users = cursor.fetchone()["total_users"]

        cursor.execute("""
            SELECT c.id, c.name, c.emoji, COUNT(m.id) AS count
            FROM categories c
            LEFT JOIN materials m ON c.id = m.category_id
            GROUP BY c.id
            ORDER BY count DESC
        """)
        category_stats = [dict(row) for row in cursor.fetchall()]

        cursor.execute("SELECT SUM(file_size) as total_size FROM materials")
        row = cursor.fetchone()
        total_bytes = row["total_size"] if row and row["total_size"] else 0

        return {
            "total_materials": total_materials,
            "total_users": total_users,
            "total_bytes": total_bytes,
            "categories": category_stats
        }
