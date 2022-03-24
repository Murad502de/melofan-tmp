export const SET_LANGUAGE = "SET_LANGUAGE";
export const SET_ID_LANGUAGE = "SET_ID_LANGUAGE";

export function setTextLanguage(languageCurrent = "en") {
	let nameFile = "en.json";

	if (languageCurrent) {
		nameFile = languageCurrent + ".json";
		nameFile = nameFile.toLowerCase();
	}

	let resultText = null;
	$.ajax({
		url: "/language/" + nameFile,
		async: false,
		dataType: "json",
		success: function (response) {
			resultText = response;
		},
	});

	if (!resultText) {
		$.ajax({
			url: "/language/en.json",
			async: false,
			dataType: "json",
			success: function (response) {
				resultText = response;
			},
		});
	}

	return {
		type: SET_LANGUAGE,
		languageText: resultText,
	};
}

export function setLanguage(idCurrent) {
	return {
		type: SET_ID_LANGUAGE,
		language: idCurrent,
	};
}
