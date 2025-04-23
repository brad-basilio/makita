<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Sale;

class SaleController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Admin/Sales';
}
