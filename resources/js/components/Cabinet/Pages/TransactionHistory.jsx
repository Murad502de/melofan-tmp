import React, { useEffect, useState } from "react"
import {Col, Container, Row, Tab, Table, Tabs} from "react-bootstrap";
import Transactions from "../Transactions"

const TransactionHistory = () => {
	return (
		<div className="content finance">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<h4 className="content__title">История транзакций</h4>
					</Col>
				</Row>
			</Container>
            <Transactions/>
		</div>
	);
};

export default TransactionHistory;
