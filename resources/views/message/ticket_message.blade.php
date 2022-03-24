<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    {{__('textMessageTicket1')}}: {{ $text_message }}

    <br />
    <p>{{__('textMessageTicket2')}}</p>
    <p>{{__('textMessageTicket3')}}
        <a href={{env('app_url')}}>
            {{__('textMessageTicket4')}}
        </a>
        {{__('textMessageTicket5')}}
    </p>
    <p>{{__('textMessageTicket6')}}</p>

    <br />
</div>

</body>
</html>
