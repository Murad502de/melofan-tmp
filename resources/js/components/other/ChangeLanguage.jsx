import React, {useRef, useState, useEffect} from "react";
import {useHistory, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {store} from "../../store/configureStore";
import {setLanguage, setTextLanguage} from "../../actions/language";
import {setIsShowPreloader} from "../../actions/preloader";
import {ArrowDown} from "./Svg";

export default props => {
	const [clickedOutside, setClickedOutside] = useState(false);
	const myRef = useRef();

	const handleClickOutside = e => {
		if (!myRef.current.contains(e.target)) {
			setLangIsActive(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	});

	// const languageText = useSelector(state => state.languageCurrent.languageText);
	const arrayLanguage = useSelector(state => state.languageCurrent.arrayLanguage);
	const language = useSelector(state => state.languageCurrent.language);
	let location = useLocation();
	let history = useHistory();

	const [langIsActive, setLangIsActive] = React.useState(false);

	const onChangeLanguage = (e, idLanguage) => {
		e.preventDefault;
		store.dispatch(setIsShowPreloader(true));
		setLangIsActive(!langIsActive);
		store.dispatch(setLanguage(idLanguage));
		store.dispatch(setTextLanguage(idLanguage));
		localStorage.setItem("selectedLanguage", idLanguage);

		postRequest("changeLanguage", {
			language: idLanguage,
			token: localStorage.usertoken,
		});

		store.dispatch(setIsShowPreloader(false));
		history.push("/" + idLanguage + location.pathname.substring(3));
	};

	let currentLanguage = {};
	let oldLanguage = [];
	for (let index = 0; index < arrayLanguage.length; index++) {
		if (arrayLanguage[index].id === language) {
			currentLanguage = arrayLanguage[index];
		} else {
			oldLanguage.push(arrayLanguage[index]);
		}
	}
	return (
		<div className={`navbar-dropdown ${props.className}`}>
			<p onClick={() => setLangIsActive(!langIsActive)}>
				<img src={currentLanguage.image} alt="" />
				{currentLanguage.title} <ArrowDown />
			</p>
			<div ref={myRef} className={`navbar-dropdown__menu ${langIsActive && "show"}`}>
				{clickedOutside ? (
					""
				) : (
					<>
						{oldLanguage.map(lang => (
							<p
								key={"language" + lang.id}
								className="navbar-dropdown__link"
								onClick={e => onChangeLanguage(e, lang.id)}>
								<img src={lang.image} alt="" />
								{lang.title}
							</p>
						))}
					</>
				)}
			</div>
		</div>
	);
};
