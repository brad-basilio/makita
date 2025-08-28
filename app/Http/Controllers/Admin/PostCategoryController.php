<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\PostCategory;
use Illuminate\Http\Request;

class PostCategoryController extends BasicController
{
    public $model = PostCategory::class;
    public $reactView = 'Admin/PostCategories';
    public $imageFields = ['banner', 'image'];

    public function beforeDelete(Request $request)
    {
        $postCategory = PostCategory::find($request->route('id'));
        if ($postCategory && $postCategory->posts()->count() > 0) {
            throw new \Exception('No se puede eliminar la categoría porque tiene posts asociados.');
        }
        return [];
    }
}
