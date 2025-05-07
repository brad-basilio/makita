<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\DeliveryPrice;
use App\Models\TypeDelivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\File;
use SoDe\Extend\JSON;
use Maatwebsite\Excel\Facades\Excel;
use SoDe\Extend\Response;
use SoDe\Extend\Text;

class DeliveryPriceController extends BasicController
{
    public $model = DeliveryPrice::class;
    public $reactView = 'Admin/DeliveryPricesType';

    public function setReactViewProperties(Request $request)
    {
        $ubigeo = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));
        return [
            'ubigeo' => $ubigeo
        ];
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();
        $found = $this->model::where('ubigeo', $body['ubigeo'])->first();

        if ($found) {
            $body['id'] = $found->id;
        }

        if ($request->has('is_free') && $request->input('is_free')) {
            $freeType = TypeDelivery::where('slug', 'envio-gratis')->first();
        } else {
            $freeType = TypeDelivery::where('slug', 'delivery-normal')->first();
        }

        if ($freeType) {
            $body['type_id'] = $freeType->id;
        }

        return $body;
    }


    public function massive(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,csv',
        ]);

        DB::beginTransaction();
        $response = Response::simpleTryCatch(function () use ($request) {
            $file = $request->file('excel');
            $ubigeoData = JSON::parse(File::get('../storage/app/utils/ubigeo.json'));

            $data = Excel::toArray([], $file)[0];

            $result = [];

            foreach ($data as $row) {
                if (count($row) < 3) {
                    throw new \Exception('Cada fila debe tener al menos 3 columnas.');
                }

                if (!is_numeric($row[0])) continue;

                $ubigeo = $row[0];
                $description = $row[1];
                $price = $row[2];

                $price = $price === '' ? null : $price;

                $ubigeoObject = collect($ubigeoData)->firstWhere('reniec', $ubigeo);

                $name = $ubigeoObject ? Text::toTitleCase("{$ubigeoObject['distrito']}, {$ubigeoObject['departamento']}") : null;

                $deliveryPrice = $this->model::updateOrCreate(
                    ['ubigeo' => $ubigeo],
                    [
                        'name' => $name,
                        'description' => $description,
                        'price' => $price,
                    ]
                );

                $result[] = $deliveryPrice;
            }
            DB::commit();
            return $result;
        }, function () {
            DB::rollBack();
        });

        return response($response->toArray(), $response->status);
    }
}
