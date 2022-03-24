import React, {useEffect, useState} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {useSelector} from "react-redux";
import Table from "../Table/Table";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";

const Notification = () => {
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);
	const userId = useSelector(state => state.user.id);

	const [updateRowsTable, setUpdateRowsTable] = useState(false);
	const [echoRowsTable, setEchoRowsTable] = useState(null);

	useEffect(() => {
		window.laravelEcho.private(`allUsers`).listen("Notifications.SendAllUser", res => {
			setEchoRowsTable({
				propertySearch: {notification: "id"},
				rows: {notification: res.message},
				events: {notification: "add"},
			});
		});
		window.laravelEcho.private(`user.${userId}`).listen("Notifications.Send", res => {
			setEchoRowsTable({
				propertySearch: {notification: "id"},
				rows: {notification: res.message},
				events: {notification: "add"},
			});
		});
		store.dispatch(setIsShowPreloader(false));
	}, []);

	return (
		<div className="content notification-page">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<h4 className="content__title">{languageText["notification1"]}</h4>
					</Col>
				</Row>
				<Table
					tabs={[{id: "notification", name: languageText["notification2"]}]}
					headCells={{
						notification: [
							{
								id: "date",
								name: languageText["notification3"],
								type: "datetime",
								style: {width: "200px"},
							},
							{id: "message", name: languageText["notification4"], type: "string"},
						],
					}}
					defaultSortIdCell={{notification: "date"}}
					defaultSortAsc={{notification: "desc"}}
					errorGetDataTable={{notification: "getTableError"}}
					updateRows={updateRowsTable}
					setUpdateRows={updateRowsTable => setUpdateRowsTable(updateRowsTable)}
					echoRows={echoRowsTable}
					setEchoRows={echoRowsTable => setEchoRowsTable(echoRowsTable)}
					conditionalColumnClassName={{notification: "isRead"}}
					equalityValueClassName={{notification: 0}}
					classNameRow={{notification: "new-notification"}}
				/>
			</Container>
		</div>
	);
};

export default Notification;
