import {SET_ID_LANGUAGE, SET_LANGUAGE} from "../actions/language";

import img_ch from "../../images/lang/china.svg";
import img_fr from "../../images/lang/france.svg";
import img_de from "../../images/lang/germany.svg";
// import img_ja from "../../images/lang/japan.svg";
import img_kz from "../../images/lang/kazakhstan.svg";
import img_ru from "../../images/lang/russia.svg";
import img_sp from "../../images/lang/spain.svg";
import img_uk from "../../images/lang/united-kingdom.svg";
import img_uz from "../../images/lang/uzbekistn.svg";

const initialState = {
	language: "en",
	languageText: null,
	arrayLanguage: [
		{id: "en", image: img_uk, title: " EN"},
		{id: "de", image: img_de, title: " DE"},
		{id: "fr", image: img_fr, title: " FR"},
		{id: "pl", image: img_fr, title: " PL"},
		{id: "es", image: img_sp, title: " ES"},
		{id: "ru", image: img_ru, title: " RU"},
		{id: "kz", image: img_kz, title: " KZ"},
		{id: "uz", image: img_uz, title: " UZ"},
		{id: "zh", image: img_ch, title: " ZH"},
	],
};

export function languageReducer(state = initialState, action) {
	switch (action.type) {
		case SET_LANGUAGE:
			return {...state, languageText: action.languageText};
		case SET_ID_LANGUAGE:
			return {...state, language: action.language};
		default:
			return state;
	}
}
