import React, {Component} from "react";
import {Route} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import MiniDrawer from "./structure/drawer/MiniDrawer";
import {connect} from "react-redux";
import SignIn from "./structure/auth/SignIn";

const styles = () => ({
	root: {
		display: "flex",
	},
});

class RootRoute extends Component {
	render() {
		let {isAuth, roleId, role, classes, basePath, path, component: Component} = this.props;
		if (isAuth && role.includes(Number(roleId))) {
			return (
				<Route
					path={basePath + path}
					render={props => {
						return (
							<div className={classes.root}>
								<MiniDrawer basePath={basePath} />
								<Component {...props} basePath={basePath} />
							</div>
						);
					}}
				/>
			);
		} else {
			return (
				<Route path={basePath + path}>
					<SignIn basePath={basePath} />
				</Route>
			);
		}
	}
}

const mapStateToProps = store => {
	return {
		roleId: store.root.roleId,
		isAuth: store.root.isAuth,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(RootRoute));
