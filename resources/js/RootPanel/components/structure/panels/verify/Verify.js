import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";
import EnhancedTable from "../../table/EnhancedTable";
import {connect} from "react-redux";
import {store} from "../../../../store/configureStore";
import {setFilter, setPage} from "../../../../store/rootActions";

const headUsersCells = [
	{id: "id", type: "numeric", label: "ID"},
	{id: "lastName", type: "text", label: "Фамилия"},
	{id: "firstName", type: "text", label: "Имя"},
	{id: "email", type: "text", label: "Email"},
	{id: "phone", type: "numeric", label: "Номер телефона"},
	{id: "created_at", type: "datetime", label: "Дата регистрации"},
];

const filtersUsersCells = [
	{
		id: "country",
		type: "select",
		title: "Страна",
		defaultValue: "US",
		value: [
			{id: "US", label: "США"},
			{id: "CA", label: "Канада"},
		],
	},
];

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
});

const nameTableUsers = "verify";

class Verify extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPageUsers, filterUsers} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						isEdit={true}
						basePath={basePath}
						entity="verify"
						textTitle="Верификация"
						filtersCells={filtersUsersCells}
						filter={filterUsers}
						setFilter={filter => this.setFilter(filter, nameTableUsers)}
						headCells={headUsersCells}
						currentPage={currentPageUsers}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableUsers)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageUsers: store.root["currentPage_" + nameTableUsers],
		filterUsers: store.root["filter_" + nameTableUsers],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Verify)));
