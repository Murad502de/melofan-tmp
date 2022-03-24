import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import {makeStyles} from "@material-ui/core/styles";
import Lottie from "react-lottie";
import color_waves from "../../../../animations/color_waves.json";
import SliderMaterial from "@material-ui/core/Slider";
import Slider from "react-slick";
import {DoneSvg, InProgressSvg, WaitingSvg} from "../../other/Svg";
import {useSelector} from "react-redux";
import {store} from "../../../store/configureStore";
import {setError, setMessage} from "../../../actions/notification";
import RoadMapItem from "../../other/RoadMapItem";
import {setIsShowPreloader} from "../../../actions/preloader";
import {getLocaleDateTime} from "../../../actions/time";

const classesDiv = ["process", "completed", "soon"];
const icons = [<InProgressSvg />, <DoneSvg />, <WaitingSvg />];

const useStyles = makeStyles(theme => ({
	root: {
		width: "100%",
	},
	margin: {
		height: theme.spacing(3),
	},
}));

const marks = [
	{
		value: 0,
		label: "0%",
	},
	{
		value: 22,
		label: "25%",
	},
	{
		value: 50,
		label: "50%",
	},
	{
		value: 75,
		label: "75%",
	},
	{
		value: 100,
		label: "100%",
	},
];

function valuetext(value) {
	return ``;
}

const settings_roadmap = {
	dots: false,
	speed: 500,
	className: "center roadmap__slider",
	centerMode: true,
	infinite: true,
	centerPadding: "60px",
	focusOnSelect: true,
	swipeToSlide: true,
	slidesToShow: 7,
	slidesToScroll: 1,
	responsive: [
		{
			breakpoint: 3500,
			settings: {
				slidesToShow: 6,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 2500,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 1650,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 1450,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 1350,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 997,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 567,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				centerPadding: "20px",
			},
		},
	],
};

const defaultOptions = {
	loop: true,
	autoplay: true,
	animationData: color_waves,
	rendererSettings: {
		preserveAspectRatio: "xMidYMid slice",
	},
};

const Securities = () => {
	const classes = useStyles();
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);

	const [roadmap, setRoadmap] = useState([]);
	const [current, setDataCurrent] = useState({
		id: 0,
		round: 0,
		status: 0,
		targetAmount: 0,
		targetPercent: 0,
		targetMLFN: 0,
		price: 0,
		remainDays: 0,
		resultAmount: 0,
		resultPercent: 0,
		resultMLFN: 0,
	});
	const [next, setDataNext] = useState({
		id: 0,
		round: 0,
		price: 0,
		created_at: "",
	});
	const [countMLFN, setCountMLFN] = useState("");
	const [widthWindow, setWidthWindow] = useState(window.innerWidth);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		postRequest("getDataSecurities")
			.then(res => {
				if (res.success) {
					if (res.current) {
						let status =
							getLocaleDateTime(new Date(), "server") <
							getLocaleDateTime(new Date(res.current.created_at), "server")
								? 2
								: res.current.status;

						let remainDays;
						if (status === 2) {
							remainDays = Math.ceil(
								Math.abs(new Date(res.current.created_at + "Z").getTime() - new Date().getTime()) /
									(1000 * 3600 * 24)
							);
						} else {
							remainDays = Math.ceil(
								Math.abs(
									new Date(res.current.updated_at + "Z").getTime() -
										new Date(res.current.created_at + "Z").getTime()
								) /
									(1000 * 3600 * 24)
							);
						}
						setCurrent({
							...res.current,
							remainDays: remainDays,
							status: status,
						});
					}
					if (res.next) {
						setCurrent({...res.next});
					}
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(languageText["getDataSecuritiesError"]));
				store.dispatch(setIsShowPreloader(false));
			});

		postRequest("getRoadmap", {language})
			.then(res => {
				if (res.success) {
					setRoadmap(res.arrayRoadmap);
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(languageText["getRoadMapError"]));
				store.dispatch(setIsShowPreloader(false));
			});

		window.addEventListener("resize", onResize);

		return () => {
			window.removeEventListener("resize", onResize);
		};
	}, []);

	const setCurrent = (newState = {}) => {
		setDataCurrent(state => {
			return {...state, ...newState};
		});
	};
	const setNext = (newState = {}) => {
		setDataNext(state => {
			return {...state, ...newState};
		});
	};

	const onBuy = e => {
		e.preventDefault();
		if (current.status == 1) {
			store.dispatch(setMessage(languageText["onBuyClose"]));
			return;
		}
		if (current.status == 2) {
			store.dispatch(
				setMessage(languageText["onBuyBegin"].replace("%date%", getLocaleDateTime(current.created_at, "date")))
			);
			return;
		}

		if (countMLFN == null || countMLFN === "" || countMLFN === undefined) {
			store.dispatch(setMessage(languageText["onBuyInputError"]));
			return;
		}

		store.dispatch(setIsShowPreloader(true));

		postRequest("onBuySecurities", {countMLFN})
			.then(res => {
				if (res.success) {
				} else {
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(languageText["onBuySecuritiesError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const onResize = () => {
		setWidthWindow(window.innerWidth);
	};

	let componentAnimations = [];
	let countAnimation = Math.ceil(widthWindow / 450);
	for (let index = 0; index <= countAnimation; index++) {
		componentAnimations.push(
			<Lottie
				key={"animationRoadMap" + index}
				options={defaultOptions}
				width={450}
				style={{marginRight: "12px", pointerEvents: "none"}}
			/>
		);
	}

	return (
		<>
			<div className="content securities pb-0">
				<Container fluid>
					<Row>
						<Col lg={12}>
							<h4 className="content__title">{languageText["securities1"]}</h4>
						</Col>
					</Row>
					{current.id ? (
						<Row>
							<Col xl={6} lg={12} style={{position: "relative"}}>
								<div className="wrapper-box wrapper-box--first">
									<div className="securities__block justify-content-between">
										<div>
											<span className="securities__block-round">
												{languageText["securities2"] + " " + current.round}
											</span>
											<p className={`securities__block-${classesDiv[Number(current.status)]}`}>
												{icons[Number(current.status)]}{" "}
												{languageText["securitiesStatus" + current.status]}
											</p>
										</div>
										<div className="ml-4">
											<p className="securities__block-text">
												{languageText[current.status === 2 ? "securities17" : "securities3"]}
											</p>
											<p className="text-gray securities__block-time">
												{languageText["securities4"].replace("%day%", current.remainDays)}
											</p>
										</div>
										<div className="">
											<p className="securities__block-text">{languageText["securities5"]}</p>
											<p className="securities__block-number">
												$ {Number(current.targetAmount).toLocaleString()}
											</p>
										</div>
									</div>
									<div className={classes.root}>
										<p className="slider-progress-title">
											{languageText["securities6"].replace(
												"%percent%",
												Number(current.targetPercent).toFixed(2)
											)}
										</p>
										<SliderMaterial
											className="slider-progress"
											disabled
											defaultValue={current.resultPercent}
											getAriaValueText={valuetext}
											aria-labelledby="discrete-slider-always"
											step={5}
											marks={marks}
											// valueLabelDisplay="on"
										/>
									</div>
								</div>
								{next.id ? (
									<div className="wrapper-box securities__block-bottom  d-flex align-items-center">
										<p>
											{languageText["securities7"]}
											<span className="securities__block-round">
												{language["securities2"] + " " + next.round}
											</span>
										</p>
										<p>
											{languageText["securities8"] + " "}
											<span>$ {next.price}</span>
										</p>
										<p>
											{languageText["securities9"] + " "}
											<span>{getLocaleDateTime(next.created_at, "date")}</span>
										</p>
									</div>
								) : (
									""
								)}
							</Col>
							<Col xl={6} lg={12}>
								<div className="wrapper-box mt-5 mt-xl-0">
									<div className="wrapper-box__header">
										<p>{languageText["securities11"]}</p>
										<span className="success">$ {current.price}</span>
									</div>
									<Form className="cabinet-form" onSubmit={onBuy}>
										<Form.Group as={Row} controlId="formPlaintextEmail">
											<Form.Label column="true" sm="12" md="4">
												{languageText["securities12"]}
											</Form.Label>
											<Col sm="12" md="8">
												<div className="form-wrapper">
													<Form.Control
														type="number"
														required
														readOnly={current.status != 0}
														value={countMLFN}
														onChange={e => setCountMLFN(e.target.value.replace(/\D/, ""))}
													/>
													<div className="form-wrapper--currency">HBM</div>
												</div>
											</Col>
										</Form.Group>

										<Form.Group as={Row} controlId="formPlaintextPassword" className="mb-3">
											<Form.Label column="true" sm="12" md="4">
												{languageText["securities13"]}
											</Form.Label>
											<Col column="true" sm="12" md="8">
												<div className="form-wrapper">
													<Form.Control
														type="number"
														required
														readOnly
														value={(countMLFN * current.price).toFixed(2)}
													/>
													<div className="form-wrapper--currency">USD</div>
												</div>
											</Col>
										</Form.Group>
										<button className="btn-main d-block btn-succes mt-3 mx-auto" type="submit">
											{languageText["securities14"]}
										</button>
									</Form>
								</div>
							</Col>
						</Row>
					) : next.id ? (
						<Row>
							<Col lg={12} style={{position: "relative"}}>
								<h4 className="content__title">
									{languageText["securities16"].replace(
										"%date%",
										getLocaleDateTime(next.created_at, "date")
									)}
								</h4>
							</Col>
						</Row>
					) : (
						<Row>
							<Col lg={12} style={{position: "relative"}}>
								<h4 className="content__title">{languageText["securities15"]}</h4>
							</Col>
						</Row>
					)}

					{roadmap.length ? (
						<Row>
							<Col lg={12}>
								<h4 className="mb-5 mt-5">{languageText["securities10"]}</h4>
							</Col>
						</Row>
					) : (
						""
					)}
				</Container>
			</div>
			{roadmap.length ? (
				<div className="content px-0 securities">
					<div className="color-waves">{componentAnimations}</div>

					<Container fluid>
						<Row>
							<Col lg={12} className="p-0">
								<Slider className="roadmap__slider" {...settings_roadmap}>
									{roadmap.map(item => (
										<div key={"roadmapLanding" + item.id}>
											<RoadMapItem
												status={item.status}
												typeTime={item.typeTime}
												month={item.month}
												quarter={item.quarter}
												year={item.year}
												updated_at={item.updated_at}
												discription={item.title}
												HBM={item.amount}
												percentCalc={item.percentCalc}
												round={item.round}
												textRound={item.target}
											/>
										</div>
									))}
								</Slider>
							</Col>
						</Row>
					</Container>
				</div>
			) : (
				""
			)}
		</>
	);
};

export default Securities;
