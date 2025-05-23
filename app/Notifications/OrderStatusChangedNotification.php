<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrderStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $orderId;
    protected $status;
    protected $clientCorrelative;
    public function __construct($orderId, $status, $correlative = null)
    {
        $this->orderId = $orderId;
        $this->status = $status;
        // Permite que funcione tanto con el servicio como con notify() directo
        $this->clientCorrelative = $correlative ?? env('APP_CORRELATIVE', 'default');
    }

    public function via($notifiable)
    {
        return ['mail'];
    }


    public function setClientCorrelative($correlative)
    {
        $this->clientCorrelative = $correlative;
    }
    public function toMail($notifiable)
    {
        $view = 'emails.' . $this->clientCorrelative . '.order_status_changed';
        if (!view()->exists($view)) {
            $view = 'emails.default.order_status_changed';
        }
        return (new MailMessage)
            ->subject('Estado de tu pedido actualizado')
            ->view($view, [
                'orderId' => $this->orderId,
                'status' => $this->status
            ]);
    }
}
