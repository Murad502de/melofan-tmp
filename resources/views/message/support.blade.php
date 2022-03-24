<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    {{__('textMessageSupport2')}} <a href={{env('app_url')}}>HitBeat</a>
    <br>
    {{__('textMessageSupport3')}} {{ $name }}
    <br>
    {{__('textMessageSupport4')}} <strong>{{ $email }}</strong>
    <br>
    {{__('textMessageSupport5')}} <strong>{{ $phone }}</strong>
    <br>
    {{__('textMessageSupport6')}} {{ $support_message }}

    <br />
</div>

</body>
</html>
