import React from "react";
import PropTypes from "prop-types";
import {getLocaleDateTime} from "../../../actions/time";
import {useSelector} from "react-redux";
import {PlaySvg} from "../../other/Svg";
import {Link} from "react-router-dom";

const propTypes = {
	row: PropTypes.object,
	headCell: PropTypes.object,
};

const statusTicket = {
	0: "success",
	1: "process-text",
	2: "success",
};

const Cell = ({row, headCell}) => {
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	let elemCell = row[headCell.id];
	let className = "";
	switch (headCell.type) {
		case "id":
			elemCell = "№ " + row[headCell.id];
			break;
		case "string":
			elemCell = row[headCell.id];
			break;
		case "date":
			elemCell = getLocaleDateTime(row[headCell.id], "date");
			break;
		case "time":
			elemCell = getLocaleDateTime(row[headCell.id], "time");
			break;
		case "datetime":
			elemCell = getLocaleDateTime(row[headCell.id]);
			break;

		case "themeTicket":
			elemCell = languageText["themeTicket" + row[headCell.id]];
			break;
		case "statusTicket":
			elemCell = languageText["statusTicket" + row[headCell.id]];
			className = statusTicket[row[headCell.id]];
			break;
		case "eventTicket":
			elemCell = (
				<Link to={"/" + language + "/cabinet/dialog-open/" + row.number}>
					{languageText["linkTicketDialog"]} <PlaySvg />
				</Link>
			);
			break;
	}

	return <td className={className}>{elemCell}</td>;
};
Cell.propTypes = propTypes;
export default Cell;
