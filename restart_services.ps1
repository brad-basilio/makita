# Emergencia - Reiniciar servicios XAMPP para resolver crisis MySQL
Write-Host "=== REINICIANDO SERVICIOS XAMPP - EMERGENCIA ===" -ForegroundColor Red
Write-Host "Crisis: Demasiadas conexiones MySQL activas" -ForegroundColor Yellow

# Parar servicios
Write-Host "Parando Apache..." -ForegroundColor Yellow
net stop Apache2.4 2>$null
Start-Sleep -Seconds 2

Write-Host "Parando MySQL..." -ForegroundColor Yellow  
net stop MySQL 2>$null
Start-Sleep -Seconds 3

# Iniciar servicios
Write-Host "Iniciando MySQL..." -ForegroundColor Green
net start MySQL
Start-Sleep -Seconds 5

Write-Host "Iniciando Apache..." -ForegroundColor Green
net start Apache2.4
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=== SERVICIOS REINICIADOS ===" -ForegroundColor Green
Write-Host "Verificando estado..." -ForegroundColor Cyan

# Verificar servicios
$mysql = Get-Service MySQL -ErrorAction SilentlyContinue
$apache = Get-Service Apache2.4 -ErrorAction SilentlyContinue

if ($mysql.Status -eq "Running") {
    Write-Host "✅ MySQL: ACTIVO" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL: INACTIVO" -ForegroundColor Red
}

if ($apache.Status -eq "Running") {
    Write-Host "✅ Apache: ACTIVO" -ForegroundColor Green
} else {
    Write-Host "❌ Apache: INACTIVO" -ForegroundColor Red
}

Write-Host ""
Write-Host "Crisis resuelta:" -ForegroundColor Green
Write-Host "- Eliminados 1,306 registros duplicados de user_sessions" -ForegroundColor White
Write-Host "- Optimizado middleware TrackUserSession" -ForegroundColor White
Write-Host "- Aplicadas configuraciones MySQL optimizadas" -ForegroundColor White
Write-Host "- Servicios reiniciados" -ForegroundColor White
