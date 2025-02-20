<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Combo;
use App\Models\Item;
use App\Models\ItemTag;
use App\Models\SubCategory;
use App\Models\Tag;
use App\Models\WebDetail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\Response;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;

use Illuminate\Http\Response as HttpResponse;

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
            ->with(['category', 'subcategory', 'brand', 'tags'])
            ->leftJoin('categories AS category', 'category.id', 'items.category_id')
            ->leftJoin('sub_categories AS subcategory', 'subcategory.id', 'items.subcategory_id')
            ->leftJoin('brands AS brand', 'brand.id', 'items.brand_id')
            ->leftJoin('item_tags AS item_tag', 'item_tag.item_id', 'items.id')
            ->where('items.status', true)
            ->where('items.visible', true)
            ->where(function ($query) {
                $query->where('category.status', true)
                    ->orWhereNull('category.id'); // Ignorar si es null
            })
            ->where(function ($query) {
                $query->where('category.visible', true)
                    ->orWhereNull('category.id'); // Ignorar si es null
            })
            ->where(function ($query) {
                $query->where('subcategory.status', true)
                    ->orWhereNull('subcategory.id'); // Ignorar si es null
            })
            ->where(function ($query) {
                $query->where('subcategory.visible', true)
                    ->orWhereNull('subcategory.id'); // Ignorar si es null
            })
            ->where(function ($query) {
                $query->where('brand.status', true)
                    ->orWhereNull('brand.id'); // Ignorar si es null
            })
            ->where(function ($query) {
                $query->where('brand.visible', true)
                    ->orWhereNull('brand.id'); // Ignorar si es null
            });
    }

    public function setPaginationSummary(Request $request, Builder $builder)
    {
        $i4category = clone $builder;
        $i4subcategory = clone $builder;
        $i4brand = clone $builder;
        $i4tag = clone $builder;

        $categories = Item::getForeign($i4category, Category::class, 'category_id');
        $subcategories = Item::getForeign($i4subcategory, SubCategory::class, 'subcategory_id');
        $brands = Item::getForeign($i4brand, Brand::class, 'brand_id');
        $tags = Item::getForeignMany($i4tag, ItemTag::class, Tag::class);

        return [
            'categories' => $categories,
            'subcategories' => $subcategories,
            'brands' => $brands,
            'tags' => $tags
        ];
    }

    public function verifyStock(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            return Item::select(['id', 'price', 'discount', 'name'])
                ->whereIn('id', $request->all())
                ->get();
        });
        return response($response->toArray(), $response->status);
    }
    public function verifyCombo2(Request $request)
    {
        dump($request->all());
        try {
            // Validar la solicitud
            $validated = $request->validate([
                'id' => 'required', // Asegúrate de que el producto exista
            ]);

            // Buscar combos donde el producto sea el principal
            $combos = Combo::whereHas('items', function ($query) use ($validated) {
                $query->where('item_id', $validated['id'])
                    ->where('is_main_item', true);
            })->with(['items' => function ($query) {
                $query->orderBy('is_main_item', 'desc'); // Ordenar para que el principal aparezca primero
            }])->get();

            dump($combos);

            // Verificar si hay combos
            if ($combos->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'El producto no es un producto principal en ningún combo.',
                ], 404);
            }

            // Formatear los datos de respuesta
            $result = $combos->map(function ($combo) {
                return [
                    'combo_id' => $combo->id,
                    'combo_name' => $combo->name,
                    'main_product' => $combo->items->firstWhere('pivot.is_main_item', true),
                    'associated_items' => $combo->items->filter(function ($item) {
                        return !$item->pivot->is_main_item;
                    }),
                ];
            });
            dump($result);
            return response()->json([
                'status' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    public function verifyCombo(Request $request): HttpResponse | ResponseFactory
    {
        $response = new Response();
        try {
            // Validar el correo electrónico
            $request->validate([
                'id' => 'required',
            ]);

            // Buscar al usuario por correo electrónico
            // Buscar combos donde el producto sea el principal
            $combos = Combo::whereHas('items', function ($query) use ($request) {
                $query->where('item_id', $request->id)
                    ->where('is_main_item', true);
            })->with([
                'items' => function ($query) {
                    $query->orderBy('is_main_item', 'desc'); // Ordenar para que el principal aparezca primero
                },
                'items.category', // Incluir la categoría del item
                'items.brand'     // Incluir la marca del item
            ])->get();

            dump($combos);

            // Verificar si hay combos
            if ($combos->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'El producto no es un producto principal en ningún combo.',
                ], 404);
            }

            // Formatear los datos de respuesta
            $result = $combos->map(function ($combo) {
                return [
                    'combo_id' => $combo->id,
                    'combo_name' => $combo->name,
                    'main_product' => $combo->items->firstWhere('pivot.is_main_item', true),
                    'associated_items' => $combo->items->filter(function ($item) {
                        return !$item->pivot->is_main_item;
                    }),
                ];
            });

            dump($result);

            // Respuesta exitosa
            $response->status = 200;
            $response->message = 'Se ha enviado un enlace para restablecer tu contraseña.';
            $response->data = $result;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        } finally {
            return response(
                $response->toArray(),
                $response->status
            );
        }
    }
}
