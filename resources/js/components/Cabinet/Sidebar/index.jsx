import React from "react";
import logo from "../../../../images/header_logo.svg";
import logo_mini from "../../../../images/mlfn_logo.svg";
import {
	AttentionVerifiedIco,
	FaqIco,
	FinanceIco,
	HistoryIco,
	NotVerifiedIco,
	SecuritiesIco,
	SettingsIco,
	SupportIco,
	TradeIco,
	UnVerifiedSvg,
	VerifiedIco,
	VerifiedSvg,
} from "../../other/Svg";
import "./Sidebar.scss";
import {Link, NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import KYCLinc from "./KYCLinc";
import ThemeSwitch from "../../other/ThemeSwitch";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser"

const Sidebar = ({onClick}) => {
	const user = useSelector(state => state.user);
	let currentDate = new Date().getFullYear();
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);

	const offLinkVerify = e => {
		if (user.statusKYC === 1) {
			e.preventDefault();
		}
	};

	let iconVerify = <NotVerifiedIco />;
	let textVerify = <span>{languageText["textSidebar6"]}</span>;
	switch (user.statusKYC) {
		case 0:
			textVerify = <span>{languageText["textSidebar7"]}</span>;
			break;
		case 1:
			iconVerify = <VerifiedIco />;
			break;
		case 4:
			iconVerify = <AttentionVerifiedIco />;
			break;
	}

	return (
		<div className="sidebar">
			<Link to={"/" + language + "/"}>
				<img src={logo} alt="logo" className="sidebar__logo" />
				<img src={logo_mini} alt="logo" className="sidebar__logo-mini" />
			</Link>
			<div className="avatar">
				<Link to={"/" + language + "/cabinet/settings"}>
					<img src={user.avatar} alt="" />
					{user.statusKYC !== 0 ? <VerifiedSvg className="verif" /> : <UnVerifiedSvg className="verif" />}
				</Link>
			</div>
			<div className="sidebar__profile">
				<p className="name">{user.firstName + " " + user.lastName}</p>
				<p className="mail">{user.email}</p>
			</div>
			<nav className="sidebar__nav">
				<ul>
					<div className="">
						<li onClick={onClick}>
							<KYCLinc   activeClassName="active" to={"/" + language + "/cabinet/finance"}>
								<FinanceIco /> <span>{languageText["textSidebar1"]}</span>
							</KYCLinc>
						</li>
						<li onClick={onClick}>
							<KYCLinc activeClassName="active" to={"/" + language + "/cabinet/securities"}>
								<SecuritiesIco /> <span>{languageText["textSidebar2"]}</span>
							</KYCLinc>
						</li>
						<li onClick={onClick}>
							<KYCLinc activeClassName="active" to={"/" + language + "/cabinet/trade"}>
								<TradeIco /> <span>{languageText["textSidebar3"]}</span>
							</KYCLinc>
						</li>
						<li onClick={onClick}>
							<KYCLinc activeClassName="active" to={"/" + language + "/cabinet/transaction-history"}>
								<HistoryIco /> <span>{languageText["textSidebar4"]}</span>
							</KYCLinc>
						</li>
						<li onClick={onClick}>
							<KYCLinc activeClassName="active" to={"/" + language + "/cabinet/partners"}>
								<FinanceIco /> <span>Партнеры</span>
							</KYCLinc>
						</li>
						<li onClick={onClick}>
							<KYCLinc activeClassName="active" to={"/" + language + "/cabinet/faq"}>
								<FaqIco /> <span>{languageText["textSidebar5"]}</span>
							</KYCLinc>
						</li>
						<li onClick={onClick}>
							<NavLink
								activeClassName="active"
								to={"/" + language + "/cabinet/verification"}
								onClick={e => offLinkVerify(e)}>
								{iconVerify}
								{textVerify}
							</NavLink>
						</li>
					</div>
					<div className="mt-5">
						<li onClick={onClick} className="sidebar__nav-down">
							<NavLink activeClassName="active" to={"/" + language + "/cabinet/support"}>
								<SupportIco /> <span>{languageText["textSidebar8"]}</span>
							</NavLink>
						</li>

						<li onClick={onClick}>
							<KYCLinc activeClassName="active" to={"/" + language + "/cabinet/settings"}>
								<SettingsIco /> <span>{languageText["textSidebar9"]}</span>
							</KYCLinc>
						</li>
						<ThemeSwitch />
						<li className="sidebar-copy">
							<p>
								© {currentDate == "2021" ? "2021" : "2021-" + currentDate} HitBeat.{" "}
								{languageText["textSidebar10"]}
							</p>
						</li>
					</div>
				</ul>
			</nav>
		</div>
	);
};

export default Sidebar;
