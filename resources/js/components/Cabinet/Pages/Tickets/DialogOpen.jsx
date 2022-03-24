import React, {Fragment, useEffect, useLayoutEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {Col, Container, Form, Row} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {CloseSvg, DownloadOutlineIco} from "../../../other/Svg";
import {setError, setMessage} from "../../../../actions/notification";
import {store} from "../../../../store/configureStore";
import {setIsShowPreloader} from "../../../../actions/preloader";
import {getLocaleDateTime} from "../../../../actions/time";
import Preloader from "../../../other/Preloader";

const DialogOpen = props => {
	const history = useHistory();

	const [images, setImages] = useState([]);
	const [isOpen, setIsOpen] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);

	const [id, setId] = useState("");
	const [messages, setMessages] = useState([]);
	const [theme, setTheme] = useState("");
	const [status, setStatus] = useState("");

	const [text, setText] = useState("");
	const [filesSupport, setDataFiles] = useState({
		file: [],
		url: [],
	});
	const [isOpenCurrent, setIsOpenCurrent] = useState(false);
	const [photoIndexCurrent, setPhotoIndexCurrent] = useState(0);
	let filesInput = useRef();

	const [isShowPreloader, setShowPreloader] = useState(false);
	const [isShowPreloaderText, setShowPreloaderText] = useState(false);
	const [isShowProgressText, setShowProgressText] = useState(false);
	const [progressText, setProgressText] = useState(0);

	const userId = useSelector(state => state.user.id);
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		let id = props.match.params.id;
		if (!id) {
			history.push(language + "/support");
		}
		setId(id);
		setDataMessage(id);

		window.laravelEcho.private(`user.${userId}`).listen("Tickets.SendUser", res => {
			setMessages(messages => {
				let newMessages = messages;
				newMessages.push(res.message);
				return newMessages;
			});
			setImages(images => {
				let newImages = images;
				res.message.msg.forEach(itemMsg => {
					newImages = newImages.concat(
						itemMsg.images.map(item => item.path + "?token=" + localStorage.usertoken)
					);
				});
				return newImages;
			});
		});
	}, []);
	const setDataMessage = id => {
		postRequest("getOneTickets", {id})
			.then(res => {
				if (res.success) {
					let images = [];
					res.messages.forEach(itemMessage => {
						itemMessage.msg.forEach(itemMsg => {
							images = images.concat(
								itemMsg.images.map(item => item.path + "?token=" + localStorage.usertoken)
							);
						});
					});

					setMessages(res.messages);
					setTheme(res.theme);
					setStatus(res.status);
					setImages(images);
					store.dispatch(setIsShowPreloader(false));
				} else {
					store.dispatch(setError(languageText["getOneTicketsError"]));
				}
				setShowPreloader(false);
			})
			.catch(err => {
				store.dispatch(setError(languageText["getOneTicketsError"]));
				setShowPreloader(false);
			});
	};
	const sendMessage = e => {
		e.preventDefault();
		setShowProgressText(true);

		let countFiles = filesSupport.file.length;
		if (!((text !== "" && text != null) || countFiles > 0)) {
			store.dispatch(setError(languageText["sendMyMessageError1"]));
			setShowProgressText(false);
			return;
		}

		let newsFormData = new FormData();
		newsFormData.append("id", id);
		newsFormData.append("text", text);

		for (let index = 0; index < countFiles; index++) {
			newsFormData.append("files" + index, filesSupport.file[index]);
		}

		newsFormData.append("countFiles", countFiles.toString());
		newsFormData.append("token", localStorage.getItem("usertoken"));

		postRequest("sendMessageTicket", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
			let percentUpload = Math.round((itemUpload.loaded / itemUpload.total) * 100);
			if (percentUpload === 100) {
				setProgressText(0);
				setShowProgressText(false);
				setShowPreloaderText(true);
			} else {
				setProgressText(percentUpload);
			}
		})
			.then(res => {
				if (res.success) {
					setDataFiles(filesSupport => {
						let files = filesSupport;
						files.file = [];
						files.url = [];
						return {...filesSupport, ...files};
					});
					setText("");
					store.dispatch(setMessage(languageText["sendMyMessageSuccess"]));
				} else {
					store.dispatch(setError(languageText["sendMyMessageError" + res.error]));
				}
				setShowPreloaderText(false);
			})
			.catch(err => {
				setShowPreloaderText(false);
				store.dispatch(setError(languageText["sendMyMessageError1"]));
			});
	};

	const onChangeFileMessage = e => {
		let countFilesSuccess = 10 - filesSupport.file.length;

		if (countFilesSuccess < 1) {
			store.dispatch(setError(languageText["fileTicketError1"]));
			filesInput.current.value = null;
			return;
		}

		let arrayFiles = filesSupport;
		for (let index = 0; index < e.target.files.length; index++) {
			if (countFilesSuccess < 1) {
				setDataFiles(filesSupport => {
					return {...filesSupport, ...arrayFiles};
				});
				store.dispatch(setError(languageText["fileTicketError1"]));
				filesInput.current.value = null;
				return;
			}

			let typeFile = e.target.files[index].type;
			if (
				typeFile === "image/png" ||
				typeFile === "image/jpeg" ||
				typeFile === "image/gif" ||
				typeFile === "image/bmp" ||
				typeFile === "image/vnd.microsoft.icon" ||
				typeFile === "image/tiff" ||
				typeFile === "image/svg+xml" ||
				typeFile === "application/pdf"
			) {
				arrayFiles.url.push(URL.createObjectURL(e.target.files[index]));
				arrayFiles.file.push(e.target.files[index]);
			} else {
				store.dispatch(setError(languageText["fileTicketError2"]));
			}
			countFilesSuccess--;
		}
		setDataFiles(filesSupport => {
			return {...filesSupport, ...arrayFiles};
		});
		filesInput.current.value = null;
	};
	const delFiles = index => {
		setDataFiles(filesSupport => {
			let files = filesSupport;
			files.file.splice(index, 1);
			files.url.splice(index, 1);
			return {...filesSupport, ...files};
		});
	};

	const openLightboxCurrent = index => {
		setIsOpenCurrent(true);
		setPhotoIndexCurrent(index);
	};

	const closeLightboxCurrent = () => {
		setIsOpenCurrent(false);
		setPhotoIndexCurrent(0);
	};

	const openLightbox = index => {
		setIsOpen(true);
		setPhotoIndex(index);
	};

	const closeLightbox = () => {
		setIsOpen(false);
		setPhotoIndex(0);
	};

	let componentSendMessage = (
		<>
			{Number(status) > 0 && (
				<>
					<Form className="cabinet-form" onSubmit={sendMessage}>
						<Form.Group as={Row} controlId="formPlaintextEmail">
							<Col sm="12" md="12">
								<textarea
									name="support"
									className="form-control"
									placeholder={languageText["ticket12"]}
									id="support"
									rows="2"
									value={text}
									onChange={e => setText(e.target.value)}
								/>
							</Col>
						</Form.Group>
						<div className="dialog__footer">
							{filesSupport.file.length > 0 && (
								<div className="dialog__footer-top">
									<p>{languageText["ticket13"]}</p>
									{filesSupport.url.map((file, index) =>
										filesSupport.file[index].type.indexOf("image") > -1 ? (
											<div key={"image" + index} className="dialog__footer-img">
												<img
													src={file}
													onClick={() => openLightboxCurrent(index)}
													alt={filesSupport.file[index].name}
												/>
												<span onClick={() => delFiles(index)}>
													<CloseSvg />
												</span>
											</div>
										) : (
											<span key={"document" + index} className="file">
												{filesSupport.file[index].name + " "}
												<span onClick={() => delFiles(index)}>
													<CloseSvg />
												</span>
											</span>
										)
									)}
									{isOpenCurrent && (
										<Lightbox
											mainSrc={filesSupport.url[photoIndexCurrent]}
											nextSrc={
												filesSupport.url[(photoIndexCurrent + 1) % filesSupport.url.length]
											}
											prevSrc={
												filesSupport.url[
													(photoIndexCurrent + filesSupport.url.length - 1) %
														filesSupport.url.length
												]
											}
											onCloseRequest={() => closeLightboxCurrent()}
											onMovePrevRequest={() =>
												setPhotoIndexCurrent(
													(photoIndexCurrent + filesSupport.url.length - 1) %
														filesSupport.url.length
												)
											}
											onMoveNextRequest={() =>
												setPhotoIndexCurrent((photoIndexCurrent + 1) % filesSupport.url.length)
											}
										/>
									)}
								</div>
							)}
							<div className="dialog__footer-bottom">
								{isShowProgressText && <Preloader type="line-progress" progress={progressText} />}
								{isShowPreloaderText && <Preloader type="mini-line" />}
								<label
									htmlFor="file"
									className="btn-cabinet d-inline-block ms-auto"
									style={{
										padding: "10px 25px",
										cursor: "pointer",
									}}>
									{languageText["ticket14"]}
								</label>
								<input
									type="file"
									id="file"
									className="d-none"
									ref={filesInput}
									multiple
									onChange={e => onChangeFileMessage(e)}
								/>
								<button type="submit" className="btn-main">
									{languageText["ticket15"]}
								</button>
							</div>
						</div>
					</Form>
				</>
			)}
		</>
	);

	return (
		<div className="content dialog">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<div className="d-flex align-items-center mb-4">
							<h4 className="mb-0">{languageText["openDialog1"].replace("%i%", id)}</h4>
							<Link to={"/" + language + "/cabinet/support"} className="btn-cabinet ml-3">
								{languageText["openDialog2"]}
							</Link>
						</div>
					</Col>
				</Row>
				<Row>
					<Col lg={12}>
						<div className="wrapper-box">
							{isShowPreloader ? (
								<Preloader type="mini-circle" />
							) : (
								<div className="dialog__messages">
									{messages.map((itemMessage, indexMessage) => {
										let result = [];

										let dayPreviousMessage = indexMessage > 0 ? messages[--indexMessage].date : "";
										if (itemMessage.date !== dayPreviousMessage) {
											result.push(
												<div key={"dialogDate" + indexMessage} className="dialog__date">
													<span>{getLocaleDateTime(itemMessage.date, "date")}</span>
												</div>
											);
										}

										if (itemMessage.userId == userId) {
											result.push(
												<div
													className="dialog__message dialog__message--right"
													key={"dialogMsg" + indexMessage}>
													<div className="dialog__message-text">
														{itemMessage.msg.map((itemMsg, indexMsg) => (
															<Fragment key={"message" + indexMessage + indexMsg}>
																<div className="dialog__message-wrapper">
																	<span className="time">
																		{getLocaleDateTime(itemMsg.date, "time")}
																	</span>
																	<p>
																		{itemMsg.text}
																		{itemMsg.documents.length > 0 && (
																			<div className="btn-wrapper">
																				{itemMsg.documents.map(
																					(item, index) => (
																						<a
																							key={
																								"document" +
																								indexMessage +
																								indexMsg +
																								index
																							}
																							href={
																								item.path +
																								"?token=" +
																								localStorage.usertoken
																							}
																							download={item.name}
																							className="btn-download">
																							{item.name +
																								"." +
																								item.type}{" "}
																							<DownloadOutlineIco />{" "}
																						</a>
																					)
																				)}
																			</div>
																		)}
																		{itemMsg.images.length > 0 && (
																			<div className="img-wrapper">
																				{itemMsg.images.map((item, index) => (
																					<img
																						key={
																							"document" +
																							indexMessage +
																							indexMsg +
																							index
																						}
																						src={
																							item.path +
																							"?token=" +
																							localStorage.usertoken
																						}
																						alt={
																							item.name + "." + item.type
																						}
																						onClick={() =>
																							openLightbox(item.index)
																						}
																					/>
																				))}
																			</div>
																		)}
																	</p>
																</div>
															</Fragment>
														))}
													</div>

													<img
														src={itemMessage.userAvatar}
														className="dialog__message-photo"
														alt=""
													/>
												</div>
											);
										} else {
											result.push(
												<div className="dialog__message" key={"dialogMsg" + indexMessage}>
													<img
														src={itemMessage.userAvatar}
														className="dialog__message-photo"
														alt=""
													/>

													<div className="dialog__message-text">
														{itemMessage.msg.map((itemMsg, indexMsg) => (
															<Fragment key={"message" + indexMessage + indexMsg}>
																<div className="dialog__message-wrapper">
																	<p>
																		{itemMsg.text}
																		{itemMsg.documents.length > 0 && (
																			<div className="btn-wrapper">
																				{itemMsg.documents.map(
																					(item, index) => (
																						<a
																							key={
																								"document" +
																								indexMessage +
																								indexMsg +
																								index
																							}
																							href={
																								item.path +
																								"?token=" +
																								localStorage.usertoken
																							}
																							download={item.name}
																							className="btn-download">
																							{item.name +
																								"." +
																								item.type}{" "}
																							<DownloadOutlineIco />{" "}
																						</a>
																					)
																				)}
																			</div>
																		)}
																		{itemMsg.images.length > 0 && (
																			<div className="img-wrapper">
																				{itemMsg.images.map((item, index) => (
																					<img
																						key={
																							"document" +
																							indexMessage +
																							indexMsg +
																							index
																						}
																						src={
																							item.path +
																							"?token=" +
																							localStorage.usertoken
																						}
																						alt={
																							item.name + "." + item.type
																						}
																						onClick={() =>
																							openLightbox(item.index)
																						}
																					/>
																				))}
																			</div>
																		)}
																	</p>
																	<span className="time">
																		{getLocaleDateTime(itemMsg.date, "time")}
																	</span>
																</div>
															</Fragment>
														))}
													</div>
												</div>
											);
										}

										return result;
									})}
								</div>
							)}
							{isOpen && (
								<Lightbox
									mainSrc={images[photoIndex]}
									nextSrc={images[(photoIndex + 1) % images.length]}
									prevSrc={images[(photoIndex + images.length - 1) % images.length]}
									onCloseRequest={() => closeLightbox()}
									onMovePrevRequest={() =>
										setPhotoIndex((photoIndex + images.length - 1) % images.length)
									}
									onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
								/>
							)}
							{componentSendMessage}
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default DialogOpen;
