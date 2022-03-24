import axios from "axios";

window.postRequest = (route, data = {}, headers = {"Content-Type": "application/json"}, onUploadProgress = null) => {
	if (localStorage.admintoken && headers["Content-Type"] === "application/json") {
		data = {...data, token: localStorage.admintoken};
	}

	let configRequest = {};
	if (onUploadProgress) {
		configRequest = {
			headers: headers,
			onUploadProgress: onUploadProgress,
		};
	} else {
		configRequest = {headers: headers};
	}

	return axios
		.post("/root-panel/api/" + route, data, configRequest)
		.then(res => {
			if (res.data.success) {
				return Promise.resolve(res.data);
			} else {
				if (res.data.error === "999") {
					alert("Technical update");
				} else {
					return Promise.resolve(res.data);
				}
			}
		})
		.catch(err => {
			replaceAuth(err.response);
			return Promise.reject(err);
		});
};

window.getRequest = route => {
	return axios
		.get("/root-panel/api/" + route, {
			headers: {Authorization: `Bearer ${localStorage.admintoken}`},
		})
		.then(res => {
			if (res.data.success) {
				return Promise.resolve(res.data);
			} else {
				return Promise.reject(res.data);
			}
		})
		.catch(err => {
			return Promise.reject(err);
		});
};

function replaceAuth(response) {
	if (
		response &&
		response.status &&
		(response.status === 401 || response.status === 403 || response.statusText === "Unauthorized")
	) {
		localStorage.removeItem("admintoken");
		document.location.replace(window.location.origin + "/root-panel/open");
	}
}
