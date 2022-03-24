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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {connect} from "react-redux";
import {getLocaleDateTime} from "../../../../actions/time";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import clsx from "clsx";
import {KeyboardDatePicker} from "@material-ui/pickers";

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

class EditRoadmap extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		let date = new Date();
		this.state = {
			titlePage: "Добавление цели",
			mainId: 0,
			numTab: 0,
			id: [],
			title: [],
			round: "",
			target: [],
			status: "0",
			amount: "",
			percentCalc: "0.1",
			percent: "0",
			typeTime: "quarter",
			created_at: "",
			updated_at: "",
			month: "1",
			quarter: "1",
			year: date.getFullYear(),

			isDisplay: true,
		};
	}

	componentDidMount() {
		let mainId = this.props.match.params.idRoadmap;

		if (mainId) {
			this.setState({
				titlePage: "Редактирование цели",
				mainId,
			});
			this.fillRoadmap(mainId);
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChangeTab = (event, newValue) => {
		this.setState({numTab: newValue});
	};

	onChange = (value, nameField) => {
		this.setState({[nameField]: value});
	};
	onChangeText = (value, nameField) => {
		let array = this.state[nameField];
		array[this.state.numTab] = value;
		this.setState({[nameField]: array});
	};
	onChangeAmount = (value, nameField) => {
		let arrayData = {
			amount: this.state.amount === "" || this.state.amount == null ? 0 : this.state.amount,
			percentCalc: this.state.percentCalc === "" || this.state.percentCalc == null ? 0 : this.state.percentCalc,
			percent: this.state.percent,
		};
		arrayData[nameField] = value;
		if (arrayData.percentCalc == 0) {
			arrayData.percent = arrayData.amount > 0 ? "+100%" : "0%";
			this.setState({...this.state, ...arrayData});
		} else {
			arrayData.percent = Math.round((arrayData.amount / arrayData.percentCalc) * 100 - 100);
			arrayData.percent = arrayData.percent > 0 ? "+" + arrayData.percent + "%" : arrayData.percent + "%";
			this.setState({...this.state, ...arrayData});
		}
	};

	fillRoadmap = id => {
		let error = "Ошибка при получении цели!";
		postRequest("get-roadmap", {id})
			.then(res => {
				let arrayLanguage = [];
				this.props.language.forEach(lang => {
					arrayLanguage.push(lang.id);
				});

				let date = new Date();
				let resultState = {
					id: [],
					title: [],
					round: "",
					target: [],
					status: 0,
					amount: "",
					percentCalc: "",
					percent: "",
					typeTime: "quarter",
					created_at: "",
					updated_at: "",
					month: "1",
					quarter: "1",
					year: date.getFullYear(),
					isDisplay: true,
				};

				res.array.forEach(roadmap => {
					let index = arrayLanguage.indexOf(roadmap.language);

					let percent = "";
					if (roadmap.percentCalc == 0) {
						percent = roadmap.amount > 0 ? "+100%" : "0%";
					} else {
						percent = Math.round((roadmap.amount / roadmap.percentCalc) * 100 - 100);
						percent = percent > 0 ? "+" + percent + "%" : percent + "%";
					}

					if (index !== -1) {
						resultState.id[index] = roadmap.id;
						resultState.title[index] = roadmap.title;
						resultState.round = roadmap.round ? roadmap.round : "";
						resultState.target[index] = roadmap.target ? roadmap.target : "";
						resultState.status = roadmap.status;
						resultState.amount = roadmap.amount;
						resultState.percentCalc = roadmap.percentCalc;
						resultState.percent = percent;
						resultState.typeTime = roadmap.typeTime;
						resultState.created_at = getLocaleDateTime(roadmap.created_at);
						resultState.updated_at = roadmap.updated_at;
						resultState.month = roadmap.month;
						resultState.quarter = roadmap.quarter;
						resultState.year = roadmap.year;
						resultState.isDisplay = roadmap.isDisplay == "1";
					} else {
						store.dispatch(setError(error));
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/roadmap");
					}
				});
				this.setState({...this.state, ...resultState});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/roadmap");
			});
	};

	actionRoadmap = typeAction => {
		store.dispatch(setIsShowPreloader(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let newsFormData = new FormData();

		let countLanguage = this.props.language.length;
		if (
			this.state.title.length < countLanguage ||
			(this.state.status !== 0 && !this.state.status) ||
			!this.state.typeTime ||
			this.state.amount === "" ||
			this.state.amount == null ||
			this.state.percentCalc === "" ||
			this.state.percentCalc == null ||
			(this.state.typeTime === "quarter" && (!this.state.quarter || !this.state.year)) ||
			(this.state.typeTime === "month" && (!this.state.month || !this.state.year)) ||
			(this.state.typeTime === "day" && !this.state.updated_at)
		) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowPreloader(false));
		} else {
			let isValidate = false;
			for (let index = 0; index < countLanguage; index++) {
				if (this.state.title[index]) {
					isValidate = true;
					if (typeAction === "edit") {
						newsFormData.append("id" + index, this.state.id[index]);
					}
					newsFormData.append("title" + index, this.state.title[index]);
					newsFormData.append("target" + index, this.state.target[index] ? this.state.target[index] : "");
					newsFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("round", this.state.round);
				newsFormData.append("status", this.state.status);
				newsFormData.append("isDisplay", this.state.isDisplay);
				newsFormData.append("amount", this.state.amount);
				newsFormData.append("percentCalc", this.state.percentCalc);
				newsFormData.append("typeTime", this.state.typeTime);
				newsFormData.append("updated_at", getLocaleDateTime(this.state.updated_at, "server"));
				newsFormData.append("month", this.state.month);
				newsFormData.append("quarter", this.state.quarter);
				newsFormData.append("year", this.state.year);
				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("token", localStorage.getItem("admintoken"));

				postRequest(typeAction + "-roadmap", newsFormData, {"Content-Type": "multipart/form-data"})
					.then(res => {
						if (res.success) {
							store.dispatch(setIsShowPreloader(false));
							this.props.history.push(this.props.basePath + "/roadmap");
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
			} else {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
			}
		}
	};

	cancelRoadmap = () => {
		this.props.history.push(this.props.basePath + "/roadmap");
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
											{this.state.mainId > 0 ? (
												<Button variant="contained" onClick={() => this.actionRoadmap("edit")}>
													Сохранить
												</Button>
											) : (
												<Button
													variant="contained"
													onClick={() => this.actionRoadmap("create")}>
													Добавить
												</Button>
											)}
											<Button variant="contained" onClick={this.cancelRoadmap}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paperTabs}>
								<Tabs
									value={this.state.numTab}
									onChange={this.onChangeTab}
									indicatorColor="primary"
									textColor="primary"
									variant="scrollable"
									scrollButtons="auto">
									{language.map(lang => (
										<Tab label={lang.title} key={lang.id} />
									))}
								</Tabs>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<FormControlLabel
										control={
											<Switch
												checked={this.state.isDisplay}
												onChange={e => this.onChange(e.target.checked, "isDisplay")}
												name="isDisplay"
												color="primary"
											/>
										}
										label="Отображать на сайте"
									/>
									<br />
									<div className={classes.blockInput}>
										<label className={classes.blockLabel}>Статус выполнения*</label>
										<Select
											className={classes.marginField}
											onChange={e => this.onChange(e.target.value, "status")}
											value={this.state.status}>
											<MenuItem value="0">В процессе</MenuItem>
											<MenuItem value="1">Скоро</MenuItem>
											<MenuItem value="2">Завершено</MenuItem>
										</Select>
									</div>
									{this.state.mainId > 0 && (
										<TextField
											id="date"
											label="Дата добавления"
											value={this.state.created_at}
											disabled
											className={classes.marginField}
										/>
									)}
									<Grid container>
										<div className={classes.blockInput}>
											<label className={classes.blockLabel}>Период*</label>
											<Select
												className={classes.marginField}
												onChange={e => this.onChange(e.target.value, "typeTime")}
												value={this.state.typeTime}>
												<MenuItem value="day">День</MenuItem>
												<MenuItem value="month">Месяц</MenuItem>
												<MenuItem value="quarter">Квартал</MenuItem>
											</Select>
										</div>
										{this.state.typeTime === "day" && (
											<KeyboardDatePicker
												variant="inline"
												views={["year", "month", "date"]}
												clearable
												format="dd.MM.yyyy"
												margin="normal"
												id="date-picker-inline"
												label="* Дата"
												className={clsx(classes.marginForNotLabel)}
												value={this.state.updated_at}
												onChange={e => this.onChange(e, "updated_at")}
												InputLabelProps={{
													shrink: true,
												}}
												fullWidth
											/>
										)}
										{this.state.typeTime === "month" && (
											<div className={classes.blockInput}>
												<Select
													className={classes.marginField}
													onChange={e => this.onChange(e.target.value, "month")}
													value={this.state.month}>
													<MenuItem value="1">Январь</MenuItem>
													<MenuItem value="2">Февраль</MenuItem>
													<MenuItem value="3">Март</MenuItem>
													<MenuItem value="4">Апрель</MenuItem>
													<MenuItem value="5">Май</MenuItem>
													<MenuItem value="6">Июнь</MenuItem>
													<MenuItem value="7">Июль</MenuItem>
													<MenuItem value="8">Август</MenuItem>
													<MenuItem value="9">Сентябрь</MenuItem>
													<MenuItem value="10">Октябрь</MenuItem>
													<MenuItem value="11">Ноябрь</MenuItem>
													<MenuItem value="12">Декабрь</MenuItem>
												</Select>
											</div>
										)}
										{this.state.typeTime === "quarter" && (
											<div className={classes.blockInput}>
												<Select
													className={clsx(classes.marginField)}
													onChange={e => this.onChange(e.target.value, "quarter")}
													value={this.state.quarter}>
													<MenuItem value="1">1</MenuItem>
													<MenuItem value="2">2</MenuItem>
													<MenuItem value="3">3</MenuItem>
													<MenuItem value="4">4</MenuItem>
												</Select>
											</div>
										)}
										{(this.state.typeTime === "month" || this.state.typeTime === "quarter") && (
											<TextField
												id="date"
												type="number"
												label=""
												value={this.state.year}
												className={clsx(classes.marginForNotLabel)}
												onChange={e => this.onChange(e.target.value, "year")}
											/>
										)}
									</Grid>
									<TextField
										name="title"
										error={false}
										label="Заголовок"
										multiline
										required
										fullWidth
										value={
											this.state.title[this.state.numTab]
												? this.state.title[this.state.numTab]
												: ""
										}
										onChange={e => this.onChangeText(e.target.value, "title")}
									/>
									<Grid container>
										<Grid item xs={12} sm={4}>
											<TextField
												id="date"
												label="Начальная цена HBM"
												type="number"
												value={this.state.percentCalc}
												className={classes.marginField}
												required
												onChange={e => this.onChangeAmount(e.target.value, "percentCalc")}
											/>
										</Grid>
										<Grid item xs={12} sm={4}>
											<TextField
												id="date"
												label="Конечная цена HBM"
												type="number"
												value={this.state.amount}
												className={classes.marginField}
												required
												onChange={e => this.onChangeAmount(e.target.value, "amount")}
											/>
										</Grid>
										<Grid item xs={12} sm={4}>
											<TextField
												id="date"
												label="Прибыль"
												disabled
												value={this.state.percent}
												className={classes.marginField}
											/>
										</Grid>
									</Grid>
									<TextField
										label="Номер раунда"
										className={classes.marginField}
										type="number"
										value={this.state.round}
										onChange={e => this.onChange(e.target.value, "round")}
									/>
									<TextField
										name="title"
										error={false}
										label="Цель раунда"
										multiline
										fullWidth
										className={classes.marginField}
										value={
											this.state.target[this.state.numTab]
												? this.state.target[this.state.numTab]
												: ""
										}
										onChange={e => this.onChangeText(e.target.value, "target")}
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditRoadmap)));
