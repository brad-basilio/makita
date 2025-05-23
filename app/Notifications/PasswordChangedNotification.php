<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

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

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'password_changed_email')->first();
        $body = $template
            ? \Illuminate\Support\Facades\Blade::render($template->description)
            : 'Plantilla no encontrada';
        return (new MailMessage)
            ->subject('Tu contraseña ha sido cambiada')
            ->view('emails.email_wrapper', [
                'slot' => $body,
                'subject' => 'Tu contraseña ha sido cambiada',
            ]);
    }
}
