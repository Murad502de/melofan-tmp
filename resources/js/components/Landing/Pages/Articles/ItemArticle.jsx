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

const ItemArticle = props => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const [state, setState] = useState({
		idArticles: "",
		dateArticles: "",
		imageArticles: "",
		titleArticles: "",
		announceArticles: "",
		bodyArticles: "",

		actualArticles: [],
		isNotFound: false,
	});

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		window.scrollTo(0, 0);

		let articlesId = props.match.params.id;
		postRequest("getOneArticles", {url: articlesId, language})
			.then(res => {
				if (res.success) {
					setState(state => {
						return {
							...state,
							idArticles: articlesId,
							dateArticles: getLocaleDateTime(res.date),
							imageArticles: res.image,
							titleArticles: res.title,
							announceArticles: res.announce,
							bodyArticles: res.body,
							actualArticles: res.actualArticles,
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
				<title>{state.titleArticles}</title>
				<meta name="description" content={state.announceArticles} />
				<meta property="og:title" content={state.titleArticles} />
				<meta property="og:description" content={state.announceArticles} />
				<meta property="og:image" content={state.imageArticles} />
			</MetaTags>
			<BackgroundBlur />
			<Container>
				<Row>
					<Col xl={{span: 8, offset: 2}} lg={{span: 12, offset: 0}}>
						<div className="article__header">
							<h4>
								<MlfnLogoIco /> <span>HitBeat</span> {languageText["itemArticles1"]}
							</h4>
							<Link to={"/" + language + "/articles"} className="btn-outline">
								{languageText["itemArticles2"]}
							</Link>
						</div>
						<div className="article">
							<h2 className="article__title">{state.titleArticles}</h2>
							<div className="article__date">
								<IsTimeIco />{" "}
								<p>
									{languageText["itemArticles3"]} {state.dateArticles}
								</p>
							</div>
							<img className="article__img" src={state.imageArticles} alt={state.titleArticles} />
							<div className="article__body">
								<p dangerouslySetInnerHTML={{__html: state.bodyArticles}} />
								<Link to={"/" + language + "/articles"} className="btn-outline d-block ms-0">
									{languageText["itemArticles2"]}
								</Link>
							</div>
						</div>
					</Col>
				</Row>
				{state.actualArticles.length > 0 && (
					<Row>
						<Col lg={12}>
							<h2 className="mb-3 mt-5 bold">{languageText["itemArticles4"]}</h2>
						</Col>
						{state.actualArticles.map(itemArticles => (
							<Col lg={3} md={6} key={"actualArticles" + itemArticles.id}>
								<Link to={"/" + language + "/article/" + itemArticles.url} className="news__link">
									<div className="news__item">
										<img src={itemArticles.image} alt={itemArticles.title} />
										<div className="news__item-body">
											<span className="data">
												<CalendarSvg /> {getLocaleDateTime(itemArticles.date)}
											</span>
											<h5>{itemArticles.title}</h5>
											<p>{itemArticles.announce}</p>
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

export default ItemArticle;
