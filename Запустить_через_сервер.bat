@echo off
chcp 65001 > nul
title LifeOS Server (localhost:4173)
echo ===================================================
echo   Запуск локального веб-сервера для LifeOS...
echo   Адрес: http://localhost:4173
echo.
echo   Чтобы остановить сервер, просто закройте это окно.
echo ===================================================
timeout /t 2 > nul
start http://localhost:4173
npx --yes serve -p 4173 "%~dp0"
