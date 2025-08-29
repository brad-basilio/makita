<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

echo "=== SCRIPT PARA LIMPIAR TABLAS RELACIONADAS A ITEMS ===\n";
echo "Este script eliminará TODOS los datos de las tablas relacionadas a items.\n";
echo "¿Estás seguro de continuar? (y/N): ";

$handle = fopen("php://stdin", "r");
$confirmation = trim(fgets($handle));
fclose($handle);

if (strtolower($confirmation) !== 'y') {
    echo "Operación cancelada.\n";
    exit(1);
}

try {
    // Desactivar verificación de claves foráneas temporalmente
    DB::statement('SET FOREIGN_KEY_CHECKS=0');
    
    echo "\n=== INICIANDO LIMPIEZA DE TABLAS ===\n";
    
    // Lista de tablas relacionadas a items en orden de dependencias
    $tablesToTruncate = [
        'item_specifications',
        'item_images', 
        'item_tags',
        'combo_items',
        'sale_details',
        'items'
    ];
    
    foreach ($tablesToTruncate as $table) {
        if (Schema::hasTable($table)) {
            echo "Limpiando tabla: {$table}...";
            DB::table($table)->truncate();
            echo " ✓ Completado\n";
        } else {
            echo "Tabla {$table} no existe, omitiendo...\n";
        }
    }
    
    // Reactivar verificación de claves foráneas
    DB::statement('SET FOREIGN_KEY_CHECKS=1');
    
    echo "\n=== LIMPIEZA COMPLETADA EXITOSAMENTE ===\n";
    echo "Todas las tablas relacionadas a items han sido limpiadas.\n";
    echo "Ahora puedes ejecutar la importación sin conflictos.\n";
    
    // Mostrar conteo de registros para verificar
    echo "\n=== VERIFICACIÓN DE LIMPIEZA ===\n";
    foreach ($tablesToTruncate as $table) {
        if (Schema::hasTable($table)) {
            $count = DB::table($table)->count();
            echo "Registros en {$table}: {$count}\n";
        }
    }
    
} catch (Exception $e) {
    echo "\nERROR durante la limpieza: " . $e->getMessage() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    
    // Asegurar que las claves foráneas se reactiven
    try {
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    } catch (Exception $e2) {
        echo "Error al reactivar claves foráneas: " . $e2->getMessage() . "\n";
    }
    
    exit(1);
}

echo "\n=== SCRIPT COMPLETADO ===\n";
?>