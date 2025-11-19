@echo off
setlocal

echo 🚀 Setting up development environment...

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

:: Install dependencies
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

:: Verify Husky setup
if exist ".husky" (
    echo ✅ Husky hooks are set up
) else (
    echo ⚠️  Husky directory not found, running setup...
    call npx husky install
)

:: Test commitlint
echo 🧪 Testing commitlint configuration...
echo feat: EVO-1234 - test commit message | npx commitlint >nul 2>&1
if errorlevel 1 (
    echo ❌ Commitlint test failed
    pause
    exit /b 1
) else (
    echo ✅ Commitlint is working correctly
)

echo.
echo 🎉 Development environment setup complete!
echo.
echo 📝 Commit message format:
echo    ^<type^>: ^<JIRA-TICKET^> - ^<description^>
echo.
echo 📖 See docs/development-setup.md for more details
pause
