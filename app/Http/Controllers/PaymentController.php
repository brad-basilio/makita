<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SaleStatus;
use App\Models\User;
use Culqi\Culqi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function getPaymentStatus($sale_id)
    {
        $sale = Sale::findOrFail($sale_id);
        return response()->json($sale);
    }

    public function charge(Request $request)
    {
        try {
            
            $culqi = new Culqi([
                'api_key' => config('services.culqi.secret_key'),
            ]);
            
            // Crear el intento de pago
            $charge = $culqi->Charges->create([
                "amount" => $request->amount * 100,
                "currency_code" => "PEN",
                "email" => $request->email,
                "source_id" => $request->token
            ]);

            // Validar si el pago fue exitoso
            if (!isset($charge->id) || ($charge->outcome->type ?? '') !== 'venta_exitosa') {
                return response()->json([
                    'message' => 'Pago fallido',
                    'status' => false,
                    'error' => $charge->outcome->user_message ?? 'Error desconocido'
                ], 400);
            }

            $saleStatusPagado = SaleStatus::getByName('Pagado');

            // Registrar la venta
            $sale = Sale::create([
                'code' => $request->orderNumber,
                'user_id' => $request->user_id,
                'name' => $request->name,
                'lastname' => $request->lastname,
                'fullname' => $request->fullname,
                'email' => $request->email,
                'phone' => $request->phone,
                'country' => $request->country,
                'department' => $request->department,
                'province' => $request->province,
                'district' => $request->district,
                'ubigeo' => $request->ubigeo,
                'address' => $request->address,
                'number' => $request->number,
                'reference' => $request->reference,
                'comment' => $request->comment,
                'amount' => $request->amount,
                'delivery' => $request->delivery,
                'culqi_charge_id' => $charge->id,
                'payment_status' => 'pagado',
                'status_id' => $saleStatusPagado ? $saleStatusPagado->id : null,
                'invoiceType' => $request->invoiceType,
                'documentType' => $request->documentType,
                'document' => $request->document,
                'businessName' => $request->businessName
            ]);

            // Registrar detalles de la venta y actualizar stock
            foreach ($request->cart as $item) {
                $itemId = is_array($item) ? $item['id'] ?? null : $item->id ?? null;
                $itemName = is_array($item) ? $item['name'] ?? null : $item->name ?? null;
                $itemPrice = is_array($item) ? $item['final_price'] ?? null : $item->final_price ?? null;
                $itemQuantity = is_array($item) ? $item['quantity'] ?? null : $item->quantity ?? null;

                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'item_id' => $itemId,
                    'name' => $itemName,
                    'price' => $itemPrice,
                    'quantity' => $itemQuantity,
                ]);

                Item::where('id', $itemId)->decrement('stock', $itemQuantity);
            }

            //usuario autenticado actualizar datos de contacto
            if (Auth::check()) {
                $userJpa = User::find(Auth::user()->id);
                $userJpa->phone = $request->phone;
                $userJpa->dni = $request->dni;
                $userJpa->country = $request->country;
                $userJpa->department = $request->department;
                $userJpa->province = $request->province;
                $userJpa->district = $request->district;
                $userJpa->ubigeo = $request->ubigeo;
                $userJpa->address = $request->address;
                $userJpa->reference = $request->reference;
                $userJpa->number = $request->number;
            
                $userJpa->save();
            }

            return response()->json([
                'message' => 'Pago exitoso',
                'status' => true,
                'culqi_response' => $charge,
                'sale' => $request->cart,
                'code' => $request->orderNumber,
                'delivery' => $request->delivery
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error en el pago',
                'status' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
