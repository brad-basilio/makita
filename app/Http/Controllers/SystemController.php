<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\General;
use App\Models\System;
use App\Models\SystemColor;
use Illuminate\Http\Request;
use SoDe\Extend\Crypto;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Illuminate\Support\Facades\Schema;

class SystemController extends BasicController
{
    public $model = System::class;
    public $reactView = 'System';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $path = $request->server('REQUEST_URI') ?? '/';
        $pages = JSON::parse(File::get(storage_path('app/pages.json')));
        $components = JSON::parse(File::get(storage_path('app/components.json')));

        $props = [
            'pages' => $pages,
            'systems' => [],
            'params' => []
        ];

        if ($path === '/base-template') {
            $props['systems'] = System::whereNull('page_id')->get();
            $props['page'] = ['name' => 'Template base'];
            $this->reactData = $props['page'];
            $this->reactData['colors'] = SystemColor::all();
            $generals = [];
            foreach ($props['systems'] as $system) {
                if ($system->component == 'content') continue;
                $parent = collect($components)->firstWhere('id', $system->component);
                $component = collect($parent['options'])->firstWhere('id', $system->value);
                if (isset($component['generals'])) {
                    $generals = array_merge($generals, $component['generals']);
                }
            }
            $props['generals'] = General::whereIn('correlative', $generals)->get();
            return $props;
        }

        $page = collect($pages)->filter(function ($item) use ($path) {
            $path2check = isset($item['pseudo_path']) && $item['pseudo_path'] ?  $item['pseudo_path'] : $item['path'];
            return strpos($path, $path2check) === 0; // Filtra las páginas que comienzan con el path
        })->sortByDesc(function ($item) {
            return strlen($item['pseudo_path'] ?? $item['path']);
        })->first();

        if (!$page) {
            abort(404);
        }

        $page['using'] = $page['using'] ?? [];

        $props['page'] = $page;
        $this->reactData = $page;
        $this->reactData['colors'] = SystemColor::all();

        $systems = [];
        if (isset($page['extends_base']) && $page['extends_base']) {
            $systems = System::whereNull('page_id')->orWhere('page_id', $page['id'])->get();
        } else {
            $systems = System::where('page_id', $page['id'])->get();
        }

        $generals = [];
        foreach ($systems as $key => $system) {
            if ($system->component == 'content') continue;
            $parent = collect($components)->firstWhere('id', $system->component);
            $component = collect($parent['options'])->firstWhere('id', $system->value);
            if (isset($component['using'])) {
                $using = 'App\\Models\\' . $component['using']['model'];
                $query = $using::select($component['using']['fields'] ?? ['*']);

                if (isset($component['using']['with'])) {
                    $query->with($component['using']['with']);
                }

                if ($system->filters) {
                    foreach ($system->filters as $field) {
                        $query->where($field, true);
                    }
                }

                if (isset($component['using']['limit'])) {
                    $query->limit($component['using']['limit']);
                }

                // aquí filtrar visible & status
                $table = (new $using)->getTable();
                if (Schema::hasColumn($table, 'visible')) {
                    $query->where('visible', true);
                }
                if (Schema::hasColumn($table, 'status')) {
                    $query->where('status', true);
                }

                $shortID = Crypto::short();
                $system->itemsId = $shortID;
                $props['systemItems'][$shortID] = $query->get();
            }

            if (isset($component['generals'])) {
                $generals = array_merge($generals, $component['generals']);
            }
        }

        $props['systems'] = $systems;
        $props['params'] = $request->route() ? $request->route()->parameters() : [];
        $props['filteredData'] = [];
        $props['generals'] = General::whereIn('correlative', $generals)->get();

        foreach ($page['using'] as $key => $using) {
            $model = $using['model'] ?? null;
            $field = $using['field'] ?? null;
            $value = $request->$key ?? null;
            $relations = $using['relations'] ?? [];

            if ($model && $field && $value) {
                $class = 'App\\Models\\' . $model;
                $result = $class::with($relations)
                    ->where($field, $value)
                    ->first();
                $props['filteredData'][$model] = $result;
            }
        }


        // Obtener todas las categorías, marcas y otros filtros dinámicamente
        $props['filteredData']['Category'] = Category::where('visible', true)->with('subcategories')->get();
        $props['filteredData']['Brand'] = Brand::where('visible', true)->get();
        //$props['filteredData']['Color'] = Color::all();
        $props['filteredData']['PriceRange'] = [
            ["label" => "S/ 0 - S/ 100", "min" => 0, "max" => 100],
            ["label" => "S/ 100 - S/ 250", "min" => 100, "max" => 250],
            ["label" => "S/ 250 - S/ 500", "min" => 250, "max" => 500],
            ["label" => "S/ 500 - S/ 1.000", "min" => 500, "max" => 1000],
            ["label" => "S/ 1.000 - S/ 2.000", "min" => 1000, "max" => 2000],
            ["label" => "S/ 2.000 - S/ 5.000", "min" => 2000, "max" => 5000],
            ["label" => "Desde S/ 5.000", "min" => 5000, "max" => null]
        ];


        return $props;
    }
}
