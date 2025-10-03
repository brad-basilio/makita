<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Item;
use App\Models\ProductAnalytic;
use App\Models\UserSession;
use App\Models\Subscription;
use App\Models\JobApplication;
use App\Models\Category;
use App\Models\Post;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';
    public $reactRootView = 'admin';

    public function setReactViewProperties(Request $request)
    {
        $today = Carbon::today();
        $startOfWeek = Carbon::now()->startOfWeek();
        $startOfMonth = Carbon::now()->startOfMonth();
        $startOfYear = Carbon::now()->startOfYear();

        // ===== ESTADÍSTICAS GENERALES =====
        $totalProducts = Item::where('visible', true)->where('status', 1)->count();
        $totalStock = Item::where('visible', true)->where('status', 1)->sum('stock');
        $totalCategories = Category::where('status', 1)->count();
        $totalPosts = Post::where('status', 1)->count();

        // ===== TRACKING Y ANALYTICS =====
        // Vistas de productos hoy, semana, mes
        $productViewsToday = ProductAnalytic::whereDate('created_at', $today)
            ->where('event_type', 'view')
            ->count();
        
        $productViewsWeek = ProductAnalytic::whereBetween('created_at', [$startOfWeek, Carbon::now()])
            ->where('event_type', 'view')
            ->count();
        
        $productViewsMonth = ProductAnalytic::whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->where('event_type', 'view')
            ->count();

        // Sesiones únicas hoy, semana, mes
        $uniqueSessionsToday = UserSession::whereDate('created_at', $today)
            ->distinct('session_id')
            ->count('session_id');
        
        $uniqueSessionsWeek = UserSession::whereBetween('created_at', [$startOfWeek, Carbon::now()])
            ->distinct('session_id')
            ->count('session_id');
        
        $uniqueSessionsMonth = UserSession::whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->distinct('session_id')
            ->count('session_id');

        // ===== SUSCRIPCIONES Y POSTULACIONES =====
        $subscriptionsToday = Subscription::whereDate('created_at', $today)->count();
        $subscriptionsMonth = Subscription::whereBetween('created_at', [$startOfMonth, Carbon::now()])->count();
        $subscriptionsTotal = Subscription::count();

        $jobApplicationsToday = JobApplication::whereDate('created_at', $today)->count();
        // Mes incluye desde inicio del mes hasta ahora (incluyendo hoy)
        $jobApplicationsMonth = JobApplication::whereYear('created_at', Carbon::now()->year)
            ->whereMonth('created_at', Carbon::now()->month)
            ->count();
        $jobApplicationsTotal = JobApplication::count();

        // ===== PRODUCTOS MÁS VISITADOS (Top 10) =====
        $mostViewedProducts = ProductAnalytic::select('item_id', DB::raw('COUNT(*) as views'))
            ->where('event_type', 'view')
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->groupBy('item_id')
            ->orderByDesc('views')
            ->limit(10)
            ->get()
            ->map(function($row) {
                $item = Item::find($row->item_id);
                return [
                    'id' => $row->item_id,
                    'name' => $item ? $item->name : 'Producto eliminado',
                    'views' => $row->views,
                    'image' => $item ? $item->image : null,
                    'sku' => $item ? $item->sku : null,
                ];
            });

        // ===== ESTADÍSTICAS POR DISPOSITIVO =====
        $deviceStats = UserSession::select('device_type', DB::raw('COUNT(DISTINCT session_id) as sessions'))
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->groupBy('device_type')
            ->get()
            ->map(function($row) {
                return [
                    'device' => $row->device_type ?: 'Desconocido',
                    'sessions' => $row->sessions,
                ];
            });

        // ===== ESTADÍSTICAS POR NAVEGADOR =====
        $browserStats = UserSession::select('browser', DB::raw('COUNT(DISTINCT session_id) as sessions'))
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->whereNotNull('browser')
            ->groupBy('browser')
            ->orderByDesc('sessions')
            ->limit(5)
            ->get();

        // ===== ESTADÍSTICAS POR SISTEMA OPERATIVO =====
        $osStats = UserSession::select('os', DB::raw('COUNT(DISTINCT session_id) as sessions'))
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->whereNotNull('os')
            ->groupBy('os')
            ->orderByDesc('sessions')
            ->limit(5)
            ->get();

        // ===== ESTADÍSTICAS POR UBICACIÓN (Solo País) =====
        $locationStats = UserSession::select('country', DB::raw('COUNT(DISTINCT session_id) as sessions'))
            ->whereBetween('created_at', [$startOfMonth, Carbon::now()])
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('sessions')
            ->limit(10)
            ->get();

        // ===== PRODUCTOS RECIENTES (Últimos 5 agregados) =====
        $recentProducts = Item::where('visible', true)
            ->where('status', 1)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'image', 'sku', 'created_at']);

        // ===== PRODUCTOS DESTACADOS (Featured) =====
        $featuredProducts = Item::where('visible', true)
            ->where('status', 1)
            ->where('recommended', true)
            ->limit(5)
            ->get(['id', 'name', 'image', 'sku']);

        // ===== TENDENCIAS DE VISUALIZACIONES (Últimos 7 días) =====
        $viewsTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $views = ProductAnalytic::whereDate('created_at', $date)
                ->where('event_type', 'view')
                ->count();
            
            $viewsTrend[] = [
                'date' => $date->format('d/m'),
                'views' => $views,
            ];
        }

        // ===== POSTS RECIENTES =====
        $recentPosts = Post::where('status', 1)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'name', 'image', 'created_at']);

        return [
            // Estadísticas generales
            'totalProducts' => $totalProducts,
            'totalStock' => $totalStock,
            'totalCategories' => $totalCategories,
            'totalPosts' => $totalPosts,
            
            // Vistas de productos
            'productViewsToday' => $productViewsToday,
            'productViewsWeek' => $productViewsWeek,
            'productViewsMonth' => $productViewsMonth,
            
            // Sesiones únicas
            'uniqueSessionsToday' => $uniqueSessionsToday,
            'uniqueSessionsWeek' => $uniqueSessionsWeek,
            'uniqueSessionsMonth' => $uniqueSessionsMonth,
            
            // Suscripciones
            'subscriptionsToday' => $subscriptionsToday,
            'subscriptionsMonth' => $subscriptionsMonth,
            'subscriptionsTotal' => $subscriptionsTotal,
            
            // Postulaciones laborales
            'jobApplicationsToday' => $jobApplicationsToday,
            'jobApplicationsMonth' => $jobApplicationsMonth,
            'jobApplicationsTotal' => $jobApplicationsTotal,
            
            // Productos más visitados
            'mostViewedProducts' => $mostViewedProducts,
            
            // Analytics por dispositivo/navegador/OS
            'deviceStats' => $deviceStats,
            'browserStats' => $browserStats,
            'osStats' => $osStats,
            'locationStats' => $locationStats,
            
            // Productos
            'recentProducts' => $recentProducts,
            'featuredProducts' => $featuredProducts,
            
            // Tendencias
            'viewsTrend' => $viewsTrend,
            
            // Posts
            'recentPosts' => $recentPosts,
        ];
    }
}
