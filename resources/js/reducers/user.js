import {
	SET_ALL_DATA_USER,
	SET_AVATAR,
	SET_BALANCE,
	SET_BALANCE_MLFN,
	SET_BALANCE_USD,
	SET_CASH,
	SET_STATUS_KYC,
} from "../actions/user";

const initialState = {
	token: null,
	id: 0,
	role_id: null,
	balanceUSD: 0,
	balanceMLFN: 0,
	firstName: "",
	lastName: "",
	avatar: "",
	email: "",
	statusKYC: 0,
	payeer: "",
};

export function userReducer(state = initialState, action) {
	switch (action.type) {
		case SET_CASH:
			return {
				...state,
				payeer: action.payeer,
			};

		case SET_ALL_DATA_USER:
			return {
				...state,
				token: action.token,
				id: action.id,
				role_id: action.role_id,
				balanceUSD: action.balanceUSD,
				balanceMLFN: action.balanceMLFN,
				firstName: action.firstName,
				lastName: action.lastName,
				avatar: action.avatar,
				email: action.email,
				statusKYC: action.statusKYC,
				payeer: action.payeer,
			};

		case SET_STATUS_KYC:
			return {
				...state,
				statusKYC: action.statusKYC,
			};

		case SET_AVATAR:
			return {
				...state,
				avatar: action.avatar,
			};

		case SET_BALANCE:
			return {
				...state,
				balanceUSD: action.balanceUSD,
				balanceMLFN: action.balanceMLFN,
			};

		case SET_BALANCE_USD:
			return {
				...state,
				balanceUSD: action.balanceUSD,
			};
		case SET_BALANCE_MLFN:
			return {
				...state,
				balanceMLFN: action.balanceMLFN,
			};

		default:
			return state;
	}
}
