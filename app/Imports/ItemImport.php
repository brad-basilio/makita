<?php

namespace App\Imports;

use App\Models\Item;
use App\Models\Category;
use App\Models\SubCategory;
use App\Models\Brand;
use App\Models\ItemSpecification;
use App\Models\ItemImage;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ItemImport implements ToModel, WithHeadingRow
{
    public function model(array $row)
    {
        // 1️⃣ Obtener o crear la categoría
        $category = Category::firstOrCreate(
            ['name' => $row['Categoria']],
            ['slug' => str()->slug($row['Categoria'])]
        );

        // 2️⃣ Obtener o crear la subcategoría
        $subCategory = SubCategory::firstOrCreate(
            ['name' => $row['SubCategoria'], 'category_id' => $category->id],
            ['slug' => str()->slug($row['SubCategoria'])]
        );

        // 3️⃣ Obtener o crear la marca
        $brand = Brand::firstOrCreate(
            ['name' => $row['marca']],
            ['slug' => str()->slug($row['marca'])]
        );

        // 4️⃣ Crear el producto
        $item = Item::create([
            'sku' => $row['SKU'],
            'name' => $row['Nombre de producto'],
            //'summary' => $row['resumen'],
            'description' => $row['Descripcion'],
            'price' => $row['Precio'],
            'discount' => $row['Descuento'],
            //final price = price > discount ? discount : discount ===NULL?price:discount;
            'final_price' => isset($row['Descuento']) && $row['Descuento'] > 0 ? $row['Descuento'] : $row['Precio'],
            'discount_percent' => isset($row['Descuento']) && $row['Descuento'] > 0 ? round((100 - ($row['Descuento'] / $row['Precio']) * 100)) : NULL,
            'category_id' => $category->id,
            'subcategory_id' => $subCategory->id,
            'brand_id' => $brand->id,
            'image' => $this->getMainImage($row['SKU']),
            'slug' => str()->slug($row['Nombre de producto']),
            'stock' =>  isset($row['Stock']) && $row['Stock'] > 0 ? $row['Stock'] : 10,
        ]);

        // 5️⃣ Guardar las especificaciones
        $this->saveSpecifications($item, $row['Especificaciones Principales (Separadas por comas)'], 'principal');
        $this->saveSpecifications($item, $row['Especificaciones Generales (Separado por comas y dos puntos)'], 'general');

        // 6️⃣ Guardar imágenes en la galería
        $this->saveGalleryImages($item, $row['sku']);
    }

    private function getMainImage($sku)
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        foreach ($extensions as $ext) {
            $path = "images/item/{$sku}.{$ext}";
            if (Storage::exists($path)) {
                return "{$sku}.{$ext}";
            }
        }
        return null;
    }

    private function saveSpecifications($item, $specs, $type)
    {
        $specsArray = explode(',', $specs);
        foreach ($specsArray as $spec) {
            if ($type == 'principal') {
                ItemSpecification::create([
                    'item_id' => $item->id,
                    'type' => $type,
                    'title' => trim($spec),
                    'description' => trim($spec),
                ]);
            } else {
                $parts = explode(':', $spec, 2);
                if (count($parts) == 2) {
                    $title = trim($parts[0]);
                    $description = trim($parts[1]);
                    ItemSpecification::create([
                        'item_id' => $item->id,
                        'type' => $type,
                        'title' => $title,
                        'description' => $description,
                    ]);
                }
            }
        }
    }

    private function saveGalleryImages($item, $sku)
    {
        $extensions = ['png', 'jpg', 'jpeg', 'webp'];
        $index = 1;

        while (true) {
            $found = false;
            foreach ($extensions as $ext) {
                $filename = "{$sku}_" . str_pad($index, 2, '0', STR_PAD_LEFT) . ".{$ext}";
                $path = "images/item/{$filename}";
                if (Storage::exists($path)) {
                    ItemImage::create([
                        'item_id' => $item->id,
                        'url' => $filename,
                    ]);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                break;
            }
            $index++;
        }
    }
}
