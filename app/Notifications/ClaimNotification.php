<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ClaimNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $claimId;

    public function __construct($claimId)
    {
        $this->claimId = $claimId;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Reclamo recibido')
            ->greeting('¡Hola!')
            ->line('Hemos recibido tu reclamo (ID: ' . $this->claimId . '). Nos pondremos en contacto contigo pronto.');
    }
}
