<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

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

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'reset_password_email')->first();
        $body = $template
            ? \Illuminate\Support\Facades\Blade::render($template->description, [
                'resetUrl' => $this->resetUrl
            ])
            : 'Plantilla no encontrada';
        return (new MailMessage)
            ->subject('Restablece tu contraseña')
            ->view('emails.email_wrapper', [
                'slot' => $body,
                'subject' => 'Restablece tu contraseña',
            ]);
    }
}
