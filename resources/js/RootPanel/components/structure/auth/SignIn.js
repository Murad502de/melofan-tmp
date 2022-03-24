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
import {setError, setIsAuth, setIsOpen2fa, setIsShowPreloader} from "../../../store/rootActions";
import Grid from "@material-ui/core/Grid";

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

class SignIn extends Component {
	constructor() {
		super();
		this.state = {
			login: "",
			password: "",
			verifyCode: "",
			is2faEnable: false,
		};
	}

	componentDidMount() {
		if (
			!localStorage.admintoken ||
			location.pathname === "/root-panel/open" ||
			location.pathname === "/root-panel/signin"
		) {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	login = e => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));

		postRequest("loginRoot", {
			firstName: this.state.login,
			password: this.state.password,
			verifyCode: this.state.verifyCode,
		})
			.then(res => {
				if (res.success) {
					if (res.token) {
						localStorage.setItem("admintoken", res.token);
						store.dispatch(setIsAuth(true, Number(res.roleId), Number(res.userId), res.token));
						if (
							document.location.pathname === "/root-panel/open" ||
							document.location.pathname === "/root-panel/signin"
						) {
							this.props.history.push(this.props.basePath + "/dashboard");
						}
					} else {
						this.setState({is2faEnable: true});
						store.dispatch(setIsShowPreloader(false));
					}
				} else {
					store.dispatch(setError(res.error));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(err));
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
						Авторизация
					</Typography>
					<form className={classes.form} noValidate onSubmit={this.login}>
						{this.state.is2faEnable ? (
							<TextField
								variant="outlined"
								margin="normal"
								required
								fullWidth
								id="verifyCode"
								label="Confirmation code"
								name="verifyCode"
								autoFocus
								value={this.state.verifyCode}
								onChange={this.onChange}
							/>
						) : (
							<>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									id="email"
									label="Login (Email)"
									name="login"
									autoComplete="email"
									autoFocus
									value={this.state.login}
									onChange={this.onChange}
								/>
								<TextField
									variant="outlined"
									margin="normal"
									required
									fullWidth
									name="password"
									label="Password"
									type="password"
									id="password"
									autoComplete="current-password"
									value={this.state.password}
									onChange={this.onChange}
								/>
							</>
						)}

						<Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
							Войти
						</Button>
						{!this.state.is2faEnable && (
							<Grid container>
								<Grid item xs>
									<Link to="reset" variant="body2">
										Забыли пароль?
									</Link>
								</Grid>
							</Grid>
						)}
					</form>
				</div>
			</Container>
		);
	}
}

export default withStyles(styles)(withRouter(SignIn));
