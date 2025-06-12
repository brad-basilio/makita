# 🚨 Script de Emergencia para Resolver Problema de Conexiones MySQL - Windows
# Este script aplica todas las optimizaciones necesarias

Write-Host "🚨 FIXING CRITICAL DATABASE CONNECTION ISSUE..." -ForegroundColor Red
Write-Host "================================================" -ForegroundColor Yellow

# 1. Limpiar cache de Laravel
Write-Host "🧹 Clearing Laravel cache..." -ForegroundColor Green
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 2. Ejecutar las migraciones de índices
Write-Host "📊 Adding database indexes..." -ForegroundColor Green
php artisan migrate --force

# 3. Ejecutar limpieza de sesiones duplicadas (dry-run primero)
Write-Host "🔍 Checking for duplicate sessions..." -ForegroundColor Green
php artisan sessions:clean-duplicates --dry-run

Write-Host ""
Write-Host "📋 NEXT STEPS:" -ForegroundColor Cyan
Write-Host "1. Review the duplicate sessions above"
Write-Host "2. If everything looks good, run: php artisan sessions:clean-duplicates"
Write-Host "3. Restart your web server"
Write-Host "4. Monitor your application logs"

Write-Host ""
Write-Host "🔧 ADDITIONAL OPTIMIZATIONS:" -ForegroundColor Cyan
Write-Host "Add these to your .env file:"
Write-Host "DB_PERSISTENT=false"
Write-Host "DB_TIMEOUT=30"
Write-Host "DB_POOL_MIN=1"
Write-Host "DB_POOL_MAX=10"
Write-Host "DB_WAIT_TIMEOUT=30"
Write-Host "DB_CONNECT_TIMEOUT=10"

Write-Host ""
Write-Host "✅ Emergency fixes applied!" -ForegroundColor Green
Write-Host "💡 Monitor your error logs to ensure the issue is resolved." -ForegroundColor Yellow
