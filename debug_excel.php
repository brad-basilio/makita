<?php

require_once 'vendor/autoload.php';

use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

// Configurar Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== DEBUG EXCEL CONTENT ===\n";

try {
    $filePath = 'productos.xlsx';
    
    if (!file_exists($filePath)) {
        echo "ERROR: Archivo no encontrado: $filePath\n";
        exit(1);
    }
    
    echo "Archivo encontrado: $filePath\n";
    echo "Tamaño del archivo: " . filesize($filePath) . " bytes\n\n";
    
    // Leer el Excel usando Laravel Excel
    $data = Excel::toArray([], $filePath);
    
    if (empty($data) || empty($data[0])) {
        echo "ERROR: No se pudo leer el contenido del Excel\n";
        exit(1);
    }
    
    $sheet = $data[0]; // Primera hoja
    
    echo "Número de filas en la hoja: " . count($sheet) . "\n\n";
    
    // Mostrar encabezados (primera fila)
    if (!empty($sheet[0])) {
        echo "=== ENCABEZADOS (Fila 1) ===\n";
        foreach ($sheet[0] as $index => $header) {
            echo "Columna $index: '$header'\n";
        }
        echo "\n";
    }
    
    // Mostrar las primeras 3 filas de datos
    echo "=== PRIMERAS 3 FILAS DE DATOS ===\n";
    for ($i = 0; $i < min(4, count($sheet)); $i++) {
        echo "Fila $i:\n";
        if (!empty($sheet[$i])) {
            foreach ($sheet[$i] as $index => $value) {
                $displayValue = is_null($value) ? 'NULL' : (is_string($value) ? "'$value'" : $value);
                echo "  [$index] = $displayValue\n";
            }
        }
        echo "\n";
    }
    
    // Buscar columnas que podrían ser precio
    echo "=== ANÁLISIS DE COLUMNAS DE PRECIO ===\n";
    if (!empty($sheet[0])) {
        $priceColumns = [];
        foreach ($sheet[0] as $index => $header) {
            $headerLower = strtolower(trim($header));
            if (strpos($headerLower, 'precio') !== false || 
                strpos($headerLower, 'price') !== false ||
                strpos($headerLower, 'costo') !== false ||
                strpos($headerLower, 'valor') !== false) {
                $priceColumns[] = $index;
                echo "Posible columna de precio encontrada: Columna $index = '$header'\n";
            }
        }
        
        if (empty($priceColumns)) {
            echo "NO se encontraron columnas que parezcan contener precios\n";
            echo "Esto explica por qué el campo 'price' es NULL en la base de datos\n";
        }
    }
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
    exit(1);
}

echo "\n=== FIN DEBUG ===\n";