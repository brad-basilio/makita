<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleStatus;
use Culqi\Culqi;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function charge(Request $request)
    {
        try {
            $culqi = new Culqi([
                'api_key' => config('services.culqi.secret_key'),
            ]);

            $charge = $culqi->Charges->create([
                "amount" => $request->amount * 100, // En céntimos
                "currency_code" => "PEN",
                "email" => $request->email,
                "source_id" => $request->token
            ]);

            // Buscar la venta
            $sale = Sale::findOrFail($request->sale_id);
            $saleStatusPagado = SaleStatus::getByName('Pagado');
            // Actualizar el estado de pago
            $sale->update([
                'culqi_charge_id' => $charge->id,
                'payment_status' => 'pagado',
                'status_id' => $saleStatusPagado ? $saleStatusPagado->id : null, // Reemplaza con el ID real del estado "Pagado"
            ]);

            return response()->json(['message' => 'Pago exitoso', 'sale' => $sale]);
        } catch (\Exception $e) {
            // Si hay error, marcar el pago como fallido
            $sale = Sale::find($request->sale_id);
            if ($sale) {
                $sale->update(['payment_status' => 'fallido']);
            }

            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
    public function getPaymentStatus($sale_id)
    {
        $sale = Sale::findOrFail($sale_id);
        return response()->json($sale);
    }
}
