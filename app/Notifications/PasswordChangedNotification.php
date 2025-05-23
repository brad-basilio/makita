<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class PasswordChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;
    public function __construct()
    {
    }


    public function via($notifiable)
    {
        return ['mail'];
    }

        /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            // No hay variables dinámicas para este email
        ];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'password_changed_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Tu contraseña ha sido cambiada'));
    }
}
