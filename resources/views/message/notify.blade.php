<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div>
    <p>{{ $text_message }}</p>

    <br />
    <p>{{__('textMessageNotify2')}}</p>
    <p>{{__('textMessageNotify3')}}
        <a href={{env('app_url')}}>
            {{__('textMessageNotify4')}}
        </a>
        {{__('textMessageNotify5')}}
    </p>
    <p>{{__('textMessageNotify6')}}</p>

    <br />
</div>

</body>
</html>
