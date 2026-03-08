# Bootstrap script for Jekyll blog development
# Run this script: .\Bootstrap.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Write-Host "=== Jekyll Blog Bootstrap ===" -ForegroundColor Cyan
Write-Host

# Check for required tools
function Test-Command {
    param($Command)
    
    try {
        $null = Get-Command $Command -ErrorAction Stop
        $version = & $Command --version 2>&1 | Select-Object -First 1
        Write-Host "✓ $Command found: $version" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "ERROR: $Command is not installed or not in PATH" -ForegroundColor Red
        return $false
    }
}

Write-Host "Checking required tools..."
$allOk = $true
$allOk = (Test-Command ruby) -and $allOk
$allOk = (Test-Command gem) -and $allOk

if (-not $allOk) {
    Write-Host "`nTo install Ruby on Windows:" -ForegroundColor Yellow
    Write-Host "  - Download Ruby installer from https://rubyinstaller.org/" -ForegroundColor Yellow
    Write-Host "  - Or use: winget install RubyInstallerTeam.Ruby (Ruby with DevKit)" -ForegroundColor Yellow
    Write-Host "  - Or use: choco install ruby (if you have Chocolatey)" -ForegroundColor Yellow
    Write-Host "`nIMPORTANT: Choose 'Ruby+Devkit' version to compile native extensions" -ForegroundColor Yellow
    Write-Host "`nPlease install missing tools and try again." -ForegroundColor Red
    exit 1
}

Write-Host

# Check if bundle command is available
try {
    $null = Get-Command bundle -ErrorAction Stop
    $bundleVersion = bundle --version 2>&1
    Write-Host "✓ bundle command found: $bundleVersion" -ForegroundColor Green
}
catch {
    Write-Host "bundle command not found. Installing bundler..." -ForegroundColor Yellow
    
    try {
        gem install bundler --user-install
        
        # Try to add gem bin to PATH for this session
        $gemPath = (ruby -e "puts Gem.user_dir") + "\bin"
        if (Test-Path $gemPath) {
            $env:Path = "$gemPath;$env:Path"
            Write-Host "Added $gemPath to PATH for this session" -ForegroundColor Green
        }
        
        # Check again
        try {
            $null = Get-Command bundle -ErrorAction Stop
        }
        catch {
            Write-Host "`nERROR: bundle command still not found after installation" -ForegroundColor Red
            Write-Host "You may need to add the Ruby gems bin directory to your PATH permanently." -ForegroundColor Yellow
            Write-Host "Add this to your PATH: $gemPath" -ForegroundColor Yellow
            Write-Host "`nOr install via: gem install bundler" -ForegroundColor Yellow
            exit 1
        }
    }
    catch {
        Write-Host "`nERROR: Failed to install bundler" -ForegroundColor Red
        Write-Host "Try: gem install bundler" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host

# Configure bundler to use local vendor/bundle for gems
try {
    $bundlePath = bundle config get path 2>&1 | Out-String
    if ($bundlePath -match "not set" -or $LASTEXITCODE -ne 0) {
        Write-Host "Configuring bundler to use local gem path..." -ForegroundColor Cyan
        bundle config set --local path vendor/bundle
    }
}
catch {
    Write-Host "Configuring bundler to use local gem path..." -ForegroundColor Cyan
    bundle config set --local path vendor/bundle
}

# Install dependencies
Write-Host "Installing Ruby dependencies..." -ForegroundColor Cyan
Push-Location $PSScriptRoot
try {
    bundle install
    if ($LASTEXITCODE -ne 0) {
        throw "bundle install failed"
    }
}
catch {
    Write-Host "`nERROR: Failed to install dependencies" -ForegroundColor Red
    Write-Host "Try running: bundle install --verbose for more details" -ForegroundColor Yellow
    exit 1
}
finally {
    Pop-Location
}

Write-Host
Write-Host "=== Bootstrap complete! ===" -ForegroundColor Green
Write-Host
Write-Host "Available commands:"
Write-Host "  .\build.ps1    - Build the site"
Write-Host "  .\serve.ps1    - Serve the site locally with live reload"
Write-Host "  bundle update  - Update dependencies"
Write-Host
