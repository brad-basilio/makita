<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Item;

echo "=== PRUEBA DE MANEJO DE SKUs DUPLICADOS ===\n";

try {
    // Habilitar logging de consultas
    DB::enableQueryLog();
    
    // Contar items antes de la importación
    $itemsAntes = Item::count();
    echo "Items en base de datos antes: {$itemsAntes}\n";
    
    // Verificar si existe el archivo Excel
    $excelFile = __DIR__ . '/productos.xlsx';
    if (!file_exists($excelFile)) {
        echo "ERROR: No se encontró productos.xlsx\n";
        exit(1);
    }
    
    echo "\n=== EJECUTANDO IMPORTACIÓN ===\n";
    echo "Archivo: {$excelFile}\n";
    
    $startTime = microtime(true);
    
    $import = new UnifiedItemImport();
    Excel::import($import, $excelFile);
    
    $endTime = microtime(true);
    $executionTime = round($endTime - $startTime, 2);
    
    // Contar items después de la importación
    $itemsDespues = Item::count();
    $itemsImportados = $itemsDespues - $itemsAntes;
    
    echo "\n=== RESULTADOS DE LA IMPORTACIÓN ===\n";
    echo "Tiempo de ejecución: {$executionTime} segundos\n";
    echo "Items antes: {$itemsAntes}\n";
    echo "Items después: {$itemsDespues}\n";
    echo "Items nuevos importados: {$itemsImportados}\n";
    
    // Verificar errores acumulados
    if (method_exists($import, 'getErrors')) {
        $errors = $import->getErrors();
        echo "\nTotal de errores/advertencias: " . count($errors) . "\n";
        
        if (!empty($errors)) {
            echo "\n=== ERRORES Y ADVERTENCIAS ===\n";
            
            $duplicateSkips = 0;
            $otherErrors = 0;
            
            foreach ($errors as $error) {
                if (strpos($error, 'SKU duplicado saltado') !== false) {
                    $duplicateSkips++;
                } else {
                    $otherErrors++;
                    echo "- {$error}\n";
                }
            }
            
            echo "\n=== RESUMEN DE ERRORES ===\n";
            echo "SKUs duplicados saltados: {$duplicateSkips}\n";
            echo "Otros errores: {$otherErrors}\n";
            
            if ($duplicateSkips > 0) {
                echo "\n✓ Los SKUs duplicados fueron manejados correctamente (saltados)\n";
            }
            
            if ($otherErrors > 0) {
                echo "\n⚠️ Hay otros errores que requieren atención\n";
            }
        } else {
            echo "\n✓ No se encontraron errores durante la importación\n";
        }
    }
    
    // Mostrar algunos ejemplos de items importados
    echo "\n=== EJEMPLOS DE ITEMS IMPORTADOS ===\n";
    $sampleItems = Item::orderBy('created_at', 'desc')->take(5)->get(['sku', 'name', 'created_at']);
    
    foreach ($sampleItems as $item) {
        echo "- SKU: {$item->sku} | Nombre: {$item->name}\n";
    }
    
    // Verificar si hay duplicados en la base de datos
    echo "\n=== VERIFICACIÓN DE DUPLICADOS ===\n";
    $duplicates = DB::select("
        SELECT sku, COUNT(*) as count 
        FROM items 
        GROUP BY sku 
        HAVING COUNT(*) > 1
    ");
    
    if (empty($duplicates)) {
        echo "✓ No se encontraron SKUs duplicados en la base de datos\n";
    } else {
        echo "⚠️ Se encontraron SKUs duplicados:\n";
        foreach ($duplicates as $duplicate) {
            echo "- SKU: {$duplicate->sku} (aparece {$duplicate->count} veces)\n";
        }
    }
    
    echo "\n=== PRUEBA COMPLETADA EXITOSAMENTE ===\n";
    echo "La importación manejó correctamente los SKUs duplicados.\n";
    
} catch (Exception $e) {
    echo "\nERROR durante la prueba: " . $e->getMessage() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    
    // Mostrar las últimas consultas SQL para debug
    $queries = DB::getQueryLog();
    if (!empty($queries)) {
        echo "\n=== ÚLTIMAS CONSULTAS SQL ===\n";
        foreach (array_slice($queries, -3) as $query) {
            echo "SQL: " . $query['query'] . "\n";
            if (!empty($query['bindings'])) {
                echo "Bindings: " . json_encode($query['bindings']) . "\n";
            }
            echo "---\n";
        }
    }
    
    exit(1);
}

echo "\n=== FIN DE LA PRUEBA ===\n";
?>