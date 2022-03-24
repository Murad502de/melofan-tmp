import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {store} from "../../../../store/configureStore";
import {setIsShowPreloader} from "../../../../store/rootActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

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
});

class EditPayouts extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Обработка выплаты",

			id: "",
			created_at: "",
			usersId: "",
			usersName: "",
			usersEmail: "",
			system: "",
			systemId: "",
			amount: "",

			amountMini: 0,
			amountMaxi: 0,
			amountIzi: 0,

			messageForUser: "",

			error: null,
			message: null,
		};
	}

	componentDidMount() {
		let id = this.props.match.params.idPayouts;

		if (id) {
			this.fillPayouts(id);
		} else {
			store.dispatch(setIsShowPreloader(false));
			this.props.history.push(this.props.basePath + "/payouts");
		}
	}

	fillPayouts = id => {
		let error = "Ошибка при получении данных о выплате!";
		postRequest("get-payouts", {
			id: id,
		})
			.then(res => {
				this.setState({
					id: res.id,
					created_at: res.created_at,
					usersId: res.usersId,
					usersName: res.usersName,
					usersEmail: res.usersEmail,
					system: res.system,
					systemId: res.systemId,
					amount: res.amount,

					amountMini: res.amountMini,
					amountIzi: res.amountIzi,
					amountMaxi: res.amountMaxi,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				this.setState({error: error});
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/payouts");
			});
	};

	applyPayouts = e => {
		e.preventDefault();
		let error = "Ошибка при выполнении операции!";
		store.dispatch(setIsShowPreloader(true));

		postRequest("apply-payouts", {
			id: this.state.id,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setIsShowPreloader(false));
					this.props.history.push(this.props.basePath + "/payouts");
				} else {
					this.setState({error: error});
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				this.setState({error: error});
				store.dispatch(setIsShowPreloader(false));
			});
	};

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	closePayouts = e => {
		e.preventDefault();
		let error = "Ошибка при выполнении операции!";
		store.dispatch(setIsShowPreloader(true));

		if (this.state.messageForUser === "" || this.state.messageForUser == null) {
			this.setState({error: "Введите сообщение пользователю!"});
			store.dispatch(setIsShowPreloader(false));
			return;
		}

		postRequest("closing-payouts", {
			id: this.state.id,
			messageForUser: this.state.messageForUser,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setIsShowPreloader(false));
					this.props.history.push(this.props.basePath + "/payouts");
				} else {
					this.setState({error: error});
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				this.setState({error: error});
				store.dispatch(setIsShowPreloader(false));
			});
	};

	cancelPayouts = () => {
		this.props.history.push(this.props.basePath + "/payouts");
	};

	closeError = () => {
		this.setState({error: null});
	};
	closeMessage = () => {
		this.setState({message: null});
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
											<Button variant="contained" onClick={this.cancelPayouts}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={12}>
							<Paper className={classes.paper}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={6} align="left">
										<Typography variant="h6" noWrap>
											{"Заработано MINI: ₽ " + Number(this.state.amountMini).toFixed(2)}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={4} align="left">
										<Typography variant="h6" noWrap>
											{"Заработано MAXI: ₽ " + Number(this.state.amountMaxi).toFixed(2)}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={4} align="left">
										<Typography variant="h6" noWrap>
											{"Заработано IZI: ₽ " + Number(this.state.amountIzi).toFixed(2)}
										</Typography>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={9}>
							<Paper className={classes.paper}>
								<Grid container spacing={2} alignItems="flex-end" className={classes.marginField}>
									<Grid item xs={12}>
										<TextField
											label="ID выплаты"
											value={this.state.id}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Дата запроса"
											value={this.state.created_at}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="ID пользователя"
											value={this.state.usersId}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="ФИО пользователя"
											value={this.state.usersName}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Email пользователя"
											value={this.state.usersEmail}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Платежна система"
											value={this.state.system}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="ID платежной системы"
											value={this.state.systemId}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Сумма, ₽"
											value={this.state.amount}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={3}>
							<Paper className={classes.paper}>
								<Grid container spacing={2} className={classes.marginField}>
									<Grid item xs={12} align="center">
										<Button variant="contained" onClick={this.applyPayouts}>
											Принять выплату
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
										<Button variant="contained" onClick={this.closePayouts}>
											Отменить выплату
										</Button>
									</Grid>
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Container>
				<Snackbar open={this.state.error != null} onClose={this.closeError}>
					<Alert align="center" elevation={6} variant="filled" onClose={this.closeError} severity="error">
						{this.state.error}
					</Alert>
				</Snackbar>
				<Snackbar open={this.state.message != null} onClose={this.closeMessage}>
					<Alert align="center" elevation={6} variant="filled" onClose={this.closeMessage} severity="success">
						{this.state.message}
					</Alert>
				</Snackbar>
			</main>
		);
	}
}

export default withStyles(styles)(withRouter(EditPayouts));
