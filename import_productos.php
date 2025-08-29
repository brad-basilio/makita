<?php

require_once 'vendor/autoload.php';

// Configurar Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "=== IMPORTACIÓN DE PRODUCTOS DESDE productos.xlsx ===\n\n";

try {
    $filePath = 'productos.xlsx';
    
    if (!file_exists($filePath)) {
        echo "ERROR: No se encontró el archivo productos.xlsx\n";
        exit(1);
    }
    
    echo "Archivo encontrado: $filePath\n";
    echo "Iniciando importación...\n\n";
    
    // Habilitar logging de consultas SQL
    DB::enableQueryLog();
    
    // Crear instancia del importador
    $importer = new UnifiedItemImport();
    
    // Contar registros antes de la importación
    $itemsBefore = DB::table('items')->count();
    $specsBefore = DB::table('item_specifications')->count();
    
    echo "Registros antes de la importación:\n";
    echo "- Items: $itemsBefore\n";
    echo "- Especificaciones: $specsBefore\n\n";
    
    // Realizar la importación
    $startTime = microtime(true);
    
    Excel::import($importer, $filePath);
    
    $endTime = microtime(true);
    $executionTime = round($endTime - $startTime, 2);
    
    // Contar registros después de la importación
    $itemsAfter = DB::table('items')->count();
    $specsAfter = DB::table('item_specifications')->count();
    
    echo "\n=== RESULTADOS DE LA IMPORTACIÓN ===\n";
    echo "Tiempo de ejecución: {$executionTime} segundos\n\n";
    
    echo "Registros después de la importación:\n";
    echo "- Items: $itemsAfter (" . ($itemsAfter - $itemsBefore) . " nuevos)\n";
    echo "- Especificaciones: $specsAfter (" . ($specsAfter - $specsBefore) . " nuevas)\n\n";
    
    // Verificar errores acumulados
    if (method_exists($importer, 'getErrors')) {
        $errors = $importer->getErrors();
        
        if (!empty($errors)) {
            echo "=== ERRORES ENCONTRADOS ===\n";
            foreach ($errors as $index => $error) {
                echo "Error " . ($index + 1) . ": $error\n";
            }
            echo "\nTotal de errores: " . count($errors) . "\n\n";
        } else {
            echo "✓ No se encontraron errores durante la importación\n\n";
        }
    } else {
        echo "✓ Importación completada (método de verificación de errores no disponible)\n\n";
    }
    
    // Mostrar algunas consultas SQL ejecutadas
    $queries = DB::getQueryLog();
    echo "=== CONSULTAS SQL EJECUTADAS ===\n";
    echo "Total de consultas: " . count($queries) . "\n";
    
    if (count($queries) > 0) {
        echo "\nÚltimas 3 consultas:\n";
        $lastQueries = array_slice($queries, -3);
        foreach ($lastQueries as $index => $query) {
            echo "" . ($index + 1) . ". " . $query['query'] . "\n";
            if (!empty($query['bindings'])) {
                echo "   Parámetros: " . json_encode($query['bindings']) . "\n";
            }
            echo "   Tiempo: " . $query['time'] . "ms\n\n";
        }
    }
    
    // Verificar algunos productos importados
    echo "=== VERIFICACIÓN DE PRODUCTOS IMPORTADOS ===\n";
    $sampleProducts = DB::table('items')
        ->select('id', 'sku', 'name', 'category_id', 'created_at')
        ->orderBy('created_at', 'desc')
        ->limit(5)
        ->get();
    
    if ($sampleProducts->count() > 0) {
        echo "Últimos 5 productos importados:\n";
        foreach ($sampleProducts as $product) {
            echo "- SKU: {$product->sku} | Nombre: " . substr($product->name, 0, 50) . "...\n";
        }
    } else {
        echo "No se encontraron productos recientes.\n";
    }
    
    echo "\n=== VERIFICACIÓN DE ESPECIFICACIONES ===\n";
    $sampleSpecs = DB::table('item_specifications')
        ->join('items', 'item_specifications.item_id', '=', 'items.id')
        ->select('items.sku', 'item_specifications.type', 'item_specifications.title', 'item_specifications.description')
        ->orderBy('item_specifications.created_at', 'desc')
        ->limit(5)
        ->get();
    
    if ($sampleSpecs->count() > 0) {
        echo "Últimas 5 especificaciones importadas:\n";
        foreach ($sampleSpecs as $spec) {
            echo "- SKU: {$spec->sku} | Tipo: {$spec->type} | Título: {$spec->title}\n";
        }
    } else {
        echo "No se encontraron especificaciones recientes.\n";
    }
    
    echo "\n=== IMPORTACIÓN COMPLETADA EXITOSAMENTE ===\n";
    
} catch (Exception $e) {
    echo "\nERROR durante la importación: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
    echo "\nTrace:\n" . $e->getTraceAsString() . "\n";
    
    // Mostrar consultas SQL si hay error
    $queries = DB::getQueryLog();
    if (count($queries) > 0) {
        echo "\n=== ÚLTIMAS CONSULTAS SQL ANTES DEL ERROR ===\n";
        $lastQueries = array_slice($queries, -3);
        foreach ($lastQueries as $index => $query) {
            echo "" . ($index + 1) . ". " . $query['query'] . "\n";
            if (!empty($query['bindings'])) {
                echo "   Parámetros: " . json_encode($query['bindings']) . "\n";
            }
        }
    }
}

echo "\n=== FIN DE LA IMPORTACIÓN ===\n";
?>