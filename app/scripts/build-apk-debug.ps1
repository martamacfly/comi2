# Comi2 — genera APK debug (Windows).
# Requiere: Node, Android SDK (local.properties), Android Studio JBR (Java 21).
# Documentación: docs/guias/android-apk.md

$ErrorActionPreference = "Stop"
$appRoot = Split-Path $PSScriptRoot -Parent
$jbr = "C:\Program Files\Android\Android Studio\jbr"

if (-not (Test-Path "$appRoot\android\local.properties")) {
  Write-Error "Falta android\local.properties. Copia android\local.properties.example y define sdk.dir."
}

if (-not (Test-Path "$jbr\bin\java.exe")) {
  Write-Error "No se encuentra Java 21 en: $jbr. Instala Android Studio o define JAVA_HOME a JDK 21."
}

$env:JAVA_HOME = $jbr
Set-Location $appRoot

Write-Host ">> npm run cap:sync"
npm run cap:sync
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host ">> gradlew assembleDebug"
Set-Location android
.\gradlew.bat assembleDebug
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$apk = "app\build\outputs\apk\debug\app-debug.apk"
$releases = Join-Path (Split-Path $appRoot -Parent) "releases"
New-Item -ItemType Directory -Force -Path $releases | Out-Null
$dest = Join-Path $releases "comi2.apk"
Copy-Item -Force $apk $dest
Write-Host ""
Write-Host "APK lista: $(Resolve-Path $dest)"
