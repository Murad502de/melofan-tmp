import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import black_404 from "../../../images/404_black.png";
import black_404_white from "../../../images/404_white.png";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

const NotFound = () => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const history = useHistory();

	const onLink = e => {
		e.preventDefault();
		history.push("/" + language + "/");
	};

	return (
		<div className="page404">
			<Container>
				<Row className="align-items-center">
					<Col lg={6}>
						<h1 className="page404__title">{languageText["notFound1"]}</h1>
						<p className="page404__subtitle">{languageText["notFound2"]}</p>
					</Col>
					<Col lg={6}>
						<img src={black_404} alt="" className="page404__img_black" />
						<img src={black_404_white} alt="" className=" page404__img_white" />
					</Col>
					<Col lg={12}>
						<button onClick={onLink} className="btn-main">
							{languageText["notFound3"]}
						</button>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default NotFound;
