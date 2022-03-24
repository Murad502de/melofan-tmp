import React, {useState} from "react";
import {Col, Container, Modal, Row} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import header_logo from "../../../images/header_logo.svg";
import {WarningSvg} from "../other/Svg";
import {useSelector} from "react-redux";
import {store} from "../../store/configureStore";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {setIsOpen} from "../../actions/modal2fa";
import Preloader from "../other/Preloader";

export default function Modal2FA(props) {
	const {executeRecaptcha} = useGoogleReCaptcha();

	const [verifyCode, setVerifyCode] = useState("");
	const [error, setError] = useState({});
	const [isShowPreloader, setShowPreloader] = useState(false);

	const languageText = useSelector(state => state.languageCurrent.languageText);
	const isOpen = useSelector(state => state.modal2fa.isOpen);

	const onLogin = async e => {
		e.preventDefault();
		setShowPreloader(true);
		setError("");
		let captcha = await executeRecaptcha("SignIn2FA");
		postRequest("verify2fa", {
			verifyCode,
			captcha,
		})
			.then(res => {
				if (res.success) {
					handleClose();
					setShowPreloader(false);
				} else {
					setError(languageText["modal2FAError"]);
					setShowPreloader(false);
				}
			})
			.catch(err => {
				setError(languageText["modal2FAError"]);
				setShowPreloader(false);
			});
	};

	const handleClose = () => {
		store.dispatch(setIsOpen(false));
	};

	return (
		<Modal show={isOpen} onHide={handleClose} centered className="modal-contact modal-2fa" backdrop="static">
			<Modal.Body className="p-0">
				<section className="auth p-0">
					<form onSubmit={e => onLogin(e)} className="form-auth" style={{border: "none"}}>
						<div className="form-auth__img">
							<img src={header_logo} alt="HitBeat Logo" width="150px" />
							<p>{languageText["modal2FA1"]}</p>
						</div>
						{/* <button type="button" className="close" onClick={props.onHide}>
							<span aria-hidden="true">×</span>
							<span className="sr-only">Close</span>
						</button> */}
						{isShowPreloader ? (
							<Preloader type="mini-circle" />
						) : (
							<>
								{typeof error == "string" && error !== "" && (
									<p className="form-auth__text">
										<WarningSvg /> {error}
									</p>
								)}
								{error && error.captcha && (
									<p className="form-auth__text">
										<WarningSvg /> {languageText["registerCaptchaError"]}
									</p>
								)}
								<div className="form-group">
									<label className="form-auth-label" htmlFor="verifyCode">
										{languageText["modal2FA2"]}
									</label>
									<input
										className="form-auth-input"
										id="verifyCode"
										required
										name="verifyCode"
										placeholder={languageText["modal2FA3"]}
										value={verifyCode}
										onChange={e => setVerifyCode(e.target.value)}
									/>
								</div>
								<div className="form-group mb-2">
									<button className="btn-main" type="submit">
										{languageText["textSingIn6"]}
									</button>
								</div>
							</>
						)}
					</form>
				</section>
			</Modal.Body>
		</Modal>
	);
}
