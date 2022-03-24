import {
	SET_ERROR,
	SET_FILTER,
	SET_IS_AUTH,
	SET_IS_OPEN_2FA,
	SET_IS_SHOW_PRELOADER,
	SET_LANGUAGE,
	SET_MESSAGE,
	SET_PAGE,
	SET_PROGRESS,
	SET_SHOW_PROGRESS,
} from "./rootActions";

const initialState = {
	roleId: 0,
	userId: 0,
	isAuth: false,
	isShowPreloader: true,
	progressNumber: 0,
	isShowProgress: false,
	language: [
		// {id: "en", title: "Английский"},
		{id: "ru", title: "Русский"},
	],
	isOpen2fa: false,
	currentPage_users: 0,
	filter_users: {},
	currentPage_operators: 0,
	filter_operators: {},

	currentPage_payments: 0,
	filter_payments: {},

	currentPage_openPayouts: 0,
	filter_openPayouts: {},
	currentPage_closePayouts: 0,
	filter_closePayouts: {},

	currentPage_news: 0,
	filter_news: {},

	currentPage_articles: 0,
	filter_articles: {},

	currentPage_events: 0,
	filter_events: {},

	currentPage_documents: 0,
	filter_documents: {},

	currentPage_roadmap: 0,
	filter_roadmap: {},

	currentPage_securities: 0,
	filter_securities: {},

	currentPage_verify: 0,
	filter_verify: {},

	currentPage_openTickets: 0,
	filter_openTickets: {},
	currentPage_closeTickets: 0,
	filter_closeTickets: {},
	currentPage_workTickets: 0,
	filter_workTickets: {},

	error: null,
	message: null,
};

export function rootReducer(state = initialState, action) {
	switch (action.type) {
		case SET_IS_AUTH:
			return {...state, isAuth: action.isAuth, roleId: action.roleId, userId: action.userId};
		case SET_IS_SHOW_PRELOADER:
			return {...state, isShowPreloader: action.isShowPreloader};
		case SET_IS_OPEN_2FA:
			return {...state, isOpen2fa: action.isOpen2fa};
		case SET_PROGRESS:
			return {...state, progressNumber: action.progress};
		case SET_SHOW_PROGRESS:
			return {
				...state,
				isShowProgress: action.isShowProgress,
				isShowPreloader: action.isShowProgress,
			};
		case SET_LANGUAGE:
			return {...state, language: action.language};
		case SET_PAGE:
			return {...state, ["currentPage_" + action.nameTable]: action.page};
		case SET_FILTER:
			return {...state, ["filter_" + action.nameTable]: action.filter};
		case SET_ERROR:
			return {...state, error: action.error};
		case SET_MESSAGE:
			return {...state, message: action.message};
		default:
			return state;
	}
}
