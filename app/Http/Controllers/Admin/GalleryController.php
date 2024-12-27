<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;

class GalleryController extends BasicController
{
    public $reactView = 'Admin/Gallery';

    public function __construct()
    {
        // Crear la carpeta si no existe
        $directory = public_path('assets/resources');
        if (!is_dir($directory)) {
            mkdir($directory, 0755, true);
        }
    }

    public function setReactViewProperties(Request $request)
    {
        $directory = public_path('assets/resources');
        $images = JSON::parse(File::get($directory . '/images.json'));
        return [
            'images' => $images
        ];
    }

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () use ($request) {
            if (!$request->hasFile('image')) throw new Exception('Debe cargar una imagen válida');
            $file = $request->file('image');
            $name = $request->name;

            $directory = public_path('assets/resources');
            if (!is_dir($directory)) {
                mkdir($directory, 0755, true);
            }

            file_put_contents($directory . '/' . $name, file_get_contents($file));
        });
        return response($response->toArray(), $response->status);
    }
}
