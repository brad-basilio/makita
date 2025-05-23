<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class SubscriptionNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $clientCorrelative;
    public function __construct($correlative = null)
    {
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
        $view = 'emails.' . $this->clientCorrelative . '.subscription';
        if (!view()->exists($view)) {
            $view = 'emails.default.subscription';
        }
        return (new MailMessage)
            ->subject('¡Gracias por suscribirte!')
            ->view($view);
    }
}
