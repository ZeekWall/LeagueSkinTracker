# Test Build Script for League Skin Tracker
Write-Host "Testing League Skin Tracker Build Process..." -ForegroundColor Green

# Check if dist-electron directory exists
if (Test-Path "dist-electron") {
    Write-Host "✓ dist-electron directory exists" -ForegroundColor Green
} else {
    Write-Host "✗ dist-electron directory not found" -ForegroundColor Red
    exit 1
}

# Check if executable exists
if (Test-Path "dist-electron\LeagueSkinTracker.exe") {
    $fileSize = (Get-Item "dist-electron\LeagueSkinTracker.exe").Length
    $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
    Write-Host "✓ LeagueSkinTracker.exe created successfully" -ForegroundColor Green
    Write-Host "  File size: $fileSizeMB MB" -ForegroundColor Cyan
} else {
    Write-Host "✗ LeagueSkinTracker.exe not found" -ForegroundColor Red
    exit 1
}

# Check if win-unpacked directory exists
if (Test-Path "dist-electron\win-unpacked") {
    Write-Host "✓ win-unpacked directory exists" -ForegroundColor Green
} else {
    Write-Host "✗ win-unpacked directory not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Build test completed successfully!" -ForegroundColor Green
Write-Host "Your executable is ready at: dist-electron\LeagueSkinTracker.exe" -ForegroundColor Cyan 