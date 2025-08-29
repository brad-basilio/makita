<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Item;

echo "=== PRUEBA DE CORRECCIÓN DE MANEJO DE SKUs DUPLICADOS ===\n\n";

// 1. Verificar estado inicial
echo "1. Estado inicial de la base de datos:\n";
$initialCount = Item::count();
echo "   - Total de productos: {$initialCount}\n";

// 2. Probar importación SIN truncate (como lo hace el modal)
echo "\n2. Probando importación sin truncate (simulando modal):\n";

try {
    // Crear importador sin truncate (como lo hace el modal)
    $import = new UnifiedItemImport(['truncate' => false]);
    
    // Simular la importación
    Excel::import($import, 'productos.xlsx');
    
    // Obtener mensajes
    $messages = $import->getAllMessages();
    $errors = $messages['errors'];
    $warnings = $messages['warnings'];
    $hasErrors = $messages['has_errors'];
    $hasWarnings = $messages['has_warnings'];
    
    echo "   - Errores reales: " . count($errors) . "\n";
    echo "   - Advertencias: " . count($warnings) . "\n";
    echo "   - Tiene errores: " . ($hasErrors ? 'SÍ' : 'NO') . "\n";
    echo "   - Tiene advertencias: " . ($hasWarnings ? 'SÍ' : 'NO') . "\n";
    
    // Mostrar algunos ejemplos de advertencias
    if (!empty($warnings)) {
        echo "\n   Ejemplos de advertencias (primeras 5):\n";
        $sampleWarnings = array_slice($warnings, 0, 5);
        foreach ($sampleWarnings as $warning) {
            echo "      - {$warning}\n";
        }
    }
    
    // Mostrar errores si los hay
    if (!empty($errors)) {
        echo "\n   ❌ ERRORES REALES ENCONTRADOS:\n";
        foreach ($errors as $error) {
            echo "      - {$error}\n";
        }
    }
    
    // Simular respuesta del controlador
    echo "\n3. Simulación de respuesta del controlador:\n";
    
    $success = !$hasErrors;
    
    if (!$hasErrors && !$hasWarnings) {
        $message = 'Importación completada exitosamente';
    } elseif (!$hasErrors && $hasWarnings) {
        $message = 'Importación completada exitosamente con advertencias';
    } else {
        $message = 'Importación completada con errores';
    }
    
    $response = [
        'success' => $success,
        'message' => $message,
        'errors_count' => count($errors),
        'warnings_count' => count($warnings),
    ];
    
    echo "   - Success: " . ($response['success'] ? 'true' : 'false') . "\n";
    echo "   - Message: {$response['message']}\n";
    echo "   - Errors count: {$response['errors_count']}\n";
    echo "   - Warnings count: {$response['warnings_count']}\n";
    echo "   - HTTP Status: " . ($success ? '200' : '422') . "\n";
    
    // Verificar que no se duplicaron productos
    echo "\n4. Verificación de integridad:\n";
    $finalCount = Item::count();
    echo "   - Productos antes: {$initialCount}\n";
    echo "   - Productos después: {$finalCount}\n";
    echo "   - Diferencia: " . ($finalCount - $initialCount) . "\n";
    
    if ($finalCount === $initialCount) {
        echo "   ✅ Correcto: No se duplicaron productos\n";
    } else {
        echo "   ❌ Error: Se modificó el número de productos\n";
    }
    
    // Verificar duplicados en BD
    $duplicates = \Illuminate\Support\Facades\DB::select("
        SELECT sku, COUNT(*) as count 
        FROM items 
        GROUP BY sku 
        HAVING COUNT(*) > 1
    ");
    
    if (empty($duplicates)) {
        echo "   ✅ Correcto: No hay SKUs duplicados en la BD\n";
    } else {
        echo "   ❌ Error: Se encontraron SKUs duplicados:\n";
        foreach ($duplicates as $dup) {
            echo "      - SKU '{$dup->sku}': {$dup->count} veces\n";
        }
    }
    
} catch (Exception $e) {
    echo "   ❌ Error durante la prueba: " . $e->getMessage() . "\n";
    echo "   Archivo: " . $e->getFile() . "\n";
    echo "   Línea: " . $e->getLine() . "\n";
}

echo "\n=== RESULTADO DE LA PRUEBA ===\n";

if (isset($response) && $response['success'] && $response['warnings_count'] > 0 && $response['errors_count'] === 0) {
    echo "✅ ÉXITO: La corrección funciona correctamente\n";
    echo "   - La importación es exitosa (success=true)\n";
    echo "   - Los SKUs duplicados se manejan como advertencias\n";
    echo "   - No se generan errores reales\n";
    echo "   - No se duplican productos en la BD\n";
} else {
    echo "❌ FALLO: La corrección no funciona como esperado\n";
    if (isset($response)) {
        echo "   - Success: " . ($response['success'] ? 'true' : 'false') . "\n";
        echo "   - Errors: {$response['errors_count']}\n";
        echo "   - Warnings: {$response['warnings_count']}\n";
    }
}

echo "\n=== COMPARACIÓN CON COMPORTAMIENTO ANTERIOR ===\n";
echo "ANTES (problemático):\n";
echo "  - SKUs duplicados → errors[] → success=false → HTTP 422\n";
echo "\nAHORA (corregido):\n";
echo "  - SKUs duplicados → warnings[] → success=true → HTTP 200\n";
echo "  - Solo errores reales → errors[] → success=false → HTTP 422\n";

?>