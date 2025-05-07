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
use App\Models\TypeDelivery;
use App\Providers\RouteServiceProvider;
use Exception;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\View;
use Illuminate\Validation\Rules\File;
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


            $validated = $request->validate([
                'ubigeo' => 'required|string|size:6' // Asumiendo nuevo parámetro desde el front
            ]);

            $ubigeo = $validated['ubigeo'];



            if (!$ubigeo) {
                $response->status = 400;
                $response->message = 'Ubigeo no encontrado';
                return;
            }
            // 1. Buscar el precio de envío
            $deliveryPrice = DeliveryPrice::with(['type'])
                ->where('ubigeo', $ubigeo)
                ->firstOrFail();

            // 2. Valida Cobertura
            if (!$deliveryPrice) {
                $response->status = 400;
                $response->message = 'No hay cobertura para esta ubicación';
                return;
            }

            // 3. Estructurar la respuesta
            $result = [
                'is_free' => $deliveryPrice->is_free,
                'standard' => [
                    'price' => $deliveryPrice->is_free ? 0 : $deliveryPrice->price,
                    'description' => $deliveryPrice->type->description ?? 'Entrega estándar',
                    'type' => $deliveryPrice->type->name
                ]
            ];

            // 4. Si es free, buscar el tipo express relacionado
            if ($deliveryPrice->is_free) {
                $expressType = TypeDelivery::where('slug', 'delivery-express')->first();

                $result['express'] = [
                    'price' => $deliveryPrice->express_price,
                    'description' => $expressType->description ?? 'Entrega express',
                    'type' => $expressType->name
                ];
            }

            $response->data = $result;
            $response->status = 200;
            $response->message = 'Precios obtenidos correctamente';
        }, function ($e) {
            \Log::error('Error en getDeliveryPrice: ' . $e->getMessage());
        });

        return response($response->toArray(), $response->status);
    }
}
