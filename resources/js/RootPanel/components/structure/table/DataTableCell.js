import React, {Component} from "react";
import Switch from "@material-ui/core/Switch";
import TableCell from "@material-ui/core/TableCell";
import {getLocaleDateTime} from "../../../actions/time";

const roles = {
	"user": "Пользователь",
	"broker": "Брокер",
	"ticket_operator": "Оператор тикетов",
	"payout_operator": "Оператор выплат",
	"admin": "Администратор",
};

const statusSecurities = {
	"0": "В процессе",
	"1": "Завершено",
};

class DataTableCell extends Component {
	render() {
		const {row, headCell} = this.props;

		let alignCell = "";
		let elemCell = "";
		switch (headCell.type) {
			case "numeric":
				alignCell = "right";
				elemCell = Number(row[headCell.id]).toLocaleString();

				break;
			case "image":
				alignCell = "center";
				elemCell = <img height="200px" src={row[headCell.id]} alt="IMAGE" />;

				break;
			case "boolean":
				alignCell = "center";
				elemCell = (
					<Switch
						checked={row[headCell.id] == "1"}
						color="primary"
						inputProps={{"aria-label": "primary checkbox"}}
					/>
				);

				break;
			case "money":
				alignCell = "right";
				elemCell =
					row["currency"] && row["currency"] === "BTC"
						? Number(row[headCell.id]).toFixed(8)
						: Number(row[headCell.id]).toFixed(2);

				break;
			case "link":
				alignCell = "left";
				elemCell = (
					<a href={row[headCell.id]} target="_blank">
						{row[headCell.id]}
					</a>
				);

				break;
			case "datetime":
				alignCell = "right";
				elemCell = getLocaleDateTime(row[headCell.id]);

				break;

			case "date":
				alignCell = "right";
				elemCell = getLocaleDateTime(row[headCell.id], "date");

				break;
			case "role":
				alignCell = "left";
				elemCell = roles[row[headCell.id]];

				break;
			case "statusSecurities":
				alignCell = "left";
				elemCell = statusSecurities[row[headCell.id]];

				break;
			case "dateRoadmap":
				alignCell = "left";
				switch (row["typeTime"]) {
					case "day":
						elemCell = getLocaleDateTime(row[headCell.id]);
						break;
					case "month":
						let arrayMonth = {
							1: "Январь",
							2: "Февраль",
							3: "Март",
							4: "Апрель",
							5: "Май",
							6: "Июнь",
							7: "Июль",
							8: "Август",
							9: "Сентябрь",
							10: "Октябрь",
							11: "Ноябрь",
							12: "Декабрь",
						};
						let month = arrayMonth[row["month"]];
						elemCell = month + " " + row["year"] + "г.";
						break;
					case "quarter":
						elemCell = row["quarter"] + " квартал " + row["year"] + "г.";
						break;
				}

				break;
			case "percent":
				alignCell = "right";
				elemCell = row[headCell.id] + "%";
				break;
			case "percentRoadmap":
				alignCell = "right";
				elemCell = Number(row[headCell.id]);
				if (row[headCell.id] == 0) {
					elemCell = row["amount"] > 0 ? "+100%" : "0%";
				} else {
					elemCell = Math.round((row["amount"] / row[headCell.id]) * 100 - 100);
					elemCell = elemCell > 0 ? "+" + elemCell + "%" : elemCell + "%";
				}
				break;
			default:
				alignCell = "left";
				elemCell = <div dangerouslySetInnerHTML={{__html: row[headCell.id]}} />;

				break;
		}

		return <TableCell align={alignCell}>{elemCell}</TableCell>;
	}
}

export default DataTableCell;
