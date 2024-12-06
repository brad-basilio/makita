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

    public function setReactViewProperties(Request $request)
    {
        $images = JSON::parse(File::get('./assets/resources/images.json'));
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
            file_put_contents('./assets/resources/' . $name, file_get_contents($file));
        });
        return response($response->toArray(), $response->status);
    }
}
