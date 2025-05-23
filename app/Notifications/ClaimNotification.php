<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ClaimNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $complaint;
    protected $clientCorrelative ;
    public function __construct($complaint, $correlative = null)
    {
        $this->complaint = $complaint;
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
        $view = 'emails.' . $this->clientCorrelative . '.claim';
        if (!view()->exists($view)) {
            $view = 'emails.default.claim';
        }
        return (new MailMessage)
            ->subject('Hemos recibido tu reclamo')
            ->view($view, [
                'complaint' => $this->complaint
            ]);
    }
}
