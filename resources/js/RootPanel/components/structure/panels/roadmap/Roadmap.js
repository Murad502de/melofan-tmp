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
	{id: "updated_at", type: "dateRoadmap", label: "Дата выполнения"},
	{id: "title", type: "text", label: "Заголовок"},
	{id: "round", type: "numeric", label: "Раунд"},
	{id: "target", type: "text", label: "Цель"},
	{id: "status", type: "text", label: "Статус"},
	{id: "amount", type: "money", label: "Цена акций"},
	{id: "percent", type: "percentRoadmap", label: "Процент прибыли"},
	{id: "isDisplay", type: "boolean", label: "Отображается на сайте"},
];
const filterCells = [
	{
		id: "language",
		type: "select",
		title: "Язык цели",
		defaultValue: "ru",
		value: [
			{id: "ru", label: "Русский"},
			{id: "en", label: "Английский"},
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

const nameTableRoadmap = "roadmap";

class Roadmap extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPageRoadmap, filterRoadmap} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						multiLanguage={true}
						isCreate={true}
						isEdit={true}
						isDestroy={true}
						basePath={basePath}
						entity="roadmap"
						textTitle="Road Map"
						filtersCells={filterCells}
						filter={filterRoadmap}
						setFilter={filter => this.setFilter(filter, nameTableRoadmap)}
						headCells={headCells}
						currentPage={currentPageRoadmap}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableRoadmap)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageRoadmap: store.root["currentPage_" + nameTableRoadmap],
		filterRoadmap: store.root["filter_" + nameTableRoadmap],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Roadmap)));
