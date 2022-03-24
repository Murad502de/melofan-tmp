import React, {Component} from "react";
import {Route} from "react-router-dom";
import RootRoute from "./RootRoute";

import SignIn from "./structure/auth/SignIn";
import Dashboard from "./structure/panels/dashboard/Dashboard";
import Users from "./structure/panels/users/Users";
import EditUsers from "./structure/panels/users/EditUsers";
import CreateUsers from "./structure/panels/users/CreateUsers";
import EditOperators from "./structure/panels/users/EditOperators";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {connect} from "react-redux";
import {store} from "../store/configureStore";
import {setError, setMessage} from "../store/rootActions";
import PasswordReset from "./structure/auth/PasswordReset";
import EditPayouts from "./structure/panels/payouts/EditPayouts";
import Payouts from "./structure/panels/payouts/Payouts";
import Payments from "./structure/panels/payments/Payments";
import EditNews from "./structure/panels/news/EditNews";
import News from "./structure/panels/news/News";
import Documents from "./structure/panels/documents/Documents";
import EditDocument from "./structure/panels/documents/EditDocument";
import Roadmap from "./structure/panels/roadmap/Roadmap";
import EditRoadmap from "./structure/panels/roadmap/EditRoadmap";
import Tickets from "./structure/panels/tickets/Tickets";
import EditTickets from "./structure/panels/tickets/EditTickets";
import Settings from "./structure/panels/settings/Settings";
import Articles from "./structure/panels/articles/Articles";
import EditArticles from "./structure/panels/articles/EditArticles";
import Events from "./structure/panels/events/Events";
import EditEvents from "./structure/panels/events/EditEvents";
import Verify from "./structure/panels/verify/Verify";
import EditVerify from "./structure/panels/verify/EditVerify";
import Securities from "./structure/panels/securities/Securities";
import EditSecurities from "./structure/panels/securities/EditSecurities";

class RootPanel extends Component {
	closeError() {
		store.dispatch(setError(null));
	}

	closeMessage() {
		store.dispatch(setMessage(null));
	}

	render() {
		let {message, error} = this.props;

		return (
			<div>
				<Route path={[this.props.path + "/signin", this.props.path + "/open"]}>
					<SignIn basePath={this.props.path} />
				</Route>
				<Route path={[this.props.path + "/reset"]}>
					<PasswordReset basePath={this.props.path} />
				</Route>
				<Route path={[this.props.path + "/reset:verification_code"]}>
					<PasswordReset basePath={this.props.path} />
				</Route>

				<RootRoute
					role={[200, 100, 101, 103]}
					basePath={this.props.path}
					path="/dashboard"
					component={Dashboard}
				/>
				<RootRoute
					role={[200, 100, 101, 103]}
					basePath={this.props.path}
					path="/settings"
					component={Settings}
				/>

				<RootRoute role={[200]} basePath={this.props.path} path="/users" component={Users} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-users:idUser" component={EditUsers} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-users" component={CreateUsers} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-operators" component={EditOperators} />
				<RootRoute
					role={[200]}
					basePath={this.props.path}
					path="/edit-operators:idUser"
					component={EditOperators}
				/>
				<RootRoute
					role={[200]}
					basePath={this.props.path}
					path="/edit-users:idUser"
					component={EditUsers}
				/>

				<RootRoute role={[200, 103]} basePath={this.props.path} path="/verify" component={Verify} />
				<RootRoute
					role={[200, 103]}
					basePath={this.props.path}
					path="/edit-verify:idVerify"
					component={EditVerify}
				/>

				<RootRoute role={[200]} basePath={this.props.path} path="/payments" component={Payments} />

				<RootRoute role={[200, 101]} basePath={this.props.path} path="/payouts" component={Payouts} />
				<RootRoute
					role={[200, 101]}
					basePath={this.props.path}
					path="/edit-openPayouts:idPayouts"
					component={EditPayouts}
				/>

				<RootRoute role={[200]} basePath={this.props.path} path="/news" component={News} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-news" component={EditNews} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-news:idNews" component={EditNews} />

				<RootRoute role={[200]} basePath={this.props.path} path="/articles" component={Articles} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-articles" component={EditArticles} />
				<RootRoute
					role={[200]}
					basePath={this.props.path}
					path="/edit-articles:idArticles"
					component={EditArticles}
				/>

				<RootRoute role={[200]} basePath={this.props.path} path="/documents" component={Documents} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-documents" component={EditDocument} />
				<RootRoute
					role={[200]}
					basePath={this.props.path}
					path="/edit-documents:idDocument"
					component={EditDocument}
				/>

				<RootRoute role={[200]} basePath={this.props.path} path="/events" component={Events} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-events" component={EditEvents} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-events:idEvent" component={EditEvents} />

				<RootRoute role={[200]} basePath={this.props.path} path="/roadmap" component={Roadmap} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-roadmap" component={EditRoadmap} />
				<RootRoute
					role={[200]}
					basePath={this.props.path}
					path="/edit-roadmap:idRoadmap"
					component={EditRoadmap}
				/>

				<RootRoute role={[200]} basePath={this.props.path} path="/securities" component={Securities} />
				<RootRoute role={[200]} basePath={this.props.path} path="/edit-securities" component={EditSecurities} />
				<RootRoute
					role={[200]}
					basePath={this.props.path}
					path="/edit-securities:idSecurities"
					component={EditSecurities}
				/>

				<RootRoute role={[200, 100]} basePath={this.props.path} path="/tickets" component={Tickets} />
				<RootRoute
					role={[200, 100]}
					basePath={this.props.path}
					path="/edit-closeTickets:idTickets"
					component={EditTickets}
				/>
				<RootRoute
					role={[200, 100]}
					basePath={this.props.path}
					path="/edit-workTickets:idTickets"
					component={EditTickets}
				/>

				<Snackbar open={error != null} onClose={this.closeError}>
					<Alert align="center" elevation={6} variant="filled" onClose={this.closeError} severity="error">
						{error}
					</Alert>
				</Snackbar>
				<Snackbar open={message != null} onClose={this.closeMessage}>
					<Alert align="center" elevation={6} variant="filled" onClose={this.closeMessage} severity="success">
						{message}
					</Alert>
				</Snackbar>
			</div>
		);
	}
}

const mapStateToProps = store => {
	return {
		error: store.root.error,
		message: store.root.message,
	};
};

export default connect(mapStateToProps)(RootPanel);
