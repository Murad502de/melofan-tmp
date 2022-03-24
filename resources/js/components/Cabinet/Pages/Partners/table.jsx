import { Table } from "react-bootstrap"
import { ArrowDownTable } from "../../../other/Svg"
import React from "react"

export default function PartnersTable(props) {
    console.log(props.users)
    return (

        <Table responsive className="cabinet-table" hover size="sm">
            <thead>
            <tr>
                {props.line === 'second' ?
                    (
                    <th>
                        Имя пригласившего <ArrowDownTable/>
                    </th>
                    )
                    : ''}

                <th>
                    Имя <ArrowDownTable/>
                </th>
                <th style={{ minWidth: "65px" }}>
                    E-mail <ArrowDownTable/>
                </th>
                <th>
                    Номер телефона <ArrowDownTable/>
                </th>
                <th>
                    Дата регистрации <ArrowDownTable/>
                </th>
            </tr>
            </thead>

            <tbody>
            {props.users.map(function (item, key) {
                return (
                    <tr key={key}>
                        {props.line === 'second' ?
                            (<td>{item.broker.firstName + ' ' + item.broker.lastName}</td>)
                         : ''}

                        <td>{item.firstName + ' ' + item.lastName}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.created_at}</td>
                    </tr>
                )
            })}

            </tbody>

        </Table>
    );

}
