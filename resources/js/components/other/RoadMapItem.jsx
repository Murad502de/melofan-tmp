import {DoneSvg, InProgressSvg, WaitingSvg} from "./Svg";
import React from "react";
import {useSelector} from "react-redux";
import {getLocaleDateTime} from "../../actions/time";

const classesDiv = ["process", "soon", "completed"];
const icons = [<InProgressSvg />, <WaitingSvg />, <DoneSvg />];

export default ({
	status,
	typeTime,
	month,
	quarter,
	year,
	updated_at,
	discription,
	HBM,
	percentCalc,
	round,
	textRound,
}) => {
	const languageText = useSelector(state => state.languageCurrent.languageText);

	let percent = "";
	if (percentCalc == 0) {
		percent = HBM > 0 ? "+100%" : "0%";
	} else {
		percent = Math.round((HBM / percentCalc) * 100 - 100);
		percent = percent > 0 ? "+" + percent + "%" : percent + "%";
	}

	let date = "";
	switch (typeTime) {
		case "day":
			date = getLocaleDateTime(updated_at, "date");
			break;
		case "month":
			date = languageText["textRoadMapMonth" + month].replace("%year%", year);
			break;
		case "quarter":
			date = languageText["textRoadMapQuarter" + quarter].replace("%year%", year);
			break;
	}

	return (
		<div className={`roadmap-item ${classesDiv[Number(status)]}`}>
			<div className="roadmap-item__header">
				<h4>{date}</h4>
				<p className="status">
					{languageText["textRoadMapStatus" + status]} {icons[Number(status)]}
				</p>
			</div>
			<div className="roadmap-item__body">
				<p>{discription}</p>
			</div>
			<div className="roadmap-item__fluid">
				<p>HBM</p>
				<p>
					$ {HBM} <span>{percent !== "0%" && percent}</span>
				</p>
			</div>
			<div className="roadmap-item__footer">
				{round && <p className="round">{languageText["textRoadMapRound"] + " " + round}</p>}
				<p>{textRound}</p>
			</div>
		</div>
	);
};
