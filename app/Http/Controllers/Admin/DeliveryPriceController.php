<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\DeliveryPrice;
use Illuminate\Http\Request;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class DeliveryPriceController extends BasicController
{
    public $model = DeliveryPrice::class;
    public $reactView = 'Admin/DeliveryPrices';

    public function setReactViewProperties(Request $request)
    {
        $ubigeo = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));
        return [
            'ubigeo' => $ubigeo
        ];
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $found = $this->model::where('ubigeo', $body['ubigeo'])->first();
        if ($found) $body['id'] = $found->id;
        return $body;
    }
}
