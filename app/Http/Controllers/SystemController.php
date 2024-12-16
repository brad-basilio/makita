<?php

namespace App\Http\Controllers;

use App\Models\System;
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
        $path = $request->server('PATH_INFO') ?? '/';
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
            return $props;
        }

        $page = collect($pages)->filter(function ($item) use ($path) {
            $path2check = $item['pseudo_path'] ?? $item['path'];
            return strpos($path, $path2check ) === 0; // Filtra las páginas que comienzan con el path
        })->sortByDesc(function ($item) {
            return strlen($item['pseudo_path'] ?? $item['path']);
        })->first();

        if (!$page) {
            abort(404);
        }

        $page['using'] = $page['using'] ?? [];

        $props['page'] = $page;
        $this->reactData = $page;

        $systems = [];
        if (isset($page['extends_base']) && $page['extends_base']) {
            $systems = System::whereNull('page_id')->orWhere('page_id', $page['id'])->get();
        } else {
            $systems = System::where('page_id', $page['id'])->get();
        }

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
        }

        $props['systems'] = $systems;
        $props['params'] = $request->route() ? $request->route()->parameters() : [];

        foreach ($props['params'] as $key) {
            
        }

        return $props;
    }
}
