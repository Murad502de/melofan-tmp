export const SET_IS_SHOW_PRELOADER = "SET_IS_SHOW_PRELOADER";
export const SET_IS_AUTH = "SET_IS_SHOW_ADMIN_PRELOADER";
export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_PROGRESS = "SET_PROGRESS";
export const SET_SHOW_PROGRESS = "SET_SHOW_PROGRESS";
export const SET_PAGE = "SET_PAGE";
export const SET_FILTER = "SET_FILTER";
export const SET_IS_OPEN_2FA = "SET_IS_OPEN_2FA";
export const SET_MESSAGE = "SET_MESSAGE";
export const SET_ERROR = "SET_ERROR";

export function setIsAuth(isAuth, roleId, userId, token) {
	return {
		type: SET_IS_AUTH,
		isAuth,
		roleId,
		userId,
		token,
	};
}

export function setIsShowPreloader(isShowPreloader) {
	return {
		type: SET_IS_SHOW_PRELOADER,
		isShowPreloader,
	};
}

export function setLanguage(language) {
	return {
		type: SET_LANGUAGE,
		language,
	};
}

export function setPage(page, nameTable) {
	return {
		type: SET_PAGE,
		page,
		nameTable,
	};
}

export function setFilter(filter, nameTable) {
	return {
		type: SET_FILTER,
		filter,
		nameTable,
	};
}

export function setProgress(progress) {
	return {
		type: SET_PROGRESS,
		progress,
	};
}

export function setIsShowProgress(isShowProgress) {
	return {
		type: SET_SHOW_PROGRESS,
		isShowProgress,
	};
}

export function setIsOpen2fa(isOpen2fa) {
	return {
		type: SET_IS_OPEN_2FA,
		isOpen2fa,
	};
}

export function setError(error) {
	return {
		type: SET_ERROR,
		error,
	};
}

export function setMessage(message) {
	return {
		type: SET_MESSAGE,
		message,
	};
}
