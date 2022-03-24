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
	{id: "role_id", type: "role", label: "Роль"},
	{id: "is_blocked", type: "boolean", label: "Заблокирован"},
	{id: "created_at", type: "datetime", label: "Дата регистрации"},
];

const filtersUsersCells = [
	{
		id: "blocked",
		type: "select",
		title: "Блокировка",
		defaultValue: "ban_true",
		value: [
			{id: "ban_true", label: "Заблокированные"},
			{id: "ban_false", label: "Не заблокированные"},
		],
	},
	{
		id: "role_id",
		type: "select",
		title: "Роль",
		defaultValue: 0,
		value: [
			{id: 0, label: "Пользователь"},
			{id: 1, label: "Брокер"},
		],
	},
	// {
	//     id: 'balance', type: 'select_condition', title: 'Баланс',
	//     defaultValue: 'equally', value: [
	//         {id: 'more', label: '>', type: 'numeric'},
	//         {id: 'less', label: '<', type: 'numeric'},
	//         {id: 'equally', label: '=', type: 'numeric'}
	//     ]
	// }
];

const headOperatorCells = [
	{id: "id", type: "numeric", label: "ID"},
	{id: "lastName", type: "text", label: "Фамилия"},
	{id: "firstName", type: "text", label: "Имя"},
	{id: "email", type: "text", label: "Email"},
	{id: "phone", type: "numeric", label: "Номер телефона"},
	{id: "role_id", type: "role", label: "Роль"},
	{id: "is_blocked", type: "boolean", label: "Заблокирован"},
];

const filtersOperatorCells = [
	{
		id: "blocked",
		type: "select",
		title: "Блокировка",
		defaultValue: "ban_true",
		value: [
			{id: "ban_true", label: "Заблокированные"},
			{id: "ban_false", label: "Не заблокированные"},
		],
	},
	{
		id: "role_id",
		type: "select",
		title: "Роль",
		defaultValue: 100,
		value: [
			{id: 100, label: "Оператор тикетов"},
			{id: 101, label: "Оператор выплат"},
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

const nameTableUsers = "users";
const nameTableOperators = "operators";

class Users extends Component {
	setCurrentPage = (numPage, nameTable) => {
		store.dispatch(setPage(numPage, nameTable));
	};
	setFilter = (filter, nameTable) => {
		store.dispatch(setFilter(filter, nameTable));
	};

	render() {
		const {classes, basePath, currentPageUsers, filterUsers, currentPageOperators, filterOperators} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth={false} className={classes.container}>
					<EnhancedTable
						isEdit={true}
                        isCreate={true}
                        isDestroy={false}
                        basePath={basePath}
						entity="users"
						textTitle="Пользователи"
						filtersCells={filtersUsersCells}
						filter={filterUsers}
						setFilter={filter => this.setFilter(filter, nameTableUsers)}
						headCells={headUsersCells}
						currentPage={currentPageUsers}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableUsers)}
					/>
					<EnhancedTable
						isEdit={true}
						isCreate={true}
						isDestroy={true}
						basePath={basePath}
						entity="operators"
						textTitle="Операторы"
						filtersCells={filtersOperatorCells}
						filter={filterOperators}
						setFilter={filter => this.setFilter(filter, nameTableOperators)}
						headCells={headOperatorCells}
						currentPage={currentPageOperators}
						setCurrentPage={numPage => this.setCurrentPage(numPage, nameTableOperators)}
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
		currentPageOperators: store.root["currentPage_" + nameTableOperators],
		filterOperators: store.root["filter_" + nameTableOperators],
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(Users)));
