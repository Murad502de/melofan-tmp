import React, {useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import Slider from "react-slick";
import Lottie from "react-lottie";
import {Mail} from "../../other/Svg";
import lottie from "lottie-web";
import anim_waves from "../../../../animations/anim_waves.json";
import footer_logo from "../../../../images/footer_logo.svg";
import up_btn from "../../../../images/up-btn.svg";
import App_Store from "../../../../images/App_Store.svg";
import Google_Play from "../../../../images/Google_Play.svg";
import telegram from "../../../../images/telegram.svg";
import twitter from "../../../../images/twitter.svg";
import instagram from "../../../../images/instagram.svg";
import Airbnb_Logo from "../../../../images/Airbnb_Logo.png";

import "./Footer.scss";
import {useSelector} from "react-redux";
import {store} from "../../../store/configureStore";
import {setError, setMessage} from "../../../actions/notification";
import {setIsShowPreloader} from "../../../actions/preloader";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";

const Footer = () => {
	const {executeRecaptcha} = useGoogleReCaptcha();
	let currentDate = new Date().getFullYear();
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const [email, setEmail] = useState("");

	React.useEffect(() => {
		lottie.loadAnimation({
		  container: document.querySelector("#react-logo"),
		  animationData: anim_waves,
		  renderer: 'canvas',
		  loop: true,
		  rendererSettings: {
			//   progressiveLoad: false,
			//   hideOnTransparent: true
		  }
		});
	  }, []);

	  
	// React.useEffect(() => {
	// 	const waves = document.querySelector(".wavesE");
	// 	let column_width = 15; //px
	// 	let column_offset = 10; //px
	// 	let count_columns = Math.floor(window.innerWidth / (column_width + column_offset)) +1;

	// 	for (let index = 0; index < count_columns; index++) {
	// 		let column = document.createElement("div");
	// 		column.classList.add("wavesE__column");
	// 		column.style.opacity = Math.random() * (1 - 0.35) + 0.35;
	// 		column.style.animationDelay = `${Math.random() * (0.5 - 0.15) + 0.15}s`;

	// 		waves.appendChild(column);

	// 	}
	// }, [])

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: anim_waves,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};

	const settings_partners = {
		// dots: true,
		autoplay: true,
		// autoplaySpeed: 3000,
		speed: 500,
		className: "partners__slider",
		infinite: true,
		swipeToSlide: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		responsive: [
			{
				breakpoint: 1550,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					// dots: true,
				},
			},
			{
				breakpoint: 1260,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					initialSlide: 1,
				},
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 650,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	const setMailingUser = async e => {
		e.preventDefault();
		if (email === "" || email == null) {
			store.dispatch(setError(languageText["mailing4"]));
		}

		store.dispatch(setIsShowPreloader(true));
		let captcha = await executeRecaptcha("SignUp");
		postRequest("setMailingUser", {email, language, captcha})
			.then(res => {
				if (res.success) {
					setEmail("");
					store.dispatch(setMessage(languageText["setMailingUserSuccess"]));
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError(languageText["setMailingUserError"]));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["setMailingUserError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	return (
		<>
			<section className="partners">
				<Container>
					<Row>
						<Col lg={12}>
							<Slider {...settings_partners}>
								<div>
									<img className="img-fluid" src={Airbnb_Logo} alt={languageText["footer1"]} />
								</div>
								<div>
									<img className="img-fluid" src={Airbnb_Logo} alt={languageText["footer1"]} />
								</div>
								<div>
									<img className="img-fluid" src={Airbnb_Logo} alt={languageText["footer1"]} />
								</div>
							</Slider>
						</Col>
					</Row>
				</Container>
				{/* <div class="wavesE"></div> */}
				<div id="react-logo" className="anim_waves" style={{height: '100px'}} />
				{/* <div className="anim_waves">
					<Lottie
						options={defaultOptions}
						style={{width: "1400px", maxHeight: "120px"}}
						// height={400}
						// width={}
					/>
				</div> */}
			</section>
			<footer className="footer">
				<Container>
					<Row className="align-items-center">
						<Col xs={{span: 12, order: 3}} lg={{span: 4, order: 1}} className="text-center text-lg-start">
							<div className="form-group">
								<label className="form-auth-label" htmlFor="email">
									{languageText["mailing1"]}
								</label>
								<div className="input-wrapper">
									<input
										className="form-auth-input"
										required
										type="email"
										id="email"
										name="email"
										placeholder={languageText["mailing2"]}
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
								</div>
								<button className="btn-main" onClick={setMailingUser}>
									{languageText["mailing3"]}
								</button>
							</div>
						</Col>
						<Col
							xs={{span: 12, order: 2}}
							lg={{span: 4, order: 2}}
							align="center"
							className=" mt-4 mt-lg-0  mb-4 mb-lg-0 ">
								
							<Link to={"/" + language + "/"}>
								<img src={footer_logo} alt="HitBeat Logo" width="150px" className="img-fluid footer__logo" />
							</Link>
							<p className="footer__text">
								{languageText["footer2"]}
								<br />
								{languageText["footer3"]}
							</p>
							<a href="http://" className="footer__app" target="_blank" rel="noopener noreferrer">
								<img src={App_Store} alt="" />
							</a>
							<a href="http://" className="footer__app" target="_blank" rel="noopener noreferrer">
								<img src={Google_Play} alt="" />
							</a>
						</Col>
						<Col xs={{span: 12, order: 1}} lg={{span: 4, order: 3}} className="text-center text-lg-end">
							<a href="#header" className="btn-up">
								<img src={up_btn} alt="" />
							</a>
						</Col>
					</Row>
					<Row className="footer__row">
						<Col lg={3} md={6}>
							<div className="footer__links">
								{/* <a
                                    href="http://"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <MapMarker /> Baker St. Marylebone, London,
                                    UK
                                </a> */}
								<a href="mailto:support@xetrade.mu">
									<Mail /> support@xetrade.mu
								</a>
								{/* <a href="tel:+77770000000">
                                    <Phone /> +7(777)000-00-00
                                </a> */}
								<div className="soc-wrapper">
									<a href="http://" target="_blank" rel="noopener noreferrer">
										<img src={instagram} alt="" />
									</a>
									<a href="http://" target="_blank" rel="noopener noreferrer">
										<img src={telegram} alt="" />
									</a>
									<a href="http://" target="_blank" rel="noopener noreferrer">
										<img src={twitter} alt="" />
									</a>
								</div>
							</div>
						</Col>
						<Col lg={3} md={6}>
							<div className="footer__links">
								<Link to={"/" + language + "/"}>{languageText["footer4"]}</Link>
								<Link to={"/" + language + "/about"}>{languageText["footer5"]}</Link>
								<Link to={"/" + language + "/board-of-directors"}>{languageText["footer6"]}</Link>
								{/* <Link to={"/"+language+"/"}>{languageText['footer7']}</Link> */}
							</div>
						</Col>
						<Col lg={2} md={6}>
							<div className="footer__links">
								<Link to={"/" + language + "/documents"}>{languageText["footer8"]}</Link>
								<Link to={"/" + language + "/events"}>{languageText["footer9"]}</Link>
								<Link to={"/" + language + "/contacts"}>{languageText["footer10"]}</Link>
								<Link to={"/" + language + "/news"}>{languageText["footer11"]}</Link>
							</div>
						</Col>
						<Col lg={3} md={6}>
							<div className="footer__links">
								<Link to={"/" + language + "/privacy-policy"}>{languageText["footer12"]}</Link>
								<Link to={"/" + language + "/terms-of-use"}>{languageText["footer13"]}</Link>
								<Link to={"/" + language + "/aml"}>{languageText["footer14"]}</Link>
								<Link to={"/" + language + "/contacts"}>{languageText["footer15"]}</Link>
							</div>
						</Col>
					</Row>
					<Row>
						<Col lg={12} align="center">
							<p className="copy">
								© {currentDate == "2021" ? "2021" : "2021-" + currentDate} HitBeat Music. All Rights Reserved.
							</p>
						</Col>
					</Row>
				</Container>
			</footer>
		</>
	);
};

export default Footer;
