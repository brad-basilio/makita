<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PurchaseSummaryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
    protected $details;
    protected $clientCorrelative;

    public function __construct($sale, $details, $correlative = null)
    {
        $this->sale = $sale;
        $this->details = $details;
        $this->clientCorrelative = $correlative ?? env('APP_CORRELATIVE', 'default');
    }

    // Recibe el correlative del cliente
    public function setClientCorrelative($correlative)
    {
        $this->clientCorrelative = $correlative;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $view = 'emails.' . $this->clientCorrelative . '.purchase_summary';
        // Si la vista no existe, usar la default
        if (!view()->exists($view)) {
            $view = 'emails.default.purchase_summary';
        }
        return (new MailMessage)
            ->subject('¡Gracias por tu compra!')
            ->view($view, [
                'sale' => $this->sale,
                'details' => $this->details
            ]);
    }
}
