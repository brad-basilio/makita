<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Symbology;
use Illuminate\Http\Request;

class SymbologyController extends BasicController
{
    public $model = Symbology::class;
    public $reactView = 'Admin/Symbologies';
    public $imageFields = ['banner', 'image'];
}