import React, {Component} from "react";
import {withStyles} from "@material-ui/core/styles";
import {store} from "../../../../store/configureStore";
import {setError, setIsOpen2fa, setIsShowPreloader} from "../../../../store/rootActions";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";

const styles = theme => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
	marginField: {
		marginTop: theme.spacing(2),
	},
});

class VerifyModal extends Component {
	constructor() {
		super();
		this.state = {
			verifyCode: "",
		};
	}

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	verifyChange2fa = e => {
		e.preventDefault();
		if (this.state.verifyCode === "" || this.state.verifyCode == null) {
			store.dispatch(setError("Неверный одноразовый код"));
			return;
		}

		store.dispatch(setIsShowPreloader(true));
		postRequest("verify2fa", {verify2fa: this.state.verifyCode})
			.then(res => {
				if (res.errors) {
					store.dispatch(setError("Неверный одноразовый код"));
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setIsOpen2fa(false));
					if (location.pathname === "/root-panel/open" || location.pathname === "/root-panel/signin") {
						this.props.history.push(this.props.path + "/dashboard");
					}
				}
			})
			.catch(err => {
				store.dispatch(setError("Неверный одноразовый код"));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	render() {
		const {classes} = this.props;
		return (
			<div>
				<Modal
					className={classes.modal}
					open={this.props.isOpen2fa}
					closeAfterTransition
					BackdropComponent={Backdrop}
					BackdropProps={{
						timeout: 500,
					}}>
					<Fade in={this.props.isOpen2fa}>
						<div className={classes.paper} align="center">
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
							<br />
							<Button className={classes.marginField} variant="contained" onClick={this.verifyChange2fa}>
								Продолжить
							</Button>
						</div>
					</Fade>
				</Modal>
			</div>
		);
	}
}

const mapStateToProps = store => {
	return {
		isOpen2fa: store.root.isOpen2fa,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(VerifyModal)));
