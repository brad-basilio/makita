<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\DeliveryPrice;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Maatwebsite\Excel\Facades\Excel;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class TypesDeliveryController extends BasicController
{
    public $model = DeliveryPrice::class;
    public $reactView = 'Admin/DeliveryPricesType';
}
