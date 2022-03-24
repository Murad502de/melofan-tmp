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

const NewsItem = ({url, date, title, text, images}) => {
	const language = useSelector(state => state.languageCurrent.language);
	return (
		<Col lg={3} md={6}>
			<Link to={"/" + language + "/news/" + url} className="news__link">
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

const News = () => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	const [state, setState] = useState({
		news: [],
		newsCount: 0,
		currentPage: 1,
	});

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);
	useEffect(() => {
		window.scrollTo(0, 0);
		setNews(1);
		fillPageNews(1);
	}, []);

	const setNews = numPage => {
		store.dispatch(setIsShowPreloader(true));

		postRequest("getNews", {language: "ru", currentPage: numPage})
			.then(res => {
				if (res.success) {
					setState(state => {
						return {...state, news: res.arrayNews};
					});
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const fillPageNews = numPage => {
		postRequest("getCountNews", {language: "ru", currentPage: numPage})
			.then(res => {
				if (res.success) {
					setState(state => {
						return {...state, newsCount: res.countNews};
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
		setNews(numPage);
		fillPageNews(numPage);
	};

	return (
		<section className="board-of-directors news">
			<MetaTags>
				<title>{languageText["itemNews1"]}</title>
				<meta name="description" content={languageText["news2"]} />
				<meta property="og:title" content={languageText["itemNews1"]} />
				<meta property="og:description" content={""} />
			</MetaTags>
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<h2 className="title">{languageText["news1"]}</h2>
						<p className="text">{languageText["news2"]}</p>
					</Col>
				</Row>
				<Row>
					{state.news.length <= 0 ? (
						<p>{languageText["news3"]}</p>
					) : (
						state.news.map(item => {
							return (
								<NewsItem
									key={"news" + item.id}
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

export default News;
