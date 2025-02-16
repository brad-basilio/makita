<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Indicator;
use App\Models\ItemFeature;
use Illuminate\Http\Request;

class ItemFeatureController extends BasicController
{
    public $model = ItemFeature::class;
    public function setReactViewProperties(Request $request)
    {
        return [];
    }
    public function saveFeatures(object $jpa, array $features)
    {
        foreach ($features as $feature) {
            ItemFeature::create([
                'item_id' => $jpa->id,
                'feature' => $feature,
            ]);
        }
    }
}
