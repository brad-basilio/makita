<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class OrderStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
   
    public function __construct($sale)
    {
        $this->sale = $sale;
       
    }

    public function via($notifiable)
    {
        return ['mail'];
    }


    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'order_status_changed_email')->first();

        // Limpieza forzada de llaves y variables (más robusta)
        $content = $template ? $template->description : '';
      
    
        // Validación extra: si sigue fallando, muestra el contenido limpio y lanza excepción personalizada
        try {
            $body = $template
                ? \Illuminate\Support\Facades\Blade::render($content, [
                    'orderId' => $this->sale->code,
                    'status' => $this->sale->status->name,
                    'name' => $this->sale->user->name,
                ])
                : 'Plantilla no encontrada';
        } catch (\Throwable $e) {
            \Log::error('Error al renderizar Blade:', [
                'content' => $content,
                'orderId' => $this->sale->code,
                'status' => $this->sale->status->name,
                'name' => $this->sale->user->name,
                'exception' => $e->getMessage(),
            ]);
            throw new \Exception('Error al renderizar el template de correo: ' . $e->getMessage() . "\nContenido limpio: " . $content);
        }

        return (new MailMessage)
            ->subject('Estado de tu pedido actualizado')
            ->view('emails.email_wrapper', [
                'slot' => $body,
                'subject' => 'Estado de tu pedido actualizado',
            ]);
    }
}
