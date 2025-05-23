<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;

class OrderStatusChangedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
    protected $details;

    public function __construct($sale, $details = null)
    {
        $this->sale = $sale;
        $this->details = $details ?? $sale->details;
    }
    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'orderId'      => 'Código del pedido',
            'status'       => 'Estado actual',
            'status_color' => 'Color para mostrar el estado',
            'name'         => 'Nombre del cliente',
            'year'         => 'Año actual',
            'productos'    => 'Bloque repetible de productos: {{#productos}}...{{/productos}}. Variables: nombre, cantidad, precio, categoria, image',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }


    public function toMail($notifiable)
    {
        \Log::info('Enviando a: ' . $notifiable->email);
        $template = \App\Models\General::where('correlative', 'order_status_changed_email')->first();
        $content = $template ? $template->description : '';

        // Construir array de productos para el bloque repetible
        $productos = [];
        foreach ($this->details as $detail) {
            // Determinar la ruta de la imagen (puede estar en detail->image o en detail->item->image)
            $imgPath = $detail->image ?? ($detail->item->image ?? '');
            // Si la ruta ya contiene 'storage/', úsala tal cual, si no, prepéndela
            if ($imgPath && strpos($imgPath, 'storage/') === false) {
                $imgPath = 'storage/images/item/' . ltrim($imgPath, '/');
            }
            $imgUrl = $imgPath ? url($imgPath) : '';
            $productos[] = [
                'nombre'    => $detail->name,
                'cantidad'  => $detail->quantity,
                'precio'    => number_format($detail->price, 2),
                'categoria' => $detail->item->category->name ?? '',
                'imagen'    => $imgUrl,
            ];
        }

        $body = $template
            ? \App\Helpers\Text::replaceData($content, [
                'orderId'      => $this->sale->code,
                'status'       => $this->sale->status->name,
                'status_color' => optional(\App\Models\SaleStatus::where('name', $this->sale->status->name)->first())->color ?? '#6c757d',
                'name'         => $this->sale->user->name,
                'year'         => date('Y'),
                'productos'    => $productos,
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail(
            $body,
            'Estado de tu pedido actualizado',
            $notifiable->email
        ));
    }
}
