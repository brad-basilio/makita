<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemGalleryController extends BasicController
{
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            // Validar los datos recibidos
            $validated = $request->validate([
                'item_id' => 'required|exists:items,id',
                'gallery' => 'nullable|array',
                'gallery.*' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
                'gallery_ids' => 'nullable|array',
                'gallery_ids.*' => 'nullable|integer',
                'deleted_images' => 'nullable|array',
                'deleted_images.*' => 'nullable|integer',
            ]);

            $itemId = $request->input('item_id');
            $item = Item::findOrFail($itemId);

            // Guardar las imágenes nuevas
            if ($request->hasFile('gallery')) {
                foreach ($request->file('gallery') as $file) {
                    $galleryPath = $file->store('items/gallery', 'public');
                    $item->images()->create([
                        'url' => $galleryPath,
                        'alt_text' => '', // Puedes agregar un campo en el frontend para esto
                        'order' => $item->images()->count() + 1, // Orden automático
                    ]);
                }
            }

            // Actualizar las imágenes existentes
            if ($request->has('gallery_ids')) {
                $existingImageIds = $request->input('gallery_ids');
                foreach ($existingImageIds as $index => $id) {
                    $item->images()->where('id', $id)->update([
                        'order' => $index + 1, // Actualizar el orden
                    ]);
                }
            }

            // Eliminar las imágenes marcadas para eliminación
            if ($request->has('deleted_images')) {
                $deletedImageIds = $request->input('deleted_images');
                $item->images()->whereIn('id', $deletedImageIds)->delete();
            }

            DB::commit();
            return response()->json(['message' => 'Galería actualizada correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al actualizar la galería: ' . $e->getMessage()], 500);
        }
    }

    public function show($itemId)
    {
        try {
            $item = Item::findOrFail($itemId);
            $images = $item->images()->orderBy('order')->get();
            return response()->json(['data' => $images], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error al obtener la galería: ' . $e->getMessage()], 500);
        }
    }
}
