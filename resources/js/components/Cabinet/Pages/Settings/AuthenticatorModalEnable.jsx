import React, {useEffect, useState} from "react";
import {Col, Modal, Row} from "react-bootstrap";
import {makeStyles} from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import App_Store from "../../../../../images/App_Store.svg";
import Google_Play from "../../../../../images/Google_Play.svg";
import Typography from "@material-ui/core/Typography";
import header_logo from "../../../../../images/header_logo.svg";
import google_illustration from "../../../../../images/google_illustration.png";
import {useSelector} from "react-redux";
import {store} from "../../../../store/configureStore";
import {setError} from "../../../../actions/notification";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import Preloader from "../../../other/Preloader";

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
	},
	backButton: {
		marginRight: theme.spacing(1),
	},
	instructions: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
}));

export default function (props) {
	const {executeRecaptcha} = useGoogleReCaptcha();
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const classes = useStyles();
	const [activeStep, setActiveStep] = React.useState(0);

	const [state, setDataState] = useState({
		qr2fa: null,
		secretKey: "",
		verifyCode2fa: "",
		verifyCodeEmail: "",
		resetCode: "",
	});
	let [timeRepeat, setTimeRepeat] = useState(0);
	const [isShowPreloader, setShowPreloader] = useState(false);
	const [isShowPreloaderSend, setShowPreloaderSend] = useState(true);

	useEffect(() => {
		if (Number(timeRepeat) > 0) {
			setTimeout(() => setTimeRepeat(--timeRepeat), 1000);
		}
	}, [timeRepeat]);

	const setState = (newState = {}) => {
		setDataState(state => {
			return {...state, ...newState};
		});
	};

	const handleNext = async () => {
		if (activeStep === 0) {
			setShowPreloader(true);
			if (!props.is2faEnable && props.show) {
				postRequest("2fa")
					.then(res => {
						if (res.success) {
							setState({
								secretKey: res.secret_key,
								qr2fa: res.google2fa_img,
							});
							setShowPreloader(false);
							setActiveStep(prevActiveStep => prevActiveStep + 1);
						} else {
							store.dispatch(setError(languageText["getDataError"]));
							setShowPreloader(false);
							props.onHide();
						}
					})
					.catch(err => {
						store.dispatch(setError(languageText["getDataError"]));
						setShowPreloader(false);
						props.onHide();
					});
			}
		} else if (activeStep === 2) {
			setShowPreloader(true);
			let captcha = await executeRecaptcha("SaveReset2FA");
			postRequest("reset2fa", {resetCode: state.resetCode, captcha})
				.then(res => {
					if (res.success) {
						setShowPreloader(false);
						setActiveStep(prevActiveStep => prevActiveStep + 1);
						sendVerifyCodeEmail();
					} else {
						store.dispatch(setError(languageText["reset2faError"]));
						setShowPreloader(false);
					}
				})
				.catch(err => {
					store.dispatch(setError(languageText["reset2faError"]));
					setShowPreloader(false);
				});
		} else if (activeStep === 3) {
			setShowPreloader(true);
			let captcha = await executeRecaptcha("Enable2FA");
			postRequest("enable2fa", {
				verifyCode2fa: state.verifyCode2fa,
				verifyCodeEmail: state.verifyCodeEmail,
				captcha,
			})
				.then(res => {
					if (res.success) {
						props.setIs2faEnable(true);
						setShowPreloader(false);
						setActiveStep(prevActiveStep => prevActiveStep + 1);
					} else {
						store.dispatch(setError(languageText["enable2faError1"]));
						setShowPreloader(false);
					}
				})
				.catch(err => {
					store.dispatch(setError(languageText["enable2faError2"]));
					setShowPreloader(false);
				});
		} else {
			setActiveStep(prevActiveStep => prevActiveStep + 1);
		}
	};

	const sendVerifyCodeEmail = async () => {
		setShowPreloaderSend(true);
		let captcha = await executeRecaptcha("SendCodeEmail2FA");
		postRequest("sendVerifyCodeEmail2fa", {captcha})
			.then(res => {
				if (res.success) {
					setTimeRepeat(60);
					setShowPreloaderSend(false);
				} else {
					store.dispatch(setError(languageText["sendCodeEmail2faError"]));
					setShowPreloaderSend(false);
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["sendCodeEmail2faError"]));
				setShowPreloaderSend(false);
			});
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const steps = [
		<p dangerouslySetInnerHTML={{__html: languageText["authenticator1"]}} />,
		<p dangerouslySetInnerHTML={{__html: languageText["authenticator2"]}} />,
		<p dangerouslySetInnerHTML={{__html: languageText["authenticator3"]}} />,
		<p dangerouslySetInnerHTML={{__html: languageText["authenticator4"]}} />,
	];

	let stepElement = <></>;
	switch (activeStep) {
		case 0:
			stepElement = (
				<div className="stepper-content">
					<p className="stepper-content__step">{languageText["authenticatorStep1"]}</p>
					<p className="stepper-content__title">{languageText["authenticatorStep2"]}</p>
					<div className="stepper-content__app">
						<a
							href="https://apps.apple.com/app/google-authenticator/id388497605"
							className="footer__app"
							target="_blank"
							rel="noopener noreferrer">
							<img src={App_Store} alt="" />
						</a>
						<a
							href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
							className="footer__app"
							target="_blank"
							rel="noopener noreferrer">
							<img src={Google_Play} alt="" />
						</a>
					</div>
				</div>
			);
			break;
		case 1:
			stepElement = (
				<div className="stepper-content">
					<p className="stepper-content__step">{languageText["authenticatorStep3"]}</p>
					<p className="stepper-content__title">{languageText["authenticatorStep4"]}</p>
					<div className="stepper-content__code">
						<div className="stepper-content__qr">
							<img src={"data:image/svg+xml;base64, " + state.qr2fa} alt={state.secretKey} />
						</div>
						<div className="stepper-content__code-text">
							<p>{languageText["authenticatorStep5"]}</p>
							<input
								readOnly
								type="text"
								value={state.secretKey}
								className="stepper-content__code-input"
							/>
						</div>
					</div>
				</div>
			);
			break;
		case 2:
			stepElement = (
				<div className="stepper-content">
					<p className="stepper-content__step">{languageText["authenticatorStep6"]}</p>
					<p className="stepper-content__title">{languageText["authenticatorStep7"]}</p>
					<div className="stepper-content__code">
						<div className="stepper-content__qr">
							<img src={google_illustration} alt="" />
						</div>
						<div className="stepper-content__code-text">
							<p>{languageText["authenticatorStep8"]}</p>
							<input
								type="text"
								value={state.resetCode}
								onChange={e => setState({resetCode: e.target.value})}
								className="stepper-content__code-input"
							/>
						</div>
					</div>
				</div>
			);
			break;
		case 3:
			stepElement = (
				<div className="stepper-content">
					<p className="stepper-content__step">{languageText["authenticatorStep9"]}</p>
					<p className="stepper-content__title">{languageText["authenticatorStep10"]}</p>
					<form className="form-auth">
						<div className="form-group">
							<Row className="align-items-end">
								<Col md={7}>
									<label className="form-auth-label" htmlFor="codeEmail">
										{languageText["authenticatorStep11"]}
									</label>
									<div className="input-wrapper">
										<input
											className="form-auth-input mb-0"
											required
											type="text"
											id="codeEmail"
											name="codeEmail"
											placeholder={languageText["authenticatorStep11"]}
											value={state.verifyCodeEmail}
											onChange={e => setState({verifyCodeEmail: e.target.value})}
										/>
									</div>
								</Col>
								<Col md={5}>
									{isShowPreloaderSend ? (
										<Preloader type="mini-circle" />
									) : timeRepeat > 0 ? (
										<p className="mb-0	mt-2 text-center" style={{fontSize: "14px"}}>
											{languageText["authenticatorStep20"].replace("%i%", timeRepeat)}
										</p>
									) : (
										<button className="btn-main mb-0 mt-2" onClick={sendVerifyCodeEmail}>
											{languageText["authenticatorStep12"]}
										</button>
									)}
								</Col>
							</Row>
						</div>
						<Row className="align-items-end">
							<Col md={12}>
								<div className="form-group mb-0">
									<label className="form-auth-label" htmlFor="codeGoogle">
										{languageText["authenticatorStep13"]}
									</label>
									<div className="input-wrapper">
										<input
											className="form-auth-input mb-0"
											required
											type="text"
											id="codeGoogle"
											name="codeGoogle"
											placeholder={languageText["authenticatorStep13"]}
											value={state.verifyCode2fa}
											onChange={e => setState({verifyCode2fa: e.target.value})}
										/>
									</div>
								</div>
							</Col>
						</Row>
					</form>
				</div>
			);
			break;
	}

	return (
		<Modal {...props} size="md" className="modal-contact modal-stepper" centered>
			<Modal.Body>
				<button type="button" className="close" onClick={props.onHide}>
					<span aria-hidden="true">×</span>
					<span className="sr-only">Close</span>
				</button>
				<div className="form-auth__img">
					<img src={header_logo} alt="HitBeat Logo" width="150px" />
					<p>{languageText["authenticatorStep14"]}</p>
				</div>
				<Stepper className="stepper" activeStep={activeStep} alternativeLabel>
					{steps.map((label, index) => (
						<Step key={"stepTitle" + index}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				<div>
					{activeStep === steps.length ? (
						<div>
							<div className="stepper-content">
								<p className="stepper-content__step">{languageText["authenticatorStep15"]}</p>
								<p className="stepper-content__title">{languageText["authenticatorStep16"]}</p>
							</div>
							<div className="stepper__footer">
								<button className="btn-outline" onClick={props.onHide}>
									{languageText["authenticatorStep17"]}
								</button>
							</div>
						</div>
					) : (
						<div>
							<Typography className={classes.instructions}>{stepElement}</Typography>

							<div className="stepper__footer">
								{isShowPreloader ? (
									<Preloader type="mini-circle" />
								) : (
									<>
										{activeStep === 0 ? (
											<button className="btn-main" onClick={handleNext}>
												{activeStep === steps.length - 1
													? languageText["authenticatorStep17"]
													: languageText["authenticatorStep18"]}
											</button>
										) : (
											<>
												{" "}
												<button
													disabled={activeStep === 0}
													onClick={handleBack}
													className="btn-outline">
													{languageText["authenticatorStep19"]}
												</button>
												<button className="btn-main" onClick={handleNext}>
													{languageText["authenticatorStep18"]}
												</button>{" "}
											</>
										)}
									</>
								)}
							</div>
						</div>
					)}
				</div>
			</Modal.Body>
		</Modal>
	);
}
