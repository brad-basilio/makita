@php
  $component = Route::currentRouteName();
@endphp

<!DOCTYPE html>
<html lang="es">

<head>
  @viteReactRefresh
  <meta charset="utf-8" />
  <title>Login | {{ env('APP_NAME', 'Kaori') }}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta content="A fully featured admin theme which can be used to build CRM, CMS, etc." name="description" />
  <meta content="Coderthemes" name="author" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="shortcut icon" href="/assets/resources/icon.png?v={{ uniqid() }}" type="image/png">

  <link href="/lte/assets/libs/select2/css/select2.min.css" rel="stylesheet" type="text/css" />

  <link href="/lte/assets/css/config/default/bootstrap.min.css" rel="stylesheet" type="text/css"
    id="bs-default-stylesheet" />
  <link href="/lte/assets/css/config/default/app.min.css" rel="stylesheet" type="text/css"
    id="app-default-stylesheet" />

  <link href="/lte/assets/css/config/default/bootstrap-dark.min.css" rel="stylesheet" type="text/css"
    id="bs-dark-stylesheet" disabled="disabled" />
  <link href="/lte/assets/css/config/default/app-dark.min.css" rel="stylesheet" type="text/css" id="app-dark-stylesheet"
    disabled="disabled" />

  <link href="/lte/assets/css/icons.min.css" rel="stylesheet" type="text/css" />

  @vite(['resources/css/app.css', 'resources/js/' . Route::currentRouteName()])
  @inertiaHead
</head>

<body class="loading authentication-bg-pattern" style="background-color: #05455A">
  @inertia

  <script src="/lte/assets/js/vendor.min.js"></script>
  <script src="/lte/assets/libs/select2/js/select2.full.min.js"></script>
  <script src="/lte/assets/js/app.min.js"></script>

</body>

</html>
