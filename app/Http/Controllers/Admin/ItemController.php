<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\WebDetail;
use Illuminate\Http\Request;
use SoDe\Extend\File;
use SoDe\Extend\JSON;

class ItemController extends BasicController
{
    public $model = Item::class;
    public $reactView = 'Admin/Items';
    public $imageFields = ['image'];
    public $prefix4filter = 'items';

    public function setReactViewProperties(Request $request)
    {
        $categories = Category::all();
        $brands = Brand::all();

        return [
            'categories' => $categories,
            'brands' => $brands
        ];
    }

    public function setPaginationInstance(string $model)
    {
        return $model::select(['items.*'])
            ->with(['category', 'subcategory', 'brand'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id');
    }
}
