export const SET_NAME_THEME = "SET_NAME_THEME";

export function setNameTheme(name) {
	return {
		type: SET_NAME_THEME,
		name,
	};
}
