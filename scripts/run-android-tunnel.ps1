<#
.SYNOPSIS
  Build le frontend, sync Capacitor (Android) et lance Android Studio
  en exposant le backend local via un tunnel HTTPS (localtunnel).

.DESCRIPTION
  - Demarre un tunnel HTTPS vers http://localhost:3000 via localtunnel.
  - Recupere l'URL publique HTTPS (ex: https://foo-bar.loca.lt).
  - Definit VITE_API_BASE_URL=<url tunnel> pour le build Vite.
  - Lance `npm run build` -> dist/
  - Lance `npx cap sync android` pour copier dist/ dans le projet Android.
  - Lance `npx cap open android` pour ouvrir Android Studio.
  - Le tunnel reste actif en arriere-plan jusqu'a Ctrl+C.

  Avantages vs run-android.ps1 (IP locale) :
    - HTTPS natif -> pas de blocage cleartext Android 9+
    - Fonctionne sur n'importe quel reseau (Wi-Fi, 4G, etc.)
    - Le device n'a pas besoin d'etre sur le meme reseau que le PC.

.PARAMETER Port
  Port du backend local (defaut: 3000).

.PARAMETER Subdomain
  Sous-domaine localtunnel optionnel (ex: babynounu).

.PARAMETER SkipOpen
  Ne pas ouvrir Android Studio a la fin.

.EXAMPLE
  .\scripts\run-android-tunnel.ps1
  .\scripts\run-android-tunnel.ps1 -Port 3000
  .\scripts\run-android-tunnel.ps1 -Subdomain babynounu
#>

[CmdletBinding()]
param(
  [int]$Port = 3000,
  [string]$Subdomain,
  [switch]$SkipOpen
)

$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# --- 1. Demarrage du tunnel localtunnel ---
Write-Host "[1/5] Demarrage du tunnel HTTPS (localtunnel)..." -ForegroundColor Cyan

$tunnelOptions = @{ port = $Port }
if ($Subdomain) {
  $tunnelOptions.subdomain = $Subdomain
}

$tunnelJson = $tunnelOptions | ConvertTo-Json -Compress

# Lance le tunnel et recupere l'URL
$tunnelScript = @"
const lt = require('localtunnel');
const opts = $tunnelJson;
lt(opts).then(t => {
  console.log('TUNNEL_URL=' + t.url);
  process.stdin.resume();
  t.on('close', () => process.exit(0));
}).catch(e => {
  console.error('TUNNEL_ERROR=' + e.message);
  process.exit(1);
});
"@

$tunnelScriptFile = Join-Path $projectRoot "scripts\_tunnel.cjs"
[System.IO.File]::WriteAllText($tunnelScriptFile, $tunnelScript)

# Demarrer le tunnel en arriere-plan (depuis le projet pour trouver node_modules)
# Noms de fichiers uniques a chaque execution pour eviter les conflits de verrouillage
$sessionId = [System.Guid]::NewGuid().ToString("N").Substring(0,8)
$outFile = "$env:TEMP\babynounu-tunnel-out-$sessionId.txt"
$errFile = "$env:TEMP\babynounu-tunnel-err-$sessionId.txt"

$tunnelProcess = Start-Process -FilePath "node" -ArgumentList "`"$tunnelScriptFile`"" -WorkingDirectory $projectRoot -NoNewWindow -PassThru -RedirectStandardOutput $outFile -RedirectStandardError $errFile

# Attendre que l'URL soit disponible (jusqu'a 20s)
$tunnelUrl = $null
for ($i = 0; $i -lt 40; $i++) {
  Start-Sleep -Milliseconds 500
  $rawOut = $null
  $rawErr = $null
  try {
    $fs = [System.IO.File]::Open($outFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $sr = New-Object System.IO.StreamReader($fs)
    $rawOut = $sr.ReadToEnd()
    $sr.Close()
    $fs.Close()
  } catch { }
  if ($rawOut -and $rawOut -match "TUNNEL_URL=(\S+)") {
    $tunnelUrl = $matches[1].Trim()
    break
  }
  if ($rawOut -and $rawOut -match "TUNNEL_ERROR=") {
    Write-Error "Erreur tunnel: $rawOut"
    $tunnelProcess.Kill()
    exit 1
  }
  try {
    $fs = [System.IO.File]::Open($errFile, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read, [System.IO.FileShare]::ReadWrite)
    $sr = New-Object System.IO.StreamReader($fs)
    $rawErr = $sr.ReadToEnd()
    $sr.Close()
    $fs.Close()
  } catch { }
  if ($rawErr -and $rawErr -match "Error|TUNNEL_ERROR") {
    Write-Error "Erreur tunnel: $rawErr"
    $tunnelProcess.Kill()
    exit 1
  }
}

if (-not $tunnelUrl) {
  Write-Error "Impossible de demarrer le tunnel localtunnel."
  $tunnelProcess.Kill()
  exit 1
}

Write-Host "      Tunnel HTTPS: $tunnelUrl" -ForegroundColor Green
Write-Host "      (Le tunnel reste actif jusqu'a Ctrl+C)" -ForegroundColor DarkGray

# --- 2. Variables d'env pour le build Vite ---
$env:VITE_MODE_APP = "dev"
$env:VITE_API_BASE_URL = $tunnelUrl
Write-Host "[2/5] VITE_API_BASE_URL=$tunnelUrl | VITE_MODE_APP=dev" -ForegroundColor Cyan

# --- 3. Build Vite ---
Write-Host "[3/5] Build Vite (npm run build)..." -ForegroundColor Cyan
& npm.cmd run build
if ($LASTEXITCODE -ne 0) {
  Write-Error "Echec du build Vite (code $LASTEXITCODE)."
  $tunnelProcess.Kill()
  exit $LASTEXITCODE
}

# --- 4. Capacitor sync ---
Write-Host "[4/5] Capacitor sync android..." -ForegroundColor Cyan
& npx.cmd cap sync android
if ($LASTEXITCODE -ne 0) {
  Write-Error "Echec de 'cap sync android' (code $LASTEXITCODE)."
  $tunnelProcess.Kill()
  exit $LASTEXITCODE
}

# --- 5. Ouverture Android Studio ---
if ($SkipOpen) {
  Write-Host "Skip: ouverture Android Studio ignoree (-SkipOpen)." -ForegroundColor Yellow
} else {
  Write-Host "[5/5] Ouverture d'Android Studio..." -ForegroundColor Cyan
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
      Write-Warning "Android Studio introuvable. Ouvrez manuellement: $projectRoot\android"
    }
  }
}

Write-Host "`nTermine. Backend tunnel: $tunnelUrl" -ForegroundColor Green
Write-Host "Le tunnel reste actif. Appuyez sur Ctrl+C pour le fermer." -ForegroundColor Yellow
Write-Host "Pensez a lancer le backend sur le port $Port." -ForegroundColor Yellow

# Garder le script actif pour que le tunnel reste ouvert
try {
  Write-Host "`n[Tunnel actif] Ctrl+C pour arreter..." -ForegroundColor DarkGray
  while ($true) {
    Start-Sleep -Seconds 1
    if ($tunnelProcess.HasExited) {
      Write-Warning "Le tunnel s'est arrete inopinement."
      break
    }
  }
} finally {
  if (-not $tunnelProcess.HasExited) {
    Write-Host "Fermeture du tunnel..." -ForegroundColor Cyan
    $tunnelProcess.Kill()
  }
  Remove-Item $tunnelScriptFile -ErrorAction SilentlyContinue
  Remove-Item $outFile -ErrorAction SilentlyContinue
  Remove-Item $errFile -ErrorAction SilentlyContinue
}
