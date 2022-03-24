import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {IsTimeIco} from "../../other/Svg";
import {useSelector} from "react-redux";
import BackgroundBlur from "../../other/BackgroundBlur";

const AML = () => {
	const language = useSelector(state => state.languageCurrent.language);
	return (
		<section className="board-of-directors article-section">
			<BackgroundBlur />
			<Container>
				<Row>
					<Col lg={{span: 12, offset: 0}}>
						<div className="article">
							<h2 className="article__title">Политика AML</h2>
							<div className="article__date">
								<IsTimeIco /> <p>Обновлено: 20.04.21</p>
							</div>
							<div className="article__body">
								<ol className="number-list">
									<li>
										Персональная информация пользователей, которую получает и обрабатывает сайт
										<ol>
											<li>
												В рамках настоящей Политики под «персональной информацией пользователя»
												понимаются:.
												<ol>
													<li>
														Персональная информация, которую пользователь предоставляет о
														себе самостоятельно при оставлении заявки, совершении покупки,
														регистрации (создании учётной записи) или в ином процессе
														использования сайта.
													</li>
													<li>
														Данные, которые автоматически передаются сайтом в процессе его
														использования с помощью установленного на устройстве
														пользователя программного обеспечения, в том числе IP-адрес,
														информация из cookie, информация о браузере пользователя (или
														иной программе, с помощью которой осуществляется доступ к
														сайту), время доступа, адрес запрашиваемой страницы.
													</li>
													<li>
														Данные, которые предоставляются сайту, в целях осуществления
														оказания услуг и/или продаже товара и/или предоставления иных
														ценностей для посетителей сайта, в соответствии с деятельностью
														настоящего ресурса: имя, e-mail, номер телефона.
													</li>
												</ol>
											</li>
											<li>
												Настоящая Политика применима только к сайту и не контролирует и не несет
												ответственность за сайты третьих лиц, на которые пользователь может
												перейти по ссылкам, доступным на сайте . На таких сайтах у пользователя
												может собираться или запрашиваться иная персональная информация, а также
												могут совершаться иные действия.
											</li>
											<li>
												Сайт в общем случае не проверяет достоверность персональной информации,
												предоставляемой пользователями, и не осуществляет контроль за их
												дееспособностью. Однако сайт исходит из того, что пользователь
												предоставляет достоверную и достаточную персональную информацию по
												вопросам, предлагаемым в формах настоящего ресурса, и поддерживает эту
												информацию в актуальном состоянии.
											</li>
										</ol>
									</li>
									<li>пункт</li>
									<li>пункт</li>
								</ol>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</section>
	);
};

export default AML;
