<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title><?php echo e($subject ?? config('app.name')); ?></title>
    <style>
        body { font-family: Arial, sans-serif; background: #f8f8f8; margin: 0; padding: 0; }
        .email-container { background: #fff; max-width: 500px; margin: 30px auto; border-radius: 8px; box-shadow: 0 2px 8px #eee; padding: 32px; }
    </style>
</head>
<body>
    <div class="email-container">
        <?php echo $slot; ?>

    </div>
</body>
</html>
<?php /**PATH C:\xampp\htdocs\projects\stechperu_final\resources\views/emails/email_wrapper.blade.php ENDPATH**/ ?>