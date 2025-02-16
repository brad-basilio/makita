<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Indicator;
use App\Models\ItemFeature;
use App\Models\ItemSpecification;
use Illuminate\Http\Request;

class ItemSpecificationController extends BasicController
{
    public $model = ItemSpecification::class;
    public function setReactViewProperties(Request $request)
    {
        return [];
    }

    public function saveSpecifications(object $jpa, array $specifications)
    {
        foreach ($specifications as $specification) {
            ItemSpecification::create([
                'item_id' => $jpa->id,
                'type' => $specification['type'] ?? null,
                'title' => $specification['title'] ?? null,
                'description' => $specification['description'] ?? null,
            ]);
        }
    }
}
