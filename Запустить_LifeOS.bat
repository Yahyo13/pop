@echo off
chcp 65001 > nul
title LifeOS Launcher
echo =========================================
echo   Запуск LifeOS - Организация жизни
echo =========================================
echo.
echo Открытие сайта в браузере...
start "" "%~dp0index.html"
exit
