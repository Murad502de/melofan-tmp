import React from "react";
import {Route, Switch} from "react-router-dom";

import LandingLayoutRoute from "./LandingLayoutRoute";
//pages
import Main from "../Pages/Main";
import AboutMelofan from "../Pages/AboutMelofan";
import BoardOfDirectors from "../Pages/BoardOfDirectors";
import Documents from "../Pages/Documents";
import Events from "../Pages/Events";
import News from "../Pages/News/News";
import ItemArticle from "../Pages/Articles/ItemArticle";
import SignIn from "../../Auth/SignIn";
import SignUp from "../../Auth/SignUp";
import Recovery from "../../Auth/Recovery";
import NotFound from "../../other/NotFound";
import PrivacyPolicy from "../Pages/Privacy-policy";
import TermsOfUse from "../Pages/Terms-of-use";
import AML from "../Pages/AML";
import Contacts from "../Pages/Contacts";
import Articles from "../Pages/Articles/Articles";
import ItemNews from "../Pages/News/ItemNews";
import Unsubscribing from "../Pages/Unsubscribing";

import {useSelector} from "react-redux";

const LandingRoutes = () => {
    const language = useSelector(state => state.languageCurrent.language);

    return (
        <>
            <Switch>
                <LandingLayoutRoute exact path={["/" + language, "/" + language + "/"]} component={Main}/>
                <LandingLayoutRoute exact path={"/" + language + "/about"} component={AboutMelofan}/>
                <LandingLayoutRoute
                    exact
                    path={"/" + language + "/board-of-directors"}
                    component={BoardOfDirectors}
                />
                <LandingLayoutRoute exact path={"/" + language + "/documents"} component={Documents}/>
                <LandingLayoutRoute exact path={"/" + language + "/events"} component={Events}/>
                <LandingLayoutRoute exact path={"/" + language + "/news"} component={News}/>
                <LandingLayoutRoute exact path={"/" + language + "/news/:id"} component={ItemNews}/>
                <LandingLayoutRoute exact path={"/" + language + "/articles"} component={Articles}/>
                <LandingLayoutRoute exact path={"/" + language + "/article/:id"} component={ItemArticle}/>
                <LandingLayoutRoute exact path={"/" + language + "/privacy-policy"} component={PrivacyPolicy}/>
                <LandingLayoutRoute exact path={"/" + language + "/terms-of-use"} component={TermsOfUse}/>
                <LandingLayoutRoute exact path={"/" + language + "/aml"} component={AML}/>
                <LandingLayoutRoute exact path={"/" + language + "/contacts"} component={Contacts}/>

                <LandingLayoutRoute exact path={"/" + language + "/signin"} component={SignIn}/>
                <LandingLayoutRoute exact path={"/" + language + "/verify/:verification_code"} component={SignIn}/>

                <LandingLayoutRoute exact path={"/" + language + "/signup"} component={SignUp}/>
                <LandingLayoutRoute exact path={"/" + language + "/ref/:mentor"} component={SignUp}/>

                <LandingLayoutRoute exact path={"/" + language + "/recovery"} component={Recovery}/>
                <LandingLayoutRoute
                    exact
                    path={"/" + language + "/recovery/:verification_code"}
                    component={Recovery}
                />
                <LandingLayoutRoute exact path={"/" + language + "/unsubscribing"} component={Unsubscribing}/>

                <Route exact path={["/" + language + "/cabinet", "/" + language + "/cabinet/*"]}/>
                <LandingLayoutRoute exact path={"/" + language + "/*"} component={NotFound}/>
            </Switch>
        </>
    );
};

export default LandingRoutes;
