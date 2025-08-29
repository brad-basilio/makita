<?php

require_once 'vendor/autoload.php';

// Configurar Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== VERIFICACIÓN DE ESPECIFICACIONES TÉCNICAS ===\n\n";

try {
    // Obtener productos con especificaciones técnicas
    $technicalSpecs = DB::table('item_specifications')
        ->join('items', 'item_specifications.item_id', '=', 'items.id')
        ->where('item_specifications.type', 'technical')
        ->select('items.sku', 'item_specifications.title', 'item_specifications.description')
        ->orderBy('items.sku')
        ->get();
    
    echo "📊 ESTADÍSTICAS:\n";
    echo "- Total de especificaciones técnicas: {$technicalSpecs->count()}\n\n";
    
    if ($technicalSpecs->count() > 0) {
        echo "🔧 ESPECIFICACIONES TÉCNICAS POR PRODUCTO:\n\n";
        
        $currentSku = '';
        $productCount = 0;
        
        foreach ($technicalSpecs as $spec) {
            if ($currentSku !== $spec->sku) {
                if ($currentSku !== '') {
                    echo "\n";
                }
                $currentSku = $spec->sku;
                $productCount++;
                echo "📦 SKU: {$spec->sku}\n";
            }
            
            echo "   • {$spec->title}: {$spec->description}\n";
        }
        
        echo "\n📈 RESUMEN:\n";
        echo "- Productos con especificaciones técnicas: {$productCount}\n";
        echo "- Promedio de especificaciones por producto: " . round($technicalSpecs->count() / $productCount, 2) . "\n\n";
        
        // Verificar formato correcto (clave:valor)
        echo "🔍 VERIFICACIÓN DE FORMATO:\n";
        $correctFormat = 0;
        $incorrectFormat = 0;
        
        foreach ($technicalSpecs as $spec) {
            // Verificar si la especificación tiene formato correcto
            if (!empty($spec->title) && !empty($spec->description) && $spec->title !== $spec->description) {
                $correctFormat++;
            } else {
                $incorrectFormat++;
                echo "⚠️ Formato incorrecto en SKU {$spec->sku}: '{$spec->title}' -> '{$spec->description}'\n";
            }
        }
        
        echo "✅ Especificaciones con formato correcto: {$correctFormat}\n";
        echo "❌ Especificaciones con formato incorrecto: {$incorrectFormat}\n\n";
        
        if ($incorrectFormat == 0) {
            echo "🎉 ¡PERFECTO! Todas las especificaciones técnicas tienen el formato correcto 'clave:valor'\n";
        } else {
            echo "⚠️ Hay especificaciones que necesitan revisión\n";
        }
        
    } else {
        echo "❌ No se encontraron especificaciones técnicas en la base de datos\n";
        echo "\n🔍 DIAGNÓSTICO:\n";
        
        // Verificar si hay especificaciones de otros tipos
        $allSpecs = DB::table('item_specifications')
            ->select('type', DB::raw('count(*) as total'))
            ->groupBy('type')
            ->get();
        
        if ($allSpecs->count() > 0) {
            echo "Especificaciones encontradas por tipo:\n";
            foreach ($allSpecs as $spec) {
                echo "- Tipo '{$spec->type}': {$spec->total} especificaciones\n";
            }
        } else {
            echo "No se encontraron especificaciones de ningún tipo\n";
        }
    }
    
    // Verificar productos que deberían tener especificaciones técnicas
    echo "\n🔎 PRODUCTOS CON DATOS TÉCNICOS EN EXCEL:\n";
    
    // Simular lectura del Excel para ver qué productos tienen especificaciones técnicas
    $excelFile = 'productos.xlsx';
    if (file_exists($excelFile)) {
        require_once 'vendor/autoload.php';
        
        $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader('Xlsx');
        $spreadsheet = $reader->load($excelFile);
        $worksheet = $spreadsheet->getActiveSheet();
        $highestRow = $worksheet->getHighestRow();
        
        $productsWithTechnicalSpecs = 0;
        
        for ($row = 2; $row <= $highestRow; $row++) {
            $sku = $worksheet->getCell('B' . $row)->getValue();
            $technicalSpecs = $worksheet->getCell('J' . $row)->getValue();
            
            if (!empty($technicalSpecs) && !empty($sku)) {
                $productsWithTechnicalSpecs++;
                
                // Verificar si este SKU tiene especificaciones técnicas en la BD
                $dbSpecs = DB::table('item_specifications')
                    ->join('items', 'item_specifications.item_id', '=', 'items.id')
                    ->where('items.sku', $sku)
                    ->where('item_specifications.type', 'technical')
                    ->count();
                
                if ($dbSpecs == 0) {
                    echo "⚠️ SKU {$sku} tiene especificaciones técnicas en Excel pero no en BD\n";
                    echo "   Excel: " . substr($technicalSpecs, 0, 100) . "...\n";
                }
            }
        }
        
        echo "\n📊 RESUMEN DE EXCEL:\n";
        echo "- Productos con especificaciones técnicas en Excel: {$productsWithTechnicalSpecs}\n";
        echo "- Productos con especificaciones técnicas en BD: {$productCount}\n";
        
        if ($productsWithTechnicalSpecs > $productCount) {
            echo "❌ Faltan " . ($productsWithTechnicalSpecs - $productCount) . " productos por procesar\n";
        } else {
            echo "✅ Todos los productos con especificaciones técnicas fueron procesados\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}

echo "\n=== VERIFICACIÓN COMPLETADA ===\n";

?>