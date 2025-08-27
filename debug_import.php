<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Application;
use App\Models\Item;
use Illuminate\Support\Facades\DB;

echo "Iniciando debug de importación...\n";

// Limpiar tablas (deshabilitando restricciones de clave foránea)
DB::statement('SET FOREIGN_KEY_CHECKS=0;');
DB::table('item_application')->delete();
Application::truncate();
Item::truncate();
DB::statement('SET FOREIGN_KEY_CHECKS=1;');

echo "Tablas limpiadas\n";

// Crear instancia del importador
$import = new UnifiedItemImport();

// Simular una fila de datos
$testRow = [
    'sku' => 'MAK001',
    'nombre' => 'Taladro Percutor',
    'descripcion' => 'Taladro de alta potencia',
    'precio' => '299.99',
    'categoria' => 'Herramientas',
    'subcategoria' => 'Taladros',
    'marca' => 'Makita',
    'aplicaciones' => 'Construccion,Albañileria,Carpinteria',
    'plataforma' => '18V',
    'familia' => 'LXT'
];

echo "Procesando fila de prueba...\n";
echo "Datos de la fila: " . json_encode($testRow) . "\n";

try {
    echo "Llamando al método model()...\n";
    $item = $import->model($testRow);
    
    if ($item) {
        echo "Item creado exitosamente: ID = {$item->id}, SKU = {$item->sku}\n";
        
        // Verificar aplicaciones
        $applications = Application::all();
        echo "Aplicaciones en BD: " . $applications->count() . "\n";
        
        foreach ($applications as $app) {
            echo "- {$app->name}\n";
        }
        
        // Verificar relaciones
        $itemApps = DB::table('item_application')->where('item_id', $item->id)->get();
        echo "Relaciones item-aplicación: " . $itemApps->count() . "\n";
        
    } else {
        echo "No se pudo crear el item (método retornó null)\n";
        
        // Verificar si hay errores en el importador
        $errors = $import->failures();
        if (!empty($errors)) {
            echo "Errores encontrados:\n";
            foreach ($errors as $error) {
                echo "- " . json_encode($error) . "\n";
            }
        }
    }
    
} catch (Exception $e) {
    echo "Excepción capturada: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . " Línea: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
} catch (Throwable $t) {
    echo "Error capturado: " . $t->getMessage() . "\n";
    echo "Archivo: " . $t->getFile() . " Línea: " . $t->getLine() . "\n";
    echo "Trace: " . $t->getTraceAsString() . "\n";
}

echo "Debug completado\n";