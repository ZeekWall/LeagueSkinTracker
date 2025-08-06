# League Skin Tracker - Build Script (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "League Skin Tracker - Build Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

# Build application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to build application" -ForegroundColor Red
    Read-Host "Press Enter to continue"
    exit 1
}

Write-Host ""
Write-Host "Choose build type:" -ForegroundColor Green
Write-Host "1. Portable executable (LeagueSkinTracker.exe)" -ForegroundColor White
Write-Host "2. Installer (.exe with installer)" -ForegroundColor White
Write-Host "3. Both" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host "Creating portable executable..." -ForegroundColor Yellow
        npm run dist:portable
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to create portable executable" -ForegroundColor Red
            Read-Host "Press Enter to continue"
            exit 1
        }
        Write-Host ""
        Write-Host "Portable executable created successfully!" -ForegroundColor Green
        Write-Host "Location: dist-electron\LeagueSkinTracker.exe" -ForegroundColor Cyan
    }
    "2" {
        Write-Host "Creating installer..." -ForegroundColor Yellow
        npm run dist
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to create installer" -ForegroundColor Red
            Read-Host "Press Enter to continue"
            exit 1
        }
        Write-Host ""
        Write-Host "Installer created successfully!" -ForegroundColor Green
        Write-Host "Location: dist-electron\League Skin Tracker Setup.exe" -ForegroundColor Cyan
    }
    "3" {
        Write-Host "Creating both portable and installer..." -ForegroundColor Yellow
        npm run dist
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Error: Failed to create executables" -ForegroundColor Red
            Read-Host "Press Enter to continue"
            exit 1
        }
        Write-Host ""
        Write-Host "Both executables created successfully!" -ForegroundColor Green
        Write-Host "Location: dist-electron\" -ForegroundColor Cyan
    }
    default {
        Write-Host "Invalid choice. Please run the script again." -ForegroundColor Red
        Read-Host "Press Enter to continue"
        exit 1
    }
}

Write-Host ""
Write-Host "Build complete! Check dist-electron folder for your executable(s)" -ForegroundColor Green
Read-Host "Press Enter to continue" 