import React, {useEffect, useState} from "react";
import ChangeLanguage from "../../other/ChangeLanguage";
import {
	FinanceIco,
	HideNavbar,
	MlfnLogoIco,
	MoneyFadeIco,
	NotificationFalseSvg,
	NotificationTrueSvg,
} from "../../other/Svg";
import {useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import {store} from "../../../store/configureStore";
import {setIsShowPreloader} from "../../../actions/preloader";
import {setAllDataUser} from "../../../actions/user";
import ModalConfirm from "../../other/ModalConfirm";
import Preloader from "../../other/Preloader";
import {getLocaleDateTime} from "../../../actions/time";
import {setError} from "../../../actions/notification";

const Topbar = ({onClick}) => {
	const balanceUSD = useSelector(state => state.user.balanceUSD);
	const balanceMLFN = useSelector(state => state.user.balanceMLFN);
	const statusKYC = useSelector(state => state.user.statusKYC);
	const userId = useSelector(state => state.user.id);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const language = useSelector(state => state.languageCurrent.language);
	const history = useHistory();

	const [showConfirm, setShowConfirm] = useState(false);

	const [dropdownIsActive, setDropdownIsActive] = useState(false);
	const [isReadMessage, setIsReadMessage] = useState(true);
	const [messages, setMessages] = useState([]);
	const [isShowPreloaderNotify, setIsShowPreloaderNotify] = useState(true);

	useEffect(() => {
		if (statusKYC == 1 || statusKYC == 3 || statusKYC == 4 || statusKYC == 5) {
			getNotification();

			window.laravelEcho.private(`allUsers`).listen("Notifications.SendAllUser", res => {
				setMessages(messages => {
					messages.unshift(res.message);
					return messages;
				});
				setIsReadMessage(false);
			});
			window.laravelEcho.private(`user.${userId}`).listen("Notifications.Send", res => {
				setMessages(messages => {
					messages.unshift(res.message);
					return messages;
				});
				setIsReadMessage(false);
			});
			window.laravelEcho.private(`user.${userId}`).listen("Notifications.Read", res => {
				let newMessages = messages;
				res.arrayIdMessages.forEach(idMessage => {
					let indexRow = newMessages.findIndex(item => item.id == idMessage);
					if (indexRow >= 0) {
						newMessages[indexRow].isRead = 1;
					}
				});
				setMessages(newMessages);

				let indexRow = newMessages.findIndex(item => item.isRead == 0);
				setIsReadMessage(indexRow < 0);
			});

			return () => {
				window.laravelEcho.leave(`allUsers`);
				window.laravelEcho.leave(`user.${userId}`);
			};
		}
	}, []);

	const getNotification = () => {
		setIsShowPreloaderNotify(true);
		postRequest("getTodayNotification")
			.then(res => {
				if (res.success) {
					setMessages(res.messages);
					setIsReadMessage(res.isReadMessages == 1);
				} else {
					store.dispatch(setError(languageText["getTodayNotificationError"]));
				}
				setIsShowPreloaderNotify(false);
			})
			.catch(err => {
				store.dispatch(setError(languageText["getTodayNotificationError"]));
				setIsShowPreloaderNotify(false);
			});
	};

	const logout = () => {
		store.dispatch(setIsShowPreloader(true));

		postRequest("signout", {
			token: localStorage.usertoken,
		})
			.then(res => {
				if (res.success) {
					localStorage.removeItem("usertoken");
					let initialState = {
						token: null,
						id: 0,
						role_id: null,
						balanceUSD: 0,
						balanceMLFN: 0,
						firstName: "",
						lastName: "",
						avatar: "",
						email: "",
						statusKYC: 0,
						payeer: "",
					};
					store.dispatch(setAllDataUser(initialState));
					store.dispatch(setIsShowPreloader(false));
					history.push("/" + language + "/");
				}
			})
			.catch(err => {
				store.dispatch(setIsShowPreloader(false));
				console.log(err);
			});
	};

	return (
		<div className="topbar">
			<button className="hide-navbar" onClick={onClick}>
				<HideNavbar />
			</button>
			{(statusKYC == 1 || statusKYC == 3 || statusKYC == 4 || statusKYC == 5) && (
				<>
					<div className="topbar__item current-price">
						<MlfnLogoIco />
						<div>
							<p className="text-small">{languageText["textTopBar1"]}</p>
							<p className="sum">
								$0.10 <span className="rate success">0.0%</span>
							</p>
						</div>
					</div>
					<div className="topbar__item my-active">
						<MoneyFadeIco />
						<div className="">
							<p className="text-small">{languageText["textTopBar2"]}</p>
							<p className="sum">
								{Number(balanceMLFN).toFixed(0)} <span className="rate">HBM</span>
							</p>
						</div>
					</div>
					<div className="topbar__item my-money">
						<FinanceIco className="topbar__money-svg" />
						<div className="">
							<p className="text-small">{languageText["textTopBar3"]}</p>
							<p className="sum">${Number(balanceUSD).toFixed(2)}</p>
						</div>
					</div>
					<div className="topbar__item my-active">
						<MoneyFadeIco />
						<div className="">
							<p className="text-small">{languageText["textTopBar7"]}</p>
							<p className="sum">
								0 <span className="rate">HBMToken</span>
							</p>
						</div>
					</div>
				</>
			)}
			<div className="topbar__right">
				{(statusKYC == 1 || statusKYC == 3 || statusKYC == 4 || statusKYC == 5) && (
					<div
						className="navbar-dropdown notification"
						onClick={() => setDropdownIsActive(!dropdownIsActive)}>
						<div className="notification__icon">
							{isReadMessage ? <NotificationFalseSvg /> : <NotificationTrueSvg />}
						</div>

						<div className={`navbar-dropdown__menu notification__menu ${dropdownIsActive && "show"}`}>
							<div className="notification__wrapper">
								<div className="notification__header">
									<p>{languageText["textTopBar5"]}</p>
									<Link to={"/" + language + "/cabinet/notification"}>
										<button className="btn-main">{languageText["textTopBar6"]}</button>
									</Link>
								</div>
								{isShowPreloaderNotify ? (
									<Preloader type="mini-circle" />
								) : (
									<div className="notification__body">
										{messages.length > 0 ? (
											messages.map(item => (
												<div
													key={"topBarNotification" + item.id}
													className={`notification__message ${
														!item.isRead && "notification__message--new"
													}`}>
													<p className="notification__message-date">
														{getLocaleDateTime(item.date)}
													</p>
													<p className="notification__message-text">{item.message}</p>
												</div>
											))
										) : (
											<div className="notification__message">
												<p>{languageText["notification5"]}</p>
											</div>
										)}
									</div>
								)}
							</div>
						</div>
					</div>
				)}
				<ChangeLanguage />
				<button className="btn-cabinet" onClick={() => setShowConfirm(true)}>
					{languageText["textTopBar4"]}
				</button>
			</div>

			<ModalConfirm
				show={showConfirm}
				handleClose={() => setShowConfirm(false)}
				textQuestion={languageText["modal1"]}
				textButtonApply={languageText["modal2"]}
				textButtonCancel={languageText["modal3"]}
				functionApply={logout}
			/>
		</div>
	);
};

export default Topbar;
