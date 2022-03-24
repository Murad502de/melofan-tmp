import React, {Fragment, useEffect, useState} from "react";
import {BrowserRouter as Router, Redirect, Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {store} from "../store/configureStore";
import {useSelector} from "react-redux";
import {setLanguage, setTextLanguage} from "../actions/language";
import {setIsShowPreloader} from "../actions/preloader";
import Preloader from "./other/Preloader";
import LandingRoutes from "./Landing/router";
import CabinetRoutes from "./Cabinet/router";
import {setAllDataUser} from "../actions/user";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {setError, setMessage} from "../actions/notification";
import NotFound from "./other/NotFound";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";
import deLocale from "date-fns/locale/de";
import esLocale from "date-fns/locale/es";
import plLocale from "date-fns/locale/pl";
import uzLocale from "date-fns/locale/uz";
import zhLocale from "date-fns/locale/zh-CN";
import kkLocale from "date-fns/locale/kk";
import {MuiPickersUtilsProvider} from "@material-ui/pickers";
import Modal2FA from "./Auth/Modal2FA";
import { setReferral } from "../actions/referral"

import {setNameTheme} from "../actions/themeCabinet"; // DELETE

const localeMap = {
    en: enLocale,
    fr: frLocale,
    ru: ruLocale,
    de: deLocale,
    kz: kkLocale,
    es: esLocale,
    pl: plLocale,
    uz: uzLocale,
    zh: zhLocale,
};

function App() {
    const [loading, setLoading] = useState(false);
    const arrayLanguage = useSelector(state => state.languageCurrent.arrayLanguage);
    const language = useSelector(state => state.languageCurrent.language);
    const message = useSelector(state => state.notification.message);
    const error = useSelector(state => state.notification.error);

    const getRequestParam = (param) => {
        let url = new URL(window.location);
        return  url.searchParams.get(param) == undefined ? null :  url.searchParams.get(param);
    }

    useEffect(() => {
        let languageURL = document.location.pathname.substring(1, 3);

        let ref  = getRequestParam('ref');
        console.log(ref)
        if( ref ) {
            localStorage.setItem("referral", ref);
            store.dispatch(setReferral(ref))
        }


        let language;
        if ((localStorage.selectedLanguage || languageURL) && localStorage.selectedLanguage === languageURL) {
            store.dispatch(setLanguage(localStorage.selectedLanguage));
            store.dispatch(setTextLanguage(localStorage.selectedLanguage));
            language = localStorage.selectedLanguage;
        } else if (languageURL) {
            localStorage.setItem("selectedLanguage", languageURL);
            store.dispatch(setLanguage(languageURL));
            store.dispatch(setTextLanguage(languageURL));
            language = languageURL;
        } else {
            language = window.navigator ? window.navigator.language : "en";
            language = language.substr(0, 2).toLowerCase();
            let triggerLanguages = arrayLanguage.map((item, index) => (item[index] = item.id), {});
            language = triggerLanguages.includes(language) ? language : "en";

            localStorage.setItem("selectedLanguage", languageURL);
            store.dispatch(setLanguage(language));
            store.dispatch(setTextLanguage(language));
        }

        if (localStorage.usertoken) {
            postRequest("changeLanguage", {language});
            postRequest("profile")
                .then(res => {
                    if (res.success) {
                        store.dispatch(setAllDataUser({...res.user, token: localStorage.usertoken}));
                        store.dispatch(setIsShowPreloader(false));
                        setLoading(true);
                    } else {
                        localStorage.removeItem("usertoken");
                        store.dispatch(setIsShowPreloader(false));
                        setLoading(true);
                    }
                })
                .catch(err => {
                    localStorage.removeItem("usertoken");
                    store.dispatch(setIsShowPreloader(false));
                    setLoading(true);
                });

            if ( !localStorage.uiTheme )
            {
                console.log( 'es gibt nicht uiTheme' ); // DELETE

                postRequest("getTheme").then(res => { // DELETE
                    if ( res.success )
                    {
                        let name = res.name ? res.name : "";

                        store.dispatch( setNameTheme( name ) );

                        if( name )
                        {
                            localStorage.setItem( "uiTheme", name );
                        }
                        else
                        {
                            localStorage.setItem( "uiTheme", 'bright' );
                        }
                    }
                });
            }
            else if ( localStorage.uiTheme === 'dark' )
            {
                store.dispatch( setNameTheme( 'dark' ) );
            }
            else if ( localStorage.uiTheme === 'bright' )
            {
                store.dispatch( setNameTheme( '' ) );
            }
        } else {
            localStorage.removeItem("usertoken");
            store.dispatch(setIsShowPreloader(false));
            setLoading(true);
        }
    }, []);

    const closeError = () => {
        store.dispatch(setError(null));
    };
    const closeMessage = () => {
        store.dispatch(setMessage(null));
    };

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeMap[language]}>
            <Fragment>
                <Preloader/>
                {loading && (
                    <Router>
                        <Modal2FA/>
                        <Switch>
                            <Route path={["/en", "/en/*"]}>
                                <Route exact path={["/en/cabinet", "/en/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/en", "/en/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/de", "/de/*"]}>
                                <Route exact path={["/de/cabinet", "/de/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/de", "/de/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/fr", "/fr/*"]}>
                                <Route exact path={["/fr/cabinet", "/fr/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/fr", "/fr/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/pl", "/pl/*"]}>
                                <Route exact path={["/pl/cabinet", "/pl/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/pl", "/pl/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/es", "/es/*"]}>
                                <Route exact path={["/es/cabinet", "/es/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/es", "/es/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/ru", "/ru/*"]}>
                                <Route exact path={["/ru/cabinet", "/ru/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/ru", "/ru/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/kz", "/kz/*"]}>
                                <Route exact path={["/kz/cabinet", "/kz/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/kz", "/kz/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/uz", "/uz/*"]}>
                                <Route exact path={["/uz/cabinet", "/uz/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/uz", "/fr/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route path={["/zh", "/zh/*"]}>
                                <Route exact path={["/zh/cabinet", "/zh/cabinet/*"]} component={CabinetRoutes}/>
                                <Route exact path={["/zh", "/zh/*"]} component={LandingRoutes}/>
                            </Route>

                            <Route exact path="/">
                                <Redirect to={language + "/"}/>
                            </Route>
                            <Route path="*">
                                <NotFound/>
                            </Route>
                        </Switch>
                    </Router>
                )}
                <Snackbar open={error != null} onClose={closeError}>
                    <Alert align="center" variant="filled" onClose={closeError} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
                <Snackbar open={message != null} onClose={closeMessage}>
                    <Alert align="center" variant="filled" onClose={closeMessage} severity="success">
                        {message}
                    </Alert>
                </Snackbar>
            </Fragment>
        </MuiPickersUtilsProvider>
    );
}

export default App;
