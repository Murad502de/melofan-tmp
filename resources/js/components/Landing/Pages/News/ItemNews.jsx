import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {CalendarSvg, IsTimeIco, MlfnLogoIco} from "../../../other/Svg";
import {useSelector} from "react-redux";
import BackgroundBlur from "../../../other/BackgroundBlur";
import {store} from "../../../../store/configureStore";
import {setIsShowPreloader} from "../../../../actions/preloader";
import {getLocaleDateTime} from "../../../../actions/time";
import NotFound from "../../../other/NotFound";
import MetaTags from "react-meta-tags";

const ItemNews = props => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const [state, setState] = useState({
		idNews: "",
		dateNews: "",
		imageNews: "",
		titleNews: "",
		announceNews: "",
		bodyNews: "",

		actualNews: [],
		isNotFound: false,
	});

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);

		let newsId = props.match.params.id;
		postRequest("getOneNews", {url: newsId, language})
			.then(res => {
				if (res.success) {
					setState(state => {
						return {
							...state,
							idNews: newsId,
							dateNews: getLocaleDateTime(res.date),
							imageNews: res.image,
							titleNews: res.title,
							announceNews: res.announce,
							bodyNews: res.body,
							actualNews: res.actualNews,
						};
					});
				} else {
					setState(state => {
						return {...state, isNotFound: true};
					});
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				setState(state => {
					return {...state, isNotFound: true};
				});
				store.dispatch(setIsShowPreloader(false));
			});
	}, []);

	if (state.isNotFound) {
		return <NotFound />;
	}

	return (
		<section className="board-of-directors article-section">
			<MetaTags>
				<title>{state.titleNews}</title>
				<meta name="description" content={state.announceNews} />
				<meta property="og:title" content={state.titleNews} />
				<meta property="og:description" content={state.announceNews} />
				<meta property="og:image" content={state.imageNews} />
			</MetaTags>
			<BackgroundBlur />
			<Container>
				<Row>
					<Col xl={{span: 8, offset: 2}} lg={{span: 12, offset: 0}}>
						<div className="article__header">
							<h4>
								<MlfnLogoIco /> <span>HitBeat</span> {languageText["itemNews1"]}
							</h4>
							<Link to={"/" + language + "/news"} className="btn-outline">
								{languageText["itemNews2"]}
							</Link>
						</div>
						<div className="article">
							<h2 className="article__title">{state.titleNews}</h2>
							<div className="article__date">
								<IsTimeIco />{" "}
								<p>
									{languageText["itemNews3"]} {state.dateNews}
								</p>
							</div>
							<img className="article__img" src={state.imageNews} alt={state.titleNews} />
							<div className="article__body">
								<p dangerouslySetInnerHTML={{__html: state.bodyNews}} />
								<div className="article__date">
									<IsTimeIco />{" "}
									<p>
										{languageText["itemNews3"]} {state.dateNews}
									</p>
								</div>
								<Link to={"/" + language + "/news"} className="btn-outline d-block ms-0">
									{languageText["itemNews2"]}
								</Link>
							</div>
						</div>
					</Col>
				</Row>
				{state.actualNews.length > 0 && (
					<Row>
						<Col lg={12}>
							<h2 className="mb-3 mt-5 bold">{languageText["itemNews4"]}</h2>
						</Col>
						{state.actualNews.map(itemNews => (
							<Col lg={3} md={6} key={"actualNews" + itemNews.id}>
								<Link to={"/" + language + "/news/" + itemNews.url} className="news__link">
									<div className="news__item">
										<img src={itemNews.image} alt={itemNews.title} />
										<div className="news__item-body">
											<span className="data">
												<CalendarSvg /> {getLocaleDateTime(itemNews.date)}
											</span>
											<h5>{itemNews.title}</h5>
											<p>{itemNews.announce}</p>
										</div>
									</div>
								</Link>
							</Col>
						))}
					</Row>
				)}
			</Container>
		</section>
	);
};

export default ItemNews;
