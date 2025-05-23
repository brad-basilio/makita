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

    public function __construct($complaint)
    {
        $this->complaint = $complaint;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('Hemos recibido tu reclamo')
            ->greeting('¡Hola ' . ($this->complaint->nombre ?? 'cliente') . '!')
            ->line('Hemos recibido tu reclamo/queja y te enviamos un respaldo de lo que registraste:')
            ->line('Tipo: ' . $this->complaint->tipo_reclamo)
            ->line('Detalle: ' . $this->complaint->detalle_reclamo)
            ->line('Fecha: ' . ($this->complaint->fecha_ocurrencia ?? 'No especificada'))
            ->line('Monto reclamado: S/ ' . ($this->complaint->monto_reclamado ?? 'No especificado'))
            ->line('Producto/Servicio: ' . $this->complaint->descripcion_producto)
            ->line('Número de pedido: ' . ($this->complaint->numero_pedido ?? 'No especificado'))
            ->line('Gracias por confiar en nosotros. Nos pondremos en contacto contigo pronto.');
        return $mail;
    }
}
