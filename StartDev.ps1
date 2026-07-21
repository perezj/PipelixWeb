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

$devPort = if ($env:PORT) { [int]$env:PORT } else { 3000 }
$existingConnections = Get-NetTCPConnection -LocalPort $devPort -State Listen -ErrorAction SilentlyContinue
foreach ($processId in ($existingConnections | Select-Object -ExpandProperty OwningProcess -Unique)) {
    $existingProcess = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($existingProcess) {
        Write-Host "Stopping process $($existingProcess.ProcessName) (PID $processId) already listening on port $devPort..."
        Stop-Process -Id $processId -Force
    }
}
if ($existingConnections) {
    Start-Sleep -Milliseconds 500
}

if ($Install -or -not (Test-Path -LiteralPath (Join-Path $PSScriptRoot 'node_modules'))) {
    Write-Host 'Installing dependencies from package-lock.json...'
    Invoke-Npm ci
}

$env:PORT = $devPort
Write-Host 'Starting the dev server. Press Ctrl+C to stop it.'
Invoke-Npm run dev
