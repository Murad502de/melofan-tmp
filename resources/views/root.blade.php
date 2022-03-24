<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="icon" href={{asset('./favicon.ico')}} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <link rel="apple-touch-icon" href={{asset('./favicon.ico')}} />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <link rel="stylesheet" href="{{asset('./css/bootstrap.min.css')}}" type="text/css" />
    <link href="{{asset('./css/suneditor.min.css')}}" rel="stylesheet" type="text/css">

    <script>
        window.pusher_app_key = '{{env("PUSHER_APP_KEY")}}';
        window.laravel_echo_port = '{{env("LARAVEL_WEBSOCKETS_PORT")}}';
        window.google_recaptcha_key = '{{env("GOOGLE_CAPTCHA_PUBLIC_KEY")}}';
    </script>

    <title>Xetrade | HitBeat Music</title>
</head>

<body>
<div id="root"></div>
<script src="{{asset('./js/app.js')}}"></script>
{{--@if(config('app.env') == 'local')--}}
{{--    <script src="http://localhost:35729/livereload.js"></script>--}}
{{--@endif--}}
</body>

</html>
