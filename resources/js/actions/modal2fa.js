export const SET_IS_OPEN = "SET_IS_OPEN";

export function setIsOpen(isOpen) {
	return {
		type: SET_IS_OPEN,
		isOpen,
	};
}
