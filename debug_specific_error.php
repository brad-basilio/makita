<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "Iniciando debug de errores específicos...\n";

// Habilitar logging detallado de SQL
DB::listen(function ($query) {
    echo "SQL: " . $query->sql . "\n";
    if (!empty($query->bindings)) {
        echo "Bindings: " . json_encode($query->bindings) . "\n";
    }
    echo "Time: " . $query->time . "ms\n\n";
});

// Probar con los SKUs que están fallando según el error
$failingSKUs = ['AS001G', 'CE001G', 'CE003G', 'DBS180', 'DCL184', 'DCM501', 'DFN350', 'DHP487'];

foreach ($failingSKUs as $index => $sku) {
    echo str_repeat("=", 60) . "\n";
    echo "Probando SKU: $sku (" . ($index + 1) . "/" . count($failingSKUs) . ")\n";
    echo str_repeat("=", 60) . "\n";
    
    try {
        $import = new UnifiedItemImport(['truncate' => false]);
        
        // Simular datos que podrían estar causando problemas
        $testRow = [
            'sku' => $sku,
            'nombre_producto' => 'Producto Test ' . $sku,
            'descripcion' => 'Descripción para ' . $sku,
            'precio' => '100.00',
            'categoria' => 'Herramientas',
            'subcategoria' => 'Subcategoría Test',
            'marca' => 'Makita',
            'stock' => '10',
            // Agregar campos que podrían estar causando problemas
            'plataforma' => '18V',
            'familia' => 'LXT',
            'aplicaciones' => 'Construcción,Carpintería',
            'color' => 'Azul',
            'collection' => 'Profesional'
        ];
        
        echo "Datos de prueba: " . json_encode($testRow, JSON_PRETTY_PRINT) . "\n\n";
        
        $result = $import->model($testRow);
        
        if ($result) {
            echo "✅ SKU $sku procesado exitosamente: ID = {$result->id}\n";
        } else {
            echo "❌ SKU $sku falló\n";
            $errors = $import->getErrors();
            if (!empty($errors)) {
                echo "Errores encontrados:\n";
                foreach ($errors as $error) {
                    echo "- " . $error . "\n";
                }
            }
        }
        
    } catch (\Exception $e) {
        echo "❌ Excepción para SKU $sku: " . $e->getMessage() . "\n";
        echo "Archivo: " . $e->getFile() . " Línea: " . $e->getLine() . "\n";
        
        // Mostrar más detalles del error
        if ($e->getPrevious()) {
            echo "Error anterior: " . $e->getPrevious()->getMessage() . "\n";
        }
    }
    
    echo "\n";
    
    // Pausa pequeña entre pruebas
    usleep(100000); // 0.1 segundos
}

echo "Debug de errores específicos completado.\n";