<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <title>Xetrade | HitBeat Music</title>

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="preload" href="{{asset('css/app.css')}}" as="style">
    <link rel="stylesheet" href="{{asset('css/app.css')}}" type="text/css">
    <link rel="shortcut icon" href="{{asset('favicon.ico')}}" type="image/x-icon">

    <meta property="og:title" content="Hitbeat" />
    <meta property="og:image" content="{{asset('images/header_logo.svg')}}" />
    <meta property="og:type" content="website" />
    {{--    <meta property="og:url" content="{{url()}}"/>--}}

    <script>
        window.pusher_app_key = '{{env("PUSHER_APP_KEY")}}';
        window.laravel_echo_port = '{{env("LARAVEL_WEBSOCKETS_PORT")}}';
        window.google_recaptcha_key = '{{env("GOOGLE_CAPTCHA_PUBLIC_KEY")}}';
    </script>

</head>

<body>
<div id="app"></div>
<script src="{{asset('js/index.js')}}"></script>
</body>
</html>
