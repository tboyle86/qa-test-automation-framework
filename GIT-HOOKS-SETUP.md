# Git Hooks Setup Guide

## Overview
This guide explains how to set up Git hooks for smart test execution based on file changes. The hooks analyze changed files and trigger appropriate test suites automatically.

## Setup Instructions

### For Windows (PowerShell)

#### 1. Enable Git Hooks
```powershell
# Navigate to your project directory
cd C:\Users\tboyl\Desktop\QA-Test

# Copy the PowerShell hook to Git hooks directory
Copy-Item ".git-hooks\pre-commit.ps1" ".git\hooks\pre-commit.ps1"

# Configure Git to use PowerShell for hooks
git config core.hooksPath .git/hooks
```

#### 2. Create Git Hook Wrapper (Windows)
```powershell
# Create pre-commit file in .git/hooks/
$hookContent = @'
#!/bin/sh
# Git Hook Wrapper for PowerShell
powershell.exe -ExecutionPolicy Bypass -File .git/hooks/pre-commit.ps1
'@

$hookContent | Out-File -FilePath ".git\hooks\pre-commit" -Encoding ASCII
```

#### 3. Make Hook Executable (if using Git Bash)
```bash
chmod +x .git/hooks/pre-commit
```

### For Linux/Mac (Bash)

#### 1. Copy and Configure Hook
```bash
# Navigate to your project directory
cd /path/to/QA-Test

# Copy the bash hook to Git hooks directory
cp .git-hooks/pre-commit .git/hooks/pre-commit

# Make hook executable
chmod +x .git/hooks/pre-commit
```

## How It Works

### File Analysis Logic
When you commit files, the hook analyzes filenames and maps them to appropriate test tags:

```
Changed File → Test Tags
├── song-library.js → @crud @smoke
├── add-song.component.ts → @crud  
├── filter.service.js → @filtering
├── sort.utils.ts → @sorting
├── responsive.css → @responsive
├── service-worker.js → @pwa
└── performance.optimizer.js → @performance
```

### Test Execution Strategy
1. **Always Run**: `@smoke` tests (critical functionality)
2. **Conditionally Add**: Tags based on changed files
3. **Generate Trigger**: Creates `.jenkins-trigger` file for CI/CD

### Example Scenarios

#### Scenario 1: Developer modifies song creation
```bash
# Files changed: add-song.component.ts, song-service.js
# Result: @smoke + @crud tests will run
git add .
git commit -m "Add song validation improvements"
```

#### Scenario 2: Developer updates filtering logic
```bash
# Files changed: filter.service.js, search.utils.ts
# Result: @smoke + @filtering tests will run
git add .
git commit -m "Improve search performance"
```

#### Scenario 3: Developer updates mobile styles
```bash
# Files changed: responsive.css, mobile.scss
# Result: @smoke + @responsive tests will run
git add .
git commit -m "Fix mobile layout issues"
```

## Jenkins Integration

### Trigger File Format
The hook creates a `.jenkins-trigger` file with test parameters:

```bash
# Jenkins CI/CD Trigger Configuration
TEST_SUITE=smart-execution
TAGS_TO_RUN=@smoke|@crud
CHANGED_FILES<<DELIMITER
src/components/add-song.component.ts
src/services/song-service.js
DELIMITER
GENERATE_REPORTS=true
TRIGGER_TYPE=pre-commit
COMMIT_HASH=abc123def456
AUTHOR=John Developer
BRANCH=feature/song-validation
TIMESTAMP=2025-09-23T10:30:00Z
```

### Jenkins Pipeline Reading
The enhanced Jenkinsfile reads this configuration:

```groovy
stage('Smart Test Execution') {
    steps {
        script {
            if (fileExists('.jenkins-trigger')) {
                def config = readFile('.jenkins-trigger')
                // Extract and use test tags
                def tagMatch = config =~ /TAGS_TO_RUN=(.+)/
                if (tagMatch) {
                    def tags = tagMatch[0][1]
                    sh "npx playwright test --grep \"${tags}\" --project=chromium"
                }
            }
        }
    }
}
```

## Testing the Hook

### 1. Test Hook Locally
```bash
# Make a small change to trigger the hook
echo "// Test comment" >> src/components/song-library.js
git add .

# This will trigger the pre-commit hook
git commit -m "Test smart execution hook"
```

### 2. Verify Output
Look for output similar to:
```
🔍 Analyzing changes for smart test execution...
📋 Changed files detected:
   src/components/song-library.js
🎯 File 'song-library.js' matches pattern 'song-library' -> Adding tag: @crud
🚀 Test Execution Plan:
   Smoke Tests: Always run (@smoke)
   Additional Tags: @crud
   Final Tag Pattern: @smoke|@crud
✅ Jenkins trigger configuration created (.jenkins-trigger)
```

## Customization Options

### Adding New File Patterns
Edit the `FILE_TAG_MAP` in the hook files:

#### PowerShell Version (.git-hooks/pre-commit.ps1)
```powershell
$FILE_TAG_MAP = @{
    "song-library" = "@crud"
    "add-song" = "@crud"
    "your-new-pattern" = "@your-tag"
}
```

#### Bash Version (.git-hooks/pre-commit)
```bash
FILE_TAG_MAP["your-new-pattern"]="@your-tag"
```

### Disabling the Hook Temporarily
```bash
# Skip hooks for a single commit
git commit -m "Emergency fix" --no-verify

# Disable globally (not recommended)
git config core.hooksPath ""
```

## Troubleshooting

### Common Issues

#### Hook Not Executing
- Verify hook is executable: `ls -la .git/hooks/pre-commit`
- Check Git configuration: `git config core.hooksPath`
- Ensure PowerShell execution policy allows scripts

#### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Hook Fails on Commit
- Check hook syntax: Run the hook script manually
- Verify file paths are correct
- Ensure required tools (npx, playwright) are available

### Debug Mode
Add debug output to hooks for troubleshooting:

```bash
# Add to top of hook file
set -x  # Enable debug mode
echo "Debug: Hook starting execution"
```

## Best Practices

1. **Regular Testing**: Test hooks with different file change scenarios
2. **Team Communication**: Ensure all team members understand the hook behavior
3. **Documentation**: Keep file pattern mappings documented and updated
4. **Monitoring**: Monitor Jenkins execution times and adjust tags as needed
5. **Backup Strategy**: Keep manual test execution options available

## Integration Benefits

- **Fast Developer Feedback**: 2-5 minute test execution vs 20-minute full regression
- **Intelligent Test Selection**: Only run tests relevant to changes
- **Consistent Quality**: Automated smoke tests always run
- **Scalable Strategy**: Easy to add new patterns and tags
- **CI/CD Integration**: Seamless Jenkins pipeline integration