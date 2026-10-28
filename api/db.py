import os
import json
import ssl
from urllib.parse import urlparse, parse_qs
from typing import List, Dict, Any, Optional
import pg8000.native

# Neon/PostgreSQL SSL SCRAM moslashuvchanlik xavfsizligi
try:
    import scramp
    if not hasattr(scramp, "make_channel_binding"):
        scramp.make_channel_binding = lambda *args, **kwargs: None
except Exception:
    pass

# Standart bo'limlar
DEFAULT_CATEGORIES = [
    {
        "name": "Video darsliklar",
        "emoji": "📹",
        "folder": "videos",
        "allowed_types": ".mp4,.avi,.mkv,.mov,.webm",
        "description": "Video darsliklar, kurslar va roliklar"
    },
    {
        "name": "Hujjatlar & Kitoblar",
        "emoji": "📄",
        "folder": "documents",
        "allowed_types": ".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.txt,.epub",
        "description": "PDF kitoblar, taqdimotlar, konspektlar"
    },
    {
        "name": "Rasmlar & Infografika",
        "emoji": "🖼️",
        "folder": "images",
        "allowed_types": ".jpg,.jpeg,.png,.gif,.webp,.svg",
        "description": "Infografikalar, diagrammalar va rasmlar"
    },
    {
        "name": "Audio materiallar",
        "emoji": "🎵",
        "folder": "audio",
        "allowed_types": ".mp3,.wav,.ogg,.m4a,.aac",
        "description": "Audio darslar, podkastlar, ma'ruzalar"
    },
    {
        "name": "Boshqa materiallar",
        "emoji": "📦",
        "folder": "other",
        "allowed_types": "*",
        "description": "Arxivlar (.zip, .rar), kodlar va boshqalar"
    }
]


def get_db_connection() -> pg8000.native.Connection:
    """Neon PostgreSQL ulanishini qaytaradi."""
    db_url = os.getenv("POSTGRES_URL") or os.getenv("DATABASE_URL")
    if not db_url:
        # Alohida o'zgaruvchilardan olish
        host = os.getenv("PGHOST", "ep-dawn-silence-b8luu7df-pooler.c-14.us-east-1.aws.neon.tech")
        user = os.getenv("PGUSER", "neondb_owner")
        password = os.getenv("PGPASSWORD", "npg_aX3hEo8DGfuY")
        database = os.getenv("PGDATABASE", "neondb")
        port = 5432
    else:
        parsed = urlparse(db_url)
        user = parsed.username
        password = parsed.password
        host = parsed.hostname
        port = parsed.port or 5432
        database = parsed.path.lstrip("/")

    ssl_context = ssl.create_default_context()
    ssl_context.check_hostname = False
    ssl_context.verify_mode = ssl.CERT_NONE

    conn = pg8000.native.Connection(
        user=user,
        password=password,
        host=host,
        port=port,
        database=database,
        ssl_context=ssl_context,
        timeout=10
    )
    return conn


def init_db():
    """Jadvallarni yaratadi va standart bo'limlarni kiritadi."""
    conn = get_db_connection()
    try:
        # Categories
        conn.run("""
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                emoji VARCHAR(50),
                folder VARCHAR(100) NOT NULL,
                allowed_types VARCHAR(255),
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Materials
        conn.run("""
            CREATE TABLE IF NOT EXISTS materials (
                id SERIAL PRIMARY KEY,
                category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                uploader_name VARCHAR(255) NOT NULL,
                comment TEXT,
                file_name VARCHAR(255) NOT NULL,
                file_size BIGINT,
                file_type VARCHAR(50),
                storage_type VARCHAR(50) DEFAULT 'telegram',
                storage_path TEXT NOT NULL,
                public_url TEXT,
                telegram_file_id TEXT,
                telegram_user_id BIGINT,
                telegram_username VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Users
        conn.run("""
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                telegram_id BIGINT UNIQUE NOT NULL,
                username VARCHAR(255),
                first_name VARCHAR(255),
                last_name VARCHAR(255),
                materials_count INT DEFAULT 0,
                last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # User States (Serverless Webhook wizard uchun)
        conn.run("""
            CREATE TABLE IF NOT EXISTS user_states (
                telegram_id BIGINT PRIMARY KEY,
                state VARCHAR(50) NOT NULL,
                data JSONB NOT NULL DEFAULT '{}',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Standart bo'limlar mavjudligini tekshirish
        rows = conn.run("SELECT COUNT(*) FROM categories")
        if rows and rows[0][0] == 0:
            for cat in DEFAULT_CATEGORIES:
                conn.run("""
                    INSERT INTO categories (name, emoji, folder, allowed_types, description)
                    VALUES (:name, :emoji, :folder, :allowed_types, :description)
                """, name=cat["name"], emoji=cat["emoji"], folder=cat["folder"],
                     allowed_types=cat["allowed_types"], description=cat["description"])

    finally:
        conn.close()


def get_categories() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        rows = conn.run("SELECT id, name, emoji, folder, allowed_types, description, created_at FROM categories ORDER BY id ASC")
        return [
            {
                "id": r[0], "name": r[1], "emoji": r[2], "folder": r[3],
                "allowed_types": r[4], "description": r[5], "created_at": str(r[6])
            }
            for r in rows
        ]
    finally:
        conn.close()


def get_category_by_id(cat_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        rows = conn.run("SELECT id, name, emoji, folder, allowed_types, description FROM categories WHERE id = :id", id=cat_id)
        if not rows:
            return None
        r = rows[0]
        return {"id": r[0], "name": r[1], "emoji": r[2], "folder": r[3], "allowed_types": r[4], "description": r[5]}
    finally:
        conn.close()


def get_user_state(telegram_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        rows = conn.run("SELECT state, data FROM user_states WHERE telegram_id = :id", id=telegram_id)
        if not rows:
            return None
        r = rows[0]
        data = r[1]
        if isinstance(data, str):
            data = json.loads(data)
        return {"state": r[0], "data": data}
    finally:
        conn.close()


def set_user_state(telegram_id: int, state: str, data: Dict[str, Any]):
    conn = get_db_connection()
    try:
        data_json = json.dumps(data, ensure_ascii=False)
        conn.run("""
            INSERT INTO user_states (telegram_id, state, data, updated_at)
            VALUES (:id, :state, :data::jsonb, CURRENT_TIMESTAMP)
            ON CONFLICT (telegram_id) DO UPDATE SET
                state = EXCLUDED.state,
                data = EXCLUDED.data,
                updated_at = CURRENT_TIMESTAMP
        """, id=telegram_id, state=state, data=data_json)
    finally:
        conn.close()


def clear_user_state(telegram_id: int):
    conn = get_db_connection()
    try:
        conn.run("DELETE FROM user_states WHERE telegram_id = :id", id=telegram_id)
    finally:
        conn.close()


def upsert_user(telegram_id: int, username: Optional[str], first_name: Optional[str], last_name: Optional[str]):
    conn = get_db_connection()
    try:
        conn.run("""
            INSERT INTO users (telegram_id, username, first_name, last_name, last_active)
            VALUES (:id, :username, :first_name, :last_name, CURRENT_TIMESTAMP)
            ON CONFLICT (telegram_id) DO UPDATE SET
                username = EXCLUDED.username,
                first_name = EXCLUDED.first_name,
                last_name = EXCLUDED.last_name,
                last_active = CURRENT_TIMESTAMP
        """, id=telegram_id, username=username or "", first_name=first_name or "", last_name=last_name or "")
    finally:
        conn.close()


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
    telegram_username: Optional[str] = None
) -> int:
    conn = get_db_connection()
    try:
        rows = conn.run("""
            INSERT INTO materials (
                category_id, name, description, uploader_name, comment,
                file_name, file_size, file_type, storage_type, storage_path,
                public_url, telegram_file_id, telegram_user_id, telegram_username
            ) VALUES (
                :category_id, :name, :description, :uploader_name, :comment,
                :file_name, :file_size, :file_type, :storage_type, :storage_path,
                :public_url, :telegram_file_id, :telegram_user_id, :telegram_username
            ) RETURNING id
        """, category_id=category_id, name=name, description=description or "",
             uploader_name=uploader_name, comment=comment or "", file_name=file_name,
             file_size=file_size, file_type=file_type, storage_type=storage_type,
             storage_path=storage_path, public_url=public_url or "",
             telegram_file_id=telegram_file_id or "", telegram_user_id=telegram_user_id or 0,
             telegram_username=telegram_username or "")

        mat_id = rows[0][0]

        if telegram_user_id:
            conn.run("""
                UPDATE users SET materials_count = materials_count + 1 WHERE telegram_id = :id
            """, id=telegram_user_id)

        return mat_id
    finally:
        conn.close()


def get_materials(category_id: Optional[int] = None, search: Optional[str] = None, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        query = """
            SELECT m.id, m.category_id, m.name, m.description, m.uploader_name, m.comment,
                   m.file_name, m.file_size, m.file_type, m.storage_type, m.storage_path,
                   m.public_url, m.telegram_file_id, m.telegram_user_id, m.telegram_username,
                   m.created_at, c.name as category_name, c.emoji as category_emoji
            FROM materials m
            JOIN categories c ON m.category_id = c.id
            WHERE 1=1
        """
        params = {}
        if category_id:
            query += " AND m.category_id = :cat_id"
            params["cat_id"] = category_id
        if search:
            query += " AND (m.name ILIKE :search OR m.description ILIKE :search OR m.uploader_name ILIKE :search)"
            params["search"] = f"%{search}%"

        query += " ORDER BY m.id DESC LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset

        rows = conn.run(query, **params)
        materials = []
        for r in rows:
            materials.append({
                "id": r[0], "category_id": r[1], "name": r[2], "description": r[3],
                "uploader_name": r[4], "comment": r[5], "file_name": r[6],
                "file_size": r[7], "file_type": r[8], "storage_type": r[9],
                "storage_path": r[10], "public_url": r[11], "telegram_file_id": r[12],
                "telegram_user_id": r[13], "telegram_username": r[14],
                "created_at": str(r[15]), "category_name": r[16], "category_emoji": r[17]
            })
        return materials
    finally:
        conn.close()


def get_material_by_id(mat_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    try:
        rows = conn.run("""
            SELECT m.id, m.category_id, m.name, m.description, m.uploader_name, m.comment,
                   m.file_name, m.file_size, m.file_type, m.storage_type, m.storage_path,
                   m.public_url, m.telegram_file_id, m.telegram_user_id, m.telegram_username,
                   m.created_at, c.name as category_name, c.emoji as category_emoji
            FROM materials m
            JOIN categories c ON m.category_id = c.id
            WHERE m.id = :id
        """, id=mat_id)
        if not rows:
            return None
        r = rows[0]
        return {
            "id": r[0], "category_id": r[1], "name": r[2], "description": r[3],
            "uploader_name": r[4], "comment": r[5], "file_name": r[6],
            "file_size": r[7], "file_type": r[8], "storage_type": r[9],
            "storage_path": r[10], "public_url": r[11], "telegram_file_id": r[12],
            "telegram_user_id": r[13], "telegram_username": r[14],
            "created_at": str(r[15]), "category_name": r[16], "category_emoji": r[17]
        }
    finally:
        conn.close()


def delete_material(mat_id: int) -> bool:
    conn = get_db_connection()
    try:
        conn.run("DELETE FROM materials WHERE id = :id", id=mat_id)
        return True
    finally:
        conn.close()


def get_stats() -> Dict[str, Any]:
    conn = get_db_connection()
    try:
        tot_mat = int(conn.run("SELECT COUNT(*) FROM materials")[0][0])
        tot_users = int(conn.run("SELECT COUNT(*) FROM users")[0][0])
        tot_size = int(conn.run("SELECT COALESCE(SUM(file_size), 0) FROM materials")[0][0])

        cat_rows = conn.run("""
            SELECT c.id, c.name, c.emoji, COUNT(m.id) as count
            FROM categories c
            LEFT JOIN materials m ON c.id = m.category_id
            GROUP BY c.id, c.name, c.emoji
            ORDER BY c.id ASC
        """)
        categories = [{"id": int(r[0]), "name": r[1], "emoji": r[2], "count": int(r[3])} for r in cat_rows]

        return {
            "total_materials": tot_mat,
            "total_users": tot_users,
            "total_bytes": tot_size,
            "categories": categories
        }
    finally:
        conn.close()
