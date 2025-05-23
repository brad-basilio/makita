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
    protected $clientCorrelative;

    public function __construct($title, $url, $correlative = null)
    {
        $this->title = $title;
        $this->url = $url;
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
        $view = 'emails.' . $this->clientCorrelative . '.blog_published';
        if (!view()->exists($view)) {
            $view = 'emails.default.blog_published';
        }
        return (new MailMessage)
            ->subject('Nuevo blog publicado: ' . $this->title)
            ->view($view, [
                'title' => $this->title,
                'url' => $this->url
            ]);
    }
}
