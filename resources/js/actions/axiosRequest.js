import axios from "axios";
import {replaceAuth} from "./user";

window.postRequest = (route, data = {}, headers = {"Content-Type": "application/json"}, onUploadProgress = null) => {
	if (localStorage.usertoken && headers["Content-Type"] === "application/json") {
		data = {...data, token: localStorage.usertoken};
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
		.post("/api/" + route, data, configRequest)
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
		.get("/api/" + route, {
			headers: {Authorization: `Bearer ${localStorage.usertoken}`},
		})
		.then(res => {
			return Promise.resolve(res.data);
		})
		.catch(err => {
			return Promise.reject(err);
		});
};
