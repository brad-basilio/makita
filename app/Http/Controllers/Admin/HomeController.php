<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Benefit;
use App\Models\Item;
use App\Models\Sale;
use App\Models\SaleStatus;
use Carbon\Carbon;
use Culqi\Culqi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';
    public $reactRootView = 'admin';

    public function setReactViewProperties(Request $request)
    {
        
        $today = Carbon::today();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfYear = Carbon::now()->startOfYear();

        // Total productos activos (visible = 1, status activo)
        $totalProducts = Item::where('visible', true)->where('status', 1)->count();

        // Total stock disponible
        $totalStock = Item::where('visible', true)->where('status', 1)->sum('stock');

        // Total ventas y monto generado hoy, mes, año
        $salesToday = Sale::whereDate('created_at', $today)->count();
        $salesMonth = Sale::whereBetween('created_at', [$startOfMonth, Carbon::now()])->count();
        $salesYear = Sale::whereBetween('created_at', [$startOfYear, Carbon::now()])->count();

        $incomeToday = Sale::whereDate('created_at', $today)->sum('amount');
        $incomeMonth = Sale::whereBetween('created_at', [$startOfMonth, Carbon::now()])->sum('amount');
        $incomeYear = Sale::whereBetween('created_at', [$startOfYear, Carbon::now()])->sum('amount');

        // Pedidos por estado
        $statuses = SaleStatus::all();
        $ordersByStatus = [];
        foreach ($statuses as $status) {
            $count = Sale::where('status_id', $status->id)->count();
            $ordersByStatus[] = [
                'name' => $status->name,
                'color' => $status->color,
                'count' => $count
            ];
        }

        // Productos más vendidos (top 5)
        $topProducts = DB::table('sale_details')
            ->select('item_id', DB::raw('SUM(quantity) as total_quantity'))
            ->groupBy('item_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get()
            ->map(function($row) {
                $item = Item::find($row->item_id);
                return [
                    'name' => $item ? $item->name : 'Desconocido',
                    'quantity' => $row->total_quantity,
                    'image' => $item ? $item->image : null,
                ];
            });

        // Nuevos productos destacados (is_new o featured)
        $newFeatured = Item::where('visible', true)
            ->where(function ($q) {
                $q->where('is_new', true)
                  ->orWhere('featured', true);
            })
            ->limit(5)
            ->get(['id', 'name', 'image', 'price']);

        // Ventas por dispositivo (simulación / ejemplo)
        // Asumimos que tienes columna 'device' en tabla sales con valores: desktop, mobile, tablet, other
      /*  $salesByDevice = Sale::select('device', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('device')
            ->get();*/

        // Ventas por ubicación (departamento, provincia, distrito)
        $salesByLocation = Sale::select('department', 'province', 'district', DB::raw('COUNT(*) as count'), DB::raw('SUM(amount) as total'))
            ->groupBy('department', 'province', 'district')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
            $latestTransactions = Sale::latest()->take(5)->get();
        return [
            'totalProducts' => $totalProducts,
            'totalStock' => $totalStock,
            'salesToday' => $salesToday,
            'salesMonth' => $salesMonth,
            'salesYear' => $salesYear,
            'incomeToday' => $incomeToday,
            'incomeMonth' => $incomeMonth,
            'incomeYear' => $incomeYear,
            'ordersByStatus' => $ordersByStatus,
            'topProducts' => $topProducts,
            'newFeatured' => $newFeatured,
            'latestTransactions' => $latestTransactions,
          //  'salesByDevice' => $salesByDevice,
            'salesByLocation' => $salesByLocation,
        ];
    }
}
