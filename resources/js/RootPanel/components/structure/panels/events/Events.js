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
	{id: "title", type: "text", label: "Заголовок"},
	{id: "body", type: "text", label: "Содержание"},
	{id: "created_at", type: "date", label: "Дата"},
];
const filterCells = [
	{
		id: "language",
		type: "select",
		title: "Язык событий",
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

const nameTableEvents = "events";

class Events extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPageEvents, filterEvents} = this.props;

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
						entity="events"
						textTitle="События"
						filtersCells={filterCells}
						filter={filterEvents}
						setFilter={filter => this.setFilter(filter, nameTableEvents)}
						headCells={headCells}
						currentPage={currentPageEvents}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableEvents)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageEvents: store.root["currentPage_" + nameTableEvents],
		filterEvents: store.root["filter_" + nameTableEvents],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Events)));
