export const SET_MESSAGE = "SET_MESSAGE";
export const SET_ERROR = "SET_ERROR";

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
