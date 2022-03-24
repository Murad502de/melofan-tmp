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
	{id: "name", type: "text", label: "Наименование"},
	{id: "format", type: "text", label: "Формат файла"},
	{id: "size", type: "text", label: "Размер файла, мб."},
	{id: "isDisplay", type: "boolean", label: "Отображается на сайте"},
];
const filterCells = [
	{
		id: "language",
		type: "select",
		title: "Язык документов",
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

const nameTableDocuments = "documents";

class Documents extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPageDocuments, filterDocuments} = this.props;

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
						entity="documents"
						textTitle="Документы"
						filtersCells={filterCells}
						filter={filterDocuments}
						setFilter={filter => this.setFilter(filter, nameTableDocuments)}
						headCells={headCells}
						currentPage={currentPageDocuments}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableDocuments)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageDocuments: store.root["currentPage_" + nameTableDocuments],
		filterDocuments: store.root["filter_" + nameTableDocuments],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Documents)));
