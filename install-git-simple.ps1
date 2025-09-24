# Simple Git Installation Script
Write-Host "Installing Git for Windows..." -ForegroundColor Green

# Create temp directory
$tempDir = "$env:TEMP\GitInstall"
if (!(Test-Path $tempDir)) {
    New-Item -ItemType Directory -Path $tempDir -Force | Out-Null
}

# Git download URL (latest stable version)
$gitUrl = "https://github.com/git-for-windows/git/releases/latest/download/Git-2.42.0.2-64-bit.exe"
$installerPath = "$tempDir\GitInstaller.exe"

try {
    Write-Host "Downloading Git installer..." -ForegroundColor Blue
    
    # Download with progress
    Invoke-WebRequest -Uri $gitUrl -OutFile $installerPath -UseBasicParsing
    
    Write-Host "Download completed!" -ForegroundColor Green
    Write-Host "Starting Git installation..." -ForegroundColor Blue
    Write-Host "Please follow the installer prompts (use default settings)" -ForegroundColor Yellow
    
    # Run installer
    Start-Process -FilePath $installerPath -Wait
    
    Write-Host "Cleaning up..." -ForegroundColor Blue
    Remove-Item $installerPath -Force -ErrorAction SilentlyContinue
    Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
    
    Write-Host ""
    Write-Host "Git installation completed!" -ForegroundColor Green
    Write-Host "IMPORTANT: Please restart VS Code and PowerShell" -ForegroundColor Yellow
    Write-Host "After restart, verify with: git --version" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error during installation: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Manual installation: Download from https://git-scm.com/download/win" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Next steps after restart:" -ForegroundColor Cyan
Write-Host "1. Restart VS Code" -ForegroundColor White
Write-Host "2. Open Source Control panel (Ctrl+Shift+G)" -ForegroundColor White
Write-Host "3. Click Initialize Repository" -ForegroundColor White
Write-Host "4. Follow GitHub setup guide" -ForegroundColor White