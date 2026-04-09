@echo off
chcp 65001 >nul 2>&1
title Firstbrain - AI-Native Second Brain

:: Navigate to vault root
cd /d "%~dp0"

echo.
echo   +-------------------------------------+
echo   ^|         Firstbrain v3.0              ^|
echo   ^|    AI-Native Second Brain            ^|
echo   +-------------------------------------+
echo.

:: -- Step 1: Check Node.js --------------------------------
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo   [ERROR] Node.js is not installed.
    echo   Install it from: https://nodejs.org ^(^>= v22^)
    echo.
    pause
    exit /b 1
)

for /f "tokens=1,2,3 delims=v." %%a in ('node -v') do (
    set NODE_MAJOR=%%a
    set NODE_MINOR=%%b
    set NODE_PATCH=%%c
)
echo   [OK] Node.js v%NODE_MAJOR%.%NODE_MINOR%.%NODE_PATCH% detected

if %NODE_MAJOR% LSS 22 (
    echo   [ERROR] Node.js version 22 or higher is required.
    pause
    exit /b 1
)
if %NODE_MAJOR% EQU 22 (
    if %NODE_MINOR% LSS 5 (
        echo   [WARNING] Node.js v22.5.0+ is recommended for stable SQLite support.
        echo             Current version: v%NODE_MAJOR%.%NODE_MINOR%.%NODE_PATCH%
        echo.
    )
)

:: -- Step 2: Check Claude Code CLI -------------------------
where claude >nul 2>&1
if %errorlevel% neq 0 (
    echo   [ERROR] Claude Code CLI is not installed.
    echo.
    echo   Install it with:
    echo     npm install -g @anthropic-ai/claude-code
    echo.
    echo   More info: https://docs.anthropic.com/en/docs/claude-code
    echo.
    set /p INSTALL="  Install now? (y/N) "
    if /i "%INSTALL%"=="y" (
        echo   Installing Claude Code...
        npm install -g @anthropic-ai/claude-code
        where claude >nul 2>&1
        if %errorlevel% neq 0 (
            echo   [ERROR] Installation failed. Please install manually.
            pause
            exit /b 1
        )
        echo   [OK] Claude Code installed
    ) else (
        pause
        exit /b 1
    )
) else (
    echo   [OK] Claude Code CLI detected
)

:: -- Step 3: Check vault structure -------------------------
set VAULT_OK=1
if not exist "CLAUDE.md" (
    echo   [ERROR] Missing CLAUDE.md
    set VAULT_OK=0
)
if not exist "00 - Inbox" (
    echo   [ERROR] Missing folder: 00 - Inbox
    set VAULT_OK=0
)
if not exist "05 - Templates" (
    echo   [ERROR] Missing folder: 05 - Templates
    set VAULT_OK=0
)

if %VAULT_OK%==1 (
    echo   [OK] Vault structure intact
) else (
    echo   [ERROR] Vault structure incomplete. Please re-clone the repository.
    pause
    exit /b 1
)

:: -- Step 4: Check optional semantic search ----------------
if exist "node_modules\@huggingface" (
    echo   [OK] Semantic search ^(Transformers.js^)
) else (
    echo   [--] Semantic search not installed ^(optional^)
    echo        Run: npm install
)

:: -- Step 5: Launch Dashboard -------------------------------
echo.
node .agents/dashboard.cjs
