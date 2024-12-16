<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\System;
use Illuminate\Http\Request;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class BannerController extends BasicController
{
    public $model = System::class;
    public $reactView = 'Admin/Banners';
    public $imageFields = ['background', 'image'];

    public function setReactViewProperties(Request $request)
    {
        $pages = JSON::parse(File::get(storage_path('app/pages.json')));
        return [
            'pages' => $pages
        ];
    }

    public function setPaginationInstance(string $model)
    {
        return $model::with('after')
            ->where('component', 'banner');
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = new Response();
        try {
            $body = $request->all();
            unset($body['id']);

            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
            foreach ($this->imageFields as $field) {
                if (!$request->hasFile($field)) continue;
                $full = $request->file($field);
                $uuid = Crypto::randomUUID();
                $ext = $full->getClientOriginalExtension();
                $path = "images/{$snake_case}/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($full));
                $body[$field] = "{$uuid}.{$ext}";
            }

            $this->model::where('id', $request->id)
                ->update([
                    'data' => $body
                ]);

            $response->status = 200;
            $response->message = 'Operacion correcta';
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
