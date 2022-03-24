import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import clsx from "clsx";
import {withStyles, withTheme} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DrawerItem from "./DrawerItem";
import {store} from "../../../store/configureStore";
import {setIsAuth, setIsShowPreloader} from "../../../store/rootActions";
import {connect} from "react-redux";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import PaymentIcon from "@material-ui/icons/Payment";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import EventIcon from "@material-ui/icons/Event";
import DescriptionIcon from "@material-ui/icons/Description";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import MapIcon from "@material-ui/icons/Map";
import SubjectIcon from "@material-ui/icons/Subject";
import EventNoteIcon from "@material-ui/icons/EventNote";
import SettingsIcon from "@material-ui/icons/Settings";
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser";
import ListAltIcon from "@material-ui/icons/ListAlt";

const drawerWidth = 255;
const styles = theme => ({
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(["width", "margin"], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	hide: {
		display: "none",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
		whiteSpace: "nowrap",
	},
	drawerOpen: {
		width: drawerWidth,
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	drawerClose: {
		transition: theme.transitions.create("width", {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		overflowX: "hidden",
		width: theme.spacing(7) + 1,
		[theme.breakpoints.up("sm")]: {
			width: theme.spacing(9) + 1,
		},
	},
	toolbar: {
		display: "flex",
		alignItems: "center",
		justifyContent: "flex-end",
		padding: theme.spacing(0, 1),
		// necessary for content to be below app bar
		...theme.mixins.toolbar,
	},
});

class MiniDrawer extends Component {
	constructor() {
		super();
		if (localStorage.admintoken) {
			postRequest("checkAuthRoot")
				.then(res => {
					store.dispatch(setIsAuth(true, Number(res.roleId), Number(res.userId), localStorage.admintoken));
				})
				.catch(err => {
					localStorage.removeItem("admintoken");
					store.dispatch(setIsAuth(false, 0, 0, null));
					this.props.history.push(this.props.basePath + "/signin");
				});
		}
		this.state = {
			isOpen: false,
		};
	}

	editIsOpen = () => {
		this.setState({isOpen: !this.state.isOpen});
	};

	logout = e => {
		e.preventDefault();
		store.dispatch(setIsShowPreloader(true));

		postRequest("logoutRoot");
		localStorage.removeItem("admintoken");
		this.props.history.push(this.props.basePath + "/signin");
	};

	render() {
		let {classes, theme, basePath, roleId} = this.props;
		let {isOpen} = this.state;
		roleId = Number(roleId);

		return (
			<div>
				<CssBaseline />
				<AppBar
					position="fixed"
					className={clsx(classes.appBar, {
						[classes.appBarShift]: isOpen,
					})}>
					<Toolbar>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							onClick={this.editIsOpen}
							edge="start"
							className={clsx(classes.menuButton, {
								[classes.hide]: isOpen,
							})}>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" noWrap>
							Панель администрирования
						</Typography>
					</Toolbar>
				</AppBar>
				<Drawer
					variant="permanent"
					className={clsx(classes.drawer, {
						[classes.drawerOpen]: isOpen,
						[classes.drawerClose]: !isOpen,
					})}
					classes={{
						paper: clsx({
							[classes.drawerOpen]: isOpen,
							[classes.drawerClose]: !isOpen,
						}),
					}}>
					<div className={classes.toolbar}>
						<IconButton onClick={this.editIsOpen}>
							{theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
						</IconButton>
					</div>
					<Divider />
					<List>
						{[200, 100, 101, 103].includes(roleId) && (
							<DrawerItem icon={DashboardIcon} text="Главная" to={basePath + "/dashboard"} />
						)}
					</List>
					<Divider />
					<List>
						{[200].includes(roleId) && (
							<DrawerItem icon={EventIcon} text="Новости" to={basePath + "/news"} />
						)}
						{[200].includes(roleId) && (
							<DrawerItem icon={SubjectIcon} text="Статьи" to={basePath + "/articles"} />
						)}
						{[200].includes(roleId) && (
							<DrawerItem icon={EventNoteIcon} text="События" to={basePath + "/events"} />
						)}
						{[200].includes(roleId) && (
							<DrawerItem icon={DescriptionIcon} text="Документы" to={basePath + "/documents"} />
						)}
						{[200].includes(roleId) && (
							<DrawerItem icon={MapIcon} text="Road Map" to={basePath + "/roadmap"} />
						)}
						{[200].includes(roleId) && (
							<DrawerItem icon={ListAltIcon} text="Ценные бумаги" to={basePath + "/securities"} />
						)}
					</List>
					<Divider />
					<List>
						{[200].includes(roleId) && (
							<DrawerItem icon={PersonIcon} text="Пользователи" to={basePath + "/users"} />
						)}
						{[200, 100].includes(roleId) && (
							<DrawerItem icon={ContactSupportIcon} text="Тех. поддержка" to={basePath + "/tickets"} />
						)}
						{[200, 103].includes(roleId) && (
							<DrawerItem icon={VerifiedUserIcon} text="Верификация" to={basePath + "/verify"} />
						)}
					</List>
					<Divider />
					<List>
						{[200].includes(roleId) && (
							<DrawerItem icon={PaymentIcon} text="Пополнения" to={basePath + "/payments"} />
						)}
						{[200, 101].includes(roleId) && (
							<DrawerItem icon={AccountBalanceIcon} text="Выплаты" to={basePath + "/payouts"} />
						)}
					</List>
					<Divider />
					<List>
						{[200, 100, 101, 103].includes(roleId) && (
							<DrawerItem icon={SettingsIcon} text="Настройки" to={basePath + "/settings"} />
						)}
						<ListItem button onClick={this.logout}>
							<ListItemIcon>
								<ExitToAppIcon />
							</ListItemIcon>
							<ListItemText primary="Выйти" />
						</ListItem>
					</List>
				</Drawer>
			</div>
		);
	}
}

const mapStateToProps = store => {
	return {
		roleId: store.root.roleId,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withTheme(withRouter(MiniDrawer))));
