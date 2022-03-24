import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import {store} from "../../../../store/configureStore";
import {setError, setIsShowPreloader, setMessage} from "../../../../store/rootActions";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {withGoogleReCaptcha} from "react-google-recaptcha-v3";

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

class Settings extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			old_password: "",
			password: "",
			password_confirmation: "",

			enable2fa: false,
			qr2fa: null,
			secretKey: "",
			verifyCode: "",
			passwordDisable: "",
			verifyCodeDisable: "",
		};
	}

	componentDidMount() {
		store.dispatch(setIsShowPreloader(true));
		postRequest("getDataSettings")
			.then(res => {
				if (res.success) {
					this.setState({enable2fa: res.enable2fa == "1"});
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

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	onChange2fa = e => {
		if (e.target.checked) {
			store.dispatch(setIsShowPreloader(true));
			postRequest("2fa")
				.then(res => {
					if (res) {
						this.setState({
							qr2fa: res.google2fa_img,
							secretKey: res.secter_key,
						});
						store.dispatch(
							setMessage(
								"Для завершения настройки отсканируйте QR-код или введите вручную " +
									'из поля "Код для приложения Google Authenticator" в приложении для аутентификации'
							)
						);
						store.dispatch(setIsShowPreloader(false));
					} else {
						store.dispatch(setError("При получении ключа произошла ошибка!"));
						store.dispatch(setIsShowPreloader(false));
					}
				})
				.catch(err => {
					store.dispatch(setError("При получении ключа произошла ошибка!"));
					store.dispatch(setIsShowPreloader(false));
				});
		} else {
			if (
				this.state.passwordDisable === "" ||
				this.state.passwordDisable == null ||
				this.state.verifyCodeDisable === "" ||
				this.state.verifyCodeDisable == null
			) {
				store.dispatch(setError("Введите пароль и проверочный код!"));
				return;
			}
			store.dispatch(setIsShowPreloader(true));
			postRequest("disable2fa", {
				currentPassword: this.state.passwordDisable,
				verifyCode: this.state.verifyCodeDisable,
			})
				.then(res => {
					if (res.errors) {
						if (res.errors.currentPassword) {
							store.dispatch(setError(res.errors.currentPassword[0]));
						} else if (res.errors.verifyCode) {
							store.dispatch(setError(res.errors.verifyCode[0]));
						} else {
							store.dispatch(setError("При выключении двухфакторной аутентификации произошла ошибка!"));
						}
						store.dispatch(setIsShowPreloader(false));
					} else {
						this.setState({enable2fa: false});
						store.dispatch(setMessage("Вы успешно отключили двухфакторную аутентификацию."));
						store.dispatch(setIsShowPreloader(false));
					}
				})
				.catch(err => {
					store.dispatch(setError("При выключении двухфакторной аутентификации произошла ошибка!"));
					store.dispatch(setIsShowPreloader(false));
				});
		}
	};

	verifyChange2fa = e => {
		e.preventDefault();
		if (this.state.verifyCode === "" || this.state.verifyCode == null) {
			store.dispatch(setError("Введите проверочный код!"));
			return;
		}

		store.dispatch(setIsShowPreloader(true));
		postRequest("enable2fa", {
			verifyCode: this.state.verifyCode,
		})
			.then(res => {
				if (res.errors) {
					if (res.errors.verifyCode) {
						store.dispatch(setError(res.errors.verifyCode[0]));
					} else {
						store.dispatch(setError("При выключении двухфакторной аутентификации произошла ошибка!"));
					}
					store.dispatch(setIsShowPreloader(false));
				} else {
					this.setState({
						enable2fa: true,
						qr2fa: null,
						secretKey: "",
						verifyCode: "",
					});
					store.dispatch(setMessage("Вы успешно включили двухфакторную аутентификацию."));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError("При включении двухфакторной аутентификации произошла ошибка!"));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	editPassword = async e => {
		e.preventDefault();
		const captcha = await this.props.googleReCaptchaProps.executeRecaptcha("EditPasswordAdminPanel");

		postRequest("editPassword", {
			old_password: this.state.old_password,
			password: this.state.password,
			password_confirmation: this.state.password_confirmation,
			captcha,
		})
			.then(res => {
				if (res.success) {
					this.setState({
						old_password: "",
						password: "",
						password_confirmation: "",
					});
					store.dispatch(setMessage("Пароль успешно изменен."));
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError("Проверьте введенные данные!"));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				if (
					err.response &&
					err.response.data &&
					err.response.data.errors &&
					err.response.data.errors.password
				) {
					store.dispatch(
						setError(
							"Новый пароль должен содержать латинские буквы верхнего и нижнего регистра, цифры, спец. символы (!@#$%^&*), с минимальным  количество символов 8."
						)
					);
				} else {
					store.dispatch(setError("При изменении пароля произошла ошибка!"));
				}
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
									Настройки
								</Typography>
							</Paper>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Paper className={classes.paper}>
								<Typography variant="h6" noWrap>
									Изменение пароля:
								</Typography>
								<TextField
									className={classes.marginField}
									label="Старый пароль"
									required
									name="old_password"
									type="password"
									value={this.state.old_password}
									onChange={this.onChange}
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<TextField
									className={classes.marginField}
									label="Новый пароль"
									required
									name="password"
									type="password"
									value={this.state.password}
									onChange={this.onChange}
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<TextField
									className={classes.marginField}
									label="Подтверждение нового пароля"
									required
									name="password_confirmation"
									type="password"
									value={this.state.password_confirmation}
									onChange={this.onChange}
									InputLabelProps={{
										shrink: true,
									}}
								/>
								<Button className={classes.marginField} variant="contained" onClick={this.editPassword}>
									Изменить пароль
								</Button>
							</Paper>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Paper className={classes.paper}>
								<Typography variant="h6" noWrap>
									Двухфакторная аутентификация:
								</Typography>
								{!this.state.qr2fa && this.state.enable2fa && (
									<>
										<TextField
											className={classes.marginField}
											label="Пароль"
											type="password"
											name="passwordDisable"
											required
											value={this.state.passwordDisable}
											onChange={this.onChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										<TextField
											className={classes.marginField}
											label="Код подтверждения"
											required
											name="verifyCodeDisable"
											value={this.state.verifyCodeDisable}
											onChange={this.onChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</>
								)}
								<FormControlLabel
									control={
										<Switch
											className={classes.marginField}
											checked={this.state.enable2fa}
											onChange={this.onChange2fa}
											name="enable2fa"
											color="primary"
										/>
									}
									label="Включить"
								/>
								{this.state.qr2fa && (
									<>
										<img
											src={"data:image/svg+xml;base64, " + this.state.qr2fa}
											alt=""
											height={256}
											width={256}
										/>
										<TextField
											className={classes.marginField}
											label="Код для приложения Google Authenticator"
											value={this.state.secretKey}
											onChange={this.onChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										<TextField
											className={classes.marginField}
											label="Код подтверждения"
											required
											name="verifyCode"
											value={this.state.verifyCode}
											onChange={this.onChange}
											InputLabelProps={{
												shrink: true,
											}}
										/>
										<Button
											className={classes.marginField}
											variant="contained"
											onClick={this.verifyChange2fa}>
											Завершить настройку
										</Button>
									</>
								)}
								<hr />
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</main>
		);
	}
}

export default withGoogleReCaptcha(withStyles(styles)(Settings));
