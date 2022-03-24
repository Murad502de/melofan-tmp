import React from "react";
import {Route} from "react-router-dom";
import PropTypes from "prop-types";
import LandingLayout from "./LandingLayout";

const propTypes = {
	rest: PropTypes.object,
	location: PropTypes.object,
};

const LandingLayoutRoute = ({component: Component, ...rest}) => {
	return (
		<Route
			{...rest}
			render={props => {
				return (
					<LandingLayout>
						<Component {...props} />
					</LandingLayout>
				);
			}}
		/>
	);
};

LandingLayoutRoute.propTypes = propTypes;

export default LandingLayoutRoute;
