<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;

class SaleController extends BasicController
{
    public $model = Sale::class;
    public $reactView = 'Admin/Sales';
    public $with4get = ['details'];
}
