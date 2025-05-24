<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;

class BlogPublishedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $blog;
    

    public function __construct($blog)
    {
        $this->blog = $blog;
      
    }

      /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'imagen'=> 'Imagen del blog',
            'titulo' => 'Título del blog',
            'descripcion' => 'Descripción del blog',
            'url'   => 'Enlace al blog',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
         \Log::info('Enviando a: ' . $notifiable->description);
        $template = \App\Models\General::where('correlative', 'blog_published_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'imagen' => url(Storage::url("images/post/".$this->blog->image ?? '')),
                'titulo' => $this->blog->name,
                'descripcion' => $this->blog->description,
                'url' =>  url('/post/' . $this->blog->slug)
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Nuevo blog publicado: ' . $this->blog->name, $notifiable->description));
    }
}
