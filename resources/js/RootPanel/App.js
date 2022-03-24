import React, {Component} from "react";
import {BrowserRouter as Router, Switch} from "react-router-dom";
import RootPanel from "./components/RootPanel";
import ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {store} from "./store/configureStore";
import {setIsAuth} from "./store/rootActions";
import Preloader from "./components/Preloader";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {ruRU} from "@material-ui/core/locale";
import VerifyModal from "./components/structure/panels/modals/VerifyModal";
import {setIsShowPreloader} from "../actions/preloader";
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";

const theme = createMuiTheme({}, ruRU);

export default class App extends Component {
	constructor() {
		super();
		if (localStorage.admintoken) {
			postRequest("checkAuthRoot")
				.then(res => {
					store.dispatch(setIsAuth(true, Number(res.roleId), Number(res.userId), localStorage.admintoken));
				})
				.catch(() => {
					localStorage.removeItem("admintoken");
					store.dispatch(setIsAuth(false, 0, 0, null));
					store.dispatch(setIsShowPreloader(false));
				});
		} else {
			store.dispatch(setIsAuth(false, 0, 0, null));
		}
	}

	render() {
		return (
			<Router>
				<MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
					<ThemeProvider theme={theme}>
						<Preloader />
						<Switch>
							<RootPanel path="/root-panel" />
						</Switch>
					</ThemeProvider>
					<VerifyModal path="/root-panel" />
				</MuiPickersUtilsProvider>
			</Router>
		);
	}
}

ReactDOM.render(
	<GoogleReCaptchaProvider
		useRecaptchaNet
		reCaptchaKey={window.google_recaptcha_key}
		scriptProps={{async: true, defer: true, appendTo: "body"}}>
		<Provider store={store}>
			<App />
		</Provider>
	</GoogleReCaptchaProvider>,
	document.getElementById("root")
);
