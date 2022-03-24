import {combineReducers} from "redux";
import {languageReducer} from "./language";
import {preloaderReducer} from "./preloader";
import {userReducer} from "./user";
import {notificationReducer} from "./notification";
import {modal2faReducer} from "./modal2fa";
import {themeCabinetReducer} from "./themeCabinet";
import { referralReducer } from "./referral"

export const rootReducer = combineReducers({
	referral: referralReducer,
	languageCurrent: languageReducer,
	preloader: preloaderReducer,
	user: userReducer,
	notification: notificationReducer,
	modal2fa: modal2faReducer,
	themeCabinet: themeCabinetReducer,
});
