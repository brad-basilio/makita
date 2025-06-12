<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\UserSession;
use Jenssegers\Agent\Agent;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TrackUserSession
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        
        if (!$request->ajax()) {
            $agent = new Agent();
            
            // Generar o recuperar el session_id
            $sessionId = $request->session()->getId();
            if (!$sessionId) {
                $sessionId = Str::uuid()->toString();
                $request->session()->setId($sessionId);
            }
            
            UserSession::create([
                'user_id' => auth()->id(),
                'session_id' => $sessionId,
                'device_type' => $this->getDeviceType($agent),
                'browser' => $agent->browser(),
                'os' => $agent->platform(),
                'country' => $request->server('HTTP_CF_IPCOUNTRY', 'PE'),
                'city' => null,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'page_views' => 1,
                'duration' => 0,
                'converted' => false
            ]);
        }

        return $response;
    }

    private function getDeviceType($agent)
    {
        if ($agent->isDesktop()) return 'desktop';
        if ($agent->isTablet()) return 'tablet';
        if ($agent->isMobile()) return 'mobile';
        return 'other';
    }
}