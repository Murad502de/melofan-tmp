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

const Unsubscribing = () => {
    const {executeRecaptcha} = useGoogleReCaptcha();

	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);
    const [state, setStateData] = useState({
		email: "",
	});

    useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

    return (
        <section className="unsub auth">
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<h4 className="title unsub-title">{languageText["unsubscribing1"]}</h4>
					</Col>
				</Row>
				<Row>
					<Col lg={12}>
						<form onSubmit={e => onSendMessage(e)} className=" form-unsub form-auth">
							{typeof message != "string" || message === "" ? (
								<>
									{typeof error == "string" && error !== "" && (
										<p className="form-auth__text">
											<WarningSvg />
											{" " + error}
										</p>
									)}
                                    <p style={{fontSize: '18px', marginBottom: '35px', fontWeight: 'bold'}}>{languageText["unsubscribing2"]}</p>
									<div className="form-group">
										<label className="form-auth-label" htmlFor="email">
											{languageText["support6"]}
										</label>
										<div className="input-wrapper">
											<input
												className="form-auth-input"
												required
                                                style={{maxWidth: '360px'}}
												type="email"
												id="email"
												name="email"
												placeholder={languageText["support7"]}
												value={state.email}
												onChange={e => setState({email: e.target.value})}
											/>
										</div>
									</div>
                                    <div className="form-group form-check">
										<input
											type="checkbox"
											required
											className="form-check-input mb-0"
											id="form-auth-checkbox"
										/>
										<label className="form-check-label mb-0" htmlFor="form-auth-checkbox">
                                            {languageText["unsubscribing3"]}
										</label>
									</div>
                                    <small className="ms-0">{languageText["unsubscribing4"]}</small>
									<div className="form-group">
										<button className="btn-main mt-5" type="submit">
										    {languageText["unsubscribing5"]}
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
    )
}

export default Unsubscribing
