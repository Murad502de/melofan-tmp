import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import BackgroundBlur from "../../other/BackgroundBlur";
import {DocIco, DownloadIco, PdfIco, ShieldIco} from "../../other/Svg";
import {useSelector} from "react-redux";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";
import {setError} from "../../../actions/notification";
import MetaTags from "react-meta-tags";
// import doc1 from '../../../../documents/MELOFAN - Certificate of Incorporation.pdf'

const iconsDoc = {
	doc: <DocIco />,
	pdf: <PdfIco />,
};

const Documents = () => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	const [documents, setDocuments] = useState([]);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		postRequest("getListDocuments", {language})
			.then(res => {
				if (res.success) {
					setDocuments(res.documents);
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError(languageText["getListDocumentsError"]));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["getListDocumentsError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	}, []);

	return (
		<section className="board-of-directors">
			<MetaTags>
				<title>{languageText["documents1"]}</title>
				<meta name="description" content={languageText["documents2"]} />
				<meta property="og:title" content={languageText["documents1"]} />
				<meta property="og:description" content={languageText["documents2"]} />
			</MetaTags>
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={12}>
						<h2 className="title">{languageText["documents1"]}</h2>
						<p className="text">{languageText["documents2"]}</p>
					</Col>
				</Row>
				<Row>
					{documents.length <= 0 ? (
						<p>{languageText["documents5"]}</p>
					) : (
						documents.map(item => (
							<Col lg={12} key={"documents" + item.id}>
								<div className="documents__item">
									<div className="documents__item-left">
										{iconsDoc[item.format]}
										<b>{item.name}</b>
										<p>{item.size}</p>
									</div>
									<div className="documents__item-right">
										<a href={item.path} download={item.name + "." + item.format}>
											<button className="btn-outline">
												<DownloadIco /> {languageText["documents3"]}
											</button>
											{item.url_confirmation && (
												<a
													href={item.url_confirmation}
													target="_blank"
													rel="noopener noreferrer">
													<button className="btn-outline">
														<ShieldIco /> {languageText["documents4"]}
													</button>
												</a>
											)}
										</a>
									</div>
								</div>
							</Col>
						))
					)}
				</Row>
			</Container>
		</section>
	);
};

export default Documents;
