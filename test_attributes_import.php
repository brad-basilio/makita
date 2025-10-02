<?php

/**
 * Script de prueba para verificar la importación de atributos
 * Ejecutar con: php test_attributes_import.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

// Simular una fila de datos con atributos
$testRow = [
    'sku' => 'TEST-ATTR-001',
    'nombre_producto' => 'Producto con Atributos',
    'categoria' => 'Categoría Test',
    'precio' => 100,
    'Atributo' => 'Color, Talla, Material',
    'Valor del atributo' => 'Rojo, M, Acero Inoxidable',
];

echo "=== TEST DE IMPORTACIÓN DE ATRIBUTOS ===\n\n";
echo "Datos de prueba:\n";
print_r($testRow);
echo "\n";

// Crear importador
$importer = new UnifiedItemImport(['truncate' => false]);

// Obtener los mapeos de campos
$mappings = $importer->getFieldMappings();
echo "Mapeos configurados para 'atributo':\n";
print_r($mappings['atributo'] ?? []);
echo "\n";
echo "Mapeos configurados para 'valor_atributo':\n";
print_r($mappings['valor_atributo'] ?? []);
echo "\n";

echo "Columnas en la fila de prueba:\n";
print_r(array_keys($testRow));
echo "\n";

// Verificar si se encuentran los campos
$reflection = new ReflectionClass($importer);
$hasFieldMethod = $reflection->getMethod('hasField');
$hasFieldMethod->setAccessible(true);

$hasAtributo = $hasFieldMethod->invoke($importer, $testRow, 'atributo');
$hasValor = $hasFieldMethod->invoke($importer, $testRow, 'valor_atributo');

echo "¿Se encuentra campo 'atributo'? " . ($hasAtributo ? 'SÍ' : 'NO') . "\n";
echo "¿Se encuentra campo 'valor_atributo'? " . ($hasValor ? 'SÍ' : 'NO') . "\n\n";

// Obtener valores
$getFieldMethod = $reflection->getMethod('getFieldValue');
$getFieldMethod->setAccessible(true);

$atributos = $getFieldMethod->invoke($importer, $testRow, 'atributo');
$valores = $getFieldMethod->invoke($importer, $testRow, 'valor_atributo');

echo "Valor de atributos: '{$atributos}'\n";
echo "Valor de valores: '{$valores}'\n\n";

if ($atributos && $valores) {
    $atributosArray = array_map('trim', explode(',', $atributos));
    $valoresArray = array_map('trim', explode(',', $valores));
    
    echo "Atributos separados:\n";
    print_r($atributosArray);
    echo "\n";
    
    echo "Valores separados:\n";
    print_r($valoresArray);
    echo "\n";
    
    echo "Pares atributo-valor:\n";
    foreach ($atributosArray as $index => $attr) {
        echo "  - {$attr}: {$valoresArray[$index]}\n";
    }
}

echo "\n=== FIN DEL TEST ===\n";
