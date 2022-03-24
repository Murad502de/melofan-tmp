import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import header_logo from "../../../images/header_logo.svg";
import {DoneSvg, WarningSvg} from "../other/Svg";
import {useSelector} from "react-redux";
import {setIsShowPreloader} from "../../actions/preloader";
import {store} from "../../store/configureStore";
import {setAllDataUser} from "../../actions/user";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import BackgroundBlur from "../other/BackgroundBlur";
// import {setIsOpen} from "../../actions/modal2fa";
import Preloader from "../other/Preloader";
import {laravelEchoInit} from "../../actions/laravelEcho";

const SignIn = props => {
	const {executeRecaptcha} = useGoogleReCaptcha();
	const history = useHistory();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [is2faEnable, set2faEnable] = useState(false);
	const [verifyCode, setVerifyCode] = useState("");
	const [isShowPreloader, setShowPreloader] = useState(false);

	const [message, setMessage] = useState("");
	const [error, setError] = useState({});

	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);
		if (props.match) {
			let verification_code = props.match.params.verification_code;

			if (verification_code) {
				postRequest("verify", {
					verification_code: verification_code,
				})
					.then(res => {
						if (res.success) {
							setMessage(languageText["verifySuccess" + res.idMessage]);
						} else {
							setError(languageText["verifyError"]);
						}
						store.dispatch(setIsShowPreloader(false));
					})
					.catch(err => {
						setError(languageText["verifyError"]);
					});
			} else {
				store.dispatch(setIsShowPreloader(false));
			}
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}, []);

	const onLogin = async e => {
		e.preventDefault();

		if ((verifyCode === "" || verifyCode == null) && is2faEnable) {
			setError(languageText["modal2FA3"]);
			return;
		}

		setShowPreloader(true);
		setMessage("");
		setError("");
		let captcha = await executeRecaptcha("SignIn");

		postRequest("signin", {
			email,
			password,
			verifyCode,
			captcha,
		})
			.then(res => {
				if (res.success) {
					if (res.token) {
						localStorage.setItem("usertoken", res.token);
						store.dispatch(setAllDataUser({...res.user, token: res.token}));
						window.laravelEcho = laravelEchoInit;
						setShowPreloader(false);
						if (
							document.location.pathname === "/" + language + "/signin" ||
							props.match.params.verification_code ||
							document.location.pathname === "/" + language + "/verify"
						) {
							if (res.user.statusKYC == 0 || res.user.statusKYC == 2) {
                                window.location.href  =  "/" + language + "/cabinet/verification";
                                //history.push("/" + language + "/cabinet/verification");
							} else if (res.user.statusKYC > 0) {
                                window.location.href  =  "/" + language + "/cabinet/settings";
								// history.push("/" + language + "/cabinet/settings");
							} else {
								setError(languageText["loginError003"]);
							}
						}
					} else {
						set2faEnable(true);
						setShowPreloader(false);
					}
				} else {
					setError(languageText["loginError" + res.idError]);
					setShowPreloader(false);
				}
			})
			.catch(err => {
				if (is2faEnable) {
					setError(languageText["loginError005"]);
				} else {
					setError(languageText["loginError002"]);
				}
				setShowPreloader(false);
			});
	};

	return (
		<section className="auth">
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<form onSubmit={e => onLogin(e)} className="form-auth">
							<div className="form-auth__img">
								<img src={header_logo} alt="HitBeat Logo" width="150px" />
								<p>{languageText["textSingIn1"]}</p>
							</div>
							{isShowPreloader ? (
								<Preloader type="mini-circle" />
							) : (
								<>
									{typeof message == "string" && message !== "" && (
										<p className="form-auth__text form-auth__text-success">
											<DoneSvg /> {message}
										</p>
									)}
									{((typeof error == "string" && error !== "") ||
										(error && (error.email || error.password))) && (
										<p className="form-auth__text">
											<WarningSvg /> {error}
										</p>
									)}
									{error && error.captcha && (
										<p className="form-auth__text">
											<WarningSvg /> {languageText["registerCaptchaError"]}
										</p>
									)}
									{is2faEnable ? (
										<div className="form-group">
											<label className="form-auth-label" htmlFor="verifyCode">
												{languageText["modal2FA2"]}
											</label>
											<div className="input-wrapper">
												<input
													className="form-auth-input"
													required
													id="verifyCode"
													name="verifyCode"
													placeholder={languageText["modal2FA3"]}
													value={verifyCode}
													onChange={e => setVerifyCode(e.target.value)}
												/>
											</div>
										</div>
									) : (
										<>
											<div className="form-group">
												<label className="form-auth-label" htmlFor="email">
													{languageText["textSingIn2"]}
												</label>
												<div className="input-wrapper">
													<input
														className="form-auth-input"
														required
														type="email"
														id="email"
														name="email"
														placeholder={languageText["textSingIn3"]}
														value={email}
														onChange={e => setEmail(e.target.value)}
													/>
												</div>
											</div>
											<div className="form-group">
												<label className="form-auth-label" htmlFor="password">
													{languageText["textSingIn4"]}
												</label>
												<input
													className="form-auth-input"
													type="password"
													id="password"
													required
													name="password"
													placeholder={languageText["textSingIn5"]}
													value={password}
													onChange={e => setPassword(e.target.value)}
												/>
											</div>
										</>
									)}
									<div className="form-group">
										<button className="btn-main" type="submit">
											{languageText["textSingIn6"]}
										</button>

										{!is2faEnable && (
											<>
												<p className="form-p">
													{languageText["textSingIn7"] + " "}
													<Link to={"/" + language + "/signup"}>
														{languageText["textSingIn8"]}
													</Link>
												</p>
												<p className="form-p mt-0">
													{languageText["textSingIn9"] + " "}
													<Link to={"/" + language + "/recovery"}>
														{languageText["textSingIn10"]}
													</Link>
												</p>
											</>
										)}
									</div>
								</>
							)}
						</form>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default SignIn;
