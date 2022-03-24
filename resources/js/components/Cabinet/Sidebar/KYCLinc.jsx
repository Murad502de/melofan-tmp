import React from "react";

import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";

const KYCLinc = props => {
	const statusKYC = useSelector(state => state.user.statusKYC);

	const offLink = e => {
		e.preventDefault();
	};
	if (statusKYC > 0) {
		return (
			<NavLink to={props.to} activeClassName={props.activeClassName}>
				{props.children}
			</NavLink>
		);
	} else {
		return (
			<NavLink onClick={e => offLink(e)} to={props.to} activeClassName={props.activeClassName}>
				{props.children}
			</NavLink>
		);
	}
};

export default KYCLinc;
