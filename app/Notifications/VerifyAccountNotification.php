<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class VerifyAccountNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $verificationUrl;

    public function __construct($verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }

        /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'verificationUrl' => 'Enlace para verificar la cuenta',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }
    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'verify_account_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'verificationUrl' => $this->verificationUrl
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Verifica tu cuenta'));
    }
}
