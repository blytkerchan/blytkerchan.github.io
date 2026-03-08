# Build the Jekyll site

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot
try {
    Write-Host "Building Jekyll site..." -ForegroundColor Cyan
    bundle exec jekyll build
    
    Write-Host "Build complete. Output in _site/" -ForegroundColor Green
}
finally {
    Pop-Location
}
