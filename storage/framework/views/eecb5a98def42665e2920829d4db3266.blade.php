<h1>¡Gracias por tu compra!</h1>
<p>Hola {{ $nombre }},</p>
<p><strong>Código de pedido:</strong> {{ $codigo }}<br><strong>Total:</strong> S/ {{ $total }}</p>
<table width="100%">
    <thead>
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
        </tr>
    </thead>
    <tbody>
        {{ $productos }}
    </tbody>
</table>
<p>¡Gracias por confiar en nosotros!</p>
<p>{{config('app.name')}}<br>&copy; {{date('Y')}}</p>