<h1>¡Gracias por tu compra!</h1>
<p>Hola <?php echo e($nombre); ?>,</p>
<p><strong>Código de pedido:</strong> <?php echo e($codigo); ?><br><strong>Total:</strong> S/ <?php echo e($total); ?></p>
<table width="100%">
    <thead>
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
        </tr>
    </thead>
    <tbody>
        <?php echo e($productos); ?>

    </tbody>
</table>
<p>¡Gracias por confiar en nosotros!</p>
<p><?php echo e(config('app.name')); ?><br>&copy; <?php echo e(date('Y')); ?></p><?php /**PATH C:\xampp\htdocs\projects\stechperu_final\storage\framework\views/eecb5a98def42665e2920829d4db3266.blade.php ENDPATH**/ ?>