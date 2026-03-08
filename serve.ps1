# Serve the Jekyll site locally with live reload

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

Push-Location $PSScriptRoot
try {
    Write-Host "Starting Jekyll server with live reload..." -ForegroundColor Cyan
    Write-Host "Site will be available at http://localhost:4000" -ForegroundColor Green
    bundle exec jekyll serve --livereload
}
finally {
    Pop-Location
}
