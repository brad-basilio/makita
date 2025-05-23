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

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $mail = (new MailMessage)
            ->subject('¡Gracias por tu compra!')
            ->greeting('¡Hola ' . ($this->sale->name ?? 'cliente') . '!')
            ->line('Tu pago fue exitoso. Aquí tienes el resumen de tu compra:')
            ->line('Código de pedido: ' . $this->sale->code)
            ->line('Total: S/ ' . number_format($this->sale->amount, 2));

        foreach ($this->details as $detail) {
            $mail->line('Producto: ' . $detail->name . ' | Cantidad: ' . $detail->quantity . ' | Precio: S/ ' . number_format($detail->price, 2));
        }

        $mail->line('¡Gracias por confiar en nosotros!');
        return $mail;
    }
}
