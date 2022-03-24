import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {store} from "../../../../store/configureStore";
import {setError, setIsShowPreloader, setMessage} from "../../../../store/rootActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {getLocaleDateTime} from "../../../../actions/time";
import PhoneInput from "react-phone-input-2";

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
	marginField: {
		marginTop: theme.spacing(2),
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
	},
	inputPhone: {
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
	containerInput: {
		color: "rgba(0, 0, 0, 0.87)",
		cursor: "text",
		display: "inline-flex",
		position: "relative",
		fontSize: "1rem",
		boxSizing: "border-box",
		alignItems: "center",
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
		fontWeight: "400",
		lineHeight: "1.1876em",
		letterSpacing: "0.00938em",
		marginTop: "16px",

		"&:before": {
			left: 0,
			right: 0,
			bottom: 0,
			content: '"\\00a0"',
			position: "absolute",
			transition: "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
			borderBottom: "1px solid rgba(0, 0, 0, 0.42)",
			pointerEvents: "none",
		},
	},
	blockLabel: {
		transition: "color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms",
		transform: "translate(0, 1.5px) scale(0.75)",
		transformOrigin: "top left",
		top: 0,
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
});

class EditVerify extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Верификация пользователя",

			id: "",
			lastName: "",
			firstName: "",
			email: "",
			phone: "",
			created_at: "",
			country: "",
			region: "",
			city: "",

			messageForUser: "",
		};
	}

	componentDidMount() {
		let idUser = this.props.match.params.idVerify;

		if (idUser) {
			this.fillUser(idUser);
		} else {
			store.dispatch(setIsShowPreloader(false));
			this.props.history.push(this.props.basePath + "/verify");
		}
	}

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};
	onChangeSwitch = e => {
		this.setState({[e.target.name]: e.target.checked});
	};

	fillUser = idUser => {
		let error = "Ошибка при получении данных для верификации!";
		postRequest("get-verify", {idUser})
			.then(res => {
				this.setState({
					id: res.user.id,
					lastName: res.user.lastName,
					firstName: res.user.firstName,
					email: res.user.email,
					phone: res.user.phone,
					created_at: getLocaleDateTime(res.user.created_at),
					country: res.user.country,
					region: res.user.region,
					city: res.user.city,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/verify");
			});
	};

	applyVerify = () => {
		let isApply = confirm("Верифицировать пользователя?");
		if (!isApply) {
			return;
		}
		store.dispatch(setIsShowPreloader(true));

		postRequest("apply-verify", {
			id: this.state.id,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setMessage("Верификация выполнена"));
					this.props.history.push(this.props.basePath + "/verify");
				} else {
					if (res.error) {
						store.dispatch(setError(res.error));
					} else {
						store.dispatch(setError("При верификации данных произошла ошибка!"));
					}
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError("При верификации данных произошла ошибка!"));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	cancelVerify = () => {
		if (!this.state.messageForUser || this.state.messageForUser === "") {
			store.dispatch(setError("Пожалуйста введите сообщение пользователю!"));
			return;
		}
		let isApply = confirm("Отменить верификацию пользователя?");
		if (!isApply) {
			return;
		}
		store.dispatch(setIsShowPreloader(true));

		postRequest("cancel-verify", {
			id: this.state.id,
			messageForUser: this.state.messageForUser,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setMessage("Верификация отменена"));
					this.props.history.push(this.props.basePath + "/verify");
				} else {
					if (res.error) {
						store.dispatch(setError(res.error));
					} else {
						store.dispatch(
							setError("При отмене верификации данных произошла ошибка, пожалуйста попробуйте позже.")
						);
					}
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(
					setError("При отмене верификации данных произошла ошибка, пожалуйста попробуйте позже.")
				);
				store.dispatch(setIsShowPreloader(false));
			});
	};

	cancel = () => {
		this.props.history.push(this.props.basePath + "/verify");
	};

	render() {
		const {classes} = this.props;

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
											<Button variant="contained" onClick={this.cancel}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={8}>
							<Paper className={classes.paper}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={4}>
										<TextField
											label="ID пользователя"
											type="number"
											value={this.state.id}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<TextField
											label="Дата регистрации"
											value={this.state.created_at}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
								</Grid>

								<TextField
									className={classes.marginField}
									label="Фамилия"
									name="lastName"
									value={this.state.lastName}
									InputLabelProps={{
										shrink: true,
									}}
								/>

								<TextField
									className={classes.marginField}
									label="Имя"
									name="firstName"
									value={this.state.firstName}
									InputLabelProps={{
										shrink: true,
									}}
								/>

								<TextField
									className={classes.marginField}
									label="Email"
									name="email"
									value={this.state.email}
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<div className={classes.blockInput}>
									<label className={classes.blockLabel}>Номер телефона</label>
									<PhoneInput
										placeholder=""
										value={this.state.phone}
										specialLabel=""
										inputClass={classes.inputPhone}
										containerClass={classes.containerInput}
										disableSearchIcon={true}
										disableDropdown={true}
									/>
								</div>

								<TextField
									className={classes.marginField}
									label="Страна"
									name="country"
									value={this.state.country}
									InputLabelProps={{
										shrink: true,
									}}
								/>

								<TextField
									className={classes.marginField}
									label="Регион"
									name="region"
									value={this.state.region}
									InputLabelProps={{
										shrink: true,
									}}
								/>

								<TextField
									className={classes.marginField}
									label="Город"
									name="city"
									value={this.state.city}
									InputLabelProps={{
										shrink: true,
									}}
								/>
							</Paper>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<Grid item xs={12} sm={8} align="left">
										<Typography variant="h6" noWrap>
											Подтверждение
										</Typography>
									</Grid>
									<Grid item xs={12} align="center">
										<Button variant="contained" onClick={this.applyVerify}>
											Принять
										</Button>
									</Grid>
									<hr />
									<Grid item xs={12}>
										<TextField
											name="messageForUser"
											error={false}
											id="standard-error-helper-text"
											label="Сообщение пользователю"
											multiline
											fullWidth
											value={this.state.messageForUser}
											onChange={this.onChange}
										/>
									</Grid>
									<Grid item xs={12} align="center">
										<Button variant="contained" onClick={this.cancelVerify}>
											Отменить
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</main>
		);
	}
}

export default withStyles(styles)(withRouter(EditVerify));
