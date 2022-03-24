import React, {useEffect, useRef, useState} from "react";
import {Col, Row, Tab, Table as TableBootstrap, Tabs} from "react-bootstrap";
import {useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import {ArrowDownTable, ArrowUpTable, ArrowEmptyTable} from "../../other/Svg";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Preloader from "../../other/Preloader";
import PropTypes from "prop-types";
import {Element, Link as LinK} from "react-scroll";
import Cell from "./Cell";
import {store} from "../../../store/configureStore";
import {setError} from "../../../actions/notification";
import Pagination from "../../other/Pagination";
import {getLocaleDateTime} from "../../../actions/time";

const propTypes = {
	tabs: PropTypes.array,
	headCells: PropTypes.object,
	defaultSortIdCell: PropTypes.object,
	defaultSortAsc: PropTypes.object,
	errorPrefixGetSuccessFalseDataTable: PropTypes.any,
	errorGetDataTable: PropTypes.object,
	countPerPage: PropTypes.object,
	updateRows: PropTypes.bool,
	setUpdateRows: PropTypes.func,
	echoRows: {
		propertySearch: PropTypes.object,
		rows: PropTypes.object,
		events: PropTypes.object,
	},
	setEchoRows: PropTypes.func,
	conditionalColumnClassName: PropTypes.object,
	equalityValueClassName: PropTypes.object,
	classNameRow: PropTypes.object,
	linkRows: PropTypes.object,
};

const defaultProps = {
	//defaultSortIdCell: "",
	defaultSortAsc: "asc",
	errorPrefixGetSuccessFalseDataTable: "",
	countPerPage: 20,
	updateRows: {},
	setUpdateRows: () => {},
	echoRows: {},
	setEchoRows: () => {},
	conditionalColumnClassName: {},
	equalityValueClassName: {},
	classNameRow: {},
	linkRows: {},
};

const iconsSort = {
	"asc": <ArrowDownTable />,
	"desc": <ArrowUpTable className="arrow-up" />,
	"empty": <ArrowEmptyTable />,
};

const getInitialState = (props, defaultData, nameProp = "") => {
	let result = {};
	for (const item of props.tabs) {
		if (defaultData === "defaultProps") {
			result[item.id] = typeof props[nameProp] === "object" ? props[nameProp][item.id] : props[nameProp];
		} else {
			result[item.id] = defaultData;
		}
	}
	return result;
};

const Table = props => {
	const history = useHistory();

	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	const [isFirstLoad, setIsFirstLoad] = useState(() => {
		return getInitialState(props, true);
	});
	const [idTab, setIdTab] = useState(props.tabs[0].id);
	const [typeDateFilter, setTypeDateFilter] = useState(() => {
		return getInitialState(props, 0);
	});
	const [dateBegin, setDateBegin] = useState(() => {
		return getInitialState(props, getLocaleDateTime(new Date(), "server"));
	});
	const [dateEnd, setDateEnd] = useState(() => {
		return getInitialState(props, getLocaleDateTime(new Date(), "server"));
	});
	const [idCellSort, setIdCellSort] = useState(() => {
		return getInitialState(props, "defaultProps", "defaultSortIdCell");
	});
	const [sortAsc, setSortAsc] = useState(() => {
		return getInitialState(props, "defaultProps", "defaultSortAsc");
	});
	const [rows, setRows] = useState(() => {
		return getInitialState(props, []);
	});
	const [currentPage, setCurrentPage] = useState(() => {
		return getInitialState(props, 1);
	});
	const [countPerPage, setCountPerPage] = useState(() => {
		return getInitialState(props, "defaultProps", "countPerPage");
	});
	const [count, setCount] = useState(() => {
		return getInitialState(props, 0);
	});
	const [isShowPreloader, setShowPreloader] = useState(() => {
		return getInitialState(props, true);
	});

	useEffect(() => {
		getRowsTable(idTab);
	}, []);

	useEffect(() => {
		if (props.updateRows) {
			props.setUpdateRows(false);
			getRowsTable(idTab);
		}
	}, [props.updateRows]);

	useEffect(() => {
		if (props.echoRows) {
			const tabs = Object.keys(props.echoRows.rows);
			let newRows = rows;
			let newCountRows = count;
			tabs.forEach(tab => {
				if (newRows[tab]) {
					let indexRow;
					switch (props.echoRows.events[tab]) {
						case "add":
							if (currentPage[tab] === 1) {
								newRows[tab].unshift(props.echoRows.rows[tab]);
								if (newRows.length > countPerPage) {
									newRows.pop();
								}
							}
							newCountRows[tab]++;
							break;
						case "delete":
							indexRow = newRows[tab].findIndex(
								item =>
									item[props.echoRows.propertySearch[tab]] ===
									props.echoRows.rows[tab][props.echoRows.propertySearch[tab]]
							);
							if (indexRow >= 0) {
								newRows[tab].splice(indexRow, 1);
							}
							newCountRows[tab] = newCountRows[tab] > 0 ? newCountRows[tab]-- : newCountRows[tab];
							break;
						case "update":
							indexRow = newRows[tab].findIndex(
								item =>
									item[props.echoRows.propertySearch[tab]] ===
									props.echoRows.rows[tab][props.echoRows.propertySearch[tab]]
							);
							if (indexRow >= 0) {
								newRows[tab][indexRow] = props.echoRows.rows[tab];
							}
							break;
					}
				}
			});

			setRows(rows => {
				return {...rows, ...newRows};
			});
			setCount(count => {
				return {...count, ...newCountRows};
			});
			props.setEchoRows(null);
		}
	}, [props.echoRows]);

	const setStatePreloader = (currentIdTab, state) => {
		setShowPreloader(isShowPreloader => {
			return {...isShowPreloader, [currentIdTab]: state};
		});
	};

	const onChangeIdTab = key => {
		setIdTab(key);
		setCount(count => {
			return {...count, [key]: 0};
		});
		getRowsTable(key);
	};

	const setSortTable = (currentIdTab, cellSort) => {
		let newSortAsc = "asc";
		if (idCellSort[currentIdTab] === cellSort) {
			newSortAsc = sortAsc[currentIdTab] === "asc" ? "desc" : "asc";
		}
		setSortAsc(sortAsc => {
			return {...sortAsc, [currentIdTab]: newSortAsc};
		});
		setIdCellSort(idCellSort => {
			return {...idCellSort, [currentIdTab]: cellSort};
		});
		getRowsTable(currentIdTab, {idCellSort: cellSort, sortAsc: newSortAsc});
	};

	const setFilterDate = (currentIdTab, typeDate) => {
		setCount(count => {
			return {...count, [currentIdTab]: 0};
		});
		setTypeDateFilter(typeDateFilter => {
			return {...typeDateFilter, [currentIdTab]: typeDate};
		});
		changeCurrentPage(currentIdTab, 1, {typeDateFilter: typeDate});
	};

	const onChangeDateBeginFilter = (currentIdTab, date, value) => {
		if (date == null || !value.includes("_")) {
			let newDate = date ? getLocaleDateTime(date, "server") : date;
			setDateBegin(dateBegin => {
				return {...dateBegin, [currentIdTab]: newDate};
			});
			setCount(count => {
				return {...count, [currentIdTab]: 0};
			});
			changeCurrentPage(currentIdTab, 1, {dateBegin: newDate});
		}
	};
	const onChangeDateEndFilter = (currentIdTab, date, value) => {
		if (date == null || !value.includes("_")) {
			let newDate = date ? getLocaleDateTime(date, "server") : date;
			setDateEnd(dateEnd => {
				return {...dateEnd, [currentIdTab]: newDate};
			});
			setCount(count => {
				return {...count, [currentIdTab]: 0};
			});
			changeCurrentPage(currentIdTab, 1, {dateEnd: newDate});
		}
	};

	const changeCurrentPage = (currentIdTab, numPage, otherData = {}) => {
		setCurrentPage(currentPage => {
			return {...currentPage, [currentIdTab]: numPage};
		});
		getRowsTable(currentIdTab, {currentPage: numPage, ...otherData});
	};

	const getRowsTable = (currentIdTab, data = {}) => {
		let scrollTop = document.getElementById("toTopTable");
		scrollTop.click();
		setStatePreloader(currentIdTab, true);
		let dataForRequest = {
			isFirstLoad: isFirstLoad[currentIdTab] ? isFirstLoad[currentIdTab] : null,
			tableId: currentIdTab,
			typeDateFilter: typeDateFilter[currentIdTab] ? typeDateFilter[currentIdTab] : null,
			dateBegin: dateBegin[currentIdTab] ? dateBegin[currentIdTab] : null,
			dataEnd: dateEnd[currentIdTab] ? dateEnd[currentIdTab] : null,
			idCellSort: idCellSort[currentIdTab] ? idCellSort[currentIdTab] : null,
			sortAsc: sortAsc[currentIdTab] ? sortAsc[currentIdTab] : null,
			currentPage: currentPage[currentIdTab] ? currentPage[currentIdTab] : null,
			countPerPage: countPerPage[currentIdTab] ? countPerPage[currentIdTab] : null,
		};
		dataForRequest = {...dataForRequest, ...data};

		postRequest("getAll-" + currentIdTab, dataForRequest)
			.then(res => {
				if (res.success) {
					setRows(rows => {
						return {...rows, [currentIdTab]: res.rows};
					});
					setCount(count => {
						return {...count, [currentIdTab]: res.count};
					});
					if (isFirstLoad[currentIdTab]) {
						setIsFirstLoad(isFirstLoad => {
							return {...isFirstLoad, [currentIdTab]: false};
						});
						if (res.typeDateFilter) {
							let triggerTypeDateFilter = Number(res.typeDateFilter);
							setTypeDateFilter(typeDateFilter => {
								return {...typeDateFilter, [currentIdTab]: triggerTypeDateFilter};
							});
							if (triggerTypeDateFilter === 4) {
								setDateBegin(dateBegin => {
									return {...dateBegin, [currentIdTab]: res.dateBegin ? res.dateBegin : null};
								});
								setDateEnd(dateEnd => {
									return {...dateEnd, [currentIdTab]: res.dateEnd ? res.dateEnd : null};
								});
							}
						}
						if (res.idCellSort) {
							setIdCellSort(idCellSort => {
								return {...idCellSort, [currentIdTab]: res.idCellSort};
							});
						}
						if (res.sortAsc) {
							setSortAsc(sortAsc => {
								return {...sortAsc, [currentIdTab]: res.sortAsc};
							});
						}
					}
					setStatePreloader(currentIdTab, false);
				} else {
					setStatePreloader(currentIdTab, false);
					if (props.errorPrefixGetSuccessFalseDataTable) {
						if (typeof props.errorPrefixGetSuccessFalseDataTable === "object") {
							store.dispatch(
								setError(
									languageText[props.errorPrefixGetSuccessFalseDataTable[currentIdTab] + res.error]
								)
							);
						} else if (typeof props.errorPrefixGetSuccessFalseDataTable === "string") {
							store.dispatch(
								setError(languageText[props.errorPrefixGetSuccessFalseDataTable + res.error])
							);
						}
					} else {
						store.dispatch(setError(languageText[props.errorGetDataTable[currentIdTab]]));
					}
				}
			})
			.catch(err => {
				setStatePreloader(currentIdTab, false);
				store.dispatch(setError(languageText[props.errorGetDataTable[currentIdTab]]));
			});
	};

	const openLink = (currentIdTab, row) => {
		if (props.linkRows && props.linkRows[currentIdTab]) {
			history.push(props.linkRows[currentIdTab].link+'/'+row[props.linkRows[currentIdTab].property]);
		}
	}

	return (
		<Row>
			<Col lg={12}>
				<div className="wrapper-box">
					<Element name="scrollToTopTable" />
					<LinK id="toTopTable" to="scrollToTopTable" spy={true} smooth={true} offset={-70} duration={500} />
					{props.tabs.length > 0 && (
						<Tabs
							activeKey={idTab}
							onSelect={key => onChangeIdTab(key)}
							id="finance-tabs"
							className="cabinet-tabs">
							{props.tabs.map(item => (
								<Tab key={"tabTable" + item.id} eventKey={item.id} title={item.name} />
							))}
						</Tabs>
					)}
					{isFirstLoad[idTab] && isShowPreloader[idTab] ? (
						<Preloader type="mini-circle" />
					) : (
						<>
							<div className="cabinet-tabs-time">
								<button
									className={`nav-link ${typeDateFilter[idTab] === 0 && "active"}`}
									onClick={() => setFilterDate(idTab, 0)}>
									{languageText["componentTable1"]}
								</button>
								<button
									className={`nav-link ${typeDateFilter[idTab] === 1 && "active"}`}
									onClick={() => setFilterDate(idTab, 1)}>
									{languageText["componentTable2"]}
								</button>
								<button
									className={`nav-link ${typeDateFilter[idTab] === 2 && "active"}`}
									onClick={() => setFilterDate(idTab, 2)}>
									{languageText["componentTable3"]}
								</button>
								<button
									className={`nav-link ${typeDateFilter[idTab] === 3 && "active"}`}
									onClick={() => setFilterDate(idTab, 3)}>
									{languageText["componentTable4"]}
								</button>
								<button
									className={`nav-link ${typeDateFilter[idTab] === 4 && "active"}`}
									onClick={() => setFilterDate(idTab, 4)}>
									{languageText["componentTable5"]}
								</button>
								<div className="d-flex align-items-center flex-wrap">
									<div className="date-cabinet">
										<KeyboardDatePicker
											placeholder={languageText["datePicker5"]}
											variant="inline"
											className="datapicker-table"
											openTo="date"
											views={["year", "month", "date"]}
											format="dd.MM.yyyy"
											id="date-picker-inline"
											disabled={typeDateFilter[idTab] !== 4}
											value={dateBegin[idTab]}
											onChange={(date, value) => onChangeDateBeginFilter(idTab, date, value)}
											invalidDateMessage={languageText["datePicker1"]}
											invalidLabel={languageText["datePicker2"]}
											maxDateMessage={languageText["datePicker3"]}
											minDateMessage={languageText["datePicker4"]}
										/>
									</div>
									<span className="line-data" />
									<div className="date-cabinet">
										<KeyboardDatePicker
											placeholder={languageText["datePicker5"]}
											variant="inline"
											className="datapicker-table"
											openTo="date"
											views={["year", "month", "date"]}
											format="dd.MM.yyyy"
											id="date-picker-inline"
											disabled={typeDateFilter[idTab] !== 4}
											value={dateEnd[idTab]}
											onChange={(date, value) => onChangeDateEndFilter(idTab, date, value)}
											invalidDateMessage={languageText["datePicker1"]}
											invalidLabel={languageText["datePicker2"]}
											maxDateMessage={languageText["datePicker3"]}
											minDateMessage={languageText["datePicker4"]}
										/>
									</div>
								</div>
							</div>

							{isShowPreloader[idTab] ? (
								<Preloader type="mini-circle" />
							) : (
								<TableBootstrap responsive className="cabinet-table" hover size="sm">
									<thead>
										<tr>
											{props.headCells[idTab].map(item => (
												<th
													key={"headCell" + item.id}
													style={item.style ? item.style : {}}
													onClick={() => setSortTable(idTab, item.id)}>
													{item.name && (
														<>
															{item.name + " "}
															{item.id === idCellSort[idTab]
																? iconsSort[sortAsc[idTab]]
																: iconsSort["empty"]}
														</>
													)}
												</th>
											))}
										</tr>
									</thead>

									<tbody>
										{rows[idTab].length > 0 ? (
											<>
												{rows[idTab].map(row => (
													<tr
														key={"row" + row[props.headCells[idTab][0].id]}
														onClick={() => openLink(idTab, row)}
														className={`${props.linkRows && props.linkRows[idTab] ? 'cursorPointer' : ''} ${
															props.conditionalColumnClassName[idTab] &&
															row[props.conditionalColumnClassName[idTab]] ==
																props.equalityValueClassName[idTab] &&
															props.classNameRow[idTab]
																? props.classNameRow[idTab]
																: ""
														}`}>
														{props.headCells[idTab].map(item => (
															<Cell
																key={item.id + row[props.headCells[idTab][0].id]}
																row={row}
																headCell={item}
															/>
														))}
													</tr>
												))}
											</>
										) : (
											<tr>
												<td colSpan={props.headCells[idTab].length} className="text-center">
													{languageText["empty"]}
												</td>
											</tr>
										)}
									</tbody>
								</TableBootstrap>
							)}
							{count[idTab] > countPerPage[idTab] && (
								<Pagination
									countRows={count[idTab]}
									countPerPage={countPerPage[idTab]}
									currentPage={currentPage[idTab]}
									changeCurrentPage={numPage => changeCurrentPage(idTab, numPage)}
								/>
							)}
						</>
					)}
				</div>
			</Col>
		</Row>
	);
};

Table.propTypes = propTypes;
Table.defaultProps = defaultProps;
export default Table;
