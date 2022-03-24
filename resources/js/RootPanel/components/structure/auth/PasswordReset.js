import React, {Component} from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import {Link, withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {store} from "../../../store/configureStore";
import {setError, setIsShowPreloader, setMessage} from "../../../store/rootActions";
import Grid from "@material-ui/core/Grid";
import {withGoogleReCaptcha} from "react-google-recaptcha-v3";

const styles = theme => ({
	paper: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: "100%", // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
});

class PasswordReset extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			login: "",
			token: "",
			password: "",
			confirmPassword: "",
		};
	}

	componentDidMount() {
		let verification_reset = this.props.match.params.verification_code;
		if (verification_reset) {
			this.setState({token: verification_reset});
			store.dispatch(setIsShowPreloader(false));
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	onRecovery = async e => {
		e.preventDefault();
		if (this.state.token !== "") {
			await this.setNewPassword();
		} else {
			await this.sendEmailForResetPassword();
		}
	};

	setNewPassword = async () => {
		store.dispatch(setIsShowPreloader(true));

		const captcha = await this.props.googleReCaptchaProps.executeRecaptcha("SetNewResetPassword");

		postRequest("resetPassword", {
			password: this.state.password,
			password_confirmation: this.state.confirmPassword,
			verification_reset: this.state.token,
			captcha,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setMessage("Пароль успешно изменен"));
				} else {
					this.refCaptcha.current.reset();
					store.dispatch(setError("Ошибка при изменении пароля!"));
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				this.refCaptcha.current.reset();
				if (
					err.response &&
					err.response.data &&
					err.response.data.errors &&
					err.response.data.errors.password
				) {
					store.dispatch(setError(err.response.data.errors));
				} else {
					store.dispatch(setError("Ошибка при изменении пароля!"));
				}
				store.dispatch(setIsShowPreloader(false));
			});
	};

	sendEmailForResetPassword = async () => {
		store.dispatch(setIsShowPreloader(true));

		const captcha = await this.props.googleReCaptchaProps.executeRecaptcha("SendMailResetPassword");

		postRequest("sendForResetPassword", {
			email: this.state.login,
			captcha,
		})
			.then(res => {
				if (res.success) {
					store.dispatch(setMessage("На Вашу почту отправлено сообщение для восстановления пароля!"));
				} else {
					store.dispatch(setError("Проверьте правильность введенных данных!"));
				}
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError("Проверьте правильность введенных данных!"));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	render() {
		const {classes} = this.props;

		return (
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component="h1" variant="h5">
						Восстановление пароля
					</Typography>
					<form className={classes.form} noValidate onSubmit={this.onRecovery}>
						{this.state.token === "" ? (
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="email"
								label="Login (Email)"
								name="login"
								autoComplete="current-password"
								autoFocus
								value={this.state.password}
								onChange={this.onChange}
							/>
						) : (
							<>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="password"
									label="Password"
									type="password"
									name="password"
									autoComplete="current-password"
									autoFocus
									value={this.state.password}
									onChange={this.onChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="confirmPassword"
									label="Confirm password"
									type="password"
									id="confirm_password"
									autoComplete="current-password"
									value={this.state.confirmPassword}
									onChange={this.onChange}
								/>
							</>
						)}
						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
							{this.state.token === "" ? "Восстановить" : "Изменить"}
						</Button>
						<Grid container>
							<Grid item xs>
								<Link to="open" variant="body2">
									Вспоминили пароль?
								</Link>
							</Grid>
						</Grid>
					</form>
				</div>
			</Container>
		);
	}
}

export default withGoogleReCaptcha(withStyles(styles)(withRouter(PasswordReset)));
