import React, {Component} from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";
import {withStyles} from "@material-ui/core/styles";
import {connect} from "react-redux";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},
});

class Preloader extends Component {
	render() {
		const {classes, isShowPreloader} = this.props;

		return (
			<Backdrop className={classes.backdrop} open={isShowPreloader}>
				{this.props.isShowProgress ? (
					<Box position="relative" display="inline-flex">
						<CircularProgress variant="static" value={this.props.progressNumber} />
						<Box
							top={0}
							left={0}
							bottom={0}
							right={0}
							position="absolute"
							display="flex"
							alignItems="center"
							justifyContent="center">
							<Typography variant="caption" component="div">{`${Math.round(
								this.props.progressNumber
							)}%`}</Typography>
						</Box>
					</Box>
				) : (
					<CircularProgress color="inherit" />
				)}
			</Backdrop>
		);
	}
}

const mapStateToProps = store => {
	return {
		isShowPreloader: store.root.isShowPreloader,
		isShowProgress: store.root.isShowProgress,
		progressNumber: store.root.progressNumber,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(Preloader));
