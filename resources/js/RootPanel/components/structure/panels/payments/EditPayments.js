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
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import {connect} from "react-redux";

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

class EditPayments extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Пополнение баланса",

			userId: "",
			userName: "",
			system: "",
			amount: "",
			transactionNumber: "",
		};
	}

	componentDidMount() {
		store.dispatch(setIsShowPreloader(false));
	}

	savePayments = e => {
		e.preventDefault();
		let dataPayment = {
			userId: this.state.userId,
			system: this.state.system,
			amount: this.state.amount,
			transactionNumber: this.state.transactionNumber,
		};

		if (
			dataPayment.userId !== "" &&
			dataPayment.userId != null &&
			dataPayment.userId > 0 &&
			dataPayment.system !== "" &&
			dataPayment.system != null &&
			dataPayment.system > 2 &&
			dataPayment.amount !== "" &&
			dataPayment.amount != null &&
			dataPayment.amount > 0 &&
			dataPayment.transactionNumber !== "" &&
			dataPayment.transactionNumber != null
		) {
			let error = "Ошибка при выполнении операции!";
			store.dispatch(setIsShowPreloader(true));

			postRequest("save-payments", dataPayment)
				.then(res => {
					if (res.success) {
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/payments");
					} else if (res.error) {
						store.dispatch(setIsShowPreloader(false));
						this.setState({error: res.error});
					} else {
						this.setState({error: error});
						store.dispatch(setIsShowPreloader(false));
					}
				})
				.catch(err => {
					this.setState({error: error});
					store.dispatch(setIsShowPreloader(false));
				});
		} else {
			this.setState({error: "Проверьте введнные данные"});
		}
	};

	getFIOUser = () => {
		if (this.state.userId) {
			store.dispatch(setIsShowPreloader(true));
			postRequest("getFIOMentor", {
				mentorId: this.state.userId,
			})
				.then(res => {
					if (res.success) {
						this.setState({
							userName: res.nameCurator,
						});
					} else {
						this.setState({error: "Ошибка при получении данных, проверьте введенный UID!"});
					}
					store.dispatch(setIsShowPreloader(false));
				})
				.catch(err => {
					this.setState({error: "Ошибка при получении данных!"});
					store.dispatch(setIsShowPreloader(false));
				});
		}
	};

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	cancelPayments = () => {
		this.props.history.push(this.props.basePath + "/payments");
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
											<Button variant="contained" onClick={this.savePayments}>
												Выполнить
											</Button>
											<Button variant="contained" onClick={this.cancelPayments}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container spacing={2} alignItems="flex-end" className={classes.marginField}>
									<Grid item xs={12} sm={6}>
										<TextField
											label="ID пользователя"
											type="number"
											name="userId"
											value={this.state.userId}
											onChange={this.onChange}
											fullWidth
											InputProps={{
												endAdornment: (
													<InputAdornment position="end">
														<Tooltip title="Получить ФИО пользователя">
															<IconButton
																aria-label="Получить ФИО пользователя"
																onClick={this.getFIOUser}>
																<InfoIcon />
															</IconButton>
														</Tooltip>
													</InputAdornment>
												),
											}}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField label="ФИО пользователя" value={this.state.userName} fullWidth />
									</Grid>
									<Grid item xs={12} sm={4}>
										<FormControl style={{width: "100%"}}>
											<InputLabel id="paymentSystem">Платежная система</InputLabel>
											<Select
												labelId="paymentSystem"
												name="system"
												fullWidth
												value={this.state.system}
												onChange={this.onChange}>
												<MenuItem value="">Не выбрана</MenuItem>
												<hr />
												<MenuItem value={4}>VISA / MasterCard</MenuItem>
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} sm={4}>
										<TextField
											label="Номер транзакции"
											name="transactionNumber"
											value={this.state.transactionNumber}
											onChange={this.onChange}
											fullWidth
										/>
									</Grid>
									<Grid item xs={12} sm={4}>
										<TextField
											label="Сумма, ₽"
											type="number"
											name="amount"
											value={this.state.amount}
											onChange={this.onChange}
											fullWidth
										/>
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

const mapStateToProps = store => {
	return {
		administrator: store.root.administrator,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditPayments)));
