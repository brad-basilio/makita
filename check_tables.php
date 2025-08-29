<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Platform;
use App\Models\Family;
use App\Models\Application;
use Illuminate\Support\Facades\Schema;

echo "Verificando existencia de tablas...\n";

// Verificar Platform
try {
    $count = Platform::count();
    echo "✅ Platform: OK (registros: $count)\n";
} catch (Exception $e) {
    echo "❌ Platform: ERROR - " . $e->getMessage() . "\n";
    
    // Verificar si la tabla existe
    if (Schema::hasTable('platforms')) {
        echo "   - Tabla 'platforms' existe\n";
    } else {
        echo "   - Tabla 'platforms' NO existe\n";
    }
}

// Verificar Family
try {
    $count = Family::count();
    echo "✅ Family: OK (registros: $count)\n";
} catch (Exception $e) {
    echo "❌ Family: ERROR - " . $e->getMessage() . "\n";
    
    // Verificar si la tabla existe
    if (Schema::hasTable('families')) {
        echo "   - Tabla 'families' existe\n";
    } else {
        echo "   - Tabla 'families' NO existe\n";
    }
}

// Verificar Application
try {
    $count = Application::count();
    echo "✅ Application: OK (registros: $count)\n";
} catch (Exception $e) {
    echo "❌ Application: ERROR - " . $e->getMessage() . "\n";
    
    // Verificar si la tabla existe
    if (Schema::hasTable('applications')) {
        echo "   - Tabla 'applications' existe\n";
    } else {
        echo "   - Tabla 'applications' NO existe\n";
    }
}

echo "\nVerificación completada.\n";