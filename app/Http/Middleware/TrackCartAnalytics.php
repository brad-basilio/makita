<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\CartAnalytic;
use Illuminate\Http\Request;

class TrackCartAnalytics
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($request->is('cart/*') && $request->session()->has('cart')) {
            $cart = $request->session()->get('cart');
            
            CartAnalytic::create([
                'user_id' => auth()->id(),
                'status' => 'active',
                'total' => collect($cart)->sum('price'),
                'items_count' => count($cart),
                'metadata' => json_encode($cart)
            ]);
        }

        return $response;
    }
}