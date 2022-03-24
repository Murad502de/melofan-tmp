<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    {{__('textMessage2FA2')}} <a href={{env('app_url')}}>HitBeat</a>
    <br>
    {{__('textMessage2FA3')}} {{$verification_code}}

    <br />
</div>

</body>
</html>
