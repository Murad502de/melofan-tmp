import {SET_IS_SHOW_PRELOADER, SET_PROGRESS, SET_SHOW_PROGRESS} from "../actions/preloader";

const initialState = {
	isShowPreloader: true,
	progressNumber: 0,
	isShowProgress: false,
};

export function preloaderReducer(state = initialState, action) {
	switch (action.type) {
		case SET_IS_SHOW_PRELOADER:
			return {isShowPreloader: action.isShowPreloader};
		case SET_PROGRESS:
			return {...state, progressNumber: action.progress};
		case SET_SHOW_PROGRESS:
			return {
				...state,
				isShowProgress: action.isShowProgress,
				isShowPreloader: action.isShowProgress,
			};
		default:
			return state;
	}
}
