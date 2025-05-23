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
        $template = \App\Models\General::where('correlative', 'blog_published_email')->first();
        $body = $template
            ? \Illuminate\Support\Facades\Blade::render($template->description, [
                'title' => $this->title,
                'url' => $this->url
            ])
            : 'Plantilla no encontrada';
        return (new MailMessage)
            ->subject('Nuevo blog publicado: ' . $this->title)
            ->view('emails.email_wrapper', [
                'slot' => $body,
                'subject' => 'Nuevo blog publicado: ' . $this->title,
            ]);
    }
}
