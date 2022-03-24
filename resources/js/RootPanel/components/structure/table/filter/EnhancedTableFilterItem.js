import {withStyles} from "@material-ui/core/styles";
import React, {Component} from "react";
import Select from "@material-ui/core/Select";
import clsx from "clsx";
import PropTypes from "prop-types";
import {Checkbox, MenuItem} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
	margin: {
		margin: theme.spacing(1),
	},
	textFieldSelect: {
		width: "80ch",
	},
	item: {
		display: "flex",
		flexDirection: "row",
		width: "100%",
	},
	alignItem: {
		display: "flex",
		alignContent: "center",
		alignItems: "center",
		justifyContent: "center",
	},
});

const propTypes = {
	filters: PropTypes.object,
};

class EnhancedTableFilterItem extends Component {
	onChangeSelect = (value, nameValue) => {
		switch (this.props.filters.type) {
			case "select":
				this.props.onChange({...this.props.value, select: value});
				break;
			case "select_condition":
				this.props.onChange(
					nameValue === "valueSelect"
						? {...this.props.value, select: value}
						: {...this.props.value, value: value}
				);
				break;
		}
	};

	onChangeActive = value => {
		if (this.props.value) {
			this.props.onChange({...this.props.value, isActive: value});
		} else {
			let data = {isActive: value};
			switch (this.props.filters.type) {
				case "select":
					data.select = this.props.filters.defaultValue;
					break;
				case "select_condition":
					data.select = this.props.filters.defaultValue;
					data.value = 0;
					break;
			}
			this.props.onChange(data);
		}
	};

	render() {
		const {classes, filters, value} = this.props;

		let componentItem = "";
		switch (filters.type) {
			case "select":
				componentItem = (
					<Select
						labelId="labelSelectFilter"
						id="select"
						disabled={value && value.isActive !== undefined ? !value.isActive : true}
						className={clsx(classes.margin)}
						onChange={e => this.onChangeSelect(e.target.value, "valueSelect")}
						value={value && value.select !== undefined ? value.select : filters.defaultValue}>
						{filters.value.map(dataFilter => (
							<MenuItem key={"strFilter" + filters.id + dataFilter.id} value={dataFilter.id}>
								{dataFilter.label}
							</MenuItem>
						))}
					</Select>
				);
				break;

			case "select_condition":
				componentItem = (
					<>
						<Select
							labelId="labelSelectFilter"
							id="select"
							disabled={value && value.isActive !== undefined ? !value.isActive : true}
							className={clsx(classes.margin)}
							onChange={e => this.onChangeSelect(e.target.value, "valueSelect")}
							value={value && value.select !== undefined ? value.select : filters.defaultValue}>
							{filters.value.map(dataFilter => (
								<MenuItem key={"strFilter" + filters.id + dataFilter.id} value={dataFilter.id}>
									{dataFilter.label}
								</MenuItem>
							))}
						</Select>
						<TextField
							className={classes.alignItem}
							type="number"
							disabled={value && value.isActive !== undefined ? !value.isActive : true}
							value={value && value.value !== undefined ? value.value : 0}
							onChange={e => this.onChangeSelect(e.target.value, "valueInput")}
						/>
					</>
				);
				break;
		}

		return (
			<>
				{componentItem !== "" && (
					<div className={classes.item}>
						<Checkbox
							checked={value && value.isActive !== undefined ? value.isActive : false}
							onChange={e => this.onChangeActive(e.target.checked)}
							inputProps={{"aria-label": "primary checkbox"}}
						/>
						<Typography className={classes.alignItem} variant="subtitle1">
							{filters.title}
						</Typography>
						{componentItem}
					</div>
				)}
			</>
		);
	}
}

EnhancedTableFilterItem.propTypes = propTypes;
export default withStyles(styles)(EnhancedTableFilterItem);
