<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Attribute;
use Illuminate\Http\Request;

class AttributeController extends BasicController
{
    public $model = Attribute::class;
    public $reactView = 'Admin/Attributes';
    
    /**
     * Obtener todos los atributos con sus valores únicos
     */
    public function getAttributesWithValues(Request $request)
    {
        $attributes = Attribute::where('visible', true)
            ->orderBy('order', 'asc')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($attribute) {
                return [
                    'id' => $attribute->id,
                    'name' => $attribute->name,
                    'slug' => $attribute->slug,
                    'description' => $attribute->description,
                    'required' => $attribute->required,
                    'values' => $attribute->getUniqueValues(),
                ];
            });
            
        return response()->json([
            'success' => true,
            'data' => $attributes
        ]);
    }

    /**
     * Obtener atributos para un item específico
     */
    public function getItemAttributes(Request $request, $itemId)
    {
        $attributes = Attribute::whereHas('items', function ($query) use ($itemId) {
            $query->where('items.id', $itemId);
        })
        ->with(['items' => function ($query) use ($itemId) {
            $query->where('items.id', $itemId);
        }])
        ->get()
        ->map(function ($attribute) {
            return [
                'id' => $attribute->id,
                'name' => $attribute->name,
                'value' => $attribute->items->first()->pivot->value ?? '',
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $attributes
        ]);
    }
}
