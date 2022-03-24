import {store} from "../store/configureStore";

export const SET_ALL_DATA_USER = "SET_ALL_DATA_USER";
export const SET_BALANCE = "SET_BALANCE";
export const SET_BALANCE_USD = "SET_BALANCE_USD";
export const SET_BALANCE_MLFN = "SET_BALANCE_MLFN";
export const SET_AVATAR = "SET_AVATAR";
export const SET_CASH = "SET_CASH";
export const SET_STATUS_KYC = "SET_STATUS_KYC";

export function setBalance(balanceUSD, balanceMLFN) {
	return {
		type: SET_BALANCE,
		balanceUSD,
		balanceMLFN,
	};
}

export function setBalanceUSD(balanceUSD) {
	return {
		type: SET_BALANCE_USD,
		balanceUSD,
	};
}

export function setBalanceMLFN(balanceMLFN) {
	return {
		type: SET_BALANCE_MLFN,
		balanceMLFN,
	};
}

export function setAvatar(avatar) {
	return {
		type: SET_AVATAR,
		avatar,
	};
}

export function setCash(data) {
	return {
		type: SET_CASH,
		payeer: data.payeer,
	};
}

export function setAllDataUser(user) {
	return {
		type: SET_ALL_DATA_USER,
		id: user.id,
		role_id: user.role_id,
		balanceUSD: user.balanceUSD,
		balanceMLFN: user.balanceMLFN,
		avatar: user.avatar,
		lastName: user.lastName,
		firstName: user.firstName,
		email: user.email,
		statusKYC: user.statusKYC,
		payeer: user.payeer,
	};
}

export function setStatusKYC(statusKYC) {
	return {
		type: SET_STATUS_KYC,
		statusKYC,
	};
}

export function replaceAuth(response) {
	if (
		response &&
		response.status &&
		(response.status === 401 || response.status === 403 || response.statusText === "Unauthorized")
	) {
		localStorage.removeItem("usertoken");
		document.location.replace(window.location.origin + "/" + store.getState().languageCurrent.language + "/signin");
	}
}
