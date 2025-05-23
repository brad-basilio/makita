<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyAccountNotification extends Notification implements ShouldQueue
{
    use Queueable;
    protected $clientCorrelative;
    protected $verificationUrl;

    public function __construct($verificationUrl, $correlative = null)
    {
        $this->verificationUrl = $verificationUrl;
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
        $view = 'emails.' . $this->clientCorrelative . '.verify_account';
        if (!view()->exists($view)) {
            $view = 'emails.default.verify_account';
        }
        return (new MailMessage)
            ->subject('Verifica tu cuenta')
            ->view($view, [
                'verificationUrl' => $this->verificationUrl
            ]);
    }
}
