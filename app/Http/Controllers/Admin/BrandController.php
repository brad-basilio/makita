<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Brand;

class BrandController extends BasicController
{
    public $model = Brand::class;
    public $reactView = 'Admin/Brands';
    public $imageFields = ['image'];
}
