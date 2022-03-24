import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {store} from "../../../../store/configureStore";
import {setError, setIsShowPreloader, setMessage} from "../../../../store/rootActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {withGoogleReCaptcha} from "react-google-recaptcha-v3";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";
import {connect} from "react-redux";

const styles = theme => ({
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: "100vh",
		overflow: "auto",
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	fixedHeight: {
		height: 240,
	},
	marginField: {
		marginTop: theme.spacing(1),
	},
});

class Dashboard extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			messageForUser: "",
		};
	}

	componentDidMount() {
		postRequest("getDataDashboard")
			.then(res => {
				if (res.success) {
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError("При получении данных произошла ошибка!"));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError("При получении данных произошла ошибка!"));
				store.dispatch(setIsShowPreloader(false));
			});
	}

	sendMessageForUser = () => {
		store.dispatch(setIsShowPreloader(true));
		postRequest("sendMessageAllUsers", {
			message: this.state.messageForUser,
		})
			.then(res => {
				if (res.success) {
					this.setState({messageForUser: ""});
					store.dispatch(setMessage("Сообщение отправлено."));
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError("Ошибка при отправке сообщения!"));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError("Ошибка при отправке сообщения!"));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	onOthersAction = () => {
		store.dispatch(setIsShowPreloader(true));
		postRequest("othersAction")
			.then(res => {
				store.dispatch(setMessage(JSON.stringify(res)));
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(JSON.stringify(err)));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	render() {
		const {classes} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth="lg" className={classes.container}>
					<Grid container spacing={2}>
						<Grid item xs={12} align="center">
							<Paper className={classes.paper}>
								<Typography variant="h5" noWrap>
									HitBeat
								</Typography>
								<ButtonGroup aria-label="small outlined button group" hidden>
									<Button variant="contained" onClick={this.onOthersAction}>
										Резервная кнопка
									</Button>
								</ButtonGroup>
							</Paper>
						</Grid>
						{(this.props.roleId == 200 || this.props.roleId == 103) && (
							<Grid item xs={12} sm={4}>
								<Paper className={classes.paper}>
									<Typography variant="h6" noWrap>
										Сообщение для всех пользователей:
									</Typography>
									<TextField
										className={classes.marginField}
										label="Текст сообщения"
										name="messageForUser"
										value={this.state.messageForUser}
										onChange={e => this.setState({messageForUser: e.target.value})}
										InputLabelProps={{
											shrink: true,
										}}
									/>
									<hr />
									<Button
										className={classes.marginField}
										variant="contained"
										onClick={() => this.sendMessageForUser()}>
										Отправить
									</Button>
								</Paper>
							</Grid>
						)}
					</Grid>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		roleId: store.root.roleId,
	};
};

export default withGoogleReCaptcha(connect(mapStateToProps)(withStyles(styles)(Dashboard)));
