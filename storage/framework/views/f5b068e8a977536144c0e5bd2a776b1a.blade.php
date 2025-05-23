<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Estado de tu Pedido</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 20px;">
        <table style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" cellpadding="0" cellspacing="0" border="0">
          <!-- Header -->
          <tr>
            <td style="background-color: #1e293b; padding: 24px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0;">{{ config('app.name') }}</h1>
            </td>
          </tr>
          
          <!-- Main Content -->
          <tr>
            <td style="padding: 24px;">
              <!-- Greeting -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="text-align: center; padding-bottom: 20px;">
                    <h2 style="font-size: 20px; color: #333333; margin: 0;">¡Hola, {{$name}}!</h2>
                    <p style="margin-top: 10px; color: #666666;">Gracias por tu compra en {{ config('app.name') }}</p>
                  </td>
                </tr>
              </table>
              
              <!-- Order Info -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f9f9f9; border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="color: #666666;">Pedido #:</td>
                        <td style="text-align: right; font-weight: bold;">{{$orderId}}</td>
                      </tr>
                      <tr>
                        <td style="height: 10px;"></td>
                      </tr>
                      <tr>
                        <td style="color: #666666;">Estado:</td>
                        <td style="text-align: right;">
                          <!-- Status Badge -->
                          @php
                              $color = '#9ca3af';
                              if (strtolower($status) == 'enviado') {
                                  $color = '#22c55e';
                              } elseif (strtolower($status) == 'procesando') {
                                  $color = '#eab308';
                              } elseif (strtolower($status) == 'pendiente') {
                                  $color = '#3b82f6';
                              } elseif (strtolower($status) == 'cancelado') {
                                  $color = '#ef4444';
                              }
                          @endphp
                          <span style="display: inline-block; padding: 4px 12px; border-radius: 50px; background-color: {{$color}}; color: white; font-size: 14px; font-weight: 500;">{{$status}}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Status Timeline -->
              @php
                  $color1 = '#22c55e'; // Pedido
                  $color2 = (strtolower($status) == 'procesando' || strtolower($status) == 'enviado' || strtolower($status) == 'entregado') ? '#22c55e' : '#d1d5db';
                  $color3 = (strtolower($status) == 'enviado' || strtolower($status) == 'entregado') ? '#22c55e' : '#d1d5db';
                  $color4 = (strtolower($status) == 'entregado') ? '#22c55e' : '#d1d5db';
              @endphp
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding-bottom: 12px;">
                    <p style="font-size: 14px; font-weight: 500; color: #4b5563; margin: 0;">Seguimiento de tu pedido:</p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="23%" style="height: 4px; background-color: {{$color1}}; border-radius: 4px;"></td>
                        <td width="2%"></td>
                        <td width="23%" style="height: 4px; background-color: {{$color2}}; border-radius: 4px;"></td>
                        <td width="2%"></td>
                        <td width="23%" style="height: 4px; background-color: {{$color3}}; border-radius: 4px;"></td>
                        <td width="2%"></td>
                        <td width="23%" style="height: 4px; background-color: {{$color4}}; border-radius: 4px;"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="25%" style="text-align: left; font-size: 12px; color: #6b7280; padding-top: 4px;">Pedido</td>
                        <td width="25%" style="text-align: center; font-size: 12px; color: #6b7280; padding-top: 4px;">Procesando</td>
                        <td width="25%" style="text-align: center; font-size: 12px; color: #6b7280; padding-top: 4px;">Enviado</td>
                        <td width="25%" style="text-align: right; font-size: 12px; color: #6b7280; padding-top: 4px;">Entregado</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="#" style="display: inline-block; background-color: #1e293b; color: #ffffff; text-decoration: none; font-weight: 500; padding: 10px 24px; border-radius: 6px; font-size: 16px;">Ver detalles del pedido</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">Si tienes alguna pregunta, no dudes en contactarnos.</p>
              <p style="margin-top: 8px; font-size: 14px; color: #6b7280;">{{ config('app.name') }} © {{ date('Y') }}. Todos los derechos reservados.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>