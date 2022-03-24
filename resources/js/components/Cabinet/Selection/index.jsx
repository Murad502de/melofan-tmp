import React, {Component} from "react";
import arrow_down from "./arrow_down_select.svg";
import arrow_up from "./arrow_up_select.svg";
import "./selection.scss";

export default class extends Component {
	constructor() {
		super();
		this.state = {
			index_option: "",
			isOpenListOptions: false,
		};
	}

	onChange = (item, index) => {
		this.setState({
			index_option: index,
			isOpenListOptions: false,
		});
		this.props.onChange(item);
	};

	onList = () => {
		this.setState({
			isOpenListOptions: !this.state.isOpenListOptions,
		});
	};

	render() {
		return (
			<div className="select-payments" onClick={() => this.onList()}>
				<img className="icon-selection" src={this.state.isOpenListOptions ? arrow_up : arrow_down} alt="" />
				<div className="selection-paysys">
					{this.state.index_option !== "" && this.state.index_option != null ? (
						<div className="option">
							<div className="title">
								<img src={this.props.options[this.state.index_option].icon} />
								<p>{this.props.options[this.state.index_option].label}</p>
							</div>
						</div>
					) : (
						<div className="placeholder input-box-icon">
							<p>{this.props.placeholder}</p>
						</div>
					)}
				</div>
				<div className="options" hidden={!this.state.isOpenListOptions}>
					{this.props.options.map((item, index) => (
						<div
							className="option"
							key={"itemSelection" + index}
							onClick={() => this.onChange(item, index)}>
							<div className="title">
								<img src={item.icon} />
								<p>{item.label}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}
}
