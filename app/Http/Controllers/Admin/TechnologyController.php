<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\Symbology;
use App\Models\Technology;
use App\Models\Post;
use Illuminate\Http\Request;

class TechnologyController extends BasicController
{
    public $model = Technology::class;
    public $reactView = 'Admin/Technologies';
    public $imageFields = ['banner', 'image'];

    public function getTechnologiesWithRecentPosts()
    {
        try {
            // Obtener TODAS las tecnologías visibles
            $technologies = Technology::where('visible', true)->get();
            
            $result = $technologies->map(function($technology) {
                // Obtener el post más reciente para cada tecnología individualmente
                $recentPost = Post::where('technology_id', $technology->id)
                    ->where('status', true)
                    ->orderBy('created_at', 'desc')
                    ->first();
                    
                return [
                    'id' => $technology->id,
                    'name' => $technology->name,
                    'description' => $technology->description,
                    'image' => $technology->image,
                    'banner' => $technology->banner,
                    'recent_post' => $recentPost ? [
                        'id' => $recentPost->id,
                        'title' => $recentPost->name,
                        'slug' => $recentPost->slug,
                        'image' => $recentPost->image,
                        'summary' => $recentPost->summary,
                        'created_at' => $recentPost->created_at,
                    ] : null
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}