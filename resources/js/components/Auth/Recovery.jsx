import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import header_logo from "../../../images/header_logo.svg";
import {WarningSvg} from "../other/Svg";
import {useSelector} from "react-redux";
import {store} from "../../store/configureStore";
import {setIsShowPreloader} from "../../actions/preloader";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import BackgroundBlur from "../other/BackgroundBlur";

const Recovery = props => {
	const {executeRecaptcha} = useGoogleReCaptcha();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [password_confirmation, setPassword_confirmation] = useState("");
	const [verification_reset, setVerification_reset] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState({});

	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		let verification_reset = props.match.params.verification_code;
		if (verification_reset) {
			setVerification_reset(verification_reset);
			store.dispatch(setIsShowPreloader(false));
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}, []);

	const onRecovery = async e => {
		e.preventDefault();
		if (verification_reset !== "") {
			await setNewPassword();
		} else {
			await sendEmailForResetPassword();
		}
	};

	const setNewPassword = async () => {
		store.dispatch(setIsShowPreloader(true));

		setMessage("");
		setError("");
		let captcha = await executeRecaptcha("SetNewResetPassword");

		postRequest("resetPassword", {
			password,
			password_confirmation,
			verification_reset,
			captcha,
		})
			.then(res => {
				if (res.success) {
					setMessage(languageText["resetPasswordSuccess"]);
				} else {
					setError(languageText["resetPasswordError"]);
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				if (
					err.response &&
					err.response.data &&
					err.response.data.errors &&
					err.response.data.errors.password
				) {
					setError(err.response.data.errors);
				} else {
					setError(languageText["resetPasswordError"]);
				}
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const sendEmailForResetPassword = async () => {
		store.dispatch(setIsShowPreloader(true));

		setMessage("");
		setError("");
		let captcha = await executeRecaptcha("SendMailResetPassword");

		postRequest("sendForResetPassword", {
			email,
			captcha,
		})
			.then(res => {
				if (res.success) {
					setMessage(languageText["sendResetPasswordSuccess"]);
				} else {
					setError({email: 422});
				}

				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				setError({email: 422});
				store.dispatch(setIsShowPreloader(false));
			});
	};

	let passwordValidate = password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,255}$/);

	return (
		<section className="auth">
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						{verification_reset !== "" ? (
							<form onSubmit={onRecovery} className="form-auth">
								<div className="form-auth__img">
									<img src={header_logo} alt="HitBeat Logo" width="150px" />
									<p>{languageText["textRecovery1"]}</p>
								</div>
								{typeof message != "string" || message === "" ? (
									<>
										<p className="form-auth__text">
											<WarningSvg />
											{" " + languageText["textRecovery8"]}
										</p>
										{typeof error == "string" && error !== "" && (
											<p className="form-auth__text">
												<WarningSvg />
												{" " + error}
											</p>
										)}
										<div
											className={`form-group ${
												((error && error.password) || (!passwordValidate && password)) &&
												"error"
											}`}>
											<label className="form-auth-label" htmlFor="password">
												{languageText["textSignUp11"]}
											</label>
											<div className="input-wrapper">
												<input
													className="form-auth-input"
													type="password"
													id="password"
													required
													name="password"
													placeholder={languageText["textSignUp12"]}
													value={password}
													onChange={e => setPassword(e.target.value)}
												/>
												{passwordValidate && password && (
													<label
														className="form-auth-label form-group-before"
														htmlFor="password"
													/>
												)}
											</div>
											{((error && error.password) || (!passwordValidate && password)) && (
												<small id="password" className="form-text text-danger">
													{!passwordValidate && password
														? languageText["registerPasswordError1"]
														: languageText["registerPasswordError2"]}
												</small>
											)}
										</div>
										<div
											className={`form-group ${
												password !== password_confirmation &&
												password_confirmation !== "" &&
												"error"
											}`}>
											<label className="form-auth-label" htmlFor="confirmPassword">
												{languageText["textSignUp13"]}
											</label>
											<div className="input-wrapper">
												<input
													className="form-auth-input"
													type="password"
													id="confirmPassword"
													required
													value={password_confirmation}
													onChange={e => setPassword_confirmation(e.target.value)}
													name="password"
													placeholder={languageText["textSignUp14"]}
												/>
												{password === password_confirmation && (
													<label
														className="form-auth-label form-group-before"
														htmlFor="confirmPassword"
													/>
												)}
											</div>
											{password !== password_confirmation && password_confirmation !== "" && (
												<small id="confirmPassword" className="form-text text-danger">
													{languageText["registerPasswordConfirmedError"]}
												</small>
											)}
										</div>
										<div className="form-group">
											<button className="btn-main" type="submit">
												{languageText["textRecovery9"]}
											</button>
											<p className="form-p">
												{languageText["textRecovery10"] + " "}
												<Link to={"/" + language + "/signin"}>
													{languageText["textRecovery11"]}
												</Link>
											</p>
										</div>
									</>
								) : (
									<p className="form-auth__text">
										<WarningSvg />
										{" " + message}
									</p>
								)}
							</form>
						) : (
							<form onSubmit={onRecovery} className="form-auth">
								<div className="form-auth__img">
									<img src={header_logo} alt="HitBeat Logo" width="150px" />
									<p>{languageText["textRecovery1"]}</p>
								</div>
								{typeof message != "string" || message === "" ? (
									<>
										<p className="form-auth__text">
											<WarningSvg />
											{" " + languageText["textRecovery2"]}
										</p>
										{typeof error == "string" && error !== "" && (
											<p className="form-auth__text">
												<WarningSvg />
												{" " + error}
											</p>
										)}
										<div className={`form-group ${error && error.email && "error"}`}>
											<label className="form-auth-label" htmlFor="email">
												{languageText["textRecovery3"]}
											</label>
											<div className="input-wrapper">
												<input
													className="form-auth-input"
													required
													type="email"
													id="email"
													name="email"
													placeholder={languageText["textRecovery4"]}
													value={email}
													onChange={e => setEmail(e.target.value)}
												/>
												<label className="form-auth-label form-group-before" />
											</div>
											{error && error.email && (
												<small id="last_name" className="form-text text-danger">
													{languageText["registerEmailError"]}
												</small>
											)}
										</div>
										<div className="form-group">
											<button type="submit" className="btn-main">
												{languageText["textRecovery5"]}
											</button>
											<p className="form-p">
												{languageText["textRecovery6"] + " "}
												<Link to={"/" + language + "/signup"}>
													{languageText["textRecovery7"]}
												</Link>
											</p>
										</div>
									</>
								) : (
									<p className="form-auth__text">
										<WarningSvg />
										{" " + message}
									</p>
								)}
							</form>
						)}
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Recovery;
