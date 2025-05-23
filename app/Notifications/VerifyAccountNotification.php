<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyAccountNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $verificationUrl;

    public function __construct($verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Verifica tu cuenta')
            ->greeting('¡Hola!')
            ->line('Gracias por registrarte. Por favor, haz clic en el botón para verificar tu cuenta:')
            ->action('Verificar cuenta', $this->verificationUrl)
            ->line('Si no creaste una cuenta, ignora este correo.');
    }
}
