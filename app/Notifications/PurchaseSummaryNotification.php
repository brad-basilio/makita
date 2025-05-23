<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

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
            ? \Illuminate\Support\Facades\Blade::render($template->description, [
                'nombre' => $this->sale->name ?? 'cliente',
                'codigo' => $this->sale->code,
                'total' => number_format($this->sale->amount, 2),
                'productos' => $productosHtml,
            ])
            : 'Plantilla no encontrada';
        return (new MailMessage)
            ->subject('¡Gracias por tu compra!')
            ->view('emails.email_wrapper', [
                'slot' => $body,
                'subject' => '¡Gracias por tu compra!',
            ]);
    }
}
