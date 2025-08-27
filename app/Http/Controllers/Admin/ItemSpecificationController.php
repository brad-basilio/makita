<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Indicator;
use App\Models\ItemFeature;
use App\Models\ItemSpecification;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class ItemSpecificationController extends BasicController
{
    public $model = ItemSpecification::class;
    public function setReactViewProperties(Request $request)
    {
        return [];
    }

    public function saveSpecifications(object $jpa, array $specifications)
    {
        try {
            Log::info('Processing specifications for item: ' . $jpa->id);
        Log::info('Specifications data: ' . json_encode($specifications));
            
            // Obtener IDs existentes (solo los que no son null)
            $existingIds = collect($specifications)
                ->pluck('id')
                ->filter() // Elimina valores null/empty
                ->toArray();
            
            // Eliminar especificaciones que ya no existen
            ItemSpecification::where('item_id', $jpa->id)
                ->whereNotIn('id', $existingIds)
                ->delete();

            // Procesar cada especificación
            foreach ($specifications as $spec) {
                Log::info('Processing spec: ' . json_encode($spec));
                
                $specId = Arr::get($spec, 'id');
                
                if ($specId) {
                     // Actualizar especificación existente
                     $updateData = [
                         'type' => Arr::get($spec, 'type'),
                         'description' => Arr::get($spec, 'description'),
                     ];
                     
                     // Solo agregar title si no está vacío
                     if (!empty(Arr::get($spec, 'title'))) {
                         $updateData['title'] = Arr::get($spec, 'title');
                     }
                     
                     // Solo agregar tooltip si no está vacío
                     if (!empty(Arr::get($spec, 'tooltip'))) {
                         $updateData['tooltip'] = Arr::get($spec, 'tooltip');
                     }
                     
                     ItemSpecification::updateOrCreate(
                         [
                             'id' => $specId,
                             'item_id' => $jpa->id
                         ],
                         $updateData
                     );
                } else {
                     // Crear nueva especificación
                     $specData = [
                         'item_id' => $jpa->id,
                         'type' => Arr::get($spec, 'type'),
                         'description' => Arr::get($spec, 'description'),
                     ];
                     
                     // Solo agregar title si no está vacío
                     if (!empty(Arr::get($spec, 'title'))) {
                         $specData['title'] = Arr::get($spec, 'title');
                     }
                     
                     // Solo agregar tooltip si no está vacío
                     if (!empty(Arr::get($spec, 'tooltip'))) {
                         $specData['tooltip'] = Arr::get($spec, 'tooltip');
                     }
                     
                     ItemSpecification::create($specData);
                 }
            }
            
            Log::info('Specifications processed successfully');
        } catch (\Exception $e) {
            Log::error('Error in saveSpecifications: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            throw $e;
        }
    }
}
