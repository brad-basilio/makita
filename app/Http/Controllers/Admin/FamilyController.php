<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Family;
use Illuminate\Http\Request;

class FamilyController extends BasicController
{
    public $model = Family::class;
    public $reactView = 'Admin/Families';
    public $imageFields = ['banner', 'image'];
}