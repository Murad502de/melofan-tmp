import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {MenuItem, Select, withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {store} from "../../../../store/configureStore";
import {setError, setIsShowPreloader} from "../../../../store/rootActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {connect} from "react-redux";
import clsx from "clsx";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {getLocaleDateTime} from "../../../../actions/time";

const styles = theme => ({
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: "100vh",
		overflow: "auto",
	},
	container: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	paperTabs: {
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	fixedHeight: {
		height: 240,
	},
	cancelButton: {
		marginLeft: 3,
	},
	blockInput: {
		border: 0,
		margin: 0,
		marginTop: theme.spacing(2),
		display: "inline-flex",
		padding: 0,
		position: "relative",
		minWidth: 0,
		flexDirection: "column",
		div: {
			font: "inherit",
			color: "currentColor",
			width: "100%",
			border: 0,
			height: "1.1876em",
			margin: 0,
			display: "block",
			padding: "6px 0 7px",
			minWidth: 0,
			background: "none",
			boxSizing: "content-box",
			animationName: "mui-auto-fill-cancel",
			letterSpacing: "inherit",
			animationDuration: "10ms",
			overflow: "visible",
		},
	},
	blockLabel: {
		transition: "color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
		transform: "translate(0, 1.5px) scale(0.75)",
		transformOrigin: "top left",
		top: "-16px",
		left: 0,
		position: "absolute",
		display: "block",
		color: "rgba(0, 0, 0, 0.54)",
		padding: 0,
		fontSize: "1rem",
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		fontWeight: 400,
		lineHeight: 1,
		letterSpacing: "0.00938em",
		marginBottom: ".5rem",
	},
	marginForNotLabel: {
		marginTop: "32px",
	},
	marginField: {
		marginTop: theme.spacing(2),
	},
});

class EditSecurities extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Добавление цели",
			id: 0,
			round: "",
			targetAmount: "",
			price: "",
			status: "0",
			targetPercent: "",
			created_at: "",
			updated_at: "",

			resultAmount: "0",
			resultPercent: "0",
			resultMLFN: "0",
			targetMLFN: "0",
		};
	}

	componentDidMount() {
		let id = this.props.match.params.idSecurities;

		if (id) {
			this.setState({
				titlePage: "Редактирование цели",
				id,
			});
			this.fillData(id);
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChange = (value, nameField) => {
		this.setState({[nameField]: value});
	};

	onChangeAmount = (value, nameField) => {
		let arrayData = {
			targetAmount:
				this.state.targetAmount === "" || this.state.targetAmount == null ? 0 : this.state.targetAmount,
			price: this.state.price === "" || this.state.price == null ? 0 : this.state.price,
			targetMLFN: this.state.targetMLFN,
		};
		arrayData[nameField] = value;
		if (arrayData.price == 0) {
			arrayData.targetMLFN = arrayData.targetAmount > 0 ? arrayData.targetAmount : "0";
			this.setState({...this.state, ...arrayData});
		} else {
			arrayData.targetMLFN = arrayData.targetAmount / arrayData.price;
			this.setState({...this.state, ...arrayData});
		}
	};

	fillData = id => {
		let error = "Ошибка при получении цели!";
		postRequest("get-securities", {id})
			.then(res => {
				this.setState({
					id: res.securities.id,
					round: res.securities.round,
					targetAmount: res.securities.targetAmount,
					price: res.securities.price,
					status: res.securities.status,
					targetPercent: res.securities.targetPercent,
					created_at: new Date(res.securities.created_at),
					updated_at: new Date(res.securities.updated_at),

					resultAmount: res.securities.resultAmount,
					resultPercent: res.securities.resultPercent,
					resultMLFN: res.securities.resultMLFN,
					targetMLFN: res.securities.targetMLFN,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/securities");
			});
	};

	actionSecurities = typeAction => {
		store.dispatch(setIsShowPreloader(true));
		let error = "Все поля обязательны для заполнения! Проверьте все доступные поля!";

		if (
			this.state.round === "" ||
			this.state.round == null ||
			this.state.targetAmount === "" ||
			this.state.targetAmount == null ||
			this.state.price === "" ||
			this.state.price == null ||
			this.state.status === "" ||
			this.state.status == null ||
			this.state.targetPercent === "" ||
			this.state.targetPercent == null ||
			this.state.created_at === "" ||
			this.state.created_at == null ||
			this.state.updated_at === "" ||
			this.state.updated_at == null
		) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowPreloader(false));
		} else {
			postRequest(typeAction + "-securities", {
				id: this.state.id,
				round: this.state.round,
				targetAmount: this.state.targetAmount,
				price: this.state.price,
				status: this.state.status,
				targetMLFN: this.state.targetMLFN,
				targetPercent: this.state.targetPercent,
				created_at: getLocaleDateTime(this.state.created_at, "server"),
				updated_at: getLocaleDateTime(this.state.updated_at, "server"),
			})
				.then(res => {
					if (res.success) {
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/securities");
					} else {
						store.dispatch(
							setError("Не удалось выполнить сохранение. Проверьте правильность введнных данных.")
						);
						store.dispatch(setIsShowPreloader(false));
					}
				})
				.catch(err => {
					store.dispatch(setError(err));
					store.dispatch(setIsShowPreloader(false));
				});
		}
	};

	cancelSecurities = () => {
		this.props.history.push(this.props.basePath + "/securities");
	};

	render() {
		const {classes, language} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth="lg" className={classes.container}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={8} align="left">
										<Typography variant="h6" noWrap>
											{this.state.titlePage}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={4} align="center">
										<ButtonGroup aria-label="small outlined button group">
											{this.state.id > 0 ? (
												<Button
													variant="contained"
													onClick={() => this.actionSecurities("edit")}>
													Сохранить
												</Button>
											) : (
												<Button
													variant="contained"
													onClick={() => this.actionSecurities("create")}>
													Добавить
												</Button>
											)}
											<Button variant="contained" onClick={this.cancelSecurities}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<div className={classes.blockInput}>
										<label className={classes.blockLabel}>Статус цели*</label>
										<Select
											className={classes.marginField}
											onChange={e => this.onChange(e.target.value, "status")}
											value={this.state.status}>
											<MenuItem value="0">В процессе</MenuItem>
											<MenuItem value="1">Завершено</MenuItem>
										</Select>
									</div>
									<TextField
										label="Номер раунда"
										className={classes.marginField}
										type="number"
										value={this.state.round}
										required
										onChange={e => this.onChange(e.target.value, "round")}
									/>

									<TextField
										label="Цель сбора"
										value={this.state.targetAmount}
										className={classes.marginField}
										type="number"
										required
										onChange={e => this.onChangeAmount(e.target.value, "targetAmount")}
									/>
									<TextField
										label="Цена HBM"
										value={this.state.price}
										className={classes.marginField}
										type="number"
										required
										onChange={e => this.onChangeAmount(e.target.value, "price")}
									/>
									<TextField
										label="Количество HBM"
										value={this.state.targetMLFN}
										className={classes.marginField}
										required
										aria-readonly={true}
									/>
									<TextField
										label="Минимальный процент выполнения"
										value={this.state.targetPercent}
										className={classes.marginField}
										type="number"
										required
										onChange={e => this.onChange(e.target.value, "targetPercent")}
									/>
									<KeyboardDatePicker
										variant="inline"
										views={["year", "month", "date"]}
										clearable
										format="dd.MM.yyyy"
										margin="normal"
										id="date-picker-inline"
										label="* Дата старта"
										className={clsx(classes.marginForNotLabel)}
										value={this.state.created_at}
										onChange={e => this.onChange(e, "created_at")}
										InputLabelProps={{
											shrink: true,
										}}
										fullWidth
									/>
									<KeyboardDatePicker
										variant="inline"
										views={["year", "month", "date"]}
										clearable
										format="dd.MM.yyyy"
										margin="normal"
										id="date-picker-inline"
										label="* Дата окончания"
										className={clsx(classes.marginForNotLabel)}
										value={this.state.updated_at}
										onChange={e => this.onChange(e, "updated_at")}
										InputLabelProps={{
											shrink: true,
										}}
										fullWidth
									/>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<Grid item xs={12} sm={8} align="left">
										<Typography variant="subtitle1" noWrap>
											Результат
										</Typography>
									</Grid>
									<TextField
										label="Сумма сбора"
										value={this.state.resultAmount}
										className={classes.marginField}
										required
										aria-readonly={true}
									/>
									<TextField
										label="Процент сбора"
										value={this.state.resultPercent}
										className={classes.marginField}
										required
										aria-readonly={true}
									/>
									<TextField
										label="Куплено HBM"
										value={this.state.resultMLFN}
										className={classes.marginField}
										required
										aria-readonly={true}
									/>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		language: store.root.language,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditSecurities)));
