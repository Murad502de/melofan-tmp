import React from "react";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles(theme => ({
	root: {
		flexShrink: 0,
		marginLeft: theme.spacing(2.5),
	},
}));

function TablePaginationActions(props) {
	const classes = useStyles();
	const {count, rowsPerPage, onChangePage} = props;

	return (
		<div className={classes.root}>
			<Pagination
				count={Math.max(0, Math.ceil(count / rowsPerPage))}
				siblingCount={1}
				color="primary"
				onChange={onChangePage}
			/>
		</div>
	);
}

TablePaginationActions.propTypes = {
	count: PropTypes.number.isRequired,
	onChangePage: PropTypes.func.isRequired,
	page: PropTypes.number.isRequired,
	rowsPerPage: PropTypes.number.isRequired,
};

export default TablePaginationActions;
