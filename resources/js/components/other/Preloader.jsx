import React, {Component} from "react";
import {connect} from "react-redux";
import Lottie from "react-lottie";
import PropTypes from "prop-types";
import white_preloader from "../../../animations/preloaders/white_logo.json";
// import black_preloader from "../../../animations/preloaders/black_logo.json";
import circle2 from "../../../animations/preloaders/circle2.json";
import line from "../../../animations/preloaders/line.json";
// import {MlfnLogoHeaderIco} from "./Svg";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Backdrop from "@material-ui/core/Backdrop";

const propTypes = {
	type: PropTypes.string,
	progress: PropTypes.number,
};
const defaultProps = {
	type: "full",
	progress: 0,
};

class Preloader extends Component {
	render() {
		const defaultFull = {
			loop: true,
			autoplay: true,
			animationData: white_preloader,
			rendererSettings: {
				preserveAspectRatio: "xMidYMid slice",
			},
		};
		const defaultCircle = {
			loop: true,
			autoplay: true,
			animationData: circle2,
			rendererSettings: {
				preserveAspectRatio: "xMidYMid slice",
			},
		};
		const defaultLine = {
			loop: true,
			autoplay: true,
			animationData: line,
			rendererSettings: {
				preserveAspectRatio: "xMidYMid slice",
			},
		};

		let elemPreloader = <></>;

		if (this.props.isShowProgress) {
			elemPreloader = (
				<Backdrop open={this.props.isShowProgress}>
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
		} else if (this.props.isShowPreloader) {
			elemPreloader = (
				<div className="loader">
					<Lottie
						options={defaultFull}
						style={{
							width: "200px",
							height: "auto",
						}}
					/>
				</div>
			);
		} else if (this.props.type === "mini-circle") {
			elemPreloader = (
				<div className={`loader-mini`}>
					<Lottie
						options={defaultCircle}
						style={{
							width: "35px",
							height: "auto",
							marginTop: "15px",
							marginBottom: "15px",
						}}
					/>
				</div>
			);
		} else if (this.props.type === "mini-line") {
			elemPreloader = (
				<div className={`loader-mini loader-mini-gradient`}>
					<Lottie
						options={defaultLine}
						style={{
							width: "100%",
							height: "10px",
							marginTop: "15px",
							marginBottom: "15px",
							pointerEvents: "none",
						}}
					/>
				</div>
			);
		} else if (this.props.type === "line-progress") {
			elemPreloader = (
				<div className={`loader-mini`}>
					<div>
						<div
							style={{
								width: this.props.progress + "%",
								height: "38px",
								pointerEvents: "none",
							}}
						/>
					</div>
				</div>
			);
		}

		return elemPreloader;
	}
}

Preloader.propTypes = propTypes;
Preloader.defaultProps = defaultProps;

const mapStateToProps = store => {
	return {
		isShowPreloader: store.preloader.isShowPreloader,
		isShowProgress: store.preloader.isShowProgress,
		progressNumber: store.preloader.progressNumber,
	};
};

export default connect(mapStateToProps)(Preloader);
