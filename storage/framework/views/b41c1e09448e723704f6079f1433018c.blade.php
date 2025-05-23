<pre class="ql-syntax" spellcheck="false">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
&nbsp; &lt;meta charset="utf-8"&gt;
&nbsp; &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
&nbsp; &lt;title&gt;Estado de tu Pedido&lt;/title&gt;
&lt;/head&gt;
&lt;body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;"&gt;
&nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0"&gt;
&nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &lt;td align="center" style="padding: 20px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;table style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" cellpadding="0" cellspacing="0" border="0"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Header --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="background-color: #1e293b; padding: 24px; text-align: center;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;h1 style="color: #ffffff; font-size: 24px; margin: 0;"&gt;{{config('app.name')}}&lt;/h1&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Main Content --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="padding: 24px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Greeting --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="text-align: center; padding-bottom: 20px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;h2 style="font-size: 20px; color: #333333; margin: 0;"&gt;¡Hola, {{$name}}!&lt;/h2&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;p style="margin-top: 10px; color: #666666;"&gt;Gracias por tu compra en {{config('app.name')}}&lt;/p&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Order Info --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 24px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="padding: 16px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="color: #666666;"&gt;Pedido #:&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="text-align: right; font-weight: bold;"&gt;{{$orderId}}&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="height: 10px;"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="color: #666666;"&gt;Estado:&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="text-align: right;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Status Badge --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;span style="display: inline-block; padding: 4px 12px; border-radius: 50px; background-color:&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Conditional color based on status --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;%
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $color = '#9ca3af'; // Default gray
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; if (strtolower($status) == 'enviado') {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $color = '#22c55e'; // Green
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; } elseif (strtolower($status) == 'procesando') {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $color = '#eab308'; // Yellow
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; } elseif (strtolower($status) == 'pendiente') {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $color = '#3b82f6'; // Blue
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; } elseif (strtolower($status) == 'cancelado') {
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; $color = '#ef4444'; // Red
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; }
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {{$color}}; color: white; font-size: 14px; font-weight: 500;"&gt;{{$status}}&lt;/span&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Status Timeline --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="padding-bottom: 12px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;p style="font-size: 14px; font-weight: 500; color: #4b5563; margin: 0;"&gt;Seguimiento de tu pedido:&lt;/p&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="23%" style="height: 4px; background-color: #22c55e; border-radius: 4px;"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="2%"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="23%" style="height: 4px; background-color: #22c55e; border-radius: 4px;"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="2%"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="23%" style="height: 4px; background-color:&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;% if (strtolower($status) == 'enviado' || strtolower($status) == 'entregado') { %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; #22c55e
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;% } else { %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; #d1d5db
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;% } %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ; border-radius: 4px;"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="2%"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="23%" style="height: 4px; background-color:&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;% if (strtolower($status) == 'entregado') { %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; #22c55e
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;% } else { %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; #d1d5db
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;% } %&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ; border-radius: 4px;"&gt;&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="25%" style="text-align: left; font-size: 12px; color: #6b7280; padding-top: 4px;"&gt;Pedido&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="25%" style="text-align: center; font-size: 12px; color: #6b7280; padding-top: 4px;"&gt;Procesando&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="25%" style="text-align: center; font-size: 12px; color: #6b7280; padding-top: 4px;"&gt;Enviado&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td width="25%" style="text-align: right; font-size: 12px; color: #6b7280; padding-top: 4px;"&gt;Entregado&lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- CTA Button --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td align="center"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;a href="#" style="display: inline-block; background-color: #1e293b; color: #ffffff; text-decoration: none; font-weight: 500; padding: 10px 24px; border-radius: 6px; font-size: 16px;"&gt;Ver detalles del pedido&lt;/a&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;!-- Footer --&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;td style="background-color: #f9f9f9; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;"&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;p style="margin: 0; font-size: 14px; color: #6b7280;"&gt;Si tienes alguna pregunta, no dudes en contactarnos.&lt;/p&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;p style="margin-top: 8px; font-size: 14px; color: #6b7280;"&gt;{{config('app.name')}} © {{date('Y')}}. Todos los derechos reservados.&lt;/p&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &nbsp; &nbsp; &nbsp; &lt;/table&gt;
&nbsp; &nbsp; &nbsp; &lt;/td&gt;
&nbsp; &nbsp; &lt;/tr&gt;
&nbsp; &lt;/table&gt;
&lt;/body&gt;
&lt;/html&gt;
</pre>