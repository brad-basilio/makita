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
    
    /**
     * Get platforms with product count for SliderFeaturedMakita
     */
    public function getPlatformsWithProductCount(Request $request)
    {
        $platforms = Platform::where('visible', true)
            ->where('status', true)
          
            ->withCount('items')
            ->orderBy('featured', 'desc')
            ->orderBy('name', 'asc')
            ->limit(10)
            ->get();
            
        return response()->json([
            'success' => true,
            'data' => $platforms
        ]);
    }
}