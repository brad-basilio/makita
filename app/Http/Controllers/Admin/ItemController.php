<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Item;
use App\Models\ItemTag;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Ramsey\Uuid\Uuid;

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

    public function afterSave(Request $request, object $jpa)
    {
        $tags = \explode(',', $request->tags ?? '');

        DB::transaction(function () use ($jpa, $tags) {
            ItemTag::where('item_id', $jpa->id)->whereNotIn('tag_id', $tags)->delete();

            foreach ($tags as $tag) {
                if (Uuid::isValid($tag)) {
                    $tagId = $tag;
                } else {
                    $tagJpa = Tag::firstOrCreate(['name' => $tag]);
                    $tagId = $tagJpa->id;
                }

                ItemTag::updateOrCreate([
                    'item_id' => $jpa->id,
                    'tag_id' => $tagId
                ]);
            }
        });
    }
}
