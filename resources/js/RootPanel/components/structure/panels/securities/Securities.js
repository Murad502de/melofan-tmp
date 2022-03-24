import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";
import EnhancedTable from "../../table/EnhancedTable";
import {connect} from "react-redux";
import {store} from "../../../../store/configureStore";
import {setFilter, setPage} from "../../../../store/rootActions";

const headCells = [
	{id: "id", type: "numeric", label: "ID"},
	{id: "created_at", type: "date", label: "Дата старта"},
	{id: "updated_at", type: "date", label: "Дата окончания"},
	{id: "round", type: "numeric", label: "Раунд"},
	{id: "status", type: "statusSecurities", label: "Статус"},
	{id: "price", type: "money", label: "Цена, $"},
	{id: "targetAmount", type: "money", label: "Цель сбора, $"},
	{id: "targetMLFN", type: "numeric", label: "Количество HBM (цель)"},
	{id: "targetPercent", type: "percent", label: "Мин. процент цели"},
	{id: "resultAmount", type: "money", label: "Собранные срадства, $"},
	{id: "resultPercent", type: "percent", label: "Процент сбора"},
	{id: "resultMLFN", type: "numeric", label: "Куплено HBM"},
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

const nameTableSecurities = "securities";

class Securities extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPageSecurities, filterSecurities} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						isCreate={true}
						isEdit={true}
						isDestroy={true}
						basePath={basePath}
						entity="securities"
						textTitle="Ценные бумаги (цели)"
						filtersCells={filterCells}
						filter={filterSecurities}
						setFilter={filter => this.setFilter(filter, nameTableSecurities)}
						headCells={headCells}
						currentPage={currentPageSecurities}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableSecurities)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageSecurities: store.root["currentPage_" + nameTableSecurities],
		filterSecurities: store.root["filter_" + nameTableSecurities],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Securities)));
