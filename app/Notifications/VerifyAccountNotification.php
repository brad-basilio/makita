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
        $template = \App\Models\General::where('correlative', 'verify_account_email')->first();
        $body = $template
            ? \Illuminate\Support\Facades\Blade::render($template->description, [
                'verificationUrl' => $this->verificationUrl
            ])
            : 'Plantilla no encontrada';
        return (new MailMessage)
            ->subject('Verifica tu cuenta')
            ->view('emails.email_wrapper', [
                'slot' => $body,
                'subject' => 'Verifica tu cuenta',
            ]);
    }
}
