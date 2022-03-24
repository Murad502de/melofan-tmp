import React, { useEffect, useLayoutEffect, useState } from "react"
import { Col, Container, Form, Row, Tab, Table, Tabs } from "react-bootstrap"
import mastercard from "../../../../images/mastercard.png"
import { ArrowDownTable, FinanceIco, MoneyFadeIco } from "../../other/Svg"
import Selection from "../Selection"
import TabItem from "../Transactions/TabItem"
import { store } from "../../../RootPanel/store/configureStore"
import { useSelector } from "react-redux"
import { useHistory } from "react-router-dom"

const colourOptions = [
    { value: "MasterCard", label: "MasterCard", icon: mastercard },
    { value: "MasterCard2", label: "MasterCard2", icon: mastercard },
    { value: "MasterCard3", label: "MasterCard3", icon: mastercard },
]

const Finance = () => {
    const history = useHistory()

    const [statePayment, setStatePayment] = useState({
        typePay: "",
    })

    const [type, setType] = useState('payments')
    const [finances, setFinances] = useState({
        hbm: 0,
        usd: 0
    })

    const onChangeSelection = e => {
        setStatePayment(statePayment => {
            return { ...statePayment, typePay: e.value }
        })
    }

    const parseFinanceData = () => {
        getRequest('finances').then(function (res) {
            setFinances(res)
        })
    }

    useEffect(function () {
        parseFinanceData()
    })

    const changeTab = k => {
        setType(k)
    }
    const language = useSelector(state => state.languageCurrent.language)

    return (
        <div className="content finance">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <h4 className="content__title">Мои финансы</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} lg={12}>
                        <div className="wrapper-box finance-stats" align="center">
                            <div className="finance-stats__block">
                                <div className="">
                                    <p className="finance-stats__block-text">Мои активы</p>
                                    <p className="finance-stats__block-number">
                                        <MoneyFadeIco /> {Number(finances.hbm.balance).toFixed(0)} <span>HBM</span>
                                    </p>
                                </div>
                                <div className="">
                                    <p className="finance-stats__block-text">Стоимость в USD</p>
                                    <p className="finance-stats__block-number text-gray">≈ $0</p>
                                </div>
                                <div className="">
                                    <p className="finance-stats__block-text">Изменение за 24ч</p>
                                    <p className="finance-stats__block-number warning">0%</p>
                                </div>
                            </div>
                            <div className="finance-stats__block">
                                <div className="">
                                    <p className="finance-stats__block-text">Мой кошелек USD</p>
                                    <p className="finance-stats__block-number">
                                        <FinanceIco className="block-svg" /> ${Number(finances.usd.balance).toFixed(2)}
                                    </p>
                                </div>
                                <div className="">
                                    <p className="finance-stats__block-text">Стоимость в HBM</p>
                                    <p className="finance-stats__block-number text-gray">
                                        ≈ 0 <span>HBM</span>
                                    </p>
                                </div>
                                <div className="">
                                    <p className="finance-stats__block-text">Изменение за 1М</p>
                                    <p className="finance-stats__block-number success">0%</p>
                                </div>
                            </div>
                            <div className="finance-stats__block">
                                <div className="">
                                    <p className="finance-stats__block-text">Мои HBMToken</p>
                                    <p className="finance-stats__block-number">
                                        <FinanceIco className="block-svg" /> 0
                                    </p>
                                </div>
                            </div>
                            <button className="btn-main"
                                onClick={() => history.push('/' + language + '/cabinet/securities')}>Купить HBM
                            </button>
                            <button className="btn-cabinet"
                                onClick={() => history.push('/' + language + '/cabinet/trade')}>Продать HBM
                            </button>
                            <br></br>
                            <button className="btn-main" disabled={true}>Купить HBMToken</button>
                        </div>
                    </Col>
                    <Col xl={6} lg={12}>
                        <div className="wrapper-box">
                            <Tabs defaultActiveKey="top-up" id="finance-tabs" className="cabinet-tabs">
                                <Tab eventKey="top-up" title="Пополнить USD">
                                    <Form className="cabinet-form">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column="true" sm="12" md="4">
                                                Сумма пополнения:
                                            </Form.Label>
                                            <Col sm="12" md="8">
                                                <div className="form-wrapper">
                                                    <Form.Control type="number" />
                                                    <div className="form-wrapper--currency">USD</div>
                                                </div>
                                            </Col>
                                            <small>
                                                Минимальная сумма пополнения: <span>1 USD</span>
                                            </small>
                                        </Form.Group>

                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column="true" sm="12" md="4">
                                                Способ пополнения:
                                            </Form.Label>
                                            <Col column="true" sm="12" md="8">
                                                <Selection
                                                    placeholder="Способ пополнения"
                                                    options={colourOptions}
                                                    value={statePayment.typePay}
                                                    onChange={e => onChangeSelection(e)}
                                                />
                                            </Col>
                                            <small>
                                                Комиссия: <span>0.010 USD</span>
                                            </small>
                                        </Form.Group>
                                        <button className="btn-main d-block mt-3 mx-auto">Пополнить кошелек</button>
                                    </Form>
                                </Tab>
                                <Tab eventKey="withdraw" title="Вывести USD">
                                    <Form className="cabinet-form">
                                        <Form.Group as={Row} controlId="formPlaintextEmail">
                                            <Form.Label column="true" sm="12" md="4">
                                                Сумма вывода:
                                            </Form.Label>
                                            <Col sm="12" md="8">
                                                <div className="form-wrapper">
                                                    <Form.Control type="number" />
                                                    <div className="form-wrapper--currency">USD</div>
                                                </div>
                                            </Col>
                                            <small>
                                                Минимальная сумма вывода: <span>1 USD</span>
                                            </small>
                                        </Form.Group>

                                        <Form.Group as={Row} controlId="formPlaintextPassword">
                                            <Form.Label column="true" sm="12" md="4">
                                                Способ вывода:
                                            </Form.Label>
                                            <Col column="true" sm="12" md="8">
                                                <Selection
                                                    placeholder="Способ вывода"
                                                    options={colourOptions}
                                                    value={statePayment.typePay}
                                                    onChange={e => onChangeSelection(e)}
                                                />
                                            </Col>
                                            <small>
                                                Комиссия: <span>0.010 USD</span>
                                            </small>
                                        </Form.Group>
                                        <button className="btn-main d-block mt-3 mx-auto">Вывести</button>
                                    </Form>
                                </Tab>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col lg={12}>
                        <div className="wrapper-box">
                            <Tabs id="finance-tabs" className="cabinet-tabs" defaultActiveKey="payments"
                                onSelect={(k) => changeTab(k)}>
                                <Tab eventKey="payments" title="История пополнений">
                                    <TabItem type={type} />
                                </Tab>
                                <Tab eventKey="payouts" title="История вывода">
                                    <TabItem type={type} />
                                </Tab>
                            </Tabs>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Finance
