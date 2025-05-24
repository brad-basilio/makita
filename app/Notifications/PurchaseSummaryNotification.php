<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class PurchaseSummaryNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $sale;
    protected $details;

    public function __construct($sale, $details)
    {
        $this->sale = $sale;
        $this->details = $details;
    }

        /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'nombre'    => 'Nombre del cliente',
            'codigo'    => 'Código de la compra',
            'total'     => 'Total de la compra',
            'productos' => 'Tabla HTML con el detalle de productos comprados (ya formateada)',
        ];
    }

    // Recibe el correlative del cliente

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'purchase_summary_email')->first();
        $productosHtml = '';
        foreach ($this->details as $detail) {
            $productosHtml .= '<tr>' .
                '<td>' . e($detail->name) . '</td>' .
                '<td>' . e($detail->quantity) . '</td>' .
                '<td>S/ ' . number_format($detail->price, 2) . '</td>' .
            '</tr>';
        }
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $this->sale->name ?? 'cliente',
                'codigo' => $this->sale->code,
                'total' => number_format($this->sale->amount, 2),
                'productos' => $productosHtml,
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, '¡Gracias por tu compra!'));
    }
}
