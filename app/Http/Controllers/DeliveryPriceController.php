<?php

namespace App\Http\Controllers;

use App\Http\Classes\EmailConfig;
use App\Http\Services\ReCaptchaService;
use App\Models\Constant;
use App\Models\DeliveryPrice;
use App\Models\ModelHasRoles;
use App\Models\User;
use App\Models\Person;
use App\Models\PreUser;
use App\Models\SpecialtiesByUser;
use App\Models\Specialty;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\View;
use Inertia\Inertia;
use SoDe\Extend\Crypto;
use SoDe\Extend\JSON;
use SoDe\Extend\Response;
use SoDe\Extend\Trace;
use Spatie\Permission\Models\Role;

class DeliveryPriceController extends BasicController
{


    public function getDeliveryPrice(Request $request): HttpResponse|ResponseFactory|RedirectResponse
    {
        $response = Response::simpleTryCatch(function (Response $response) use ($request) {
            // Verifica los datos recibidos
            //dump($request->all());

            // Construye el nombre en el formato esperado por la base de datos
            $name = "{$request->district}, {$request->department}";

            // Busca el precio de envío en la base de datos
            $price = DeliveryPrice::where('name', $name)->first();

            if ($price) {
                // Si se encuentra el precio, devuelve los datos
                $response->data = $price;
                $response->status = 200;
                $response->message = 'Operación Correcta. Precio de envío obtenido';
            } else {
                // Si no se encuentra, devuelve un error
                $response->status = 400;
                $response->message = 'Operación Incorrecta. No está registrado';
            }
        });

        return response($response->toArray(), $response->status);
    }
}
