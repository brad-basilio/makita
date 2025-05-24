<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

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
  /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'nombre'               => 'Nombre del cliente',
            'tipo_reclamo'         => 'Tipo de reclamo',
            'detalle_reclamo'      => 'Detalle del reclamo',
            'fecha_ocurrencia'     => 'Fecha de ocurrencia',
            'monto_reclamado'      => 'Monto reclamado',
            'descripcion_producto' => 'Descripción del producto',
            'numero_pedido'        => 'Número de pedido',
        ];
    }
    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'claim_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $this->complaint->nombre ?? 'cliente',
                'tipo_reclamo' => $this->complaint->tipo_reclamo,
                'detalle_reclamo' => $this->complaint->detalle_reclamo,
                'fecha_ocurrencia' => $this->complaint->fecha_ocurrencia ?? 'No especificada',
                'monto_reclamado' => $this->complaint->monto_reclamado ?? 'No especificado',
                'descripcion_producto' => $this->complaint->descripcion_producto,
                'numero_pedido' => $this->complaint->numero_pedido ?? 'No especificado',
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Hemos recibido tu reclamo'));
    }
}
