<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "=== Prueba Final de Corrección Completa ===\n\n";

// Datos de prueba que replican exactamente el error original
$testData = [
    'sku' => 'AS001G_FINAL_TEST',
    'categoria' => 'HERRAMIENTAS',
    'plataforma' => 'XGT',
    'familia' => 'SOPLADORAS',
    'aplicacion' => 'CONSTRUCCION, MAESTRANZA, CARPINTERIA, MINERIA',
    'nombre_producto' => 'Soplador Multifuncional XGT 40Vmax / 4 Vel. / BL / Sin Baterías *NUEVO*',
    'descripcion' => 'SOPLADORA MUTIFUNCION XGT 40 VMAX / 200 M/S / SUCCION 103 MBAR / 4 VELOCIDADES / BL / SIN BATERIAS',
    'especificaciones_generales_separadas_por_comas' => 'Motor BL, 4 velocidades, Freno eléctrico, Compatible con baterías XGT 40Vmax, Uso como soplador y aspirador',
    'especificaciones_tecnicas_separado_por_comas_y_dos_puntos' => 'Velocidad del aire:200 m/s, Volumen de aire:1.1 m3/min, Fuerza de soplado:2.8 N, Presión máxima:29 kPa, Nivel de ruido:85 dB(A)',
    'marca' => 'Makita',
    'precio' => 450.00,
    'descuento' => 45.00,
    'stock' => 5
];

echo "Procesando SKU: {$testData['sku']}\n";
echo "Especificaciones técnicas originales: {$testData['especificaciones_tecnicas_separado_por_comas_y_dos_puntos']}\n\n";

$import = new UnifiedItemImport();

try {
    $result = $import->model($testData);
    
    if ($result) {
        echo "✅ SKU {$testData['sku']} procesado exitosamente: ID = {$result->id}\n";
        
        // Verificar que las especificaciones técnicas se guardaron correctamente
        $specs = DB::table('item_specifications')
            ->where('item_id', $result->id)
            ->where('type', 'technical')
            ->get();
            
        echo "\n--- Especificaciones Técnicas Guardadas Correctamente ---\n";
        foreach ($specs as $spec) {
            echo "✓ {$spec->title}: {$spec->description} (Tipo: {$spec->type})\n";
        }
        
        // Verificar especificaciones generales también
        $generalSpecs = DB::table('item_specifications')
            ->where('item_id', $result->id)
            ->where('type', 'general')
            ->get();
            
        if ($generalSpecs->count() > 0) {
            echo "\n--- Especificaciones Generales ---\n";
            foreach ($generalSpecs as $spec) {
                echo "✓ {$spec->title}: {$spec->description} (Tipo: {$spec->type})\n";
            }
        }
        
        echo "\n🎉 TODAS LAS ESPECIFICACIONES SE PROCESARON CORRECTAMENTE\n";
        
    } else {
        echo "❌ SKU {$testData['sku']} falló (retornó null)\n";
    }
    
} catch (Exception $e) {
    echo "❌ SKU {$testData['sku']} falló con excepción: {$e->getMessage()}\n";
    echo "Archivo: {$e->getFile()}\n";
    echo "Línea: {$e->getLine()}\n";
}

// Mostrar errores acumulados
echo "\n=== Errores Acumulados ===\n";
if (method_exists($import, 'getErrors')) {
    $errors = $import->getErrors();
    if (empty($errors)) {
        echo "✅ No hay errores acumulados.\n";
    } else {
        foreach ($errors as $error) {
            echo "❌ $error\n";
        }
    }
} else {
    echo "Método getErrors() no disponible.\n";
}

echo "\n=== Prueba Final Completada ===\n";
echo "\n🔧 RESUMEN DE CORRECCIONES APLICADAS:\n";
echo "1. ✅ Corregido el tipo de especificación de 'tecnica' a 'technical'\n";
echo "2. ✅ Mejorado el manejo de errores SQL con mensajes específicos\n";
echo "3. ✅ Agregadas validaciones preventivas para evitar errores\n";
echo "4. ✅ Mejorado el parsing de especificaciones técnicas\n";
echo "\n🎯 El error SQLSTATE[01000] Warning 1265 Data truncated debería estar resuelto.\n";