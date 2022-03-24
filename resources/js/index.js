import "./bootstrap";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import {store} from "./store/configureStore";
import {Provider} from "react-redux";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";

ReactDOM.render(
	<GoogleReCaptchaProvider
		useRecaptchaNet
		reCaptchaKey={window.google_recaptcha_key}
		scriptProps={{async: true, defer: true, appendTo: "body"}}>
		<Provider store={store}>
			<App />
		</Provider>
	</GoogleReCaptchaProvider>,
	document.getElementById("app")
);
