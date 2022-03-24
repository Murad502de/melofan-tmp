import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";
import EnhancedTable from "../../table/EnhancedTable";
import {connect} from "react-redux";
import {store} from "../../../../store/configureStore";
import {setFilter, setPage} from "../../../../store/rootActions";

const headCells = [
	{id: "id", type: "numeric", label: "ID пополнения"},
	{id: "userId", type: "numeric", label: "ID пользователя"},
	{id: "system", type: "text", label: "Платежная система"},
	{id: "amount", type: "money", label: "Сумма, ₽"},
	{id: "transactionNumber", type: "text", label: "Номер транзакции"},
	{id: "created_at", type: "datetime", label: "Дата пополнения"},
];
const filterCells = [];

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

const nameTablePayments = "payments";

class Payments extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPagePayments, filterOpenPayments} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						basePath={basePath}
						entity="payments"
						textTitle="Пополнения"
						filtersCells={filterCells}
						filter={filterOpenPayments}
						setFilter={filter => this.setFilter(filter, nameTablePayments)}
						headCells={headCells}
						currentPage={currentPagePayments}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTablePayments)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPagePayments: store.root["currentPage_" + nameTablePayments],
		filterOpenPayments: store.root["filter_" + nameTablePayments],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Payments)));
