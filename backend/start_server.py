#!/usr/bin/env python3
"""
FastAPI fejlesztői szerver indító script
"""
import os
import sys
import subprocess

def start_server():
    """Elindítja a FastAPI szervert fejlesztői módban"""
    
    # Aktuális könyvtár beállítása
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(backend_dir)
    
    # Virtual environment python használata
    venv_python = os.path.join(os.path.dirname(backend_dir), ".venv", "Scripts", "python.exe")
    
    if not os.path.exists(venv_python):
        print("❌ Virtual environment nem található!")
        print(f"Keresett útvonal: {venv_python}")
        return False
    
    try:
        print("🚀 FastAPI szerver indítása...")
        print("📍 URL: http://localhost:8000")
        print("📍 API dokumentáció: http://localhost:8000/docs")
        print("🛑 Kilépés: Ctrl+C")
        print("-" * 50)
        
        # Uvicorn szerver indítása
        subprocess.run([
            venv_python, "-m", "uvicorn", 
            "app.main:app", 
            "--reload", 
            "--host", "0.0.0.0",
            "--port", "8000"
        ])
        
    except KeyboardInterrupt:
        print("\n✅ Szerver leállítva")
        return True
    except Exception as e:
        print(f"❌ Hiba a szerver indításakor: {e}")
        return False

if __name__ == "__main__":
    start_server()
