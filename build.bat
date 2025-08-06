@echo off
echo ========================================
echo League Skin Tracker - Build Script
echo ========================================

echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build application
    pause
    exit /b 1
)

echo.
echo Choose build type:
echo 1. Portable executable (LeagueSkinTracker.exe)
echo 2. Installer (.exe with installer)
echo 3. Both
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Creating portable executable...
    npm run dist:portable
    if %errorlevel% neq 0 (
        echo Error: Failed to create portable executable
        pause
        exit /b 1
    )
    echo.
    echo Portable executable created successfully!
    echo Location: dist-electron\LeagueSkinTracker.exe
) else if "%choice%"=="2" (
    echo Creating installer...
    npm run dist
    if %errorlevel% neq 0 (
        echo Error: Failed to create installer
        pause
        exit /b 1
    )
    echo.
    echo Installer created successfully!
    echo Location: dist-electron\League Skin Tracker Setup.exe
) else if "%choice%"=="3" (
    echo Creating both portable and installer...
    npm run dist
    if %errorlevel% neq 0 (
        echo Error: Failed to create executables
        pause
        exit /b 1
    )
    echo.
    echo Both executables created successfully!
    echo Location: dist-electron\
) else (
    echo Invalid choice. Please run the script again.
    pause
    exit /b 1
)

echo.
echo Build complete! Check dist-electron folder for your executable(s)
pause 