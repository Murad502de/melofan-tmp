import React, {useState} from "react";
import {Accordion, Card, Container, Nav, Navbar} from "react-bootstrap";
import {useSelector} from "react-redux";
import {Link, NavLink, useHistory} from "react-router-dom";
import ChangeLanguage from "../../other/ChangeLanguage";
import logo from "../../../../images/header_logo.svg";
import {ArrowDown, ExitIco, FinanceIco} from "../../other/Svg";
import "./Navbar.scss";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";
import {setAllDataUser} from "../../../actions/user";

const NavBarTop = () => {
	const [langIsActive, setLangIsActive] = useState(false);
	const [menuIsActive1, setMenuIsActive1] = useState(false);
	const [menuIsActive2, setMenuIsActive2] = useState(false);
	const [isActiveBurger, setIsActiveBurger] = useState(false);
	const [isActiveMenu, setIsActiveMenu] = useState(false);
	const userId = useSelector(state => state.user.id);
	const avatar = useSelector(state => state.user.avatar);
	const email = useSelector(state => state.user.email);
	const firstName = useSelector(state => state.user.firstName);
	const lastName = useSelector(state => state.user.lastName);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);
	const history = useHistory();
	const logout = e => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));

		postRequest("signout", {
			token: localStorage.usertoken,
		})
			.then(res => {
				if (res.success) {
					localStorage.removeItem("usertoken");
					let initialState = {
						token: null,
						id: 0,
						role_id: null,
						balanceUSD: 0,
						balanceMLFN: 0,
						firstName: "",
						lastName: "",
						avatar: "",
						email: "",
						statusKYC: 0,
						payeer: "",
					};
					store.dispatch(setAllDataUser(initialState));
					store.dispatch(setIsShowPreloader(false));
					history.push("/" + language + "/");
				}
			})
			.catch(err => {
				store.dispatch(setIsShowPreloader(false));
				console.log(err);
			});
	};

	const onCloseMobileNavbar = () => {
		setIsActiveMenu(!isActiveMenu);
		setIsActiveBurger(!isActiveBurger);
	};

	return (
		<>
			<header className="nav-bar-top">
				<Container fluid="md">
					<Navbar expand="lg">
						<Navbar.Brand>
							<Link to={"/" + language + "/"}>
								<img src={logo} alt="HitBeat" width="150px" />
							</Link>
						</Navbar.Brand>
						{/*<Navbar.Toggle aria-controls="basic-navbar-nav"/>*/}
						<Navbar.Collapse id="basic-navbar-nav">
							<Nav className="mr-auto">
								<NavLink
									activeClassName="active"
									exact
									className="nav-bar-top__link"
									to={"/" + language + "/"}>
									{languageText["navbar1"]}
								</NavLink>
								<NavLink
									onMouseEnter={() => setMenuIsActive1(true)}
									onMouseLeave={() => setMenuIsActive1(false)}
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/about"}>
									{languageText["navbar2"]} <ArrowDown />
								</NavLink>
								<NavLink
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/news"}>
									{languageText["navbar3"]}
								</NavLink>
								<NavLink
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/articles"}>
									{languageText["navbar15"]}
								</NavLink>
								<NavLink
									onMouseEnter={() => setMenuIsActive2(true)}
									onMouseLeave={() => setMenuIsActive2(false)}
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/privacy-policy"}>
									{languageText["navbar4"]} <ArrowDown />
								</NavLink>
								<NavLink
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/contacts"}>
									{languageText["navbar5"]}
								</NavLink>
							</Nav>
						</Navbar.Collapse>
						<ChangeLanguage className="ms-auto" />
						<div
							id="nav-icon3"
							onClick={() => {
								setIsActiveMenu(!isActiveMenu), setIsActiveBurger(!isActiveBurger);
							}}
							className={`${isActiveBurger ? "open" : ""}`}>
							<span></span>
							<span></span>
							<span></span>
							<span></span>
						</div>
						{userId ? (
							<div
								className="navbar-dropdown navbar-profile-box"
								onClick={() => setLangIsActive(!langIsActive)}>
								{/* <div className="navbar-profile">
                                        <p>{firstName + ' ' + lastName}</p>
                                        <p className="navbar-profile__mail">{email}</p>
                                    </div> */}
								<div className="avatar">
									<img src={avatar} alt="" />
								</div>
								<ArrowDown />
								<div className={`navbar-dropdown__menu ${langIsActive && "show"}`}>
									<div className="navbar-profile mb-2">
										<p>{firstName + " " + lastName}</p>
										<p className="navbar-profile__mail">{email}</p>
									</div>
									<Link to={"/" + language + "/cabinet/settings"} className="navbar-dropdown__link">
										<FinanceIco /> Личный кабинет
									</Link>
									<a onClick={logout} className="navbar-dropdown__link">
										<ExitIco /> Выход
									</a>
								</div>
							</div>
						) : (
							<NavLink activeClassName="active" className="nav-auth" to={"/" + language + "/signin"}>
								<button className="btn-outline">{languageText["navbar-login"]}</button>
							</NavLink>
						)}

						<div className={`navbar-mobile ${isActiveMenu ? "open" : ""}`}>
							<Container fluid="md">
								{userId ? (
									<div
										className="navbar-dropdown navbar-profile-box"
										onClick={() => setLangIsActive(!langIsActive)}>
										<div className="navbar-profile">
											<p>{firstName + " " + lastName}</p>
											<p className="navbar-profile__mail">{email}</p>
										</div>
										<div className="avatar">
											<img src={avatar} alt="" />
										</div>
										<ArrowDown />
										<div className={`navbar-dropdown__menu ${langIsActive && "show"}`}>
											<Link
												to={"/" + language + "/cabinet/settings"}
												className="navbar-dropdown__link"
												onClick={onCloseMobileNavbar}>
												<FinanceIco /> Личный кабинет
											</Link>
											<a onClick={logout} className="navbar-dropdown__link">
												<ExitIco /> Выход
											</a>
										</div>
									</div>
								) : (
									<NavLink
										activeClassName="active"
										className="nav-auth"
										to={"/" + language + "/signin"}
										onClick={onCloseMobileNavbar}>
										<button className="btn-outline">{languageText["navbar-login"]}</button>
									</NavLink>
								)}
								<NavLink
									activeClassName="active"
									exact
									className="nav-bar-top__link"
									to={"/" + language + "/"}
									onClick={onCloseMobileNavbar}>
									{languageText["navbar1"]}
								</NavLink>
								<Accordion className="nav-accordion">
									<Card>
										<Accordion.Toggle as={Card.Header} eventKey="1">
											{languageText["navbar2"]} <ArrowDown />
										</Accordion.Toggle>
										<Accordion.Collapse eventKey="1">
											<Card.Body>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/about"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar6"]}
												</NavLink>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/board-of-directors"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar7"]}
												</NavLink>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/documents"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar9"]}
												</NavLink>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/events"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar10"]}
												</NavLink>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/contacts"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar11"]}
												</NavLink>
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>
								<NavLink
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/news"}
									onClick={onCloseMobileNavbar}>
									{languageText["navbar3"]}
								</NavLink>
								<NavLink
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/articles"}
									onClick={onCloseMobileNavbar}>
									{languageText["navbar15"]}
								</NavLink>
								<Accordion className="nav-accordion">
									<Card>
										<Accordion.Toggle as={Card.Header} eventKey="0">
											{languageText["navbar4"]} <ArrowDown />
										</Accordion.Toggle>
										<Accordion.Collapse eventKey="0">
											<Card.Body>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/privacy-policy"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar12"]}
												</NavLink>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/terms-of-use"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar13"]}
												</NavLink>
												<NavLink
													activeClassName="active"
													className="menu-down__link"
													to={"/" + language + "/aml"}
													onClick={onCloseMobileNavbar}>
													{languageText["navbar14"]}
												</NavLink>
											</Card.Body>
										</Accordion.Collapse>
									</Card>
								</Accordion>
								<NavLink
									activeClassName="active"
									className="nav-bar-top__link"
									to={"/" + language + "/contacts"}
									onClick={onCloseMobileNavbar}>
									{languageText["navbar5"]}
								</NavLink>
							</Container>
						</div>
					</Navbar>
				</Container>
			</header>
			<div
				className={`menu-down ${menuIsActive1 ? "show" : ""}`}
				onMouseEnter={() => setMenuIsActive1(true)}
				onMouseLeave={() => setMenuIsActive1(false)}>
				<Container fluid="md">
					<Nav className="">
						<NavLink activeClassName="active" className="menu-down__link" to={"/" + language + "/about"}>
							{languageText["navbar6"]}
						</NavLink>
						<NavLink
							activeClassName="active"
							className="menu-down__link"
							to={"/" + language + "/board-of-directors"}>
							{languageText["navbar7"]}
						</NavLink>
						{/* <NavLink
                            activeClassName="active"
                            className="menu-down__link"
                            to={"/"+language+"/management"}
                        >
                            {languageText["navbar8"]}
                        </NavLink> */}
						<NavLink
							activeClassName="active"
							className="menu-down__link"
							to={"/" + language + "/documents"}>
							{languageText["navbar9"]}
						</NavLink>
						<NavLink activeClassName="active" className="menu-down__link" to={"/" + language + "/events"}>
							{languageText["navbar10"]}
						</NavLink>
						<NavLink activeClassName="active" className="menu-down__link" to={"/" + language + "/contacts"}>
							{languageText["navbar11"]}
						</NavLink>
					</Nav>
				</Container>
			</div>
			<div
				className={`menu-down ${menuIsActive2 ? "show" : ""}`}
				onMouseEnter={() => setMenuIsActive2(true)}
				onMouseLeave={() => setMenuIsActive2(false)}>
				<Container fluid="md">
					<Nav className="">
						<NavLink
							activeClassName="active"
							className="menu-down__link"
							to={"/" + language + "/privacy-policy"}>
							{languageText["navbar12"]}
						</NavLink>
						<NavLink
							activeClassName="active"
							className="menu-down__link"
							to={"/" + language + "/terms-of-use"}>
							{languageText["navbar13"]}
						</NavLink>
						<NavLink activeClassName="active" className="menu-down__link" to={"/" + language + "/aml"}>
							{languageText["navbar14"]}
						</NavLink>
					</Nav>
				</Container>
			</div>
		</>
	);
};

export default NavBarTop;
