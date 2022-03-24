import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {DocIco, DownloadIco, PdfIco} from "../../other/Svg";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import BackgroundBlur from "../../other/BackgroundBlur";
import MetaTags from "react-meta-tags";
import {useSelector} from "react-redux";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";
import {setError} from "../../../actions/notification";
import {getLocaleDateTime} from "../../../actions/time";

const iconsDoc = {
	doc: <DocIco />,
	pdf: <PdfIco />,
};

const Events = () => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	const [events, setEvents] = useState([]);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		postRequest("getListEvents", {language})
			.then(res => {
				if (res.success) {
					setEvents(res.arrayEvents);
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError(languageText["getListEventsError"]));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["getListEventsError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	}, []);

	return (
		<section className="board-of-directors doings">
			<MetaTags>
				<title>{languageText["events1"]}</title>
				<meta name="description" content={languageText["events2"]} />
				<meta property="og:title" content={languageText["events1"]} />
				<meta property="og:description" content={languageText["events2"]} />
			</MetaTags>
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<h2 className="title">{languageText["events1"]}</h2>
						<p className="text">{languageText["events2"]}</p>
					</Col>
				</Row>
				<Row>
					{events.length <= 0 ? (
						<p>{languageText["events4"]}</p>
					) : (
						events.map(event => (
							<Col lg={12}>
								<Accordion className="landing-accordions">
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1a-content"
										id="panel1a-header">
										<Typography>
											{event.title + " "}
											<span>{getLocaleDateTime(event.created_at, "date")}</span>
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										{event.body && <p dangerouslySetInnerHTML={{__html: event.body}} />}
										{event.images.map(image => (
											<div className="documents__item">
												<div className="documents__item-left">
													{iconsDoc[image.format]}
													<b>{image.name}</b>
													<p>{image.size}</p>
												</div>
												<div className="documents__item-right">
													<a href={image.path} download={image.name + "." + image.format}>
														<button className="btn-outline">
															<DownloadIco /> {languageText["events3"]}
														</button>
													</a>
												</div>
											</div>
										))}
									</AccordionDetails>
								</Accordion>
							</Col>
						))
					)}
				</Row>
			</Container>
		</section>
	);
};

export default Events;
