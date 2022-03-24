import Echo from "laravel-echo";
window.Pusher = require("pusher-js");

export const laravelEchoInit = token => {
    window.laravelEcho = undefined;
    let useTls = process.env.LARAVEL_WEBSOCKETS_TLS === undefined ? true : process.env.LARAVEL_WEBSOCKETS_TLS;

    window.laravelEcho = new Echo({
        broadcaster: "pusher",
        key: window.pusher_app_key,
        wsHost: window.location.hostname,
        wsPort: window.laravel_echo_port,
        wssPort: window.laravel_echo_port,
        forceTLS: useTls,
        disableStats: true,
        auth: {
            headers: {
                "Authorization": "Bearer " + token,
            },
        },
    });
};

laravelEchoInit(localStorage.usertoken);
