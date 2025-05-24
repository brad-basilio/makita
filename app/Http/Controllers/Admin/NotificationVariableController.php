<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class NotificationVariableController extends Controller
{
    /**
     * Get available variables for a notification type.
     * @param Request $request
     * @param string $type
     * @return \Illuminate\Http\JsonResponse
     */
    public function variables(Request $request, $type)
    {
        // Map notification type to class
        $map = [
            'purchase_summary'      => \App\Notifications\PurchaseSummaryNotification::class,
            'order_status_changed'  => \App\Notifications\OrderStatusChangedNotification::class,
            'blog_published'        => \App\Notifications\BlogPublishedNotification::class,
            'claim'                 => \App\Notifications\ClaimNotification::class,
            'password_changed'      => \App\Notifications\PasswordChangedNotification::class,
            'password_reset'        => \App\Notifications\PasswordResetLinkNotification::class,
            'subscription'          => \App\Notifications\SubscriptionNotification::class,
            'verify_account'        => \App\Notifications\VerifyAccountNotification::class,
        ];
        if (!isset($map[$type])) {
            return response()->json(['error' => 'Tipo de notificación no válido'], 404);
        }
        $class = $map[$type];
        $variables = method_exists($class, 'availableVariables') ? $class::availableVariables() : [];
        return response()->json(['variables' => $variables]);
    }
}
