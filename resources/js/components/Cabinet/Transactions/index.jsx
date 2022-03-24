import { Col, Row, Tab, Table, Tabs } from "react-bootstrap"
import { KeyboardDatePicker } from "@material-ui/pickers"
import { ArrowDownTable } from "../../other/Svg"
import Pagination from "../../other/Pagination"
import React, { useEffect, useState } from "react"
import Container from "@material-ui/core/Container"
import TabItem from './TabItem';

export default function Transactions(props) {
    const [ type, setType ] = useState('payments')

    const changeTab = k => {
        setType(k);
    }

    return (
        <Container fluid={+true}>
            <Row>
                <Col lg={12}>
                    <div className="wrapper-box">
                        <Tabs defaultActiveKey="payments" onSelect={(k) => changeTab(k)} id="transaction-history-tabs"
                              className="cabinet-tabs cabinet-history-tabs">
                            <Tab eventKey="payments" title="Пополнения">
                                <TabItem type={type}/>
                            </Tab>
                            <Tab eventKey="payouts" title="Выводы">
                                <TabItem
                                    type={type}
                                />
                            </Tab>
                            <Tab eventKey="purchase" title="Покупки">
                                <TabItem
                                    type={type}
                                />
                            </Tab>
                            <Tab eventKey="trade" title="Торговля">
                                <TabItem
                                    type={type}
                                />
                            </Tab>
                        </Tabs>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}


