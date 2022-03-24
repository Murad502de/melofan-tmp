import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {store} from "../../store/configureStore";
import {setNameTheme} from "../../actions/themeCabinet";

const ThemeSwitch = () => {
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const nameTheme = useSelector(state => state.themeCabinet.name);

	useEffect(() => {
		// postRequest("getTheme").then(res => {
		// 	if (res.success) {
		// 		let name = res.name ? res.name : "";
		// 		store.dispatch(setNameTheme( name ));
		// 	}
		// });
	}, []);

	const setTheme = theme => {
		store.dispatch(setNameTheme(theme));
		postRequest("setTheme", {nameTheme: theme});

        if ( theme )
        {
            localStorage.setItem( "uiTheme", 'dark' );
        }
        else
        {
            localStorage.setItem( "uiTheme", 'bright' );
        }
	};

	return (
		<div className="theme-switch">
			<div
				onClick={() => setTheme("")}
				className={`theme-switch__item theme-switch__item--light ${
					nameTheme === "" && "theme-switch__item--active"
				}`}>
				<svg
					className="me-1"
					width="17"
					height="16"
					viewBox="0 0 17 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<g clipPath="url(#clip0)">
						<path
							d="M8.7955 12.427C11.2433 12.427 13.2277 10.4426 13.2277 7.99478C13.2277 5.54693 11.2433 3.56256 8.7955 3.56256C6.34765 3.56256 4.36328 5.54693 4.36328 7.99478C4.36328 10.4426 6.34765 12.427 8.7955 12.427Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M16.2875 7.48132H14.7053C14.4218 7.48132 14.1919 7.71119 14.1919 7.99475V8.00523C14.1919 8.28878 14.4218 8.51865 14.7053 8.51865H16.2875C16.5711 8.51865 16.8009 8.28878 16.8009 8.00523V7.99475C16.8009 7.71119 16.5711 7.48132 16.2875 7.48132Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M2.89639 7.48132H1.31421C1.03065 7.48132 0.800781 7.71119 0.800781 7.99475V8.00523C0.800781 8.28878 1.03065 8.51865 1.31421 8.51865H2.89639C3.17995 8.51865 3.40982 8.28878 3.40982 8.00523V7.99475C3.40982 7.71119 3.17995 7.48132 2.89639 7.48132Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M13.7323 2.33019L12.6135 3.44897C12.413 3.64947 12.413 3.97455 12.6135 4.17506L12.6209 4.18247C12.8214 4.38297 13.1465 4.38297 13.347 4.18247L14.4658 3.06369C14.6663 2.86319 14.6663 2.5381 14.4658 2.3376L14.4584 2.33019C14.2579 2.12969 13.9328 2.12969 13.7323 2.33019Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M4.26014 11.8071L3.14137 12.9258C2.94086 13.1263 2.94086 13.4514 3.14137 13.6519L3.14878 13.6593C3.34928 13.8598 3.67436 13.8598 3.87487 13.6593L4.99364 12.5406C5.19415 12.3401 5.19415 12.015 4.99364 11.8145L4.98623 11.8071C4.78573 11.6066 4.46065 11.6066 4.26014 11.8071Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M8.28223 0.513396V2.09558C8.28223 2.37914 8.51209 2.60901 8.79565 2.60901H8.80613C9.08969 2.60901 9.31955 2.37914 9.31955 2.09558V0.513396C9.31955 0.229839 9.08969 -2.88486e-05 8.80613 -2.88486e-05H8.79565C8.51209 -2.88486e-05 8.28223 0.229839 8.28223 0.513396Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M8.28223 13.8939V15.4761C8.28223 15.7596 8.5121 15.9895 8.79565 15.9895H8.80613C9.08969 15.9895 9.31956 15.7596 9.31956 15.4761V13.8939C9.31956 13.6103 9.08969 13.3805 8.80613 13.3805H8.79565C8.5121 13.3805 8.28223 13.6103 8.28223 13.8939Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M3.14367 3.07097L4.26244 4.18975C4.46295 4.39025 4.78803 4.39025 4.98853 4.18975L4.99594 4.18234C5.19645 3.98184 5.19645 3.65675 4.99594 3.45625L3.87717 2.33747C3.67666 2.13697 3.35158 2.13697 3.15108 2.33747L3.14367 2.34488C2.94316 2.54539 2.94316 2.87047 3.14367 3.07097Z"
							fill="white"
							fillOpacity="0.44"
						/>
						<path
							d="M12.6056 12.5279L13.7244 13.6467C13.9249 13.8472 14.2499 13.8472 14.4504 13.6467L14.4579 13.6393C14.6584 13.4388 14.6584 13.1137 14.4579 12.9132L13.3391 11.7944C13.1386 11.5939 12.8135 11.5939 12.613 11.7944L12.6056 11.8019C12.4051 12.0024 12.4051 12.3274 12.6056 12.5279Z"
							fill="white"
							fillOpacity="0.44"
						/>
					</g>
					<defs>
						<clipPath id="clip0">
							<rect width="16" height="16" fill="white" transform="translate(0.800781)" />
						</clipPath>
					</defs>
				</svg>
				<span>{languageText["theme1"]}</span>
			</div>
			<div
				onClick={() => setTheme("dark")}
				className={`theme-switch__item theme-switch__item--dark ${
					nameTheme === "dark" && "theme-switch__item--active"
				}`}>
				<svg
					className="me-1"
					width="13"
					height="14"
					viewBox="0 0 13 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<g clipPath="url(#clip0)">
						<path
							d="M5.89389 1.19658e-05C5.61099 0.00178006 5.3284 0.0189758 5.04743 0.0515204C6.03307 0.766677 6.78485 1.75055 7.21009 2.88183C7.63533 4.01312 7.71543 5.24235 7.44051 6.41797C6.96417 7.92845 5.94629 9.21633 4.57702 10.041C3.20776 10.8657 1.58077 11.1707 0 10.8992C0.68269 11.9056 1.61831 12.7204 2.7156 13.2641C3.81289 13.8078 5.0344 14.0619 6.26099 14.0016C7.48758 13.9413 8.67738 13.5686 9.71435 12.92C10.7513 12.2713 11.6001 11.3688 12.1778 10.3005C12.7555 9.23213 13.0425 8.03442 13.0108 6.82416C12.979 5.61389 12.6297 4.43239 11.9967 3.39489C11.3638 2.35739 10.4689 1.4993 9.39932 0.904322C8.32974 0.30934 7.122 -0.00222543 5.89389 1.19658e-05Z"
							fill="white"
						/>
					</g>
					<defs>
						<clipPath id="clip0">
							<rect width="13" height="14" fill="white" />
						</clipPath>
					</defs>
				</svg>
				<span>{languageText["theme2"]}</span>
			</div>
		</div>
	);
};

export default ThemeSwitch;
