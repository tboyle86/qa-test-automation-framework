# Git Repository Setup Script
# Run this after creating your GitHub repository

Write-Host "🚀 Setting up Git repository for QA Test Automation Framework..." -ForegroundColor Green

# Check if Git is available
try {
    $gitVersion = git --version
    Write-Host "✅ Git is available: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Git first or use VS Code's Source Control panel" -ForegroundColor Yellow
    exit 1
}

# Initialize Git repository if not already done
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing Git repository..." -ForegroundColor Blue
    git init
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}

# Add all files
Write-Host "📄 Adding all files to Git..." -ForegroundColor Blue
git add .

# Check if there are any changes to commit
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Committing changes..." -ForegroundColor Blue
    git commit -m "Initial commit: Comprehensive QA Test Automation Framework

Features:
- Cross-browser testing with Playwright
- Accessibility compliance testing
- Performance monitoring
- PWA testing capabilities
- Unified HTML dashboard reporting
- Allure report integration
- Code coverage analysis
- Visual testing support
- Responsive design testing

Ready for production use with comprehensive documentation."

} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

# Prompt for GitHub repository URL
Write-Host "`n🔗 GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "Please create a GitHub repository first if you haven't already:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Create a new repository (don't initialize with README)" -ForegroundColor Yellow
Write-Host "3. Copy the repository URL" -ForegroundColor Yellow

$repoUrl = Read-Host "`nEnter your GitHub repository URL (e.g., https://github.com/username/repo.git)"

if ($repoUrl) {
    Write-Host "🔗 Adding GitHub remote..." -ForegroundColor Blue
    
    # Remove existing origin if it exists
    try {
        git remote remove origin 2>$null
    } catch {
        # Ignore error if origin doesn't exist
    }
    
    git remote add origin $repoUrl
    
    # Set main branch and push
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
    git branch -M main
    
    try {
        git push -u origin main
        Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
        Write-Host "🌐 Repository available at: $($repoUrl -replace '\.git$', '')" -ForegroundColor Cyan
    } catch {
        Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
        Write-Host "This might be due to authentication issues." -ForegroundColor Yellow
        Write-Host "Try using VS Code's Source Control panel or set up authentication." -ForegroundColor Yellow
    }
} else {
    Write-Host "⏭️  Skipping GitHub setup - you can add remote later with:" -ForegroundColor Yellow
    Write-Host "git remote add origin YOUR_REPO_URL" -ForegroundColor Gray
    Write-Host "git push -u origin main" -ForegroundColor Gray
}

Write-Host "`n🎉 Git setup complete!" -ForegroundColor Green
Write-Host "Your QA Test Automation Framework is now ready to share!" -ForegroundColor Cyan