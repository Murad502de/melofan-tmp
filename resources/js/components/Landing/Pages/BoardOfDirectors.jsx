import React from "react";
import {Col, Container, Modal, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import BackgroundBlur from "../../other/BackgroundBlur";
import Michael_Gortovnik from "../../../../images/team/Michael_Gortovnik.png";
import header_logo from "../../../../images/header_logo.svg";
import no_photo from "../../../../images/team/no_photo.png";
import {MetaTags} from "react-meta-tags";

function DirectorModal(props) {
	return (
		<Modal
			{...props}
			className="modal-contact modal-director"
			aria-labelledby="contained-modal-title-vcenter"
			centered>
			<Modal.Body>
				<button type="button" className="close" onClick={props.onHide}>
					<span aria-hidden="true">×</span>
					<span className="sr-only">Close</span>
				</button>
				<div className="form-auth__img">
					<img src={header_logo} alt="HitBeat Logo" width="150px" />
					<p>совет директоров</p>
				</div>
				<div className="modal-director__info">
					<img src={Michael_Gortovnik} alt="" className="modal-director__photo" />
					<div className="modal-director__name">
						<h4>Michael Gortovnik</h4>
						<p>DYNAMIC LEADER WITH BUSINESS STRATEGY AND EXECUTIVE MANAGEMENT EXPERIENCE</p>
					</div>
				</div>
				<div className="modal-director__body">
					<h4 className="modal-director__body-title">Навыки и умения</h4>
					<p>
						Развитие бизнеса и стратегия
						<br />
						Управление аккаунтом и исполнителем
						<br />
						Управление продуктом
						<br />
						Контент и привлечение талантов
					</p>
					<h4 className="modal-director__body-title">Профессиональный опыт</h4>
					<div className="modal-director__body-work">
						<b>Менеджер по работе с лейблом и телевидением / кино</b>
						<p>Март 2020 - Настоящее время</p>
					</div>
					<div className="modal-director__body-work">
						<b>Менеджер по работе с клиентами</b>
						<p>Апрель 2018 - Март 2020</p>
					</div>
					<p>
						Корпорация Audible Magic
						<br />
						Лос-Гатос, Калифорния
					</p>
					<p>
						- Управлял аккаунтами более 200 правообладателей музыки и телевидения / кино, включая
						Monstercat, Dim Mak, Epitaph, Label-Engine, Entertainment One, CBS и Sky.
						<br />
						- Разработаны и внедрены ежеквартальные бизнес-обзоры для всех основных владельцев прав и счетов
						клиентов.
						<br />
						- Владел всеми отчетами для основных учетных записей, включая Twitch, Facebook, UMG, WMG и Sony
						Music.
						<br />
						- Скоординированная миграция на AWS для всех неосновных поставщиков контента. <br />
						- Работал кросс-функционально с операциями с контентом и DevOps для оптимизации процесса
						адаптации.
						<br />- Инициированная программа приобретения контента для всех неосновных правообладателей в
						регионе АН.
					</p>
				</div>
			</Modal.Body>
		</Modal>
	);
}

const BoardOfDirectors = () => {
	const [modalShow, setModalShow] = React.useState(false);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	return (
		<section className="board-of-directors">
			<MetaTags>
				<title>{languageText["title"]}</title>
				<meta name="description" content={languageText["description"]} />
				<meta property="og:title" content={languageText["title"]} />
				<meta property="og:description" content={languageText["description"]} />
			</MetaTags>
			<BackgroundBlur />
			<DirectorModal show={modalShow} onHide={() => setModalShow(false)} />
			<Container>
				<Row>
					<Col lg={12}>
						<h2 className="title">Совет директоров</h2>
						<p className="text">
							Совет директоров является органом управления HitBeat, осуществляющим общее руководство
							деятельностью компании. Решения Совета директоров принимаются в порядке, определенном
							кодексом корпоративного управления.
						</p>
					</Col>
				</Row>
				<Row>
					<Col lg={3} md={6}>
						<div className="board-of-directors__item">
							<img src={Michael_Gortovnik} alt="" className="board-of-directors__photo" />
							<h5 className="board-of-directors__item-name">Michael Gortovnik</h5>
							<p className="board-of-directors__item-title">
								dynamic leader with business strategy and executive management experience
							</p>
							<button className="btn-main" onClick={() => setModalShow(true)}>
								Подробнее
							</button>
						</div>
					</Col>
					{ /*<Col lg={3} md={6}>
						<div className="board-of-directors__item">
							<img src={Ralph_Olson} alt="" className="board-of-directors__photo" />
							<h5 className="board-of-directors__item-name">Ralph Olson</h5>
							<p className="board-of-directors__item-title">CO-FOUNDER AND DIRECTOR</p>
							<button className="btn-main" onClick={() => setModalShow(true)}>
								Подробнее
							</button>
						</div>
					</Col>

					<Col lg={3} md={6}>
						<div className="board-of-directors__item">
							<img src={Scott_Reeves} alt="" className="board-of-directors__photo" />
							<h5 className="board-of-directors__item-name">Scott Reeves</h5>
							<p className="board-of-directors__item-title">DIRECTOR</p>
							<button className="btn-main" onClick={() => setModalShow(true)}>
								Подробнее
							</button>
						</div>
					</Col> 

					<Col lg={3} md={6}>
						<div className="board-of-directors__item">
							<img src={no_photo} alt="" className="board-of-directors__photo" />
							<h5 className="board-of-directors__item-name">Lawrence Braden</h5>
							<p className="board-of-directors__item-title">CPA, MBA Senior Experienced CFO Consultant</p>
							<button className="btn-main" onClick={() => setModalShow(true)}>
								Подробнее
							</button>
						</div>
					</Col>
					
					<Col lg={3} md={6}>
                        <div className="board-of-directors__item">
                            <img src={no_photo} alt="" className="board-of-directors__photo"/>
                            <h5 className="board-of-directors__item-name">
                                Otto von Nostitz
                            </h5>
                            <p className="board-of-directors__item-title">
                                LEAD INDEPENDENT DIRECTOR
                            </p>
                             <button
                                className="btn-main"
                                onClick={() => setModalShow(true)}
                            >
                                Подробнее
                            </button>
                        </div>
                    </Col> */}
				</Row>
			</Container>
		</section>
	);
};

export default BoardOfDirectors;
