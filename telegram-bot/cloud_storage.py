import os
import shutil
import logging
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Any, Optional

from config import (
    GCS_BUCKET_NAME,
    GOOGLE_APPLICATION_CREDENTIALS,
    STORAGE_MODE,
    STORAGE_DIR,
    is_gcs_configured
)

logger = logging.getLogger(__name__)


class CloudStorageManager:
    """Google Cloud Storage va Lokal zaxira boshqaruvchisi."""

    def __init__(self):
        self._client = None
        self._bucket = None
        self._is_gcs_ready = False
        self._init_client()

    def _init_client(self):
        if STORAGE_MODE == "gcs" and is_gcs_configured():
            try:
                from google.cloud import storage
                self._client = storage.Client.from_service_account_json(
                    str(GOOGLE_APPLICATION_CREDENTIALS)
                )
                self._bucket = self._client.bucket(GCS_BUCKET_NAME)
                self._is_gcs_ready = True
                logger.info(f"✅ Google Cloud Storage bucket ulandi: {GCS_BUCKET_NAME}")
            except Exception as e:
                logger.warning(f"⚠️ GCS ulanishda xatolik: {e}. Lokal saqlash rejimiga o'tildi.")
                self._is_gcs_ready = False
        else:
            self._is_gcs_ready = False
            if STORAGE_MODE == "gcs":
                logger.info("ℹ️ GCS sozlamalari to'liq emas. Bot lokal 'storage/' papkasida ishlaydi.")

    @property
    def is_gcs_active(self) -> bool:
        return self._is_gcs_ready

    def upload_file(
        self,
        local_file_path: Path,
        folder_name: str,
        original_file_name: str,
        content_type: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Faylni GCS yoki Lokal papkaga saqlaydi.
        
        Qaytaradi:
            {
                "storage_type": "gcs" | "local",
                "storage_path": "...",
                "public_url": "...",
                "file_size": 12345
            }
        """
        file_size = local_file_path.stat().st_size
        safe_name = "".join(c if c.isalnum() or c in "._- " else "_" for c in original_file_name).strip()
        time_prefix = datetime.now().strftime("%Y%m%d_%H%M%S")
        year_month = datetime.now().strftime("%Y-%m")
        destination_name = f"{folder_name}/{year_month}/{time_prefix}_{safe_name}"

        # Agar GCS tayyor bo'lsa
        if self._is_gcs_ready and self._bucket is not None:
            try:
                blob = self._bucket.blob(destination_name)
                if content_type:
                    blob.content_type = content_type

                blob.upload_from_filename(str(local_file_path))

                # Signed URL yoki Public URL olish
                public_url = self.generate_signed_url(destination_name)

                logger.info(f"☁️ GCS ga yuklandi: {destination_name}")
                return {
                    "storage_type": "gcs",
                    "storage_path": destination_name,
                    "public_url": public_url,
                    "file_size": file_size
                }
            except Exception as e:
                logger.error(f"❌ GCS yuklashda xatolik: {e}. Lokal saqlanmoqda...")

        # Lokal saqlash (Fallback yoki STORAGE_MODE == 'local')
        local_target_dir = STORAGE_DIR / folder_name / year_month
        local_target_dir.mkdir(parents=True, exist_ok=True)
        local_target_file = local_target_dir / f"{time_prefix}_{safe_name}"

        shutil.copy2(local_file_path, local_target_file)
        rel_path = f"storage/{folder_name}/{year_month}/{time_prefix}_{safe_name}"

        logger.info(f"📁 Lokal saqlandi: {rel_path}")
        return {
            "storage_type": "local",
            "storage_path": rel_path,
            "public_url": None,
            "file_size": file_size
        }

    def generate_signed_url(self, blob_name: str, expiration_hours: int = 24) -> Optional[str]:
        """GCS fayli uchun vaqtinchalik xavfsiz yuklab olish havolasi yaratadi."""
        if not self._is_gcs_ready or not self._bucket:
            return None
        try:
            blob = self._bucket.blob(blob_name)
            url = blob.generate_signed_url(
                version="v4",
                expiration=timedelta(hours=expiration_hours),
                method="GET"
            )
            return url
        except Exception as e:
            logger.warning(f"Signed URL yaratishda xato: {e}")
            return f"https://storage.googleapis.com/{GCS_BUCKET_NAME}/{blob_name}"

    def delete_file(self, storage_type: str, storage_path: str) -> bool:
        """Faylni o'chirish."""
        try:
            if storage_type == "gcs" and self._is_gcs_ready and self._bucket:
                blob = self._bucket.blob(storage_path)
                blob.delete()
                return True
            elif storage_type == "local":
                full_path = STORAGE_DIR.parent / storage_path
                if full_path.exists():
                    full_path.unlink()
                    return True
        except Exception as e:
            logger.error(f"Fayl o'chirishda xato: {e}")
        return False


# Singleton obyekt
storage_manager = CloudStorageManager()
