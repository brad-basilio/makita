<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

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

      /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'title' => 'Título del blog',
            'url'   => 'Enlace al blog',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'blog_published_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'title' => $this->title,
                'url' => $this->url
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Nuevo blog publicado: ' . $this->title));
    }
}
