<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Application;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Family;
use App\Models\Item;
use App\Models\ItemTag;
use App\Models\Platform;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use SoDe\Extend\Crypto;
use SoDe\Extend\Text;
use Exception;
use App\Models\ItemSpecification;

class ItemController extends BasicController
{
    public $model = Item::class;
    public $reactView = 'Admin/Items';
    public $imageFields = ['image', 'banner', 'texture'];
    public $prefix4filter = 'items';
    public $with4get = ['platform', 'family', 'applications', 'symbologies'];

    public function mediaGallery(Request $request, string $uuid)
    {
        try {
            $snake_case = 'item/gallery';
            if (Text::has($uuid, '.')) {
                $route = "images/{$snake_case}/{$uuid}";
            } else {
                $route = "images/{$snake_case}/{$uuid}.img";
            }
            $content = Storage::get($route);
            if (!$content) throw new Exception('Imagen no encontrado');
            return response($content, 200, [
                'Content-Type' => 'application/octet-stream'
            ]);
        } catch (\Throwable $th) {
            $content = Storage::get('utils/cover-404.svg');
            $status = 200;
            if ($this->throwMediaError) return null;
            return response($content, $status, [
                'Content-Type' => 'image/svg+xml'
            ]);
        }
    }
    /*
    public function save(Request $request): HttpResponse|ResponseFactory
    {


//dump($request->all());

        DB::beginTransaction();
        try {
            // Validar los datos recibidos
            $validated = $request->validate([
                'category_id' => 'required|exists:categories,id',
                'subcategory_id' => 'nullable|exists:sub_categories,id',
                'brand_id' => 'nullable|exists:brands,id',
                'name' => 'required|string|max:255',
                'summary' => 'nullable|string',
                'price' => 'required|numeric',
                'discount' => 'nullable|numeric',
                'tags' => 'nullable|array',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'gallery_ids' => 'nullable|array',
                'gallery_ids.*' => 'nullable|integer',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'nullable|integer',
            ]);

            // Crear o actualizar el elemento
            $item = Item::updateOrCreate(
                ['id' => $request->input('id')],
                [
                    'category_id' => $request->input('category_id'),
                    'subcategory_id' => $request->input('subcategory_id'),
                    'brand_id' => $request->input('brand_id'),
                    'name' => $request->input('name'),
                    'summary' => $request->input('summary'),
                    'price' => $request->input('price'),
                    'discount' => $request->input('discount'),
                    'description' => $request->input('description'),
                ]
            );

            // Guardar la imagen principal
            if ($request->hasFile('image')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("image");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->image = "{$uuid}.{$ext}";
                $item->save();
            }

            // Guardar el banner
            if ($request->hasFile('banner')) {
                $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                $full = $request->file("banner");
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $item->banner = "{$uuid}.{$ext}";
                $item->save();
            }

            // Guardar las imágenes nuevas de la galería
            if ($request->hasFile('gallery')) {

                foreach ($request->file('gallery') as $file) {
                    $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
                    $full = $file;
                    $uuid = Crypto::randomUUID();
                    $ext = $full->getClientOriginalExtension();
                    $path = "images/{$snake_case}/gallery/{$uuid}.{$ext}";
                    Storage::put($path, file_get_contents($full));
                    $item->images()->create(['url' => "{$uuid}.{$ext}"]);
                }
            }

            // Actualizar las imágenes existentes
            if ($request->has('gallery_ids')) {
                $existingImageIds = $request->input('gallery_ids');
                foreach ($existingImageIds as $id) {
                    $item->images()->where('id', $id)->update(['item_id' => $item->id]);
                }
            }

            // Eliminar las imágenes marcadas para eliminación
            if ($request->has('deleted_images')) {
                $deletedImageIds = $request->input('deleted_images');
                $item->images()->whereIn('id', $deletedImageIds)->delete();
            }

            DB::commit();
            return response(['message' => 'Elemento guardado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response(['message' => 'Error al guardar el elemento: ' . $e->getMessage()], 500);
        }
    }
*/
    public function setReactViewProperties(Request $request)
    {
        $categories = Category::where('status', 1)->get();
        $brands = Brand::where('status', 1)->get();
        $collections = Collection::where('status', 1)->get();
        $platforms = Platform::where('status', 1)->get();
        $families = Family::where('status', 1)->get();
        $applications = Application::where('status', 1)->get();

        return [
            'categories' => $categories,
            'brands' => $brands,
            'collections' => $collections,
            'platforms' => $platforms,
            'families' => $families,
            'applications' => $applications
        ];
    }

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select(['items.*'])
            ->with(['category', 'subcategory', 'brand', 'images', 'collection', 'specifications', 'applications', 'platform', 'family'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id');
    }



    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        $tags = explode(',', $request->tags ?? '');
        $applications = $request->applications ?? [];
        $symbologies = $request->symbologies ?? [];

        DB::transaction(function () use ($jpa, $tags, $applications, $symbologies, $request) {
            // Manejo de Tags
            ItemTag::where('item_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

            foreach ($tags as $tag) {
                if (Uuid::isValid($tag)) {
                    $tagId = $tag;
                } else {
                    $tagJpa = Tag::firstOrCreate(['name' => $tag]);
                    $tagId = $tagJpa->id;
                }

                ItemTag::updateOrCreate([
                    'item_id' => $jpa->id,
                    'tag_id' => $tagId
                ]);
            }

            // Manejo de Applications
            if (is_array($applications) && !empty($applications)) {
                // Eliminar aplicaciones que ya no están seleccionadas
                DB::table('item_application')
                    ->where('item_id', $jpa->id)
                    ->whereNotIn('application_id', $applications)
                    ->delete();

                // Agregar o mantener las aplicaciones seleccionadas
                foreach ($applications as $applicationId) {
                    if (!empty($applicationId)) {
                        DB::table('item_application')->updateOrInsert([
                            'item_id' => $jpa->id,
                            'application_id' => $applicationId
                        ]);
                    }
                }
            } else {
                // Si no hay aplicaciones seleccionadas, eliminar todas las existentes
                DB::table('item_application')->where('item_id', $jpa->id)->delete();
            }

            // Manejo de Symbologies
            if (is_array($symbologies) && !empty($symbologies)) {
                // Eliminar simbologías que ya no están seleccionadas
                DB::table('item_symbology')
                    ->where('item_id', $jpa->id)
                    ->whereNotIn('symbology_id', $symbologies)
                    ->delete();

                // Agregar o mantener las simbologías seleccionadas
                foreach ($symbologies as $symbologyId) {
                    if (!empty($symbologyId)) {
                        DB::table('item_symbology')->updateOrInsert([
                            'item_id' => $jpa->id,
                            'symbology_id' => $symbologyId
                        ]);
                    }
                }
            } else {
                // Si no hay simbologías seleccionadas, eliminar todas las existentes
                DB::table('item_symbology')->where('item_id', $jpa->id)->delete();
            }
        });
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                if (!$file) continue;

                $imageRequest = new Request();
                $imageRequest->replace(['item_id' => $jpa->id]);
                $imageRequest->files->set('url', $file);

                (new ItemImageController())->save($imageRequest);
            }
        }

        // DEBUG: Log de todos los datos recibidos
        \Log::info('DEBUG - Datos recibidos en afterSave:', [
            'item_id' => $jpa->id,
            'gallery_ids' => $request->input('gallery_ids'),
            'deleted_images' => $request->input('deleted_images'),
            'all_request_data' => $request->all()
        ]);

        // Procesar gallery_ids para preservar imágenes existentes
        if ($request->has('gallery_ids')) {
            $galleryIds = $request->input('gallery_ids');
            \Log::info('DEBUG - Procesando gallery_ids:', ['gallery_ids' => $galleryIds]);
            
            if (is_array($galleryIds)) {
                foreach ($galleryIds as $imageId) {
                    if (!empty($imageId)) {
                        \Log::info('DEBUG - Actualizando imagen existente:', ['image_id' => $imageId, 'item_id' => $jpa->id]);
                        // Verificar que la imagen existe y pertenece al item
                        $jpa->images()->where('id', $imageId)->update(['item_id' => $jpa->id]);
                    }
                }
            }
        }

        // Eliminar las imágenes marcadas para eliminación
        if ($request->has('deleted_images')) {
            $deletedImagesJson = $request->input('deleted_images');
            $deletedImageIds = json_decode($deletedImagesJson, true);
            
            \Log::info('DEBUG - Procesando deleted_images:', [
                'deleted_images_json' => $deletedImagesJson,
                'deleted_image_ids' => $deletedImageIds
            ]);
            
            if (is_array($deletedImageIds) && !empty($deletedImageIds)) {
                // Obtener las imágenes antes de eliminarlas para borrar los archivos físicos
                $imagesToDelete = $jpa->images()->whereIn('id', $deletedImageIds)->get();
                
                \Log::info('DEBUG - Imágenes a eliminar:', ['images_to_delete' => $imagesToDelete->toArray()]);
                
                foreach ($imagesToDelete as $image) {
                    // Eliminar el archivo físico
                    $imagePath = "images/item/gallery/{$image->url}";
                    if (Storage::exists($imagePath)) {
                        Storage::delete($imagePath);
                        \Log::info('DEBUG - Archivo físico eliminado:', ['path' => $imagePath]);
                    }
                }
                
                // Eliminar los registros de la base de datos
                $deletedCount = $jpa->images()->whereIn('id', $deletedImageIds)->delete();
                \Log::info('DEBUG - Registros eliminados de BD:', ['count' => $deletedCount]);
            }
        }

        // Decodificar features y specifications
        try {
            $features = json_decode($request->input('features'), true);
            $specifications = json_decode($request->input('specifications'), true);

            // Procesar features
            if ($features && is_array($features)) {
                (new ItemFeatureController())->saveFeatures($jpa, $features);
            }

            // Procesar specifications
            if ($specifications && is_array($specifications)) {
                // Guardar cada specification asociada al item
                (new ItemSpecificationController())->saveSpecifications($jpa, $specifications);
            }
        } catch (\Exception $e) {
            Log::error('Error processing features/specifications: ' . $e->getMessage());
            Log::error('Features data: ' . $request->input('features'));
            Log::error('Specifications data: ' . $request->input('specifications'));
            throw $e;
        }

        // if ($specifications && is_array($specifications)) {
        //     // Primero eliminar las que ya no existen
        //     $existingIds = collect($specifications)->pluck('id')->filter();
        //     ItemSpecification::where('item_id', $jpa->id)
        //         ->whereNotIn('id', $existingIds)
        //         ->delete();
            
        //     // Luego crear/actualizar las restantes
        //     foreach ($specifications as $spec) {
        //         ItemSpecification::updateOrCreate(
        //             ['id' => $spec['id'] ?? null],
        //             [
        //                 'item_id' => $jpa->id,
        //                 'type' => $spec['type'],
        //                 'title' => $spec['title'],
        //                 'description' => $spec['description']
        //             ]
        //         );
        //     }
        // }
    }
}
