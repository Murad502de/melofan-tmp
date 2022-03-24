import {SET_ERROR, SET_MESSAGE} from "../actions/notification";

const initialState = {
	error: null,
	message: null,
};

export function notificationReducer(state = initialState, action) {
	switch (action.type) {
		case SET_ERROR:
			return {...state, error: action.error};
		case SET_MESSAGE:
			return {...state, message: action.message};
		default:
			return state;
	}
}
