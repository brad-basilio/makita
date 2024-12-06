<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Item;
use App\Models\WebDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ItemController extends BasicController
{
    public $model = Item::class;
    public $reactView = 'Courses';
    public $reactRootView = 'public';
    public $prefix4filter = 'items';

    public function setReactViewProperties(Request $request)
    {
        $categories = Category::select([
            DB::raw('DISTINCT(categories.id)'),
            'categories.name'
        ])
            ->join('items', 'items.category_id', 'categories.id')
            ->where('categories.status', true)
            ->where('categories.visible', true)
            ->where('items.status', true)
            ->where('items.visible', true)
            ->get();
        $details = WebDetail::where('page', 'courses')->get();
        return [
            'categories' => $categories,
            'details' => $details
        ];
    }

    public function setPaginationInstance(string $model)
    {
        return $model::select(['items.*'])
            ->with(['category'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id')
            ->where('items.status', true)
            ->where('items.visible', true)
            ->where('category.status', true)
            ->where('category.visible', true);
    }
}
