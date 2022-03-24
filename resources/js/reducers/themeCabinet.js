import {SET_NAME_THEME} from "../actions/themeCabinet";

const initialState = {
	name: "dark",
};

export function themeCabinetReducer(state = initialState, action) {
	switch (action.type) {
		case SET_NAME_THEME:
			return {name: action.name};
		default:
			return state;
	}
}
