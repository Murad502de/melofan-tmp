import {withStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import SearchIcon from "@material-ui/icons/Search";
import ClearIcon from "@material-ui/icons/Clear";
import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../store/rootActions";
import RefreshIcon from "@material-ui/icons/Refresh";
import EnhancedTableFilter from "./filter/EnhancedTableFilter";

const styles = theme => ({
	root: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(1),
	},
	title: {
		flex: "1 1 100%",
	},
	margin: {
		margin: theme.spacing(1),
	},
	withoutLabel: {
		marginTop: theme.spacing(3),
	},
	textField: {
		width: "80ch",
	},
});

class EnhancedTableToolbar extends Component {
	onChangeFieldSearch = e => {
		this.props.onChangeFieldSearch(e.target.value);
	};
	onSearch = e => {
		if (e.key === "Enter") {
			this.props.onSearch(this.props.textSearch);
		}
	};

	clearFieldSearch = () => {
		this.props.onChangeFieldSearch("");
	};

	addData = () => {
		store.dispatch(setIsShowPreloader(true));
		this.props.history.push(this.props.basePath + "/edit-" + this.props.entity);
	};

	refreshData = () => {
		this.props.getData();
	};

	render() {
		const {classes, textTitle, isCreate, filtersCells, filter, setFilter, onChangeFilters} = this.props;

		return (
			<Toolbar className={classes.root}>
				<Tooltip title="Обновить">
					<IconButton aria-label="Обновить" onClick={this.refreshData}>
						<RefreshIcon />
					</IconButton>
				</Tooltip>

				<Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
					{textTitle}
				</Typography>

				<EnhancedTableFilter
					onChangeFilters={filter => onChangeFilters(filter)}
					filtersCells={filtersCells}
					filter={filter}
					setFilter={filter => setFilter(filter)}
				/>

				<Tooltip title="Поиск">
					<TextField
						id="outlined-start-adornment"
						className={clsx(classes.margin, classes.textField)}
						value={this.props.textSearch}
						onChange={this.onChangeFieldSearch}
						onKeyPress={this.onSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Tooltip title="Найти">
										<IconButton
											aria-label="Найти"
											onClick={() => this.props.onSearch(this.props.textSearch)}>
											<SearchIcon />
										</IconButton>
									</Tooltip>
								</InputAdornment>
							),

							endAdornment: (
								<InputAdornment position="end">
									<Tooltip title="Очистить">
										<IconButton aria-label="Очистить" onClick={this.clearFieldSearch}>
											<ClearIcon />
										</IconButton>
									</Tooltip>
								</InputAdornment>
							),
						}}
					/>
				</Tooltip>

				{isCreate && (
					<Tooltip title="Добавить">
						<IconButton aria-label="Добавить" onClick={this.addData}>
							<AddIcon />
						</IconButton>
					</Tooltip>
				)}
			</Toolbar>
		);
	}
}

export default withStyles(styles)(withRouter(EnhancedTableToolbar));
