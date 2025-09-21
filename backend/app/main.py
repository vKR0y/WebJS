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

    # System info endpoint
    @app.get("/system-info")
    def system_info():
        import psutil
        import platform
        import os
        from datetime import datetime
        import time
        
        # CPU info
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_count = psutil.cpu_count()
        cpu_freq = psutil.cpu_freq()
        
        # Memory info
        memory = psutil.virtual_memory()
        memory_total = round(memory.total / (1024**3), 2)  # GB
        memory_used = round(memory.used / (1024**3), 2)    # GB
        memory_percent = memory.percent
        memory_available = round(memory.available / (1024**3), 2)  # GB
        
        # Disk info (Windows-hoz C:\ drive)
        try:
            if platform.system() == "Windows":
                disk = psutil.disk_usage('C:\\')
            else:
                disk = psutil.disk_usage('/')
        except:
            # Fallback ha nincs C:\ vagy / elérhető
            disk = psutil.disk_usage(os.getcwd())
            
        disk_total = round(disk.total / (1024**3), 2)      # GB
        disk_used = round(disk.used / (1024**3), 2)        # GB
        disk_free = round(disk.free / (1024**3), 2)        # GB
        disk_percent = round((disk.used / disk.total) * 100, 1)
        
        # Network info
        network_stats = psutil.net_io_counters()
        
        # Process count
        process_count = len(psutil.pids())
        
        # Boot time
        boot_time = datetime.fromtimestamp(psutil.boot_time())
        uptime_seconds = time.time() - psutil.boot_time()
        uptime_hours = round(uptime_seconds / 3600, 1)
        
        # System info
        system_info = {
            "platform": platform.system(),
            "platform_version": platform.version(),
            "architecture": platform.machine(),
            "processor": platform.processor() or "N/A",
            "hostname": platform.node(),
            "python_version": platform.python_version(),
            "boot_time": boot_time.strftime("%Y-%m-%d %H:%M:%S"),
            "uptime_hours": uptime_hours
        }
        
        # API Endpoints status
        api_status = {
            "auth_register": "✅ Működik",
            "auth_login": "✅ Működik", 
            "auth_logout": "✅ Működik",
            "auth_change_password": "✅ Működik",
            "system_info": "✅ Működik",
            "health": "✅ Működik"
        }
        
        return {
            "status": "ok",
            "timestamp": datetime.now().isoformat(),
            "cpu": {
                "usage_percent": cpu_percent,
                "cores": cpu_count,
                "frequency_mhz": cpu_freq.current if cpu_freq else None
            },
            "memory": {
                "total_gb": memory_total,
                "used_gb": memory_used,
                "available_gb": memory_available,
                "usage_percent": memory_percent
            },
            "disk": {
                "total_gb": disk_total,
                "used_gb": disk_used,
                "free_gb": disk_free,
                "usage_percent": disk_percent
            },
            "network": {
                "bytes_sent": network_stats.bytes_sent,
                "bytes_recv": network_stats.bytes_recv,
                "packets_sent": network_stats.packets_sent,
                "packets_recv": network_stats.packets_recv
            },
            "system": system_info,
            "processes": {
                "count": process_count
            },
            "api_endpoints": api_status
        }

    return app

app = create_app()

# App indulásakor (csak egyszer) inicializáld az adatbázist és az admin usert
@app.on_event("startup")
def on_startup():
    init_db()