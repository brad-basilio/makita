<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\System;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use SoDe\Extend\Crypto;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;
use Throwable;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\DB;
use ReflectionClass;

class SystemController extends BasicController
{
    public $model = System::class;
    public $reactView = 'Admin/System';
    public $softDeletion = false;


    private function getRelations(Model $modelo)
    {
        $relaciones = [];
        $reflexion = new ReflectionClass($modelo);

        foreach ($reflexion->getMethods() as $metodo) {
            if ($metodo->class === $reflexion->getName() && $metodo->isPublic() && !$metodo->isStatic()) {
                try {
                    $resultado = $modelo->{$metodo->name}();
                    if ($resultado instanceof Relation) {
                        $relaciones[] = $metodo->name;
                    }
                } catch (Throwable $e) {
                    continue;
                }
            }
        }

        return $relaciones;
    }

    public function setReactViewProperties(Request $request)
    {
        $systems = System::all();
        $pages = JSON::parse(File::get(storage_path('app/pages.json')));
        $components = JSON::parse(File::get(storage_path('app/components.json')));

        $files = File::scan(base_path() . '/app/Models', ['type' => 'file']);
        $models = [];
        foreach ($files as $file) {
            $fileName = str_replace('.php', '', $file);
            $modelName = str_replace('/', '\\', $fileName);
            $className = 'App\\Models\\' . $modelName;

            if (!is_subclass_of($className, Model::class)) continue;

            $modelInstance = new $className();
            $fields = $modelInstance->getFillable();

            $relations = $this->getRelations($modelInstance);

            $models[] = [
                'name' => $modelName,
                'fields' => $fields,
                'relations' => $relations
            ];
        }

        return [
            'systems' => $systems,
            'pages' => $pages,
            'components' => $components,
            'models' => $models
        ];
    }

    public function afterSave(Request $request, object $jpa)
    {
        return $jpa;
    }

    public function updateOrder(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $udpates = $request->all();
            foreach ($udpates as $id => $after_component) {
                $system = System::find($id);
                $system->after_component = $after_component;
                $system->save();
            }
        });
        return response($response->toArray(), $response->status);
    }

    public function savePage(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $pages = JSON::parse(File::get(storage_path('app/pages.json')));

            $pageData = $request->all();
            $pageId = $pageData['id'] ?? null;

            $isUpdated = false;

            $newPages = array_map(function ($p) use ($pageData, $pageId, &$isUpdated) {
                if ($p['id'] === $pageId) {
                    $isUpdated = true;
                    return array_merge($p, $pageData);
                }
                return $p;
            }, $pages);

            if (!$isUpdated) {
                $newPages[] = [
                    'id' => Crypto::randomUUID(),
                    'name' => $pageData['name'] ?? 'Nueva página',
                    'path' => $pageData['path'] ?? '/page-' . Crypto::short(),
                    'extends_base' => true
                ];
            }

            File::save(storage_path('app/pages.json'), JSON::stringify($newPages, true));

            return $newPages;
        });

        return response($response->toArray(), 200);
    }

    public function deletePage(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            $pages = JSON::parse(File::get(storage_path('app/pages.json')));
            $pageId = $request->route('id');
            $newPages = array_filter($pages, function ($p) use ($pageId) {
                return $p['id'] !== $pageId;
            });
            File::save(storage_path('app/pages.json'), JSON::stringify(array_values($newPages), true));
            return true;
        });

        return response($response->toArray(), $response->status);
    }

    public function exportBK(Request $request)
    {
        $backup = [
            'pages' => JSON::parse(File::get(storage_path('app/pages.json'))),
            'components' => $this->model::with([])->all()
        ];
        return $backup;
    }

    public function importBK(Request $request)
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            DB::transaction(function () use ($request) {
                $this->model::whereNotNull('id')->delete();

                foreach ($request->all() as $data) {
                    $this->model::create($data);
                }
            });
        });
        return response($response->toArray(), $response->status);
    }
}
