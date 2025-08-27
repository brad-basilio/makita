<?php

require_once 'vendor/autoload.php';

use App\Imports\UnifiedItemImport;
use Maatwebsite\Excel\Facades\Excel;

// Configurar Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo "Iniciando prueba de importación...\n";
    
    // Crear instancia del importador
    $import = new UnifiedItemImport();
    
    // Importar el archivo CSV
    Excel::import($import, 'test_import_applications.csv');
    
    echo "Importación completada exitosamente!\n";
    
    // Verificar que las aplicaciones se crearon
    $applications = \App\Models\Application::all();
    echo "Aplicaciones creadas: " . $applications->count() . "\n";
    
    foreach ($applications as $app) {
        echo "- {$app->name} (slug: {$app->slug})\n";
    }
    
    // Verificar las relaciones
    $items = \App\Models\Item::with('applications')->get();
    echo "\nItems con aplicaciones:\n";
    
    foreach ($items as $item) {
        echo "- {$item->name}: ";
        echo $item->applications->pluck('name')->implode(', ') . "\n";
    }
    
} catch (Exception $e) {
    echo "Error durante la importación: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}