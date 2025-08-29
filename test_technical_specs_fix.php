<?php

require_once 'vendor/autoload.php';

// Configurar Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Imports\UnifiedItemImport;
use Illuminate\Support\Facades\DB;
use App\Models\Item;
use App\Models\ItemSpecification;

echo "=== PRUEBA DE CORRECCIÓN DE ESPECIFICACIONES TÉCNICAS ===\n\n";

try {
    // Habilitar logging de consultas SQL
    DB::enableQueryLog();
    
    // Datos de prueba con el formato correcto: clave:valor
    $testData = [
        'sku' => 'TEST_SPECS_FIX',
        'categoria' => 'HERRAMIENTAS',
        'plataforma' => 'XGT',
        'familia' => 'PRUEBAS',
        'aplicacion' => 'TESTING',
        'nombre_del_producto' => 'Producto de Prueba para Especificaciones',
        'descripcion' => 'Producto para probar el parsing de especificaciones técnicas',
        'especificaciones_generales_separadas_por_comas' => 'Motor BL, 4 velocidades, Freno eléctrico',
        'especificaciones_tecnicas_separado_por_comas_y_dos_puntos' => 'Velocidad del aire:200 m/s, Volumen de aire:1.1 m3/min, Fuerza de soplado:2.8 N, Presión de succión:103 mbar, Peso neto:2.1 kg'
    ];
    
    echo "Datos de prueba:\n";
    echo "SKU: {$testData['sku']}\n";
    echo "Especificaciones técnicas: {$testData['especificaciones_tecnicas_separado_por_comas_y_dos_puntos']}\n\n";
    
    // Eliminar producto de prueba si existe
    $existingItem = Item::where('sku', $testData['sku'])->first();
    if ($existingItem) {
        echo "Eliminando producto de prueba existente...\n";
        ItemSpecification::where('item_id', $existingItem->id)->delete();
        $existingItem->delete();
    }
    
    // Crear instancia del importador
    $importer = new UnifiedItemImport(['truncate' => false]);
    
    // Simular el procesamiento de una fila
    echo "Procesando producto de prueba...\n";
    $item = $importer->model($testData);
    
    if ($item === null) {
        echo "❌ ERROR: El producto no se creó correctamente\n";
        exit(1);
    }
    
    echo "✅ Producto creado exitosamente: {$item->sku}\n\n";
    
    // Verificar especificaciones técnicas
    echo "=== VERIFICACIÓN DE ESPECIFICACIONES TÉCNICAS ===\n";
    $technicalSpecs = ItemSpecification::where('item_id', $item->id)
        ->where('type', 'technical')
        ->orderBy('id')
        ->get();
    
    if ($technicalSpecs->count() > 0) {
        echo "✅ Se encontraron {$technicalSpecs->count()} especificaciones técnicas:\n";
        foreach ($technicalSpecs as $index => $spec) {
            echo "  " . ($index + 1) . ". Clave: '{$spec->title}' | Valor: '{$spec->description}'\n";
        }
    } else {
        echo "❌ No se encontraron especificaciones técnicas\n";
    }
    
    // Verificar especificaciones generales
    echo "\n=== VERIFICACIÓN DE ESPECIFICACIONES GENERALES ===\n";
    $generalSpecs = ItemSpecification::where('item_id', $item->id)
        ->where('type', 'general')
        ->orderBy('id')
        ->get();
    
    if ($generalSpecs->count() > 0) {
        echo "✅ Se encontraron {$generalSpecs->count()} especificaciones generales:\n";
        foreach ($generalSpecs as $index => $spec) {
            echo "  " . ($index + 1) . ". Título: '{$spec->title}' | Descripción: '{$spec->description}'\n";
        }
    } else {
        echo "❌ No se encontraron especificaciones generales\n";
    }
    
    // Verificar el formato esperado
    echo "\n=== ANÁLISIS DEL FORMATO ===\n";
    $expectedSpecs = [
        'Velocidad del aire' => '200 m/s',
        'Volumen de aire' => '1.1 m3/min',
        'Fuerza de soplado' => '2.8 N',
        'Presión de succión' => '103 mbar',
        'Peso neto' => '2.1 kg'
    ];
    
    $allCorrect = true;
    foreach ($expectedSpecs as $expectedTitle => $expectedValue) {
        $found = $technicalSpecs->where('title', $expectedTitle)->where('description', $expectedValue)->first();
        if ($found) {
            echo "✅ '{$expectedTitle}': '{$expectedValue}' - CORRECTO\n";
        } else {
            echo "❌ '{$expectedTitle}': '{$expectedValue}' - NO ENCONTRADO\n";
            $allCorrect = false;
        }
    }
    
    echo "\n=== RESULTADO FINAL ===\n";
    if ($allCorrect && $technicalSpecs->count() == count($expectedSpecs)) {
        echo "🎉 ¡ÉXITO! El parsing de especificaciones técnicas funciona correctamente\n";
        echo "✅ Formato 'clave:valor' procesado correctamente\n";
        echo "✅ Separación por comas funciona bien\n";
    } else {
        echo "❌ Hay problemas con el parsing de especificaciones técnicas\n";
        if ($technicalSpecs->count() != count($expectedSpecs)) {
            echo "   - Cantidad esperada: " . count($expectedSpecs) . ", encontrada: {$technicalSpecs->count()}\n";
        }
    }
    
    // Mostrar consultas SQL ejecutadas
    $queries = DB::getQueryLog();
    echo "\n=== CONSULTAS SQL EJECUTADAS ===\n";
    echo "Total de consultas: " . count($queries) . "\n";
    
    // Limpiar datos de prueba
    echo "\n=== LIMPIEZA ===\n";
    ItemSpecification::where('item_id', $item->id)->delete();
    $item->delete();
    echo "✅ Datos de prueba eliminados\n";
    
} catch (Exception $e) {
    echo "\n❌ ERROR durante la prueba: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
    echo "\nTrace:\n" . $e->getTraceAsString() . "\n";
}

echo "\n=== FIN DE LA PRUEBA ===\n";

?>