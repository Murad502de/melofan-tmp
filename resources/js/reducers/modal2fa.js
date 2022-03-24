import {SET_IS_OPEN} from "../actions/modal2fa";

const initialState = {
	isOpen: false,
};

export function modal2faReducer(state = initialState, action) {
	switch (action.type) {
		case SET_IS_OPEN:
			return {...state, isOpen: action.isOpen};
		default:
			return state;
	}
}
