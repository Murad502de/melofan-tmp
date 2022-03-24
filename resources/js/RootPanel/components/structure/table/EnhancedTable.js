import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import EnhancedTableToolbar from "./EnhancedTableToolbar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import Tooltip from "@material-ui/core/Tooltip";
import TableHead from "@material-ui/core/TableHead";
import {store} from "../../../store/configureStore";
import {setError, setIsShowPreloader, setMessage} from "../../../store/rootActions";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {connect} from "react-redux";
import DataTableCell from "./DataTableCell";
import TablePaginationActions from "./TablePaginationActions";
import PropTypes from "prop-types";

const styles = theme => ({
	root: {
		width: "100%",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
});

const propTypes = {
	multiLanguage: PropTypes.bool,
	isCreate: PropTypes.bool,
	isEdit: PropTypes.bool,
	isDestroy: PropTypes.bool,
	isApply: PropTypes.bool,
	textApply: PropTypes.string,
	basePath: PropTypes.string,
	entity: PropTypes.string,
	textTitle: PropTypes.string,
	headCells: PropTypes.array,
	filtersCells: PropTypes.array,
	filter: PropTypes.object,
	setFilter: PropTypes.func,
	currentPage: PropTypes.number,
	setCurrentPage: PropTypes.func,

	echoRows: {
		propertySearch: PropTypes.string,
		row: PropTypes.object,
		event: PropTypes.string,
	},
	setEchoRows: PropTypes.func,
};

const defaultProps = {
	multiLanguage: false,
	isCreate: false,
	isEdit: false,
	isDestroy: false,
	isApply: false,
	textApply: "",
	filtersCells: false,
	filter: false,

	echoRows: {},
	setEchoRows: () => {},
};

class EnhancedTable extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			page: 0,
			rowsPerPage: 10,
			search: "",
			rows: [],
			rowsLength: 0,
		};
	}

	componentDidMount() {
		this.setState({page: this.props.currentPage});
		this.getData(this.props.currentPage, this.state.rowsPerPage, this.state.search, this.props.filter);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (this.props.echoRows && prevProps.echoRows !== this.props.echoRows) {
			let newRows = this.state.rows;
			let newCountRows = this.state.rowsLength;

			let indexRow;
			switch (this.props.echoRows.event) {
				case "add":
					if (this.state.page === 0) {
						newRows.unshift(this.props.echoRows.row);
						if (newRows.length > this.state.rowsPerPage) {
							newRows.pop();
						}
					}
					newCountRows++;
					break;
				case "delete":
					indexRow = newRows.findIndex(
						item =>
							item[this.props.echoRows.propertySearch] ===
							this.props.echoRows.row[this.props.echoRows.propertySearch]
					);
					if (indexRow >= 0) {
						newRows.splice(indexRow, 1);
					}
					newCountRows = newCountRows > 0 ? --newCountRows : newCountRows;
					break;
				case "update":
					indexRow = newRows.findIndex(
						item =>
							item[this.props.echoRows.propertySearch] ===
							this.props.echoRows.row[this.props.echoRows.propertySearch]
					);
					if (indexRow >= 0) {
						newRows[indexRow] = this.props.echoRows.row;
					}
					break;
			}
			this.setState({
				rows: newRows,
				rowsLength: newCountRows,
			});
			this.props.setEchoRows(null);
		}
	}

	getData = (page, perPage, search, filter) => {
		store.dispatch(setIsShowPreloader(true));
		let data = {
			page: page,
			perPage: perPage,
			search: search,
			filter: filter,
		};
		postRequest("getAll-" + this.props.entity, data)
			.then(res => {
				this.setState({
					rows: res.array,
					rowsLength: res.total,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(err));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	handleRequestSort = (event, property) => {
		let isAsc = this.state.orderBy === property && this.state.order === "asc";
		this.setState({
			order: isAsc ? "desc" : "asc",
			orderBy: property,
		});
	};

	handleChangePage = (event, newPage) => {
		newPage -= 1;
		this.setState({page: newPage});
		this.getData(newPage, this.state.rowsPerPage, this.state.search, this.props.filter);
	};

	handleChangeRowsPerPage = event => {
		let page = 0;
		let perPage = parseInt(event.target.value, 10);
		this.setState({
			page: page,
			rowsPerPage: perPage,
		});
		this.getData(page, perPage, this.state.search, this.props.filter);
	};

	onChangeFieldSearch = textSearch => {
		this.setState({search: textSearch});
	};

	onSearch = textSearch => {
		this.setState({page: 0, search: textSearch});
		this.getData(0, this.state.rowsPerPage, textSearch, this.props.filter);
	};

	onChangeFilters = filter => {
		this.setState({page: 0});
		this.getData(0, this.state.rowsPerPage, this.state.search, filter);
	};

	onChangeLanguage = (e, rowId, langId) => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));

		let data = {
			rowId: rowId,
			langId: langId,
		};
		postRequest("changeLanguage-" + this.props.entity, data)
			.then(res => {
				let arrayNews = this.state.rows;
				for (let index = 0; index < this.state.rows.length; index++) {
					if (this.state.rows[index].id === rowId) {
						arrayNews[index] = res[this.props.entity];
						break;
					}
				}

				this.setState({rows: arrayNews});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(err));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	applyRow = (e, rowId) => {
		e.preventDefault();
		let isApply = confirm('Вы уверены, что хотите "' + this.props.textApply + '"?');
		if (!isApply) {
			return;
		}
		store.dispatch(setIsShowPreloader(true));

		let data = {
			rowId: rowId,
		};
		postRequest("apply-" + this.props.entity, data)
			.then(res => {
				if (res.success) {
					this.getData(this.state.page, this.state.rowsPerPage, this.state.search, this.props.filter);
					store.dispatch(setMessage("Действие успешно выполнено."));
				} else {
					if (res.error) {
						store.dispatch(setError(res.error));
						store.dispatch(setIsShowPreloader(false));
					}
				}
			})
			.catch(err => {
				store.dispatch(setError(err));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	deleteRow = (e, rowId) => {
		e.preventDefault();
		let isDel = confirm("Вы уверены, что хотите удалить запись?");
		if (!isDel) {
			return;
		}

		store.dispatch(setIsShowPreloader(true));

		let data = {
			rowId: rowId,
		};
		postRequest("destroy-" + this.props.entity, data)
			.then(res => {
				if (res.success) {
					this.getData(this.state.page, this.state.rowsPerPage, this.state.search, this.props.filter);
					store.dispatch(setMessage("Строка удалена"));
				} else {
					if (res.error) {
						if (Number(res.error) === 1) {
							store.dispatch(setError("У пользователя не хватает баланса"));
							store.dispatch(setIsShowPreloader(false));
						} else if (Number(res.error) === 2) {
							store.dispatch(setError("Нарушение целостности данных."));
						}
					}
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(err));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	editRow = (e, rowId) => {
		this.props.setCurrentPage(this.state.page);
		this.props.history.push(this.props.basePath + "/edit-" + this.props.entity + rowId);
	};

	render() {
		const {
			classes,
			textTitle,
			headCells,
			basePath,
			entity,
			language,
			isApply,
			textApply,
			multiLanguage,
			isCreate,
			isEdit,
			isDestroy,
			filtersCells,
			filter,
			setFilter,
		} = this.props;

		const {page, rowsPerPage, rows, rowsLength, search} = this.state;

		return (
			<div className={classes.root}>
				<Paper className={classes.paper}>
					<EnhancedTableToolbar
						isCreate={isCreate}
						basePath={basePath}
						entity={entity}
						textTitle={textTitle}
						textSearch={this.state.search}
						filtersCells={filtersCells}
						filter={filter}
						setFilter={filter => setFilter(filter)}
						getData={() => this.getData(page, rowsPerPage, search, filter)}
						onChangeFieldSearch={textSearch => this.onChangeFieldSearch(textSearch)}
						onSearch={textSearch => this.onSearch(textSearch)}
						onChangeFilters={filter => this.onChangeFilters(filter)}
					/>
					<TableContainer>
						<Table
							className={classes.table}
							aria-labelledby="tableTitle"
							size="small"
							aria-label="enhanced table">
							<TableHead>
								<TableRow>
									{headCells.map(headCell => (
										<TableCell
											key={"headCell" + headCell.id}
											align={
												headCell.type === "numeric" ||
												headCell.type === "date" ||
												headCell.type === "date_roadmap"
													? "right"
													: headCell.type === "image" || headCell.type === "boolean"
													? "center"
													: "left"
											}
											variant="head">
											{headCell.label}
										</TableCell>
									))}

									{(multiLanguage || isEdit || isDestroy || isApply) && (
										<TableCell key={"headCell" + "actions"} align="center" />
									)}
								</TableRow>
							</TableHead>
							<TableBody>
								{rows.map(row => {
									return (
										<TableRow hover key={"row" + row.id}>
											{headCells.map(headCell => (
												<DataTableCell
													key={headCell.id + row.id}
													row={row}
													headCell={headCell}
												/>
											))}

											{(multiLanguage || isEdit || isDestroy || isApply) && (
												<TableCell align="center" padding="none">
													{multiLanguage && (
														<div>
															<ButtonGroup>
																{language.map(lang => (
																	<Button
																		variant="contained"
																		key={"lang" + lang.id}
																		onClick={e =>
																			this.onChangeLanguage(e, row.id, lang.id)
																		}>
																		{lang.id.toUpperCase()}
																	</Button>
																))}
															</ButtonGroup>
															<br />
														</div>
													)}
													{isEdit && (
														<Tooltip title="Редактировать">
															<IconButton
																aria-label="Редактировать"
																onClick={e => this.editRow(e, row.id)}>
																<EditIcon />
															</IconButton>
														</Tooltip>
													)}
													{isApply && (
														<Tooltip title={textApply}>
															<IconButton
																aria-label={textApply}
																onClick={e => this.applyRow(e, row.id)}>
																<CheckIcon />
															</IconButton>
														</Tooltip>
													)}
													{isDestroy && (
														<Tooltip title="Удалить">
															<IconButton
																aria-label="Удалить"
																onClick={e => this.deleteRow(e, row.id)}>
																<DeleteIcon />
															</IconButton>
														</Tooltip>
													)}
												</TableCell>
											)}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={rowsLength}
						rowsPerPage={rowsPerPage}
						page={page}
						onChangePage={this.handleChangePage}
						onChangeRowsPerPage={this.handleChangeRowsPerPage}
						ActionsComponent={TablePaginationActions}
					/>
				</Paper>
			</div>
		);
	}
}
EnhancedTable.propTypes = propTypes;
EnhancedTable.defaultProps = defaultProps;

const mapStateToProps = store => {
	return {
		language: store.root.language,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EnhancedTable)));
