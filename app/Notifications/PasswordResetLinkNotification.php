<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Mail\Mailable;
use App\Mail\RawHtmlMail;

class PasswordResetLinkNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $resetUrl;
    public function __construct($resetUrl)
    {
        $this->resetUrl = $resetUrl;
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
            'resetUrl' => 'Enlace para restablecer la contraseña',
        ];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'reset_password_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'resetUrl' => $this->resetUrl
            ])
            : 'Plantilla no encontrada';
        // Usar Mailable personalizado para enviar HTML puro
        return (new RawHtmlMail($body, 'Restablece tu contraseña'));
    }
}
