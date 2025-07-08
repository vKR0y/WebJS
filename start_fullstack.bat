@echo off
title WebJS Full Stack Inditas
echo.
echo ===================================
echo   WebJS Full Stack Alkalmazas
echo ===================================
echo.
echo Backend inditasa (Port 8000)...
start "Backend" cmd /k "cd /d d:\DRIVE\PROJECTEK\vkr0yhu\Page\WebJS_FastAPI\WebJS\backend && python start_server.py"
echo.
echo Frontend inditasa (Port 3000)...
start "Frontend" cmd /k "cd /d d:\DRIVE\PROJECTEK\vkr0yhu\Page\WebJS_FastAPI\WebJS\frontend && npm start"
echo.
echo ===================================
echo   Szerverek inditva!
echo ===================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo ===================================
echo.
pause
