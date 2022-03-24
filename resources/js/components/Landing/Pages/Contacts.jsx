import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import header_logo from "../../../../images/header_logo.svg";
import {useSelector} from "react-redux";
import BackgroundBlur from "../../other/BackgroundBlur";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";
import {DoneSvg, WarningSvg} from "../../other/Svg";

const Contacts = () => {
	const {executeRecaptcha} = useGoogleReCaptcha();

	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);
	const [state, setStateData] = useState({
		name: "",
		email: "",
		phone: "",
		message: "",
	});
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const setState = (newState = {}) => {
		setStateData(state => {
			return {...state, ...newState};
		});
	};

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const onSendMessage = async e => {
		e.preventDefault();
		setMessage("");
		setError("");

		if (
			state.name === "" ||
			state.name == null ||
			state.name.length < 2 ||
			state.email === "" ||
			state.email == null ||
			state.phone === "" ||
			state.phone == null ||
			state.phone.length < 3 ||
			state.message === "" ||
			state.message == null ||
			state.message.length < 3
		) {
			setError(languageText["sendMessageSupportError1"]);
		}

		store.dispatch(setIsShowPreloader(true));
		let captcha = await executeRecaptcha("SendSupportMessage");

		postRequest("sendMessageSupport", {
			name: state.name,
			email: state.email,
			phone: state.phone,
			support_message: state.message,
			language,
			captcha,
		})
			.then(res => {
				if (res.success) {
					setState({
						name: "",
						email: "",
						phone: "",
						support_message: "",
					});
					setMessage(languageText["sendMessageSupportSuccess"]);
					window.scrollTo(0, 0);
					store.dispatch(setIsShowPreloader(false));
				} else {
					setError(languageText["sendMessageSupportError1"]);
					window.scrollTo(0, 0);
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				setError(languageText["sendMessageSupportError2"]);
				window.scrollTo(0, 0);
				store.dispatch(setIsShowPreloader(false));
			});
	};

	return (
		<section className="board-of-directors auth contacts">
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<h2 className="title">{languageText["support1"]}</h2>
						<p className="text">{languageText["support2"]}</p>
					</Col>
				</Row>
				<Row>
					<Col lg={12}>
						<form onSubmit={e => onSendMessage(e)} className="form-auth">
							{typeof message != "string" || message === "" ? (
								<>
									<div className="form-auth__img">
										<img src={header_logo} alt="HitBeat Logo" width="150px" />
										<p>{languageText["support3"]}</p>
									</div>
									{typeof error == "string" && error !== "" && (
										<p className="form-auth__text">
											<WarningSvg />
											{" " + error}
										</p>
									)}
									<div className="form-group">
										<label className="form-auth-label" htmlFor="name">
											{languageText["support4"]}
										</label>
										<div className="input-wrapper">
											<input
												className="form-auth-input"
												required
												type="name"
												id="name"
												name="name"
												placeholder={languageText["support5"]}
												value={state.name}
												onChange={e => setState({name: e.target.value})}
											/>
										</div>
									</div>
									<div className="form-group">
										<label className="form-auth-label" htmlFor="email">
											{languageText["support6"]}
										</label>
										<div className="input-wrapper">
											<input
												className="form-auth-input"
												required
												type="email"
												id="email"
												name="email"
												placeholder={languageText["support7"]}
												value={state.email}
												onChange={e => setState({email: e.target.value})}
											/>
										</div>
									</div>
									<div className="form-group input-wrapper">
										<label className="form-auth-label" htmlFor="phone">
											{languageText["support8"]}
										</label>
										<PhoneInput
											placeholder={languageText["support9"]}
											value={state.phone}
											country={language}
											onChange={e => setState({phone: e})}
											specialLabel=""
											id="phone"
											inputClass="form-auth-input"
											required
											disableSearchIcon={true}
											disableDropdown={true}
										/>
									</div>
									<div className="form-group">
										<label className="form-auth-label" htmlFor="message">
											{languageText["support10"]}
										</label>
										<div className="input-wrapper">
											<textarea
												className="form-auth-input h-100"
												required
												id="message"
												rows="5"
												name="message"
												placeholder={languageText["support11"]}
												value={state.message}
												onChange={e => setState({message: e.target.value})}
											/>
										</div>
									</div>
									<div className="form-group">
										<button className="btn-main" type="submit">
											{languageText["support12"]}
										</button>
									</div>
								</>
							) : (
								<p className="form-auth__text form-auth__text-success">
									<DoneSvg />
									{" " + message}
								</p>
							)}
						</form>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default Contacts;
