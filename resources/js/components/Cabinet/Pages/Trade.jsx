import React from "react";
import {Col, Container, Form, Row, Tab, Table, Tabs} from "react-bootstrap";
import {makeStyles} from "@material-ui/core/styles";
import SliderMaterial from "@material-ui/core/Slider";
import {AllSortIco, ArrowDownTable, DownSortIco, UpSortIco} from "../../other/Svg";
import {KeyboardDatePicker} from "@material-ui/pickers";

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

const Trade = () => {
	const classes = useStyles();
	return (
		<div className="content securities">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<h4 className="content__title">Торговля</h4>
					</Col>
				</Row>
				<Row>
					<Col xl={9} lg={12}>
						<div className="wrapper-box">
							<Container>
								<Row>
									<Col lg={6}>
										<Form className="cabinet-form">
											<Form.Group as={Row} controlId="formPlaintextEmail">
												<Form.Label column="true" sm="12" md="4">
													Цена:
												</Form.Label>
												<Col sm="12" md="8">
													<div className="form-wrapper">
														<Form.Control type="number" />
														<div className="form-wrapper--currency">USD</div>
													</div>
												</Col>
											</Form.Group>

											<Form.Group as={Row} controlId="formPlaintextPassword" className="mb-3">
												<Form.Label column="true" sm="12" md="4">
													Количество:
												</Form.Label>
												<Col column="true" sm="12" md="8">
													<div className="form-wrapper">
														<Form.Control type="number" />
														<div className="form-wrapper--currency">HBM</div>
													</div>
												</Col>
											</Form.Group>
											<SliderMaterial
												className="slider-progress"
												defaultValue={0}
												aria-labelledby="discrete-slider-always"
												step={1}
												marks={marks}
												// valueLabelDisplay="on"
											/>
											<Form.Group as={Row} controlId="formPlaintextEmail">
												<Form.Label column="true" sm="12" md="4">
													Всего:
												</Form.Label>
												<Col sm="12" md="8">
													<div className="form-wrapper">
														<Form.Control type="number" />
														<div className="form-wrapper--currency">CAD</div>
													</div>
												</Col>
											</Form.Group>
											<button className="btn-main d-block btn-succes mt-3 mx-auto">
												Купить HBM
											</button>
										</Form>
									</Col>
									<Col lg={6}>
										<Form className="cabinet-form">
											<Form.Group as={Row} controlId="formPlaintextEmail">
												<Form.Label column="true" sm="12" md="4">
													Цена:
												</Form.Label>
												<Col sm="12" md="8">
													<div className="form-wrapper">
														<Form.Control type="number" />
														<div className="form-wrapper--currency">CAD</div>
													</div>
												</Col>
											</Form.Group>

											<Form.Group as={Row} controlId="formPlaintextPassword" className="mb-3">
												<Form.Label column="true" sm="12" md="4">
													Количество:
												</Form.Label>
												<Col column="true" sm="12" md="8">
													<div className="form-wrapper">
														<Form.Control type="number" />
														<div className="form-wrapper--currency">HBM</div>
													</div>
												</Col>
											</Form.Group>
											<SliderMaterial
												className="slider-progress"
												defaultValue={0}
												aria-labelledby="discrete-slider-always"
												step={1}
												marks={marks}
												// valueLabelDisplay="on"
											/>
											<Form.Group as={Row} controlId="formPlaintextEmail">
												<Form.Label column="true" sm="12" md="4">
													Всего:
												</Form.Label>
												<Col sm="12" md="8">
													<div className="form-wrapper">
														<Form.Control type="number" />
														<div className="form-wrapper--currency">CAD</div>
													</div>
												</Col>
											</Form.Group>
											<button className="btn-main d-block btn-sell mt-3 mx-auto">
												Продать HBM
											</button>
										</Form>
									</Col>
								</Row>
								<Row>
									<Col className="p-0" lg={12}>
										<hr style={{backgroundColor: "rgba(70, 91, 201, 0.50)"}} />
										<Tabs
											defaultActiveKey="open-orders"
											id="finance-tabs"
											className="cabinet-tabs mt-3">
											<Tab eventKey="open-orders" title="Открытые ордера(9)">
												<div className="cabinet-tabs-time">
													<button className="nav-link active">1 День</button>
													<button className="nav-link">1 Неделя</button>
													<button className="nav-link">1 месяц</button>
													<button className="nav-link">3 Месяца</button>
													<div className="d-flex align-items-center flex-wrap">
														<div className="date-cabinet">
															<KeyboardDatePicker
																variant="inline"
																className="datapicker-table"
																openTo="year"
																views={["year", "month", "date"]}
																format="dd.MM.yyyy"
																id="date-picker-inline"
																required
															/>
														</div>
														<span className="line-data"></span>
														<div className="date-cabinet">
															<KeyboardDatePicker
																variant="inline"
																className="datapicker-table"
																openTo="year"
																views={["year", "month", "date"]}
																format="dd.MM.yyyy"
																id="date-picker-inline"
																required
															/>
														</div>
													</div>
												</div>
												<Table responsive className="cabinet-table" hover size="sm">
													<thead>
														<tr>
															<th>
																Тип <ArrowDownTable />
															</th>
															<th>
																Пара <ArrowDownTable />
															</th>
															<th>
																Время <ArrowDownTable />
															</th>
															<th
																style={{
																	minWidth: "55px",
																}}>
																Вид <ArrowDownTable />
															</th>
															<th
																style={{
																	minWidth: "59px",
																}}>
																Цена <ArrowDownTable />
															</th>
															<th
																style={{
																	minWidth: "107px",
																}}>
																Количество <ArrowDownTable />
															</th>
															<th>
																Итого <ArrowDownTable />
															</th>
															<th></th>
														</tr>
													</thead>
													<tbody>
														<tr>
															<td className="success">Покупка</td>
															<td>HBM/CAD</td>
															<td>05.03.2021 12:32:32</td>
															<td>Limit Order</td>
															<td>0.55 CAD</td>
															<td>447.72 HBM</td>
															<td>246.246 CAD</td>
															<td className="success">
																<button className="btn-table">Отменить</button>
															</td>
														</tr>
														<tr>
															<td className="warning">Продажа</td>
															<td>HBM/CAD</td>
															<td>05.03.2021 12:32:32</td>
															<td>Limit Order</td>
															<td>0.55 CAD</td>
															<td>447.72 HBM</td>
															<td>246.246 CAD</td>
															<td className="success">
																<button className="btn-table">Отменить</button>
															</td>
														</tr>
													</tbody>
												</Table>
											</Tab>
											<Tab eventKey="order-history" title="История ордеров">
												История ордеров
											</Tab>
										</Tabs>
									</Col>
								</Row>
							</Container>
						</div>
					</Col>
					<Col xl={3} md={12}>
						<Row>
							<Col xl={12} md={6}>
								<div className="wrapper-box ">
									<div className="trade-right-sort">
										<div className="wrapper-btn-sort">
											<button className="btn-sort active">
												<AllSortIco />
											</button>
											<button className="btn-sort">
												<UpSortIco />
											</button>
											<button className="btn-sort">
												<DownSortIco />
											</button>
										</div>
									</div>
									<div className="table-fix-hight">
										<Table responsive className="cabinet-table table-trade-right" hover size="sm">
											<thead>
												<tr>
													<th>Цена CAD</th>
													<th>Кол-во HBM</th>
													<th>Всего</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="success">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
											</tbody>
										</Table>
									</div>
									<div className="table-fix-hight">
										<h4 className="mb-0 table-fix-hight__title  success">
											$0.5643 <UpSortIco /> <DownSortIco />
										</h4>
										<Table responsive className="cabinet-table table-trade-right" hover size="sm">
											<thead>
												<tr>
													<th>Цена CAD</th>
													<th>Кол-во HBM</th>
													<th>Всего</th>
												</tr>
											</thead>
											<tbody>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
												<tr>
													<td className="warning">0.5623</td>
													<td>23,913</td>
													<td>23,913.56</td>
												</tr>
											</tbody>
										</Table>
									</div>
								</div>
							</Col>
							<Col xl={12} md={6}>
								<div className="wrapper-box wrapper-box-deal">
									<Tabs defaultActiveKey="open-orders" id="finance-tabs" className="cabinet-tabs">
										<Tab eventKey="open-orders" title="Сделки на рынке">
											<Table
												responsive
												className="cabinet-table table-trade-right"
												hover
												size="sm">
												<thead>
													<tr>
														<th>Цена CAD</th>
														<th>Кол-во HBM</th>
														<th>Всего</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
												</tbody>
											</Table>
										</Tab>
										<Tab eventKey="order-history" title="Мои сделки">
											<Table
												responsive
												className="cabinet-table table-trade-right"
												hover
												size="sm">
												<thead>
													<tr>
														<th>Цена CAD</th>
														<th>Кол-во HBM</th>
														<th>Всего</th>
													</tr>
												</thead>
												<tbody>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
													<tr>
														<td className="warning">0.5623</td>
														<td>23,913</td>
														<td>23,913.56</td>
													</tr>
												</tbody>
											</Table>
										</Tab>
									</Tabs>
								</div>
							</Col>
						</Row>
					</Col>
					{/* <Col xl={{span: 9, order: 3}} md={{span: 12, order: 4}} lg={{span: 12, order: 4}}>
						2
					</Col> */}
					<Col xl={{span: 3, order: 3}} md={{span: 12, order: 3}} lg={{span: 6, order: 3}}></Col>
				</Row>
			</Container>
		</div>
	);
};

export default Trade;
