import React from "react";
import {useSelector, useStore} from "react-redux";
import {Route} from "react-router-dom";
import CabinetLayout from "./CabinetLayout";
import PropTypes from "prop-types";
import NavBarTop from "../../Landing/Navbar";
import SignIn from "../../Auth/SignIn";
import Footer from "../../Landing/Footer";
import Verification from "../Pages/Verification";

const propTypes = {
	rest: PropTypes.object,
	location: PropTypes.object,
};

const CabinetLayoutRoute = ({role, component: Component, ...rest}) => {
	const userId = useSelector(state => state.user.id);
	const statusKYC = useSelector(state => state.user.statusKYC);

	const store = useStore();
	if (userId) {
		if (role.includes(Number(statusKYC))) {
			return (
				<Route
					{...rest}
					render={props => {
						return (
							<CabinetLayout>
								<Component {...props} />
							</CabinetLayout>
						);
					}}
				/>
			);
		} else {
			return (
				<Route
					{...rest}
					render={props => {
						return (
							<CabinetLayout>
								<Verification {...props} />
							</CabinetLayout>
						);
					}}
				/>
			);
		}
	} else {
		return (
			<Route
				{...rest}
				render={props => {
					return (
						<>
							<NavBarTop />
							<SignIn {...props} />
							<Footer />
						</>
					);
				}}
			/>
		);
	}
};

CabinetLayoutRoute.propTypes = propTypes;

export default CabinetLayoutRoute;
