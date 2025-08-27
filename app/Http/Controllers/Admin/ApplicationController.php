<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Application;
use Illuminate\Http\Request;

class ApplicationController extends BasicController
{
    public $model = Application::class;
    public $reactView = 'Admin/Applications';
    public $imageFields = ['banner', 'image'];
}