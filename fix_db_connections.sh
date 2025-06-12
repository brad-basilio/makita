#!/bin/bash

# 🚨 Script de Emergencia para Resolver Problema de Conexiones MySQL
# Este script aplica todas las optimizaciones necesarias

echo "🚨 FIXING CRITICAL DATABASE CONNECTION ISSUE..."
echo "================================================"

# 1. Limpiar cache de Laravel
echo "🧹 Clearing Laravel cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# 2. Ejecutar las migraciones de índices
echo "📊 Adding database indexes..."
php artisan migrate --force

# 3. Ejecutar limpieza de sesiones duplicadas (dry-run primero)
echo "🔍 Checking for duplicate sessions..."
php artisan sessions:clean-duplicates --dry-run

echo ""
echo "📋 NEXT STEPS:"
echo "1. Review the duplicate sessions above"
echo "2. If everything looks good, run: php artisan sessions:clean-duplicates"
echo "3. Restart your web server"
echo "4. Monitor your application logs"

echo ""
echo "🔧 ADDITIONAL OPTIMIZATIONS:"
echo "Add these to your .env file:"
echo "DB_PERSISTENT=false"
echo "DB_TIMEOUT=30"
echo "DB_POOL_MIN=1"
echo "DB_POOL_MAX=10"
echo "DB_WAIT_TIMEOUT=30"
echo "DB_CONNECT_TIMEOUT=10"

echo ""
echo "✅ Emergency fixes applied!"
echo "💡 Monitor your error logs to ensure the issue is resolved."