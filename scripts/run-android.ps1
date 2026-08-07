<#
.SYNOPSIS
  Build le frontend, sync Capacitor (Android) et lance Android Studio
  en pointant le backend vers l'IP locale du PC (reseau local).

.DESCRIPTION
  - Detecte automatiquement l'IPv4 locale du PC (reseau Wi-Fi/Ethernet).
  - Definit VITE_API_BASE_URL=http://<ip>:<port> pour le build Vite.
  - Lance `npm run build` (vue-tsc + vite build) -> dist/
  - Lance `npx cap sync android` pour copier dist/ dans le projet Android.
  - Lance `npx cap open android` pour ouvrir Android Studio.

.PARAMETER Port
  Port du backend (defaut: 3000).

.PARAMETER Ip
  Forcer une IP au lieu de l'auto-detection.

.PARAMETER SkipOpen
  Ne pas ouvrir Android Studio a la fin (utile en CI).

.PARAMETER Mode
  Mode VITE_MODE_APP : "dev" (defaut) ou "prod". En prod l'override IP est ignore
  car index.request.ts utilise l'URL de production.

.EXAMPLE
  .\scripts\run-android.ps1
  .\scripts\run-android.ps1 -Port 3000
  .\scripts\run-android.ps1 -Ip 192.168.1.50 -Port 3000
  .\scripts\run-android.ps1 -SkipOpen
#>

[CmdletBinding()]
param(
  [string]$Ip,
  [int]$Port = 3000,
  [switch]$SkipOpen,
  [ValidateSet("dev", "prod")]
  [string]$Mode = "dev"
)

$ErrorActionPreference = "Stop"

# --- Racine du projet (parent du dossier scripts/) ---
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

function Resolve-LocalIp {
  <#
    Recupere la premiere IPv4 non-loopback active.
    Priorise les interfaces "Up" avec une passerelle (reseau local reel).
  #>
  $candidates = @()

  try {
    $ipinfo = Get-NetIPConfiguration -ErrorAction Stop |
      Where-Object { $_.NetAdapter.Status -eq "Up" -and $_.IPv4DefaultGateway -and $_.IPv4Address.IPAddress }

    foreach ($cfg in $ipinfo) {
      $addr = $cfg.IPv4Address.IPAddress
      if ($addr -and ($addr -notmatch "^169\.254\.") -and ($addr -ne "127.0.0.1")) {
        $candidates += $addr
      }
    }
  } catch {
    # Fallback : ipconfig parsing (robuste sur vieux Windows / sans module NetTCPIP)
    $ipconfig = ipconfig
    $inEthernet = $false
    foreach ($line in $ipconfig) {
      if ($line -match "Ethernet|Wi-Fi|Wi-Fi 2|Wireless|Sans fil|Carte Ethernet|Carte Wi-Fi|adapter") {
        $inEthernet = $true
        continue
      }
      if ($inEthernet -and $line -match "IPv4.*:\s*(\d{1,3}(?:\.\d{1,3}){3})") {
        $addr = $matches[1]
        if ($addr -notmatch "^169\.254\." -and $addr -ne "127.0.0.1") {
          $candidates += $addr
          $inEthernet = $false
        }
      }
    }
  }

  if ($candidates.Count -gt 0) {
    return $candidates[0]
  }
  return $null
}

# --- 1. Determination de l'IP ---
if (-not $Ip) {
  Write-Host "[1/4] Detection de l'IP locale..." -ForegroundColor Cyan
  $Ip = Resolve-LocalIp
  if (-not $Ip) {
    Write-Error "Impossible de detecter l'IP locale. Specifiez -Ip <adresse>."
    exit 1
  }
}

if ($Ip -eq "127.0.0.1" -or $Ip -eq "localhost") {
  Write-Warning "L'IP 127.0.0.1/localhost n'est PAS accessible depuis un device/emulateur Android. Utilisez l'IP reseau local."
}

$baseUrl = "http://${Ip}:${Port}"
Write-Host "      IP backend : $Ip" -ForegroundColor Green
Write-Host "      URL backend: $baseUrl" -ForegroundColor Green

# --- 2. Variables d'env pour le build Vite ---
$env:VITE_MODE_APP = $Mode
$env:VITE_API_BASE_URL = $baseUrl
Write-Host "[2/4] VITE_API_BASE_URL=$baseUrl | VITE_MODE_APP=$Mode" -ForegroundColor Cyan

# --- 3. Build Vite ---
Write-Host "[3/4] Build Vite (npm run build)..." -ForegroundColor Cyan
& npm.cmd run build
if ($LASTEXITCODE -ne 0) {
  Write-Error "Echec du build Vite (code $LASTEXITCODE)."
  exit $LASTEXITCODE
}

# --- 4. Capacitor sync ---
Write-Host "[4/4] Capacitor sync android..." -ForegroundColor Cyan
& npx.cmd cap sync android
if ($LASTEXITCODE -ne 0) {
  Write-Error "Echec de 'cap sync android' (code $LASTEXITCODE)."
  exit $LASTEXITCODE
}

# --- 5. Ouverture Android Studio ---
if ($SkipOpen) {
  Write-Host "Skip: ouverture Android Studio ignoree (-SkipOpen)." -ForegroundColor Yellow
} else {
  Write-Host "Ouverture d'Android Studio..." -ForegroundColor Cyan
  & npx.cmd cap open android
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "'cap open android' a retourne $LASTEXITCODE. Ouverture manuelle de fallback..."
    $studioPaths = @(
      "C:\Program Files\Android\Android Studio\bin\studio64.exe",
      "C:\Program Files\Android\Android Studio\bin\studio.exe",
      "${env:LOCALAPPDATA}\Programs\Android Studio\bin\studio64.exe"
    )
    $opened = $false
    foreach ($p in $studioPaths) {
      if (Test-Path $p) {
        Start-Process -FilePath $p -ArgumentList "`"$projectRoot\android`""
        $opened = $true
        break
      }
    }
    if (-not $opened) {
      Write-Warning "Android Studio introuvable. Ouvrez manuellement le dossier: $projectRoot\android"
    }
  }
}

Write-Host "`nTermine. Backend: $baseUrl" -ForegroundColor Green
Write-Host "Pensez a lancer le backend sur le port $Port et a connecter le device/emulateur au meme reseau Wi-Fi." -ForegroundColor Yellow
