<?php

require_once 'vendor/autoload.php';

// Configurar Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== RESUMEN FINAL DE LA IMPORTACIÓN ===\n\n";

// Contar totales
$totalItems = DB::table('items')->count();
$totalSpecs = DB::table('item_specifications')->count();
$totalImages = DB::table('item_images')->count();

echo "📊 ESTADÍSTICAS GENERALES:\n";
echo "- Total de items en la base de datos: $totalItems\n";
echo "- Total de especificaciones: $totalSpecs\n";
echo "- Total de imágenes: $totalImages\n\n";

// Productos por categoría
echo "📂 PRODUCTOS POR CATEGORÍA:\n";
$categories = DB::table('items')
    ->join('categories', 'items.category_id', '=', 'categories.id')
    ->select('categories.name as category_name', DB::raw('count(*) as total'))
    ->groupBy('categories.id', 'categories.name')
    ->orderBy('total', 'desc')
    ->get();

foreach($categories as $cat) {
    echo "- {$cat->category_name}: {$cat->total} productos\n";
}

// Especificaciones por tipo
echo "\n🔧 ESPECIFICACIONES POR TIPO:\n";
$specTypes = DB::table('item_specifications')
    ->select('type', DB::raw('count(*) as total'))
    ->groupBy('type')
    ->orderBy('total', 'desc')
    ->get();

foreach($specTypes as $spec) {
    echo "- Tipo '{$spec->type}': {$spec->total} especificaciones\n";
}

// Productos por plataforma
echo "\n🏗️ PRODUCTOS POR PLATAFORMA:\n";
$platforms = DB::table('items')
    ->join('platforms', 'items.platform_id', '=', 'platforms.id')
    ->select('platforms.name as platform_name', DB::raw('count(*) as total'))
    ->groupBy('platforms.id', 'platforms.name')
    ->orderBy('total', 'desc')
    ->get();

foreach($platforms as $platform) {
    echo "- {$platform->platform_name}: {$platform->total} productos\n";
}

// Productos por familia
echo "\n👨‍👩‍👧‍👦 PRODUCTOS POR FAMILIA:\n";
$families = DB::table('items')
    ->join('families', 'items.family_id', '=', 'families.id')
    ->select('families.name as family_name', DB::raw('count(*) as total'))
    ->groupBy('families.id', 'families.name')
    ->orderBy('total', 'desc')
    ->get();

foreach($families as $family) {
    echo "- {$family->family_name}: {$family->total} productos\n";
}

// SKUs más recientes
echo "\n🆕 ÚLTIMOS 10 PRODUCTOS IMPORTADOS:\n";
$recentItems = DB::table('items')
    ->select('sku', 'name', 'created_at')
    ->orderBy('created_at', 'desc')
    ->limit(10)
    ->get();

foreach($recentItems as $item) {
    $shortName = strlen($item->name) > 50 ? substr($item->name, 0, 50) . '...' : $item->name;
    echo "- SKU: {$item->sku} | {$shortName}\n";
}

// Verificar integridad de datos
echo "\n🔍 VERIFICACIÓN DE INTEGRIDAD:\n";

$itemsWithoutSpecs = DB::table('items')
    ->leftJoin('item_specifications', 'items.id', '=', 'item_specifications.item_id')
    ->whereNull('item_specifications.id')
    ->count();

echo "- Items sin especificaciones: $itemsWithoutSpecs\n";

$itemsWithSpecs = $totalItems - $itemsWithoutSpecs;
echo "- Items con especificaciones: $itemsWithSpecs\n";

if ($totalItems > 0) {
    $percentageWithSpecs = round(($itemsWithSpecs / $totalItems) * 100, 2);
    echo "- Porcentaje de items con especificaciones: {$percentageWithSpecs}%\n";
}

// Verificar duplicados
echo "\n🔄 VERIFICACIÓN DE DUPLICADOS:\n";
$duplicateSKUs = DB::table('items')
    ->select('sku', DB::raw('count(*) as total'))
    ->groupBy('sku')
    ->having('total', '>', 1)
    ->get();

if ($duplicateSKUs->count() > 0) {
    echo "⚠️ SKUs duplicados encontrados:\n";
    foreach($duplicateSKUs as $dup) {
        echo "- SKU '{$dup->sku}': {$dup->total} ocurrencias\n";
    }
} else {
    echo "✅ No se encontraron SKUs duplicados\n";
}

echo "\n=== IMPORTACIÓN ANALIZADA COMPLETAMENTE ===\n";

?>