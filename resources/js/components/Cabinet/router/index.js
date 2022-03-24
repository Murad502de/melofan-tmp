import React from "react";
import "../Cabinet.scss";
import {Switch} from "react-router-dom";
import CabinetLayoutRoute from "./CabinetLayoutRoute";
//pages
import Finance from "../Pages/Finance";
import Securities from "../Pages/Securities";
import Trade from "../Pages/Trade";
import TransactionHistory from "../Pages/TransactionHistory";
import Verification from "../Pages/Verification";
import Faq from "../Pages/Faq";
import Settings from "../Pages/Settings/Settings";
import NotFound from "../../other/NotFound";
import Support from "../Pages/Tickets/Support";
import DialogOpen from "../Pages/Tickets/DialogOpen";
import Notification from "../Pages/Notification";
import Partners from "../Pages/Partners";
import {useSelector} from "react-redux";

const CabinetRoutes = () => {
    const language = useSelector(state => state.languageCurrent.language);
    const statusKYC = useSelector(state => state.user.statusKYC);

    return (
        <>
            <Switch>
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/finance"]}
                    component={Finance}
                />
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/securities"]}
                    component={Securities}
                />
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/trade"]}
                    component={Trade}
                />
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/partners"]}
                    component={Partners}
                />
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/transaction-history"]}
                    component={TransactionHistory}
                />
                {(statusKYC === 0 || statusKYC === 2 || statusKYC === 4) && (
                    <CabinetLayoutRoute
                        role={[0, 2, 4]}
                        exact
                        path={["/" + language + "/cabinet/verification"]}
                        component={Verification}
                    />
                )}
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/faq"]}
                    component={Faq}
                />
                <CabinetLayoutRoute
                    role={[0, 1, 2, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/support"]}
                    component={Support}
                />
                <CabinetLayoutRoute
                    role={[0, 1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/dialog-open/:id"]}
                    component={DialogOpen}
                />
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/notification"]}
                    component={Notification}
                />
                <CabinetLayoutRoute
                    role={[1, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet/settings"]}
                    component={Settings}
                />

                <CabinetLayoutRoute
                    role={[0, 1, 2, 3, 4, 5]}
                    exact
                    path={["/" + language + "/cabinet", "/" + language + "/cabinet/*"]}
                    component={NotFound}
                />
            </Switch>
        </>
    );
};

export default CabinetRoutes;
