<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;
use Illuminate\Http\Request;

class PostController extends BasicController
{
    public $model = Post::class;
    public $prefix4filter = 'posts';

    public function setPaginationInstance(Request $request, string $model)
    {
        return $model::select(['posts.*'])
            ->with(['postCategory'])
            ->join('post_categories AS postCategory', 'postCategory.id', 'posts.post_category_id')
            ->where('posts.status', true)
            ->where('postCategory.status', true);
    }

    /**
     * Obtiene los 4 posts más recientes excluyendo la categoría 'tecnologia'
     */
    public function getRecentPostsExcludingTechnology()
    {
        try {
            $posts = Post::with(['postCategory', 'technology'])
                ->where('status', true)
                ->whereHas('postCategory', function($query) {
                    $query->where('status', true)
                          ->where('slug', '!=', 'tecnologia');
                })
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $posts->map(function($post) {
                    return [
                        'id' => $post->id,
                        'name' => $post->name,
                        'slug' => $post->slug,
                        'summary' => $post->summary,
                        'description' => $post->description,
                        'image' => $post->image,
                        'post_date' => $post->post_date,
                        'created_at' => $post->created_at,
                        'post_category' => $post->postCategory ? [
                            'id' => $post->postCategory->id,
                            'name' => $post->postCategory->name,
                            'slug' => $post->postCategory->slug,
                        ] : null,
                        'technology' => $post->technology ? [
                            'id' => $post->technology->id,
                            'name' => $post->technology->name,
                            'slug' => $post->technology->slug,
                        ] : null,
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener los posts: ' . $e->getMessage()
            ], 500);
        }
    }
}
