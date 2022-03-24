import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import Modal from "@material-ui/core/Modal";
import PropTypes from "prop-types";
import EnhancedTableFilterItem from "./EnhancedTableFilterItem";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	panelButton: {
		display: "flex",
		alignItems: "center",
		justifyContent: "right",
		marginTop: theme.spacing(1),
	},
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
});

const propTypes = {
	filters: PropTypes.array,
	onChangeFilters: PropTypes.func,
};

class EnhancedTableFilter extends Component {
	constructor() {
		super();
		this.state = {
			isOpenModal: false,
			filter: {},
		};
	}

	componentDidMount() {
		this.setState({filter: this.props.filter});
	}

	onChange = (value, itemId) => {
		this.props.setFilter({...this.props.filter, [itemId]: value});
	};

	onChangeFilters = () => {
		let stateFilter = {};
		let thisStateFilter = {};
		this.props.filtersCells.forEach(item => {
			if (this.props.filter[item.id]) {
				stateFilter[item.id] = this.props.filter[item.id];
				if (this.props.filter[item.id].isActive) {
					thisStateFilter[item.id] = this.props.filter[item.id];
				}
			}
		});
		this.setState({filter: thisStateFilter});
		this.props.setFilter(stateFilter);
		this.setState({isOpenModal: false});
		this.props.onChangeFilters(stateFilter);
	};

	handleOpenClose = () => {
		let trigger = !this.state.isOpenModal;
		if (!trigger) {
			this.props.setFilter(this.state.filter);
		}
		this.setState({isOpenModal: trigger});
	};

	render() {
		const {classes, filtersCells, filter} = this.props;
		const {isOpenModal} = this.state;

		const body = (
			<div className={classes.paper}>
				<Typography id="filter-modal-title" variant="h6" noWrap>
					Фильтр
				</Typography>
				{filtersCells.map(dataFilter => (
					<EnhancedTableFilterItem
						key={"filterItem" + dataFilter.id}
						filters={dataFilter}
						value={filter[dataFilter.id]}
						onChange={value => this.onChange(value, dataFilter.id)}
					/>
				))}
				<div className={classes.panelButton}>
					<ButtonGroup aria-label="small outlined button group">
						<Button variant="contained" onClick={() => this.handleOpenClose()}>
							Закрыть
						</Button>
						<Button variant="contained" onClick={() => this.onChangeFilters()}>
							Применить
						</Button>
					</ButtonGroup>
				</div>
			</div>
		);
		return (
			<>
				{filtersCells && filtersCells.length > 0 && (
					<>
						<Tooltip title="Открыть фильтр">
							<IconButton aria-label="Открыть фильтр" onClick={this.handleOpenClose}>
								<FilterListIcon
									style={{
										color: Object.keys(this.state.filter).length !== 0 ? "#3f51b5" : "#757575",
									}}
								/>
							</IconButton>
						</Tooltip>
						<Modal
							open={isOpenModal}
							onClose={this.handleOpenClose}
							aria-labelledby="filter-modal-title"
							aria-describedby="filter-modal-description"
							className={classes.modal}>
							{body}
						</Modal>
					</>
				)}
			</>
		);
	}
}

EnhancedTableFilter.propTypes = propTypes;
export default withStyles(styles)(EnhancedTableFilter);
