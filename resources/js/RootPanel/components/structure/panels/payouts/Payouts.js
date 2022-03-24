import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";
import EnhancedTable from "../../table/EnhancedTable";
import {connect} from "react-redux";
import {store} from "../../../../store/configureStore";
import {setFilter, setPage} from "../../../../store/rootActions";

const headCellsOpen = [
	{id: "id", type: "numeric", label: "ID выплаты"},
	{id: "user_id", type: "numeric", label: "ID пользователя"},
	{id: "system", type: "text", label: "Платежная система"},
	{id: "system_id", type: "text", label: "ID ПС"},
	{id: "amount", type: "money", label: "Сумма, C$"},
	{id: "created_at", type: "datetime", label: "Дата запроса"},
];
const filterOpenPayoutsCells = [];

const headCellsClose = [
	{id: "id", type: "numeric", label: "ID выплаты"},
	{id: "user_id", type: "numeric", label: "ID пользователя"},
	{id: "system", type: "text", label: "Платежная система"},
	{id: "system_id", type: "text", label: "ID ПС"},
	{id: "amount", type: "money", label: "Сумма, C$"},
	{id: "created_at", type: "datetime", label: "Дата запроса"},
	{id: "updated_at", type: "datetime", label: "Дата выплаты"},
];
const filterClosePayoutsCells = [];

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

const nameTableOpenPayouts = "openPayouts";
const nameTableClosePayouts = "closePayouts";

class Payouts extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {
			classes,
			basePath,
			currentPageClosePayout,
			filterClosePayouts,
			currentPageOpenPayout,
			filterOpenPayouts,
		} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						isEdit={true}
						basePath={basePath}
						entity="openPayouts"
						textTitle="Не обработанные выплаты"
						filtersCells={filterOpenPayoutsCells}
						filter={filterOpenPayouts}
						setFilter={filter => this.setFilter(filter, nameTableOpenPayouts)}
						headCells={headCellsOpen}
						currentPage={currentPageOpenPayout}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableOpenPayouts)}
					/>

					<EnhancedTable
						basePath={basePath}
						entity="closePayouts"
						textTitle="История выплат"
						filtersCells={filterClosePayoutsCells}
						filter={filterClosePayouts}
						setFilter={filter => this.setFilter(filter, nameTableClosePayouts)}
						headCells={headCellsClose}
						currentPage={currentPageClosePayout}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableClosePayouts)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageOpenPayout: store.root["currentPage_" + nameTableOpenPayouts],
		filterOpenPayouts: store.root["filter_" + nameTableOpenPayouts],
		currentPageClosePayout: store.root["currentPage_" + nameTableClosePayouts],
		filterClosePayouts: store.root["filter_" + nameTableClosePayouts],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Payouts)));
