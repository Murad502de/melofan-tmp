<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    {{__('textMessageResetPassword2')}} <a href={{env('app_url')}}>HitBeat</a>
    <br>
    {{__('textMessageResetPassword3')}} {{ $login }}
    <br>
    <br>
    {{__('textMessageResetPassword4')}}
    <a href="{{ url(app()->getLocale().'/'.$url_reset.'/'.$verification_code)}}">{{__('textMessageResetPassword5')}}</a>.

    <br />
</div>

</body>
</html>
