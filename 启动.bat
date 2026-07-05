@echo off
chcp 65001 >nul
echo 正在启动复习程序...
cd /d "%~dp0quiz-app"
start http://localhost:5173/
call npm run dev
pause
