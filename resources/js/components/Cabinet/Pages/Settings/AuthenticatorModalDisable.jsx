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

	const [state, setDataState] = useState({
		verifyCode2fa: "",
		verifyCodeEmail: "",
	});
	let [timeRepeat, setTimeRepeat] = useState(0);
	const [isShowPreloader, setShowPreloader] = useState(false);
	const [isShowPreloaderSend, setShowPreloaderSend] = useState(false);

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

	const disable2FA = async () => {
		setShowPreloader(true);
		let captcha = await executeRecaptcha("Disable2FA");
		postRequest("disable2fa", {
			verifyCode2fa: state.verifyCode2fa,
			verifyCodeEmail: state.verifyCodeEmail,
			captcha,
		})
			.then(res => {
				if (res.success) {
					props.setIs2faEnable(false);
					setShowPreloader(false);
					props.onHide();
				} else {
					store.dispatch(setError(languageText["disable2faError1"]));
					setShowPreloader(false);
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["disable2faError2"]));
				setShowPreloader(false);
			});
	};

	const sendVerifyCodeEmail = async () => {
		setShowPreloaderSend(true);
		postRequest("sendVerifyCodeEmail2fa")
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
				<div>
					<div>
						<Typography className={classes.instructions}>
							<div className="stepper-content">
								<p className="stepper-content__title">{languageText["authenticatorStep21"]}</p>
								<form className="form-auth">
									<Row className="align-items-end">
										<Col md={7}>
											<div className="form-group">
												<label className="form-auth-label" htmlFor="codeEmail">
													{languageText["authenticatorStep11"]}
												</label>
												<div className="input-wrapper">
													<input
														className="form-auth-input"
														required
														type="text"
														id="codeEmail"
														name="codeEmail"
														placeholder={languageText["authenticatorStep11"]}
														value={state.verifyCodeEmail}
														onChange={e => setState({verifyCodeEmail: e.target.value})}
													/>
												</div>
											</div>
										</Col>
										<Col md={5}>
											{isShowPreloaderSend ? (
												<div className="form-group">
													<Preloader type="mini-circle" />
												</div>
											) : timeRepeat > 0 ? (
												<div className="form-group">
													<p>
														{languageText["authenticatorStep20"].replace("%i%", timeRepeat)}
													</p>
												</div>
											) : (
												<div className="form-group">
													<button className="btn-main" onClick={sendVerifyCodeEmail}>
														{languageText["authenticatorStep12"]}
													</button>
												</div>
											)}
										</Col>
									</Row>
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
						</Typography>

						<div className="stepper__footer">
							{isShowPreloader ? (
								<Preloader type="mini-circle" />
							) : (
								<button className="btn-main" onClick={disable2FA}>
									{languageText["authenticatorStep22"]}
								</button>
							)}
						</div>
					</div>
				</div>
			</Modal.Body>
		</Modal>
	);
}
