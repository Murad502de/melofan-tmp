import React, {Fragment, useEffect, useState} from "react";
import PropTypes from "prop-types";
import Sidebar from "../Sidebar";
import Topbar from "../Topbar";
import {useSelector} from "react-redux";

const propTypes = {
	children: PropTypes.element.isRequired,
};

const CabinetLayout = ({children}) => {
	const nameTheme = useSelector(state => state.themeCabinet.name);
	const [onClickBtn, setOnClickBtn] = useState(false);
	

	function resize() {
		if (window.matchMedia("(max-width: 810px)").matches) {
			document.querySelector(".wrapper").classList.add("wrapper--closed");
			setOnClickBtn(true);
		} else {
			document.querySelector(".wrapper").classList.remove("wrapper--closed");
			setOnClickBtn(false);
		}
		if (window.matchMedia("(max-width: 568px)").matches) {
			document.querySelector(".wrapper").classList.add("wrapper--mobile");
		} else {
			document.querySelector(".wrapper").classList.remove("wrapper--mobile");
		}
	}

	useEffect(() => {
		window.scrollTo(0, 0);
		resize();
		window.addEventListener("resize", resize)
		return () => {
			window.removeEventListener("resize", resize);
		}
	}, []);

	return (
		<Fragment>
			<div className={`wrapper ${nameTheme} ${onClickBtn ? "wrapper--closed" : ""}`}>
				<Sidebar onClick={() => setOnClickBtn(true)} />
				<Topbar onClick={() => setOnClickBtn(!onClickBtn)} />
				{children}
			</div>
		</Fragment>
	);
};

CabinetLayout.propTypes = propTypes;

export default CabinetLayout;
