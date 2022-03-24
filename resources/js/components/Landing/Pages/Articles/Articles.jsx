import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Link} from "react-router-dom";
import {CalendarSvg} from "../../../other/Svg";
import {useSelector} from "react-redux";
import BackgroundBlur from "../../../other/BackgroundBlur";
import {store} from "../../../../store/configureStore";
import {setIsShowPreloader} from "../../../../actions/preloader";
import {getLocaleDateTime} from "../../../../actions/time";
import MetaTags from "react-meta-tags";
import Pagination from "../../../other/Pagination";

const ArticleItem = ({url, date, title, text, images}) => {
	const language = useSelector(state => state.languageCurrent.language);
	return (
		<Col lg={3} md={6}>
			<Link to={"/" + language + "/article/" + url} className="news__link">
				<div className="news__item">
					<img src={images} alt={title} />
					<div className="news__item-body">
						<span className="data">
							<CalendarSvg /> {date}
						</span>
						<h5>{title}</h5>
						<p>{text}</p>
					</div>
				</div>
			</Link>
		</Col>
	);
};

const Articles = () => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	const [state, setState] = useState({
		articles: [],
		articlesCount: 0,
		currentPage: 1,
	});

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);
	useEffect(() => {
		window.scrollTo(0, 0);
		setArticles(1);
		fillPageArticles(1);
	}, []);

	const setArticles = numPage => {
		store.dispatch(setIsShowPreloader(true));

		postRequest("getArticles", {language, currentPage: numPage})
			.then(res => {
				if (res.success) {
					setState(state => {
						return {...state, articles: res.arrayArticles};
					});
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const fillPageArticles = numPage => {
		postRequest("getCountArticles", {language, currentPage: numPage})
			.then(res => {
				if (res.success) {
					setState(state => {
						return {...state, articlesCount: res.countArticles};
					});
				}
			})
			.catch(err => {
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const changeCurrentPage = numPage => {
		setState(state => {
			return {...state, currentPage: numPage};
		});
		setArticles(numPage);
		fillPageArticles(numPage);
	};
	return (
		<section className="board-of-directors news">
			<MetaTags>
				<title>{languageText["itemArticles1"]}</title>
				<meta name="description" content={languageText["articles2"]} />
				<meta property="og:title" content={languageText["itemArticles1"]} />
				<meta property="og:description" content={languageText["articles2"]} />
			</MetaTags>
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<h2 className="title">{languageText["articles1"]}</h2>
						<p className="text">{languageText["articles2"]}</p>
					</Col>
				</Row>
				<Row>
					{state.articles.length <= 0 ? (
						<p>{languageText["articles3"]}</p>
					) : (
						state.articles.map(item => {
							return (
								<ArticleItem
									key={"articles" + item.id}
									url={item.url}
									images={item.image}
									date={getLocaleDateTime(item.date, "date")}
									title={item.title}
									text={item.announce}
								/>
							);
						})
					)}
				</Row>
				{/*{state.newsCount > 20 && (*/}
				<Row>
					<Pagination
						countRows={state.newsCount}
						countPerPage={20}
						currentPage={state.currentPage}
						changeCurrentPage={numPage => changeCurrentPage(numPage)}
					/>
				</Row>
				{/*)}*/}
			</Container>
		</section>
	);
};

export default Articles;
