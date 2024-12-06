<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Benefit;
use Illuminate\Http\Request;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';
    public $reactRootView = 'admin';

    public function setReactViewProperties(Request $request)
    {
        
        return [];
    }
}
