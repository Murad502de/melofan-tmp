import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core";
import EnhancedTable from "../../table/EnhancedTable";
import {connect} from "react-redux";
import {store} from "../../../../store/configureStore";
import {setFilter, setPage} from "../../../../store/rootActions";

const headCellsOpen = [
	{id: "id", type: "numeric", label: "ID тикета"},
	{id: "user_id", type: "numeric", label: "ID автора"},
	{id: "theme", type: "text", label: "Тема"},
	{id: "text", type: "text", label: "Содержание"},
	{id: "created_at", type: "datetime", label: "Дата создания"},
];
const filterOpenTicketsCells = [];

const headCellsWork = [
	{id: "id", type: "numeric", label: "ID тикета"},
	{id: "user_id", type: "numeric", label: "ID автора"},
	{id: "theme", type: "text", label: "Тема"},
	{id: "text", type: "text", label: "Содержание"},
	{id: "status", type: "text", label: "Статус"},
	{id: "created_at", type: "datetime", label: "Дата создания"},
];
const filterWorkTicketsCells = [];

const headCellsClose = [
	{id: "id", type: "numeric", label: "ID тикета"},
	{id: "user_id", type: "numeric", label: "ID автора"},
	{id: "theme", type: "text", label: "Тема"},
	{id: "text", type: "text", label: "Содержание"},
	{id: "created_at", type: "datetime", label: "Дата создания"},
	{id: "updated_at", type: "datetime", label: "Дата закрытия"},
];
const filterCloseTicketsCells = [];

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

const nameTableOpenTickets = "openTickets";
const nameTableCloseTickets = "closeTickets";
const nameTableWorkTickets = "workTickets";

class Tickets extends Component {
	constructor() {
		super();
		this.state = {
			echoRowsTableOpen: {},
			echoRowsTablePending: {},
		};
	}

	componentDidMount() {
		window.laravelEcho.private(`allTicketOperators`).listen("Tickets.Open", res => {
			this.setState({
				echoRowsTableOpen: {
					propertySearch: "id",
					row: res.ticket,
					event: "add",
				},
			});
		});
		window.laravelEcho.private(`allTicketOperators`).listen("Tickets.Apply", res => {
			this.setState({
				echoRowsTableOpen: {
					propertySearch: "id",
					row: {id: res.idTicket},
					event: "delete",
				},
			});
		});
		window.laravelEcho.private(`ticketOperator.${this.props.userId}`).listen("Tickets.AddPending", res => {
			this.setState({
				echoRowsTablePending: {
					propertySearch: "id",
					row: res.ticket,
					event: "add",
				},
			});
		});
		window.laravelEcho.private(`ticketOperator.${this.props.userId}`).listen("Tickets.UpdateStatusOperator", res => {
			this.setState({
				echoRowsTablePending: {
					propertySearch: "id",
					row: res.ticket,
					event: "update",
				},
			});
		});
	}

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
			currentPageOpenTickets,
			filterOpenTickets,
			currentPageCloseTickets,
			filterCloseTickets,
			currentPageWorkTickets,
			filterWorkTickets,
		} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						isApply={true}
						textApply="Принять обращение на обработку"
						basePath={basePath}
						entity="openTickets"
						textTitle="Открытые тикеты"
						filtersCells={filterOpenTicketsCells}
						filter={filterOpenTickets}
						setFilter={filter => this.setFilter(filter, nameTableOpenTickets)}
						headCells={headCellsOpen}
						currentPage={currentPageOpenTickets}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableOpenTickets)}
						echoRows={this.state.echoRowsTableOpen}
						setEchoRows={data => this.setState({echoRowsTableOpen: data})}
					/>

					<EnhancedTable
						isEdit={true}
						basePath={basePath}
						entity="workTickets"
						textTitle="Тикеты в обработке"
						filtersCells={filterWorkTicketsCells}
						filter={filterWorkTickets}
						setFilter={filter => this.setFilter(filter, nameTableWorkTickets)}
						headCells={headCellsWork}
						currentPage={currentPageWorkTickets}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableWorkTickets)}
						echoRows={this.state.echoRowsTablePending}
						setEchoRows={data => this.setState({echoRowsTablePending: data})}
					/>

					<EnhancedTable
						isEdit={true}
						basePath={basePath}
						entity="closeTickets"
						textTitle="Закрытые тикеты"
						filtersCells={filterCloseTicketsCells}
						filter={filterCloseTickets}
						setFilter={filter => this.setFilter(filter, nameTableCloseTickets)}
						headCells={headCellsClose}
						currentPage={currentPageCloseTickets}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableCloseTickets)}
					/>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		currentPageOpenTickets: store.root["currentPage_" + nameTableOpenTickets],
		filterOpenTickets: store.root["filter_" + nameTableOpenTickets],
		currentPageCloseTickets: store.root["currentPage_" + nameTableCloseTickets],
		filterCloseTickets: store.root["filter_" + nameTableCloseTickets],
		currentPageWorkTickets: store.root["currentPage_" + nameTableWorkTickets],
		filterWorkTickets: store.root["filter_" + nameTableWorkTickets],
		userId: store.root.userId,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Tickets)));
