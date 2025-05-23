<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class BlogPublishedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $title;
    protected $url;

    public function __construct($title, $url)
    {
        $this->title = $title;
        $this->url = $url;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Nuevo blog publicado: ' . $this->title)
            ->greeting('¡Hola!')
            ->line('Se ha publicado un nuevo blog: ' . $this->title)
            ->action('Leer blog', $this->url);
    }
}
