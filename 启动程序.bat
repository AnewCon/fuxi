@echo off
chcp 65001 >nul
title 思想政治期末复习系统

echo ============================================
echo     思想政治期末复习系统 - 启动程序
echo ============================================
echo.

:: 检查是否已安装 Node.js
where node >nul 2>nul
if %errorlevel%==0 (
    echo [检测到 Node.js] 正在启动开发服务器...
    cd /d "%~dp0quiz-app"
    start http://localhost:5173/
    call npm run dev
    pause
    exit /b
)

:: 检查是否已安装 Python
where python >nul 2>nul
if %errorlevel%==0 (
    echo [检测到 Python] 正在启动本地服务器...
    cd /d "%~dp0quiz-app\dist"
    start http://localhost:8080/
    python -m http.server 8080
    pause
    exit /b
)

:: 检查 Python3
where python3 >nul 2>nul
if %errorlevel%==0 (
    echo [检测到 Python3] 正在启动本地服务器...
    cd /d "%~dp0quiz-app\dist"
    start http://localhost:8080/
    python3 -m http.server 8080
    pause
    exit /b
)

echo [错误] 未检测到 Node.js 或 Python 环境！
echo.
echo 请安装以下任一环境后重试：
echo   1. Node.js: https://nodejs.org/
echo   2. Python: https://www.python.org/
echo.
pause
