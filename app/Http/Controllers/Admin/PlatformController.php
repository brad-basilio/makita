<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Platform;
use Illuminate\Http\Request;

class PlatformController extends BasicController
{
    public $model = Platform::class;
    public $reactView = 'Admin/Platforms';
    public $imageFields = ['banner', 'image'];
}