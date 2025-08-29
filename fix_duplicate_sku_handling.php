<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Item;
use Illuminate\Support\Facades\DB;

echo "=== ANÁLISIS DEL PROBLEMA DE SKUs DUPLICADOS ===\n\n";

// 1. Verificar estado actual de la base de datos
echo "1. Estado actual de la base de datos:\n";
$totalItems = Item::count();
echo "   - Total de productos: {$totalItems}\n";

// 2. Verificar si hay duplicados reales en la base de datos
echo "\n2. Verificación de duplicados reales en BD:\n";
$duplicates = DB::select("
    SELECT sku, COUNT(*) as count 
    FROM items 
    GROUP BY sku 
    HAVING COUNT(*) > 1
");

if (empty($duplicates)) {
    echo "   ✅ No hay SKUs duplicados en la base de datos\n";
} else {
    echo "   ❌ Se encontraron SKUs duplicados:\n";
    foreach ($duplicates as $dup) {
        echo "      - SKU '{$dup->sku}': {$dup->count} veces\n";
    }
}

// 3. Simular importación para entender el problema
echo "\n3. Simulando importación desde modal:\n";

// Leer el archivo Excel para ver qué SKUs están duplicados
require_once 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;

try {
    $excelFile = 'productos.xlsx';
    if (!file_exists($excelFile)) {
        echo "   ❌ No se encontró el archivo productos.xlsx\n";
        exit(1);
    }
    
    $spreadsheet = IOFactory::load($excelFile);
    $worksheet = $spreadsheet->getActiveSheet();
    $rows = $worksheet->toArray();
    
    // Obtener headers
    $headers = array_shift($rows);
    $skuColumnIndex = null;
    
    // Encontrar la columna de SKU
    foreach ($headers as $index => $header) {
        if (strtolower(trim($header)) === 'sku') {
            $skuColumnIndex = $index;
            break;
        }
    }
    
    if ($skuColumnIndex === null) {
        echo "   ❌ No se encontró la columna SKU en el Excel\n";
        exit(1);
    }
    
    // Analizar SKUs en el Excel
    $excelSkus = [];
    $duplicatesInExcel = [];
    
    foreach ($rows as $rowIndex => $row) {
        if (empty($row[$skuColumnIndex])) continue;
        
        $sku = trim($row[$skuColumnIndex]);
        if (isset($excelSkus[$sku])) {
            $duplicatesInExcel[$sku] = ($duplicatesInExcel[$sku] ?? 1) + 1;
        } else {
            $excelSkus[$sku] = true;
        }
    }
    
    echo "   - Total SKUs únicos en Excel: " . count($excelSkus) . "\n";
    
    if (!empty($duplicatesInExcel)) {
        echo "   - SKUs duplicados en Excel:\n";
        foreach ($duplicatesInExcel as $sku => $count) {
            echo "      * {$sku}: {$count} veces\n";
        }
    } else {
        echo "   ✅ No hay SKUs duplicados en el Excel\n";
    }
    
    // Verificar cuáles SKUs del Excel ya existen en BD
    echo "\n4. SKUs del Excel que ya existen en BD:\n";
    $existingSkus = [];
    
    foreach (array_keys($excelSkus) as $sku) {
        $exists = Item::where('sku', $sku)->first();
        if ($exists) {
            $existingSkus[] = $sku;
        }
    }
    
    if (!empty($existingSkus)) {
        echo "   - SKUs que ya existen (serán saltados):\n";
        foreach ($existingSkus as $sku) {
            echo "      * {$sku}\n";
        }
        echo "   - Total: " . count($existingSkus) . " SKUs\n";
    } else {
        echo "   ✅ Ningún SKU del Excel existe en la BD\n";
    }
    
} catch (Exception $e) {
    echo "   ❌ Error al leer Excel: " . $e->getMessage() . "\n";
}

echo "\n=== EXPLICACIÓN DEL PROBLEMA ===\n";
echo "\nEl problema es que el código actual trata los SKUs duplicados como 'errores'\n";
echo "cuando en realidad deberían ser 'advertencias' o 'notificaciones'.\n";
echo "\nCuando importas desde el modal:\n";
echo "1. El sistema encuentra SKUs que ya existen en la BD\n";
echo "2. Los salta correctamente (no los duplica)\n";
echo "3. Pero los registra como 'errores' en el array \$errors\n";
echo "4. El controlador ve que hay errores y marca success=false\n";
echo "\nCuando importas directamente por scripts:\n";
echo "1. Usas truncate=true (limpia la BD primero)\n";
echo "2. No hay SKUs existentes, por lo que no hay 'duplicados'\n";
echo "3. No se generan errores\n";

echo "\n=== SOLUCIÓN PROPUESTA ===\n";
echo "\nSe debe modificar UnifiedItemImport.php para:\n";
echo "1. Separar 'errores' de 'advertencias/notificaciones'\n";
echo "2. Los SKUs duplicados van a 'warnings' no a 'errors'\n";
echo "3. Solo marcar success=false si hay errores reales\n";
echo "4. Permitir success=true con warnings\n";

echo "\n=== IMPLEMENTANDO SOLUCIÓN ===\n";
echo "La solución se implementará en el siguiente paso...\n";

?>