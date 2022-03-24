import { useSelector } from "react-redux"
import React, { useEffect, useState } from "react"
import { store } from "../../../store/configureStore"
import { setIsShowPreloader } from "../../../actions/preloader"
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap"
import Pagination from "../../other/Pagination"
import PartnersTable from "./Partners/table"

const Pages = () => {
    const [ users, setUsers ] = useState([])
    const [ tab, changeTab ] = useState('first')
    const [ total, setTotal ] = useState(0)
    const [ page, setPage ] = useState(1)

    const parsePartners = () => {
        getRequest(`my-partners/${tab}?page=` + page).then(function (res) {
            if ( res ) {
                setUsers(res.data)
                setTotal(res.total)
            }
        })
    }
    useEffect(() => {
        parsePartners()
        store.dispatch(setIsShowPreloader(false))
    }, [ tab, page ])

    return (
        <div className="content notification-page">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <h4 className="content__title">Партнеры</h4>
                    </Col>

                    <Tabs defaultActiveKey="first" onSelect={(k) => changeTab(k)} id="transaction-history-tabs"
                          className="cabinet-tabs cabinet-history-tabs">
                        <Tab eventKey="first" title="1 Линия">
                            <PartnersTable users={users}/>
                        </Tab>
                        <Tab eventKey="second" title="2 Линия">
                            <PartnersTable users={users} line={tab}/>
                        </Tab>
                    </Tabs>

                    <Pagination currentPage={page} countPerPage={15} countRows={total} changeCurrentPage={setPage}/>
                </Row>

            </Container>
        </div>
    )
}

export default Pages
