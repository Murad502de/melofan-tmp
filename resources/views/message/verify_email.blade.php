<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
</head>
<body>

<div style="margin: 25px auto; width: 100%; max-width: 600px; background: #ffffff">
    <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        style="
            margin: 25px auto;
            padding-bottom: 10px;
            width: 100%;
            height: 100%;
            background: #ffffff;
            box-shadow: 0px 0px 26px rgba(0, 0, 0, 0.08);
            border-radius: 23px;
            font-family: 'Trebuchet MS', Helvetica, sans-serif;
            background: url(../../images/waves.png) no-repeat bottom;
        "
    >
        <tr>
            <td>
                <img src="../../images/mail/logo_dark.png" style="display: block; margin: 0 auto" alt="" />
            </td>
        </tr>
        <tr>
            <td align="center" style="padding: 15px 0">
                <a
                    href="#"
                    style="
                        color: #333333;
                        font: 10px Arial, sans-serif;
                        line-height: 0;
                        -webkit-text-size-adjust: none;
                        display: inline-block;
                        padding: 0 10px;
                    "
                    target="_blank"
                    ><img src="../../images/mail/instagram.png" alt=""
                /></a>
                <a
                    href="#"
                    style="
                        color: #333333;
                        font: 10px Arial, sans-serif;
                        line-height: 0;
                        -webkit-text-size-adjust: none;
                        display: inline-block;
                        padding: 0 10px;
                    "
                    target="_blank"
                    ><img src="../../images/mail/telegram.png" alt=""
                /></a>
                <a
                    href="#"
                    style="
                        color: #333333;
                        font: 10px Arial, sans-serif;
                        line-height: 0;
                        -webkit-text-size-adjust: none;
                        display: inline-block;
                        padding: 0 10px;
                    "
                    target="_blank"
                    ><img src="../../images/mail/twitter.png" alt=""
                /></a>
            </td>
        </tr>
        <tr>
            <td align="center" style=" padding: 60px 40px;">
                <p style="margin-top: 75px;"> {{__('textMessageVerify2')}} <b style="color: #333333"><a href={{env('app_url')}}>HitBeat</a></b></p>
                <p>{{__('textMessageVerify3')}}</p>
                <a
                    href="{{ url(app()->getLocale().'/verify/'.$verification_code)}}"
                    style="
                        color: #ffffff;
                        font: 14px Arial, sans-serif;
                        text-decoration: none;
                        background: linear-gradient(90deg, #07eff7 0%, #2a29ff 52.6%, #f590a1 100%);
                        line-height: 13px;
                        margin-top: 25px;
                        margin-bottom: 25px;
                        -webkit-text-size-adjust: none;
                        display: block;
                        padding: 10px 0;
                        box-shadow: 0px 14px 22px -7px rgb(131 44 243 / 20%);
                        border-radius: 27px;
                        max-width: 350px;
                    "
                    target="_blank"
                    >{{__('textMessageVerify4')}}</a
                >
                <p>{{__('textMessageVerify5')}}</p>
                <!-- <p style="margin-top: 100px;">{{__('textMessageVerify6')}} <a href="" style="
                    color: #2A29FF;
                    font: 16px 'Trebuchet MS', Helvetica, sans-serif;
                    line-height: 0;
                    -webkit-text-size-adjust: none;
                    display: inline-block;
                    padding: 0 10px;
                    margin-bottom: 10px;
                ">{{__('textMessageVerify7')}}</a></p> -->
                <p  style="margin-top: 100px;">© 2021 HitBeat. All Rights Reserved.</p>
            </td>
            <tr>
                <td style="height: 25px;"></td>
            </tr>
        </tr>
    </table>
</div>

</body>
</html>
