@echo off
chcp 65001 >nul
title 思想政治期末复习系统
cd /d "%~dp0quiz-app\dist"

echo ============================================
echo     思想政治期末复习系统
echo ============================================
echo.
echo 正在启动本地服务器...
echo 浏览器将自动打开，请勿关闭此窗口
echo.

start http://localhost:8899/
python -m http.server 8899
