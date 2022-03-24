<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    {{__('textMessageConnection2')}} <a href={{env('app_url')}}>HitBeat</a>
    <br>
    {{__('textMessageConnection3')}} {{ $name }}
    <br>
    {{__('textMessageConnection4')}} <strong>{{ $phone }}</strong>

    <br />
</div>

</body>
</html>
