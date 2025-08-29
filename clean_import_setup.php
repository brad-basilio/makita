<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;

echo "=== CONFIGURACIÓN PARA IMPORTACIÓN LIMPIA DE ITEMS ===\n";
echo "Este script limpiará las tablas relacionadas y ejecutará la importación.\n\n";

// Verificar si existe el archivo de Excel
$excelFile = __DIR__ . '/productos.xlsx';
if (!file_exists($excelFile)) {
    echo "ERROR: No se encontró el archivo productos.xlsx en el directorio raíz.\n";
    exit(1);
}

echo "Opciones disponibles:\n";
echo "1. Solo limpiar tablas\n";
echo "2. Limpiar tablas e importar datos\n";
echo "3. Solo importar datos (sin limpiar)\n";
echo "Selecciona una opción (1-3): ";

$handle = fopen("php://stdin", "r");
$option = trim(fgets($handle));
fclose($handle);

if (!in_array($option, ['1', '2', '3'])) {
    echo "Opción inválida. Saliendo...\n";
    exit(1);
}

try {
    if ($option === '1' || $option === '2') {
        echo "\n=== INICIANDO LIMPIEZA DE TABLAS ===\n";
        
        // Desactivar verificación de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        
        // Tablas en orden de dependencias (de más dependiente a menos dependiente)
        $tablesToClean = [
            'item_specifications' => 'Especificaciones de items',
            'item_images' => 'Imágenes de items', 
            'item_tags' => 'Tags de items',
            'combo_items' => 'Items en combos',
            'sale_details' => 'Detalles de ventas',
            'items' => 'Items principales'
        ];
        
        foreach ($tablesToClean as $table => $description) {
            if (Schema::hasTable($table)) {
                $count = DB::table($table)->count();
                echo "Limpiando {$description} ({$table}): {$count} registros...";
                DB::table($table)->truncate();
                echo " ✓ Completado\n";
            } else {
                echo "Tabla {$table} no existe, omitiendo...\n";
            }
        }
        
        // Reactivar verificación de claves foráneas
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
        
        echo "\n✓ LIMPIEZA COMPLETADA EXITOSAMENTE\n";
        
        // Verificar limpieza
        echo "\n=== VERIFICACIÓN DE LIMPIEZA ===\n";
        foreach (array_keys($tablesToClean) as $table) {
            if (Schema::hasTable($table)) {
                $count = DB::table($table)->count();
                echo "Registros en {$table}: {$count}\n";
            }
        }
    }
    
    if ($option === '2' || $option === '3') {
        echo "\n=== INICIANDO IMPORTACIÓN DE DATOS ===\n";
        echo "Archivo: {$excelFile}\n";
        
        // Habilitar logging de consultas para debug
        DB::enableQueryLog();
        
        $startTime = microtime(true);
        
        try {
            $import = new UnifiedItemImport();
            Excel::import($import, $excelFile);
            
            $endTime = microtime(true);
            $executionTime = round($endTime - $startTime, 2);
            
            echo "\n✓ IMPORTACIÓN COMPLETADA EXITOSAMENTE\n";
            echo "Tiempo de ejecución: {$executionTime} segundos\n";
            
            // Mostrar estadísticas de importación
            echo "\n=== ESTADÍSTICAS DE IMPORTACIÓN ===\n";
            $itemsCount = DB::table('items')->count();
            $specsCount = DB::table('item_specifications')->count();
            $imagesCount = DB::table('item_images')->count();
            
            echo "Items importados: {$itemsCount}\n";
            echo "Especificaciones creadas: {$specsCount}\n";
            echo "Imágenes procesadas: {$imagesCount}\n";
            
            // Verificar si hay errores acumulados
            if (method_exists($import, 'getErrors') && !empty($import->getErrors())) {
                echo "\n⚠️ ERRORES DURANTE LA IMPORTACIÓN:\n";
                foreach ($import->getErrors() as $error) {
                    echo "- {$error}\n";
                }
            }
            
        } catch (Exception $importError) {
            echo "\nERROR durante la importación: " . $importError->getMessage() . "\n";
            echo "Línea: " . $importError->getLine() . "\n";
            echo "Archivo: " . $importError->getFile() . "\n";
            
            // Mostrar las últimas consultas SQL para debug
            $queries = DB::getQueryLog();
            if (!empty($queries)) {
                echo "\n=== ÚLTIMAS CONSULTAS SQL ===\n";
                foreach (array_slice($queries, -5) as $query) {
                    echo "SQL: " . $query['query'] . "\n";
                    if (!empty($query['bindings'])) {
                        echo "Bindings: " . json_encode($query['bindings']) . "\n";
                    }
                    echo "---\n";
                }
            }
            
            throw $importError;
        }
    }
    
} catch (Exception $e) {
    echo "\nERROR GENERAL: " . $e->getMessage() . "\n";
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

echo "\n=== PROCESO COMPLETADO EXITOSAMENTE ===\n";
echo "La base de datos está lista para usar.\n";
?>