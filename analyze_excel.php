<?php

require_once 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Shared\Date;

echo "=== ANÁLISIS DEL ARCHIVO productos.xlsx ===\n\n";

try {
    $filePath = 'productos.xlsx';
    
    if (!file_exists($filePath)) {
        echo "ERROR: No se encontró el archivo productos.xlsx\n";
        exit(1);
    }
    
    echo "Archivo encontrado: $filePath\n";
    echo "Tamaño del archivo: " . number_format(filesize($filePath) / 1024, 2) . " KB\n\n";
    
    // Cargar el archivo Excel
    $spreadsheet = IOFactory::load($filePath);
    $worksheet = $spreadsheet->getActiveSheet();
    
    // Obtener información básica
    $highestRow = $worksheet->getHighestRow();
    $highestColumn = $worksheet->getHighestColumn();
    $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
    
    echo "=== INFORMACIÓN GENERAL ===\n";
    echo "Número de filas: $highestRow\n";
    echo "Número de columnas: $highestColumnIndex ($highestColumn)\n\n";
    
    // Leer encabezados (primera fila)
    echo "=== ENCABEZADOS (Fila 1) ===\n";
    $headers = [];
    for ($col = 1; $col <= $highestColumnIndex; $col++) {
        $cellValue = $worksheet->getCellByColumnAndRow($col, 1)->getCalculatedValue();
        $headers[$col] = $cellValue;
        echo "Columna $col: '$cellValue'\n";
    }
    echo "\n";
    
    // Mostrar algunas filas de ejemplo
    echo "=== PRIMERAS 5 FILAS DE DATOS ===\n";
    $maxRowsToShow = min(6, $highestRow); // Mostrar hasta 5 filas de datos (fila 2-6)
    
    for ($row = 2; $row <= $maxRowsToShow; $row++) {
        echo "--- Fila $row ---\n";
        for ($col = 1; $col <= $highestColumnIndex; $col++) {
            $cellValue = $worksheet->getCellByColumnAndRow($col, $row)->getCalculatedValue();
            $header = $headers[$col] ?? "Col$col";
            echo "  $header: '$cellValue'\n";
        }
        echo "\n";
    }
    
    // Análisis de datos
    echo "=== ANÁLISIS DE CONTENIDO ===\n";
    
    // Contar filas no vacías
    $nonEmptyRows = 0;
    for ($row = 2; $row <= $highestRow; $row++) {
        $isEmpty = true;
        for ($col = 1; $col <= $highestColumnIndex; $col++) {
            $cellValue = trim($worksheet->getCellByColumnAndRow($col, $row)->getCalculatedValue());
            if (!empty($cellValue)) {
                $isEmpty = false;
                break;
            }
        }
        if (!$isEmpty) {
            $nonEmptyRows++;
        }
    }
    
    echo "Filas con datos: $nonEmptyRows\n";
    echo "Filas vacías: " . ($highestRow - 1 - $nonEmptyRows) . "\n\n";
    
    // Verificar columnas importantes para la importación
    echo "=== VERIFICACIÓN DE COLUMNAS CLAVE ===\n";
    $keyColumns = [
        'sku' => ['sku', 'codigo', 'code', 'item_code'],
        'name' => ['name', 'nombre', 'producto', 'item_name'],
        'price' => ['price', 'precio', 'cost', 'costo'],
        'category' => ['category', 'categoria', 'cat'],
        'brand' => ['brand', 'marca', 'fabricante'],
        'description' => ['description', 'descripcion', 'desc']
    ];
    
    foreach ($keyColumns as $key => $possibleNames) {
        $found = false;
        foreach ($headers as $colIndex => $header) {
            $headerLower = strtolower(trim($header));
            foreach ($possibleNames as $possible) {
                if (strpos($headerLower, strtolower($possible)) !== false) {
                    echo "✓ $key encontrado en columna $colIndex: '$header'\n";
                    $found = true;
                    break 2;
                }
            }
        }
        if (!$found) {
            echo "✗ $key NO encontrado\n";
        }
    }
    
    echo "\n=== MUESTRA DE DATOS POR COLUMNA ===\n";
    
    // Mostrar muestra de datos únicos por columna
    for ($col = 1; $col <= min(10, $highestColumnIndex); $col++) {
        $header = $headers[$col] ?? "Columna $col";
        echo "\n--- $header ---\n";
        
        $uniqueValues = [];
        $sampleCount = 0;
        
        for ($row = 2; $row <= $highestRow && $sampleCount < 5; $row++) {
            $cellValue = trim($worksheet->getCellByColumnAndRow($col, $row)->getCalculatedValue());
            if (!empty($cellValue) && !in_array($cellValue, $uniqueValues)) {
                $uniqueValues[] = $cellValue;
                echo "  - '$cellValue'\n";
                $sampleCount++;
            }
        }
        
        if (empty($uniqueValues)) {
            echo "  (Sin datos)\n";
        }
    }
    
    echo "\n=== RESUMEN FINAL ===\n";
    echo "El archivo productos.xlsx contiene $nonEmptyRows filas de datos válidos.\n";
    echo "Estructura: $highestColumnIndex columnas x $highestRow filas (incluyendo encabezados).\n";
    echo "\nArchivo listo para importación.\n";
    
} catch (Exception $e) {
    echo "ERROR al analizar el archivo: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

echo "\n=== FIN DEL ANÁLISIS ===\n";
?>