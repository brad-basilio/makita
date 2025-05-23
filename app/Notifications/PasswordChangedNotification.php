<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class PasswordChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Tu contraseña ha sido cambiada')
            ->greeting('¡Hola!')
            ->line('Te informamos que tu contraseña ha sido cambiada exitosamente.')
            ->line('Si no realizaste este cambio, por favor contacta con soporte de inmediato.');
    }
}
