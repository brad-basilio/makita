<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends BasicController
{
    public $model = Brand::class;
    public $reactView = 'Admin/Brands';
    public $imageFields = ['image'];
}
