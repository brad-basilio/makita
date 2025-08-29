<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "=== Prueba de Corrección de Especificaciones Técnicas ===\n\n";

// Habilitar logging de SQL
DB::listen(function ($query) {
    echo "SQL: {$query->sql}\n";
    echo "Bindings: " . json_encode($query->bindings) . "\n";
    echo "Time: {$query->time}ms\n\n";
});

// Datos de prueba que replican el error original
$testData = [
    'sku' => 'AS001G_TEST_FIX',
    'categoria' => 'HERRAMIENTAS',
    'plataforma' => 'XGT',
    'familia' => 'SOPLADORAS',
    'aplicacion' => 'CONSTRUCCION, MAESTRANZA, CARPINTERIA, MINERIA',
    'nombre_producto' => 'Soplador Multifuncional XGT 40Vmax / 4 Vel. / BL / Sin Baterías *NUEVO*',
    'descripcion' => 'SOPLADORA MUTIFUNCION XGT 40 VMAX / 200 M/S / SUCCION 103 MBAR / 4 VELOCIDADES / BL / SIN BATERIAS',
    'especificaciones_generales_separadas_por_comas' => 'Motor BL, 4 velocidades, Freno eléctrico, Compatible con baterías XGT 40Vmax, Uso como soplador y aspirador',
    'especificaciones_tecnicas_separado_por_comas_y_dos_puntos' => 'Velocidad del aire:200 m/s, Volumen de aire:1.1 m3/min, Fuerza de soplado:2.8 N, Presión máxima:29 kPa',
    'marca' => 'Makita',
    'precio' => 450.00,
    'descuento' => 45.00,
    'stock' => 5
];

echo "Procesando SKU: {$testData['sku']}\n";
echo "Especificaciones técnicas: {$testData['especificaciones_tecnicas_separado_por_comas_y_dos_puntos']}\n\n";

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
            
        echo "\n--- Especificaciones Técnicas Guardadas ---\n";
        foreach ($specs as $spec) {
            echo "- {$spec->title}: {$spec->description} (Tipo: {$spec->type})\n";
        }
        
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
        echo "No hay errores acumulados.\n";
    } else {
        foreach ($errors as $error) {
            echo "- $error\n";
        }
    }
} else {
    echo "Método getErrors() no disponible.\n";
}

echo "\n=== Prueba Completada ===\n";