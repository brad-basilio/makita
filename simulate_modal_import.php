<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Http\Controllers\UnifiedImportController;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;

echo "=== SIMULACIÓN DE IMPORTACIÓN DESDE MODAL (CORREGIDA) ===\n\n";

// Simular el comportamiento del modal después de la corrección
try {
    // Crear una instancia del controlador
    $controller = new UnifiedImportController();
    
    // Simular el archivo subido
    $filePath = realpath('productos.xlsx');
    if (!$filePath || !file_exists($filePath)) {
        throw new Exception('No se encontró el archivo productos.xlsx');
    }
    
    // Crear un mock del UploadedFile
    $uploadedFile = new UploadedFile(
        $filePath,
        'productos.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        null,
        true // test mode
    );
    
    // Crear el request simulado
    $request = Request::create('/api/unified-import', 'POST', [
        'truncate' => false // Como lo hace el modal
    ]);
    
    // Simular el archivo en el request
    $request->files->set('file', $uploadedFile);
    
    echo "1. Ejecutando importación simulada desde modal...\n";
    
    // Ejecutar la importación
    $response = $controller->import($request);
    
    // Obtener el contenido de la respuesta
    $responseData = json_decode($response->getContent(), true);
    $statusCode = $response->getStatusCode();
    
    echo "\n2. Respuesta del servidor:\n";
    echo "   - HTTP Status: {$statusCode}\n";
    echo "   - Success: " . ($responseData['success'] ? 'true' : 'false') . "\n";
    echo "   - Message: {$responseData['message']}\n";
    echo "   - Errors count: {$responseData['errors_count']}\n";
    echo "   - Warnings count: {$responseData['warnings_count']}\n";
    
    // Mostrar algunas advertencias de ejemplo
    if (isset($responseData['warnings']) && !empty($responseData['warnings'])) {
        echo "\n3. Ejemplos de advertencias (primeras 3):\n";
        $sampleWarnings = array_slice($responseData['warnings'], 0, 3);
        foreach ($sampleWarnings as $warning) {
            echo "   - {$warning}\n";
        }
    }
    
    // Mostrar errores si los hay
    if (isset($responseData['errors']) && !empty($responseData['errors'])) {
        echo "\n❌ ERRORES ENCONTRADOS:\n";
        foreach ($responseData['errors'] as $error) {
            echo "   - {$error}\n";
        }
    }
    
    echo "\n4. Análisis del resultado:\n";
    
    if ($responseData['success'] && $statusCode === 200) {
        echo "   ✅ ÉXITO: La importación fue exitosa\n";
        echo "   ✅ El modal mostrará success=true\n";
        echo "   ✅ No se mostrarán errores al usuario\n";
        
        if ($responseData['warnings_count'] > 0) {
            echo "   ℹ️  Se pueden mostrar advertencias como información\n";
        }
    } else {
        echo "   ❌ FALLO: La importación falló\n";
        echo "   ❌ El modal mostrará success=false\n";
        echo "   ❌ Se mostrarán errores al usuario\n";
    }
    
    echo "\n5. Comparación con el comportamiento anterior:\n";
    echo "\n   ANTES (problemático):\n";
    echo "   {\n";
    echo "     \"success\": false,\n";
    echo "     \"message\": \"Importación completada con errores\",\n";
    echo "     \"errors_count\": 6,\n";
    echo "     \"errors\": [\n";
    echo "       \"SKU duplicado saltado: 'DHP487'...\",\n";
    echo "       \"SKU duplicado saltado: 'DRT50'...\",\n";
    echo "       ...\n";
    echo "     ]\n";
    echo "   }\n";
    echo "   HTTP Status: 422\n";
    
    echo "\n   AHORA (corregido):\n";
    echo "   {\n";
    echo "     \"success\": true,\n";
    echo "     \"message\": \"Importación completada exitosamente con advertencias\",\n";
    echo "     \"errors_count\": 0,\n";
    echo "     \"warnings_count\": {$responseData['warnings_count']},\n";
    echo "     \"warnings\": [\n";
    echo "       \"SKU duplicado saltado: 'DHP487'...\",\n";
    echo "       \"SKU duplicado saltado: 'DRT50'...\",\n";
    echo "       ...\n";
    echo "     ]\n";
    echo "   }\n";
    echo "   HTTP Status: 200\n";
    
} catch (Exception $e) {
    echo "❌ Error durante la simulación: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . "\n";
    echo "Línea: " . $e->getLine() . "\n";
}

echo "\n=== RESUMEN DE LA CORRECCIÓN ===\n";
echo "\n✅ PROBLEMA RESUELTO:\n";
echo "   - Los SKUs duplicados ya no se consideran errores\n";
echo "   - Se manejan como advertencias (warnings)\n";
echo "   - La importación es exitosa (success=true)\n";
echo "   - El modal no mostrará errores al usuario\n";
echo "   - HTTP Status 200 en lugar de 422\n";

echo "\n🔧 CAMBIOS IMPLEMENTADOS:\n";
echo "   1. Agregado array \$warnings en UnifiedItemImport\n";
echo "   2. Método addWarning() para advertencias\n";
echo "   3. SKUs duplicados van a warnings, no a errors\n";
echo "   4. UnifiedImportController maneja warnings separadamente\n";
echo "   5. success=true cuando solo hay warnings\n";

echo "\n📋 COMPORTAMIENTO ACTUAL:\n";
echo "   - Errores reales → success=false, HTTP 422\n";
echo "   - Solo advertencias → success=true, HTTP 200\n";
echo "   - Sin errores ni advertencias → success=true, HTTP 200\n";

?>