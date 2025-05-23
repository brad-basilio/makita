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
    protected $clientCorrelative;
    public function __construct($resetUrl, $correlative = null)
    {
        $this->resetUrl = $resetUrl;
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
        $view = 'emails.' . $this->clientCorrelative . '.reset_password';
        if (!view()->exists($view)) {
            $view = 'emails.default.reset_password';
        }
        return (new MailMessage)
            ->subject('Restablece tu contraseña')
            ->view($view, [
                'resetUrl' => $this->resetUrl
            ]);
    }
}
