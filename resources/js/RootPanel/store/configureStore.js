import {combineReducers, createStore} from "redux";
import {rootReducer} from "./rootReducers";

export const indexReducers = combineReducers({
	root: rootReducer,
});

export const store = createStore(indexReducers);
