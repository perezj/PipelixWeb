[CmdletBinding()]
param(
    [switch]$Install
)

$ErrorActionPreference = 'Stop'

Set-Location -LiteralPath $PSScriptRoot

function Invoke-Npm {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$Arguments)

    & npm.cmd @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "npm $($Arguments -join ' ') failed with exit code $LASTEXITCODE."
    }
}

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js 22.13 or later is required. Install it, then run this script again.'
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'npm was not found. Reinstall Node.js, then run this script again.'
}

$nodeVersion = [version]((& node --version).TrimStart('v'))
if ($nodeVersion -lt [version]'22.13.0') {
    throw "Node.js 22.13 or later is required; found $nodeVersion. Upgrade Node.js, then run this script again."
}

if ($Install -or -not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
    Write-Host 'Installing dependencies from package-lock.json...'
    Invoke-Npm ci
}

Write-Host 'Building the application...'
& npm.cmd run build
$buildExitCode = $LASTEXITCODE
if ($buildExitCode -ne 0) {
    $staticEntryPoint = Join-Path $PSScriptRoot 'dist\client\index.html'
    # Vinext can assert while closing its Windows async handle after completing
    # a successful static export. Keep the workaround narrow and verify output.
    if ($buildExitCode -eq -1073740791 -and (Test-Path -LiteralPath $staticEntryPoint)) {
        Write-Warning 'Vinext completed the static export but crashed during Windows cleanup. Continuing with the generated site.'
    }
    else {
        throw "npm run build failed with exit code $buildExitCode."
    }
}

Write-Host 'Starting the website. Press Ctrl+C to stop it.'
Invoke-Npm run start
