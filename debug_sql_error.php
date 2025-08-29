<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Imports\UnifiedItemImport;
use App\Models\Item;
use App\Models\Category;
use App\Models\Brand;
use App\Models\Platform;
use App\Models\Family;
use App\Models\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "Iniciando debug de errores SQL...\n";

// Habilitar logging de queries SQL
DB::listen(function ($query) {
    echo "SQL: " . $query->sql . "\n";
    echo "Bindings: " . json_encode($query->bindings) . "\n";
    echo "Time: " . $query->time . "ms\n\n";
});

// Crear datos de prueba mínimos
echo "Creando datos de prueba...\n";

try {
    // Crear categoría de prueba
    $category = Category::firstOrCreate(
        ['name' => 'Herramientas Test'],
        ['slug' => 'herramientas-test']
    );
    echo "Categoría creada: ID = {$category->id}\n";

    // Crear marca de prueba
    $brand = Brand::firstOrCreate(
        ['name' => 'Makita Test'],
        ['slug' => 'makita-test']
    );
    echo "Marca creada: ID = {$brand->id}\n";

    // Intentar crear un item directamente
    echo "\nIntentando crear item directamente...\n";
    
    $itemData = [
        'sku' => 'TEST001',
        'name' => 'Producto Test',
        'description' => 'Descripción de prueba',
        'price' => 100.00,
        'discount' => 0.00,
        'final_price' => 100.00,
        'discount_percent' => 0.00,
        'category_id' => $category->id,
        'brand_id' => $brand->id,
        'slug' => 'producto-test-' . time(),
        'stock' => 10,
    ];
    
    echo "Datos del item: " . json_encode($itemData, JSON_PRETTY_PRINT) . "\n";
    
    $item = Item::create($itemData);
    
    if ($item) {
        echo "✅ Item creado exitosamente: ID = {$item->id}\n";
    } else {
        echo "❌ No se pudo crear el item\n";
    }
    
} catch (\Exception $e) {
    echo "❌ Error al crear item: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . " Línea: " . $e->getLine() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

// Ahora probar con el importador
echo "\n" . str_repeat("=", 50) . "\n";
echo "Probando con UnifiedItemImport...\n";

try {
    $import = new UnifiedItemImport(['truncate' => false]); // No truncar para mantener los datos de prueba
    
    $testRow = [
        'sku' => 'TEST002',
        'nombre_producto' => 'Producto Import Test',
        'descripcion' => 'Descripción de importación',
        'precio' => '150.50',
        'categoria' => 'Herramientas Test',
        'marca' => 'Makita Test',
        'stock' => '5'
    ];
    
    echo "Datos de la fila: " . json_encode($testRow, JSON_PRETTY_PRINT) . "\n";
    
    $result = $import->model($testRow);
    
    if ($result) {
        echo "✅ Importación exitosa: ID = {$result->id}\n";
    } else {
        echo "❌ Importación falló\n";
        $errors = $import->getErrors();
        if (!empty($errors)) {
            echo "Errores encontrados:\n";
            foreach ($errors as $error) {
                echo "- " . $error . "\n";
            }
        }
    }
    
} catch (\Exception $e) {
    echo "❌ Error en importación: " . $e->getMessage() . "\n";
    echo "Archivo: " . $e->getFile() . " Línea: " . $e->getLine() . "\n";
}

echo "\nDebug completado.\n";