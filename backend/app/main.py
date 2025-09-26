"""
FastAPI belépési pont, session/cookie middleware, route-ok regisztrációja, DB init.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .config import settings
from .api import routes_auth
from .db import init_db

def create_app():
    app = FastAPI()

    # CORS middleware - frontend és backend közötti kommunikáció engedélyezése
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,  # Konfigurációból
        allow_credentials=True,  # FONTOS: cookie-k továbbítása
        allow_methods=["GET", "POST", "PUT", "DELETE"],
        allow_headers=["*"],
    )

    # Session middleware (cookie-alapú, titkos kulccsal)
    app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY or "default_secret_key")

    # Auth route-ok regisztrálása
    app.include_router(routes_auth.router, prefix="/auth", tags=["auth"])

    # Gyökér endpoint - üdvözlő üzenet
    @app.get("/")
    def root():
        return {
            "message": "FastAPI Backend működik!",
            "endpoints": {
                "health": "/health",
                "auth_register": "/auth/register",
                "auth_login": "/auth/login",
                "auth_logout": "/auth/logout",
                "docs": "/docs",
                "redoc": "/redoc"
            }
        }

    # Health check endpoint
    @app.get("/health")
    def health_check():
        return {"status": "ok", "message": "Backend működik"}

    # System info endpoint - Clean Code: Delegated to service
    @app.get("/system-info")
    def get_system_info():
        """Get complete system information - Simple endpoint using service layer"""
        from .services.system_info_service import SystemInfoService
        return SystemInfoService.get_complete_system_info()

    return app

app = create_app()

# App indulásakor (csak egyszer) inicializáld az adatbázist és az admin usert
@app.on_event("startup")
def on_startup():
    init_db()