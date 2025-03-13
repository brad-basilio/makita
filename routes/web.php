<?php

use Illuminate\Support\Facades\Route;

// Admin
use App\Http\Controllers\Admin\AboutusController as AdminAboutusController;
use App\Http\Controllers\Admin\HomeController as AdminHomeController;
use App\Http\Controllers\Admin\IndicatorController as AdminIndicatorController;
use App\Http\Controllers\Admin\SliderController as AdminSliderController;
use App\Http\Controllers\Admin\TestimonyController as AdminTestimonyController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\SocialController as AdminSocialController;
use App\Http\Controllers\Admin\StrengthController as AdminStrengthController;
use App\Http\Controllers\Admin\GeneralController as AdminGeneralController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\AccountController as AdminAccountController;
use App\Http\Controllers\Admin\BannerController as AdminBannerController;
use App\Http\Controllers\Admin\ItemController as AdminItemController;
use App\Http\Controllers\Admin\GalleryController as AdminGalleryController;
use App\Http\Controllers\Admin\SystemController as AdminSystemController;
use App\Http\Controllers\Admin\TagController as AdminTagController;
use App\Http\Controllers\Admin\BrandController as AdminBrandController;
use App\Http\Controllers\Admin\ComboController as AdminComboController;
use App\Http\Controllers\Admin\DeliveryPriceController as AdminDeliveryPriceController;
use App\Http\Controllers\Admin\SaleController as AdminSaleController;
use App\Http\Controllers\Admin\SubCategoryController as AdminSubCategoryController;

use App\Http\Controllers\Admin\FaqController as AdminFaqController;
use App\Http\Controllers\AuthClientController;
// Public 
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SystemController;
use SoDe\Extend\File;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Verificar si el archivo existe, si no, crear uno vacío
$filePath = storage_path('app/pages.json');
if (!file_exists($filePath)) {
    file_put_contents($filePath, json_encode([]));
}

$pages = json_decode(File::get($filePath), true);

// Public routes
foreach ($pages as $page) {
    Route::get($page['path'], [SystemController::class, 'reactView'])->name('System.jsx');
}

Route::get('/base-template', [SystemController::class, 'reactView'])->name('System.jsx');
Route::get('/login', [AuthController::class, 'loginView'])->name('Login.jsx');

// Admin routes
Route::middleware(['can:Admin', 'auth'])->prefix('admin')->group(function () {
    Route::get('/', fn() => redirect()->route('Admin/Home.jsx'));
    Route::get('/home', [AdminHomeController::class, 'reactView'])->name('Admin/Home.jsx');
    Route::get('/sales', [AdminSaleController::class, 'reactView'])->name('Admin/Sales.jsx');
    Route::get('/items', [AdminItemController::class, 'reactView'])->name('Admin/Items.jsx');

    Route::get('/combos', [AdminComboController::class, 'reactView'])->name('Admin/Combos.jsx');

    Route::get('/categories', [AdminCategoryController::class, 'reactView'])->name('Admin/Categories.jsx');
    Route::get('/subcategories', [AdminSubCategoryController::class, 'reactView'])->name('Admin/SubCategories.jsx');
    Route::get('/brands', [AdminBrandController::class, 'reactView'])->name('Admin/Brands.jsx');
    Route::get('/tags', [AdminTagController::class, 'reactView'])->name('Admin/Tags.jsx');
    Route::get('/prices', [AdminDeliveryPriceController::class, 'reactView'])->name('Admin/DeliveryPrices.jsx');
    Route::get('/messages', [AdminSubscriptionController::class, 'reactView'])->name('Admin/Messages.jsx');
    Route::get('/subscriptions', [AdminSubscriptionController::class, 'reactView'])->name('Admin/Subscriptions.jsx');

    Route::get('/posts', [AdminPostController::class, 'reactView'])->name('Admin/Posts.jsx');
    Route::get('/about', [AdminAboutusController::class, 'reactView'])->name('Admin/About.jsx');
    Route::get('/indicators', [AdminIndicatorController::class, 'reactView'])->name('Admin/Indicators.jsx');
    Route::get('/sliders', [AdminSliderController::class, 'reactView'])->name('Admin/Sliders.jsx');
    Route::get('/banners', [AdminBannerController::class, 'reactView'])->name('Admin/Banners.jsx');
    Route::get('/testimonies', [AdminTestimonyController::class, 'reactView'])->name('Admin/Testimonies.jsx');
    Route::get('/socials', [AdminSocialController::class, 'reactView'])->name('Admin/Socials.jsx');
    Route::get('/strengths', [AdminStrengthController::class, 'reactView'])->name('Admin/Strengths.jsx');
    Route::get('/generals', [AdminGeneralController::class, 'reactView'])->name('Admin/Generals.jsx');

    Route::get('/faqs', [AdminFaqController::class, 'reactView'])->name('Admin/Faqs.jsx');


    Route::get('/gallery', [AdminGalleryController::class, 'reactView'])->name('Admin/Gallery.jsx');

    Route::middleware(['can:Root'])->get('/system', [AdminSystemController::class, 'reactView'])->name('Admin/System.jsx');

    Route::get('/profile', [AdminProfileController::class, 'reactView'])->name('Admin/Profile.jsx');
    Route::get('/account', [AdminAccountController::class, 'reactView'])->name('Admin/Account.jsx');
});

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use ZipArchive;
use App\Models\Item;
use App\Models\ItemImage;

Route::post('/upload-zip', function (Request $request) {
    $request->validate([
        'zip_file' => 'required|mimes:zip|max:10240', // Máximo 10MB
    ]);

    // Guardar el ZIP en una carpeta temporal
    $path = $request->file('zip_file')->store('temp_zip');

    // Ruta absoluta al archivo ZIP
    $zipPath = storage_path('app/' . $path);

    // Crear una carpeta para extraer el ZIP
    $extractPath = storage_path('app/temp_zip_extract/');
    if (!file_exists($extractPath)) {
        mkdir($extractPath, 0777, true);
    }

    // Descomprimir el archivo ZIP
    $zip = new ZipArchive;
    if ($zip->open($zipPath) === TRUE) {
        $zip->extractTo($extractPath);
        $zip->close();
    } else {
        return response()->json(['error' => 'No se pudo abrir el archivo ZIP'], 400);
    }

    // Procesar imágenes
    $files = glob($extractPath . '*.{jpg,jpeg,png,webp}', GLOB_BRACE);

    foreach ($files as $file) {
        $filename = pathinfo($file, PATHINFO_BASENAME);

        // Validar el formato SKU
        if (preg_match('/^(sku_\d+)(?:_(\d+))?\.(jpg|jpeg|png|webp)$/', $filename, $matches)) {
            $sku = $matches[1];
            $is_gallery = isset($matches[2]);

            // Buscar el producto por SKU
            $item = Item::where('sku', $sku)->first();

            if ($item) {
                // Definir carpeta de destino
                $destination = $is_gallery ? "images/item_image/" : "images/item/";

                // Mover la imagen a la carpeta correcta
                $newName = $filename; // Se mantiene el mismo nombre
                Storage::move('temp_zip_extract/' . $filename, 'app/' . $destination . $newName);

                if ($is_gallery) {
                    // Guardar en la galería
                    ItemImage::create([
                        'item_id' => $item->id,
                        'url' => $newName, // Solo guardamos el nombre del archivo
                    ]);
                } else {
                    // Actualizar el campo `image` en Item
                    $item->update(['image' => $newName]);
                }
            }
        }
    }

    // Limpiar archivos temporales
    Storage::deleteDirectory('temp_zip');
    Storage::deleteDirectory('temp_zip_extract');

    return response()->json(['message' => 'Imágenes cargadas correctamente']);
});
