<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Symbology;
use App\Models\Technology;
use Illuminate\Http\Request;

class TechnologyController extends BasicController
{
    public $model = Technology::class;
    public $reactView = 'Admin/Technologies';
    public $imageFields = ['banner', 'image'];
}