import React, {Fragment} from "react";
import PropTypes from "prop-types";
import NavBarTop from "../Navbar";
import Footer from "../Footer";

const propTypes = {
	children: PropTypes.element.isRequired,
};

const LandingLayout = ({children}) => {
	React.useEffect(() => {
		window.scrollTo(0, 0);
	});

	return (
		<Fragment>
			<NavBarTop />
			{children}
			<Footer />
		</Fragment>
	);
};

LandingLayout.propTypes = propTypes;

export default LandingLayout;
