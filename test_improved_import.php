<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "=== Prueba de Importación Mejorada ===\n\n";

// Habilitar logging de SQL
DB::listen(function ($query) {
    echo "SQL: {$query->sql}\n";
    echo "Bindings: " . json_encode($query->bindings) . "\n";
    echo "Time: {$query->time}ms\n\n";
});

// Datos de prueba que incluyen casos problemáticos
$testData = [
    // Caso 1: SKU normal
    [
        'sku' => 'TEST_IMPROVED_001',
        'nombre_producto' => 'Producto de Prueba Mejorado 1',
        'categoria' => 'Herramientas Eléctricas',
        'subcategoria' => 'Taladros',
        'marca' => 'Makita',
        'precio' => 150.00,
        'descuento' => 15.00,
        'stock' => 10,
        'descripcion' => 'Descripción del producto de prueba',
        'color' => 'Azul',
        'plataforma' => 'LXT',
        'familia' => 'Taladros',
        'aplicaciones' => 'Construcción, Carpintería'
    ],
    // Caso 2: SKU duplicado (debería fallar controladamente)
    [
        'sku' => 'TEST_IMPROVED_001', // Mismo SKU
        'nombre_producto' => 'Producto Duplicado',
        'categoria' => 'Herramientas Eléctricas',
        'marca' => 'Makita',
        'precio' => 200.00
    ],
    // Caso 3: Nombre muy largo (debería fallar)
    [
        'sku' => 'TEST_LONG_NAME',
        'nombre_producto' => str_repeat('Producto con nombre extremadamente largo ', 20), // > 255 chars
        'categoria' => 'Herramientas Eléctricas',
        'marca' => 'Makita',
        'precio' => 100.00
    ],
    // Caso 4: SKU muy largo (debería fallar)
    [
        'sku' => str_repeat('VERY_LONG_SKU_', 20), // > 100 chars
        'nombre_producto' => 'Producto con SKU largo',
        'categoria' => 'Herramientas Eléctricas',
        'marca' => 'Makita',
        'precio' => 100.00
    ],
    // Caso 5: Descripción muy larga (debería truncarse)
    [
        'sku' => 'TEST_LONG_DESC',
        'nombre_producto' => 'Producto con descripción larga',
        'categoria' => 'Herramientas Eléctricas',
        'marca' => 'Makita',
        'precio' => 100.00,
        'descripcion' => str_repeat('Descripción muy larga. ', 3000) // > 65535 chars
    ]
];

$import = new UnifiedItemImport();

foreach ($testData as $index => $data) {
    echo "\n--- Procesando caso " . ($index + 1) . ": {$data['sku']} ---\n";
    
    try {
        $result = $import->model($data);
        
        if ($result) {
            echo "✅ Caso " . ($index + 1) . " procesado exitosamente: ID = {$result->id}\n";
        } else {
            echo "❌ Caso " . ($index + 1) . " falló (retornó null)\n";
        }
        
    } catch (Exception $e) {
        echo "❌ Caso " . ($index + 1) . " falló con excepción: {$e->getMessage()}\n";
    }
}

// Mostrar errores acumulados
echo "\n=== Errores Acumulados ===\n";
if (method_exists($import, 'getErrors')) {
    $errors = $import->getErrors();
    if (empty($errors)) {
        echo "No hay errores acumulados.\n";
    } else {
        foreach ($errors as $error) {
            echo "- $error\n";
        }
    }
} else {
    echo "Método getErrors() no disponible.\n";
}

echo "\n=== Prueba Completada ===\n";