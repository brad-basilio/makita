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
            'productos'    => 'Bloque repetible de productos: {{#productos}}...{{/productos}}. Variables: nombre, cantidad, precio, categoria, imagen',
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
            // Obtener la ruta de la imagen (puede estar en detail->image o en detail->item->image)
            $imgPath = $detail->image ?? ($detail->item->image ?? '');
            $imgUrl = '';
            if ($imgPath) {
                // Si ya es una URL absoluta, úsala tal cual
                if (preg_match('/^https?:\/\//i', $imgPath)) {
                    $imgUrl = $imgPath;
                } else {
                    // Si la ruta ya contiene 'storage/', úsala con url()
                    if (strpos($imgPath, 'storage/') === 0) {
                        $imgUrl = url($imgPath);
                    } else {
                        // Asume que es una imagen de item en storage
                        $imgUrl = url('storage/images/item/' . ltrim($imgPath, '/'));
                    }
                }
            }
            \Log::info('Producto: ' . $detail->name . ' | imgPath: ' . $imgPath . ' | imgUrl: ' . $imgUrl);
            $productos[] = [
                'nombre'    => $detail->name,
                'cantidad'  => $detail->quantity,
                'precio'    => number_format($detail->price, 2),
                'categoria' => $detail->item->category->name ?? '',
                'imagen'    => $imgUrl, // SOLO "imagen"
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
        \Log::info($imgUrl);
        // Limpia cualquier base antepuesta a {{imagen}} en src
        $body = preg_replace('/(<img[^>]+src=[\'"])([^\'"]*?\{\{imagen\}\})[\'"]/i', '$1{{imagen}}"', $body);
        \Log::info('Cuerpo: ' . $body);
        return (new RawHtmlMail(
            $body,
            'Estado de tu pedido actualizado',
            $notifiable->email
        ));
    }
}
