export const SET_IS_SHOW_PRELOADER = "SET_IS_SHOW_PRELOADER";
export const SET_PROGRESS = "SET_PROGRESS";
export const SET_SHOW_PROGRESS = "SET_SHOW_PROGRESS";

export function setIsShowPreloader(isShowPreloader) {
	return {
		type: SET_IS_SHOW_PRELOADER,
		isShowPreloader,
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
