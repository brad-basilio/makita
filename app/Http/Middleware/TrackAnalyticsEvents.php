<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\AnalyticsEvent;
use Illuminate\Http\Request;

class TrackAnalyticsEvents
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if ($request->is('products/*') || $request->is('cart/*')) {
            AnalyticsEvent::create([
                'user_id' => auth()->id(),
                'event_type' => $request->is('products/*') ? 'product_view' : 'cart_interaction',
                'value' => 1,
                'metadata' => json_encode([
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                ])
            ]);
        }

        return $response;
    }
}