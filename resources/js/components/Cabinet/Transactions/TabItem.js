import { KeyboardDatePicker } from "@material-ui/pickers"
import { Table } from "react-bootstrap"
import { ArrowDownTable } from "../../other/Svg"
import Pagination from "../../other/Pagination"
import React, { useEffect, useState } from "react"

export default function TabItem(props) {
    const [ transactions, setTransactions ] = useState([])
    const [ total, setTotal ] = useState(0)
    const [ page, setPage ] = useState(1)
    const [ period, setPeriod ] = useState(1)
    const [ pickerStart, setPickerStart ] = useState(null)
    const [ pickerStartValue, setPickerStartValue ] = useState(null)
    const [ pickerEnd, setPickerEnd ] = useState(null)
    const [ pickerEndValue, setPickerEndValue ] = useState(null)


    const setDates = (date, value, periodType) => {
        if ( periodType === 'start' ) {
            setPickerStart(date)
            setPickerStartValue(value)
        } else {
            setPickerEnd(value)
            setPickerEndValue(value)
        }
    }


    const getPosts = () => {
        let datePeriod = pickerStartValue && pickerEndValue ? pickerStartValue + '|' + pickerEndValue : period
        getRequest('transactions?type=' + props.type + '&page=' + page + '&period=' + datePeriod).then(function (res) {
            if ( res.data ) {
                setTransactions(res.data)
                setTotal(res.total)
            } else {
                setTransactions([])
            }
        })
    }

    useEffect(function () {
        setTransactions([]);
        getPosts()
    }, [ props.type, pickerEndValue, pickerStartValue, page, period ])

    const statuses = {
        refuse: {
            color: 'denied',
            value: 'Отказано'
        },
        success: {
            color: 'success',
            value: 'Завершено'
        },
        pending: {
            color: 'during',
            value: 'В ожидании'
        },
    }

    const types = {
        payment: {
            label: 'Пополнение',
            color: 'success',
        },
        payout: {
            label: 'Вывод',
            color: 'warning',
        },
    }

    const table = transactions.map((item, key) => parseItems(item, key))

    function parseItems(item, key) {
        let statusItems = statuses[ item.status ]
        let field = props.type === 'payments' ? item.transaction_number : item.wallet_number

        return (
            <tr key={key}>
                <td className={types[ item.type ].color}>{types[ item.type ].label}</td>
                <td>{item.created_at}</td>
                <td>{item.amount + ' ' + item.currency}</td>
                <td>{item.system}</td>
                <td>{field}</td>
                <td className={statusItems.color}>{statusItems.value}</td>
            </tr>
        )
    }


    const getLabel = () => {
        return props.type === 'payment' ? 'Номер транзакции' : 'Номер кошелька'
    }

    return (
        <div>
            <div className="cabinet-tabs-time">
                <button className={period === 1 ? 'nav-link active' : 'nav-link'}
                        onClick={event => setPeriod(1)}>1 День
                </button>
                <button className={period === 7 ? 'nav-link active' : 'nav-link'}
                        onClick={event => setPeriod(7)}>1 Неделя
                </button>
                <button className={period === 30 ? 'nav-link active' : 'nav-link'}
                        onClick={event => setPeriod(30)}>1 месяц
                </button>
                <button className={period === 90 ? 'nav-link active' : 'nav-link'}
                        onClick={event => setPeriod(90)}>3 Месяца
                </button>

                <div className="d-flex align-items-center flex-wrap">
                    <div className="date-cabinet">
                        <KeyboardDatePicker
                            variant="inline"
                            className="datapicker-table"
                            openTo="year"
                            views={[ "year", "month", "date" ]}
                            format="dd.MM.yyyy"
                            id="date-picker-inline"
                            placeholder
                            value={pickerStart}
                            onChange={(date, value) => setDates(date, value, 'start')}
                            required
                            emptyLabel="Выберите дату"
                        />
                    </div>
                    <span className="line-data"></span>
                    <div className="date-cabinet">
                        <KeyboardDatePicker
                            variant="inline"
                            className="datapicker-table"
                            openTo="year"
                            views={[ "year", "month", "date" ]}
                            value={pickerEnd}
                            onChange={(date, value) => setDates(date, value, 'end')}
                            format="dd.MM.yyyy"
                            id="date-picker-inline"
                            emptyLabel="Выберите дату"
                            required
                        />
                    </div>
                </div>
            </div>
            <Table responsive className="cabinet-table" hover size="sm">
                <thead>
                <tr>
                    <th>
                        Тип <ArrowDownTable/>
                    </th>
                    <th>
                        Время <ArrowDownTable/>
                    </th>
                    <th style={{ minWidth: "65px" }}>
                        Сумма <ArrowDownTable/>
                    </th>
                    <th
                        style={{
                            minWidth: "148px",
                        }}>
                        Платежная система <ArrowDownTable/>
                    </th>
                    <th>
                        {getLabel} <ArrowDownTable/>
                    </th>
                    <th>
                        Статус <ArrowDownTable/>
                    </th>
                </tr>
                </thead>

                <tbody>
                {table}
                </tbody>

            </Table>
            <Pagination currentPage={page} countPerPage={10} countRows={total} changeCurrentPage={setPage}/>
        </div>
    )
}
