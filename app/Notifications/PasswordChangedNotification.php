<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $clientCorrelative;

    public function __construct($correlative = null)
    {

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
        $view = 'emails.' . $this->clientCorrelative . '.password_changed';
        if (!view()->exists($view)) {
            $view = 'emails.default.password_changed';
        }
        return (new MailMessage)
            ->subject('Tu contraseña ha sido cambiada')
            ->view($view);
    }
}
