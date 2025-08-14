# PowerShell build script for LoL Skin Tracker portable exe
# This script provides a reliable way to build the app on any Windows PC

param(
    [switch]$Clean,
    [switch]$SkipInstall,
    [switch]$Dev
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 LoL Skin Tracker v2.0 Build Script" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Get the script's directory (works regardless of where it's called from)
$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

Write-Host "📁 Working Directory: $ScriptPath" -ForegroundColor Gray

# Check Node.js version
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    
    # Check if Node.js version is 20 or higher
    $versionNumber = [version]($nodeVersion -replace 'v', '')
    if ($versionNumber.Major -lt 20) {
        Write-Host "⚠️  Warning: Node.js 20+ recommended. Current: $nodeVersion" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 20+" -ForegroundColor Red
    exit 1
}

# Clean previous builds if requested
if ($Clean -or $Dev) {
    Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
    @("build", "dist", "node_modules") | ForEach-Object {
        if (Test-Path $_) {
            Write-Host "   Removing $_" -ForegroundColor Gray
            Remove-Item -Recurse -Force $_
        }
    }
}

# Install dependencies
if (-not $SkipInstall) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Green
    & npm install --ignore-scripts
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Dependency installation failed" -ForegroundColor Red
        Write-Host "💡 Try running: npm install --ignore-scripts --force" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Build React app with Vite
Write-Host "⚛️  Building React app with Vite..." -ForegroundColor Green
$vitePath = ".\node_modules\.bin\vite"
if (-not (Test-Path $vitePath)) {
    Write-Host "❌ Vite not found. Trying npx..." -ForegroundColor Yellow
    & npx vite build
} else {
    & $vitePath build
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ React build failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ React build completed" -ForegroundColor Green

# Compile Electron main process
Write-Host "⚡ Compiling Electron main process..." -ForegroundColor Green
$tscPath = ".\node_modules\.bin\tsc"
if (-not (Test-Path $tscPath)) {
    Write-Host "❌ TypeScript compiler not found. Trying npx..." -ForegroundColor Yellow
    & npx tsc electron/main.ts --outDir build/electron --target es2020 --module commonjs --moduleResolution node --esModuleInterop
} else {
    & $tscPath electron/main.ts --outDir build/electron --target es2020 --module commonjs --moduleResolution node --esModuleInterop
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Electron TypeScript compilation failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Electron main process compiled" -ForegroundColor Green

# Build portable executable
Write-Host "📦 Building portable executable..." -ForegroundColor Green
$builderPath = ".\node_modules\.bin\electron-builder"
if (-not (Test-Path $builderPath)) {
    Write-Host "❌ Electron Builder not found. Trying npx..." -ForegroundColor Yellow
    & npx electron-builder --win portable
} else {
    & $builderPath --win portable
}

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Electron builder failed" -ForegroundColor Red
    exit 1
}

# Success!
Write-Host "" -ForegroundColor Green
Write-Host "🎉 Build completed successfully!" -ForegroundColor Green
Write-Host "📁 Executable location: dist\LoL Skin Tracker-v2.0.0-x64.exe" -ForegroundColor Cyan

# Show file size
$exePath = "dist\LoL Skin Tracker-v2.0.0-x64.exe"
if (Test-Path $exePath) {
    $fileSize = [math]::Round((Get-Item $exePath).Length / 1MB, 1)
    Write-Host "📊 File size: ${fileSize} MB" -ForegroundColor Gray
    Write-Host "✅ Ready to distribute!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Executable not found at expected location" -ForegroundColor Yellow
}