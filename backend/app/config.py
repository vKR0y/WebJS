"""
Konfigurációs beállítások, környezeti változók kezelése.
"""

import os
from dotenv import load_dotenv

load_dotenv()  # Betölti a .env fájl változóit

class Settings:
    # Titkos kulcs a session cookie-hoz (fejlesztéshez lehet fix, élesben legyen random!)
    SECRET_KEY = os.getenv("SECRET_KEY")

    # SQLite DB elérési út, fejlesztésre
    DB_URL = os.getenv("DB_URL", "sqlite:///./local.db")

    DEBUG = os.getenv("DEBUG", "false").lower() == "true"

    # CORS engedélyezett origin-ek (vessző-elválasztott lista)
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

settings = Settings()