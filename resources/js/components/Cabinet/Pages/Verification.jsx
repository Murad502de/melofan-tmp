import {Tab} from "bootstrap";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {Col, Container, Form, Row, Tabs} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {WarningSvg} from "../../other/Svg";
import {useSelector} from "react-redux";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";
import {setError} from "../../../actions/notification";
import Preloader from "../../other/Preloader";
import {setStatusKYC} from "../../../actions/user";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {getLocaleDateTime} from "../../../actions/time";
import {MenuItem, Select} from "@material-ui/core";
import SelectSearch from "../../other/SelectSearch";

const Verification = () => {
	const history = useHistory();
	let today = new Date();
	let maxBirthday = getLocaleDateTime(new Date(today.setFullYear(today.getFullYear() - 18)), "server");
	const [state, setDataState] = useState({
		step: 1,
		stepKYC: 0,
		statusKYC: 0,

		firstName: "",
		lastName: "",
		birthday: null,
		postIndex: "",
		country: {
			value: "",
			name: "",
		},
		city: {
			value: "",
			name: "",
		},
		region: {
			value: "",
			name: "",
		},
		address: "",

		isUpdateRegion: false,
		isUpdateCity: false,

		isAccreditation: false,
		isNeedAccreditation: false,
		isShowPreloader: false,

		messageNotVerify: "",
	});
	const user = useSelector(state => state.user);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		postRequest("getStepKYC").then(res => {
			setState({
				firstName: user.firstName,
				lastName: user.lastName,
				birthday: user.birthday ? user.birthday : null,
				postIndex: user.postIndex,
				isAccreditation: res.isAccreditation == 1,
				isNeedAccreditation: res.isNeedAccreditation == 1,
				statusKYC: Number(res.statusKYC),
				messageNotVerify: res.messageNotVerify,
			});
			switch (Number(res.stepKYC)) {
				case 1:
					if (res.isNeedAccreditation == 1) {
						setState({step: 3, stepKYC: 1});
					} else {
						setState({step: 3, stepKYC: 1});
					}
					break;
				case 2:
					setState({step: 3, stepKYC: 2});
					break;
				case 3:
					setState({step: 0, stepKYC: 3});
					break;
				case 4:
					setState({step: 0, stepKYC: 4});
					break;
				default:
					setState({step: 1, stepKYC: 0});
					break;
			}
			store.dispatch(setIsShowPreloader(false));
		});
	}, []);

	const onSelectStep = e => {};
	const setState = (newState = {}) => {
		setDataState(state => {
			return {...state, ...newState};
		});
	};

	const onChangeBirthday = (date, value) => {
		if (date && !value.includes("_")) {
			setState({birthday: getLocaleDateTime(date, "server")});
		}
	};

	const setApply = e => {
		e.preventDefault();
		setState({step: 2});
	};

	const setPersonalData = e => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));

		postRequest("savePersonalData", {
			firstName: state.firstName,
			lastName: state.lastName,
			birthday: state.birthday,
			postIndex: state.postIndex,
			country: state.country.value,
			region: state.region.value,
			city: state.city.value,
			address: state.address,
		})
			.then(res => {
				if (res.success) {
					if (res.isNeedAccreditation == 1) {
						setState({step: 3, stepKYC: 1, isNeedAccreditation: true});
					} else {
						setState({step: 3, stepKYC: 1, isNeedAccreditation: false});
					}

					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError(languageText["setSavePersonalDataError"]));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["setSavePersonalDataError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const setDataAccreditation = e => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));

		postRequest("setDataAccreditation", {
			isAccreditation: state.isAccreditation,
		})
			.then(res => {
				if (res.success) {
					setState({step: 4, stepKYC: res.stepKYC, statusKYC: res.statusKYC});
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError(languageText["setDataAccreditationError"]));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["setDataAccreditationError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	const onFinish = e => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));
		postRequest("onFinishVerify", {
			isAccreditation: state.isAccreditation,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setStatusKYC(res.statusKYC));
					store.dispatch(setIsShowPreloader(false));
					history.push("/" + language + "/cabinet/settings");
				} else {
					store.dispatch(setError(languageText["onFinishVerifyError"]));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(languageText["onFinishVerifyError"]));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	let verifyComponent;
	if (state.stepKYC == 4 && (state.statusKYC == 3 || state.statusKYC == 5)) {
		verifyComponent = (
			<div className="verification__warning-text">
				<div className="d-flex align-items-center mb-2">
					<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
				</div>
				<p className="mb-0">{languageText["verification39"]}</p>
				<p className="mb-0">{state.messageNotVerify}</p>
			</div>
		);
	} else if (state.stepKYC == 4) {
		verifyComponent = (
			<div className="verification__warning-text">
				<div className="d-flex align-items-center mb-2">
					<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
				</div>
				<p className="mb-0">{languageText["verification35"]}</p>
			</div>
		);
	} else if (state.stepKYC == 3 && (state.statusKYC == 3 || state.statusKYC == 5)) {
		verifyComponent = (
			<div className="verification__warning-text">
				<div className="d-flex align-items-center mb-2">
					<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
				</div>
				<p className="mb-0">{languageText["verification38"]}</p>
			</div>
		);
	} else if (state.stepKYC == 0 && state.statusKYC == 4) {
		verifyComponent = (
			<div className="verification__warning-text">
				<div className="d-flex align-items-center mb-2">
					<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
				</div>
				<p className="mb-0">{languageText["verification37"]}</p>
			</div>
		);
	} else {
		let stepAccreditation = <></>;
		if (state.isNeedAccreditation && state.stepKYC > 0) {
			stepAccreditation = (
				<Tab eventKey="step3" title={languageText["verification28"]}>
					<div className="verification__warning-text">
						<div className="d-flex align-items-center mb-2">
							<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
						</div>
						<p className="mb-0">{languageText["verification11"]}</p>
						<p className="mb-0">{languageText["verification-disclaimer"]}</p>
					</div>
					<Form onSubmit={e => setDataAccreditation(e)} className="cabinet-form">
						<Row>
							<Col lg={12}>
								<Form.Group as={Row} controlId="verifRegion">
									<Form.Label column="true" sm="12" md="4">
										{languageText["verification31"]}
									</Form.Label>
									<Col column="true" sm="12" md="8">
										<Select
											placeholder={languageText["verification34"]}
											value={state.isAccreditation ? 1 : 0}
											onChange={e => setState({isAccreditation: e.target.value == 1})}>
											<MenuItem value={0}>{languageText["verification32"]}</MenuItem>
											<MenuItem value={1}>{languageText["verification33"]}</MenuItem>
										</Select>
									</Col>
								</Form.Group>
							</Col>
						</Row>

						<button type="submit" className="btn-main d-block mt-4 mx-auto">
							{languageText["verification27"]}
						</button>
					</Form>
				</Tab>
			);
		}

		let stepDisclaimer = <></>;
		if (!state.isNeedAccreditation && state.stepKYC > 0) {
			stepDisclaimer = (
				<Tab eventKey="step3" title={languageText["verification29"]}>
					<form onSubmit={e => onFinish(e)}>
						<div className="verification__warning-text">
							<div className="d-flex align-items-center mb-2">
								<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
							</div>
							<p>{languageText["verification29"]}</p>
						</div>
						<div className="form-group form-check">
							<input type="checkbox" required className="form-check-input" id="form-auth-checkbox" />
							<label className="form-check-label" htmlFor="form-auth-checkbox">
								{languageText["verification7"]}
							</label>
						</div>
						<div className="form-group form-check">
							<input type="checkbox" required className="form-check-input" id="form-auth-checkbox-2" />
							<label
								className="form-check-label"
								htmlFor="form-auth-checkbox-2"
								dangerouslySetInnerHTML={{__html: languageText["verification8"]}}
							/>
						</div>
						<button type="submit" className="btn-main d-block mt-4 mx-auto">
							{languageText["verification9"]}
						</button>
					</form>
				</Tab>
			);
		}

		verifyComponent = (
			<Tabs
				activeKey={"step" + state.step}
				id="verification-steps"
				className="verification-steps"
				onSelect={e => onSelectStep(e)}>
				<Tab eventKey="step1" title={languageText["verification2"]}>
					<form onSubmit={e => setApply(e)}>
						<div className="verification__warning-text">
							<div className="d-flex align-items-center mb-2">
								<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
							</div>
							<p className="mb-0">{languageText["verification3"]}</p>
						</div>
						<b className="mt-4 mb-3 d-block">{languageText["verification4"]}</b>
						<ul className="verification__ul">
							<li dangerouslySetInnerHTML={{__html: languageText["verification5"]}} />
							<li dangerouslySetInnerHTML={{__html: languageText["verification6"]}} />
						</ul>
						<div className="form-group form-check">
							<input type="checkbox" required className="form-check-input mb-0" id="form-auth-checkbox" />
							<label className="form-check-label mb-0" htmlFor="form-auth-checkbox">
								{languageText["verification7"]}
							</label>
						</div>
						<div className="form-group form-check">
							<input
								type="checkbox"
								required
								className="form-check-input mb-0"
								id="form-auth-checkbox-2"
							/>
							<label
								className="form-check-label mb-0"
								htmlFor="form-auth-checkbox-2"
								dangerouslySetInnerHTML={{__html: languageText["verification8"]}}
							/>
						</div>
						<button type="submit" className="btn-main d-block mt-4 mx-auto">
							{languageText["verification9"]}
						</button>
					</form>
				</Tab>
				<Tab eventKey="step2" title={languageText["verification10"]}>
					<div className="verification__warning-text">
						<div className="d-flex align-items-center mb-2">
							<WarningSvg className="me-2" /> <b>{languageText["verification30"]}</b>
						</div>
						<p className="mb-0">{languageText["verification11"]}</p>
					</div>
					{state.isShowPreloader ? (
						<Preloader type="mini-circle" />
					) : (
						<Form onSubmit={e => setPersonalData(e)} className="cabinet-form">
							<Row>
								<Col lg={6}>
									<Form.Group as={Row} controlId="verifName">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification12"]}
										</Form.Label>
										<Col sm="12" md="8">
											<Form.Control
												required
												type="text"
												placeholder={languageText["verification13"]}
												value={state.firstName}
												name="a"
												onChange={e =>
													setState({
														firstName: e.target.value,
													})
												}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="verifFirstName">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification19"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<Form.Control
												required
												type="text"
												name="b"
												placeholder={languageText["verification20"]}
												value={state.lastName}
												onChange={e =>
													setState({
														lastName: e.target.value,
													})
												}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="verifDateBDay">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification14"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<KeyboardDatePicker
												className="datapicker"
												variant="inline"
												openTo="year"
												views={["year", "month", "date"]}
												maxDate={maxBirthday}
												format="dd.MM.yyyy"
												placeholder={languageText["datePicker5"]}
												margin="normal"
												id="date-picker-inline"
												value={state.birthday}
												required
												onChange={(date, value) => onChangeBirthday(date, value)}
												invalidDateMessage={languageText["datePicker1"]}
												invalidLabel={languageText["datePicker2"]}
												maxDateMessage={languageText["datePicker3"]}
												minDateMessage={languageText["datePicker4"]}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="verifPostcode">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification21"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<Form.Control
												required
												type="number"
												name="c"
												placeholder={languageText["verification22"]}
												value={state.postIndex}
												onChange={e =>
													setState({
														postIndex: e.target.value,
													})
												}
											/>
										</Col>
									</Form.Group>
								</Col>
								<Col lg={6}>
									<Form.Group as={Row} controlId="verifCountry">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification15"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<SelectSearch
												urlApi={"getCountries"}
												className="select-search"
												value={state.country}
												name="d"
												onChange={country =>
													setState({
														country,
														region: "",
														city: "",
														isUpdateRegion: true,
													})
												}
												additionalFilter={{}}
												update={false}
												setUpdate={isUpdate => setState({isUpdateRegion: isUpdate})}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="verifRegion">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification17"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<SelectSearch
												urlApi={"getRegions"}
												className="select-search"
												value={state.region}
												name="f"
												onChange={region =>
													setState({
														region,
														city: "",
														isUpdateCity: true,
													})
												}
												additionalFilter={{
													country: state.country.value,
												}}
												update={state.isUpdateRegion}
												setUpdate={isUpdate => setState({isUpdateRegion: isUpdate})}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="verifCity">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification23"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<SelectSearch
												urlApi={"getCities"}
												className="select-search"
												value={state.city}
												name="g"
												onChange={city => setState({city})}
												additionalFilter={{
													country: state.country.value,
													region: state.region.value,
												}}
												update={state.isUpdateCity}
												setUpdate={isUpdate => setState({isUpdateCity: isUpdate})}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="verifAddress" className="mb-4">
										<Form.Label column="true" sm="12" md="4">
											{languageText["verification25"]}
										</Form.Label>
										<Col column="true" sm="12" md="8">
											<Form.Control
												required
												type="text"
												name="e"
												placeholder={languageText["verification26"]}
												value={state.address}
												onChange={e =>
													setState({
														address: e.target.value,
													})
												}
											/>
										</Col>
									</Form.Group>
								</Col>
							</Row>

							<button type="submit" className="btn-main d-block mt-4 mx-auto">
								{languageText["verification27"]}
							</button>
						</Form>
					)}
				</Tab>
				{stepAccreditation}
				{stepDisclaimer}
			</Tabs>
		);
	}

	return (
		<div className="content verification">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<h4>{languageText["verification1"]}</h4>
					</Col>
				</Row>
				<Row>
					<Col lg={12}>
						<div className="wrapper-box">{verifyComponent}</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default Verification;
