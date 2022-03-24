import React, {useEffect, useRef, useState, useLayoutEffect} from "react";
import {Col, Container, Form, Row} from "react-bootstrap";
import Lightbox from "react-image-lightbox";
import {useSelector} from "react-redux";
import {CloseSvg} from "../../../other/Svg";
import Selection from "../../Selection";
import Table from "../../Table/Table";
import {setError, setMessage} from "../../../../actions/notification";
import {store} from "../../../../store/configureStore";
import {setIsShowPreloader, setIsShowProgress, setProgress} from "../../../../actions/preloader";
import Preloader from "../../../other/Preloader";

const Support = () => {
	const [updateRowsTable, setUpdateRowsTable] = useState(false);
	const [echoRowsTable, setEchoRowsTable] = useState(null);
	const [isOpen, setIsOpen] = useState(false);
	const [photoIndex, setPhotoIndex] = useState(0);
	const language = useSelector(state => state.languageCurrent.language);
	const languageText = useSelector(state => state.languageCurrent.languageText);
	const userId = useSelector(state => state.user.id);

	const [theme, setTheme] = useState("");
	const [text, setText] = useState("");
	const [filesSupport, setDataFiles] = useState({
		file: [],
		url: [],
	});
	let filesInput = useRef();

	const [isShowPreloaderText, setShowPreloaderText] = useState(false);
	const [isShowProgressText, setShowProgressText] = useState(false);
	const [progressText, setProgressText] = useState(0);
	const [isOpenTicket, setIsOpenTicket] = useState(false);

	useLayoutEffect(() => {
		store.dispatch(setIsShowPreloader(true));
	}, []);

	useEffect(() => {
		postRequest("getIsOpenTicket")
			.then(res => {
				setIsOpenTicket(res.isOpenTicket == 1);
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setIsShowPreloader(false));
				store.dispatch(setError(languageText["getDataError"]));
			});

		window.laravelEcho.private(`user.${userId}`).listen("Tickets.Close", res => {
			setIsOpenTicket(false);
			let row = {
				number: res.ticket.number,
				theme: res.ticket.theme,
				date: res.ticket.date,
				status: res.ticket.status,
			};
			setEchoRowsTable({
				propertySearch: {
					pendingTickets: "number",
					endTickets: "number",
					allTickets: "number",
				},
				rows: {
					pendingTickets: row,
					endTickets: row,
					allTickets: row,
				},
				events: {
					pendingTickets: "delete",
					endTickets: "add",
					allTickets: "update",
				},
			});
		});
		window.laravelEcho.private(`user.${userId}`).listen("Tickets.UpdateStatusUser", res => {
			let row = {
				number: res.ticket.number,
				theme: res.ticket.theme,
				date: res.ticket.date,
				status: res.ticket.status,
			};
			setEchoRowsTable({
				propertySearch: {
					pendingTickets: "number",
					allTickets: "number",
				},
				rows: {
					pendingTickets: row,
					allTickets: row,
				},
				events: {
					pendingTickets: "delete",
					allTickets: "update",
				},
			});
		});
	}, []);

	const onOpenTicket = e => {
		e.preventDefault();
		setShowPreloaderText(true);
		store.dispatch(setIsShowProgress(true));

		if (theme === "" || theme == null || text === "" || text == null) {
			store.dispatch(setError(languageText["onOpenTicketError"]));
			setShowProgressText(false);
			return;
		}
		let countFiles = filesSupport.file.length;
		let formData = new FormData();
		formData.append("theme", theme);
		formData.append("text", text);

		for (let index = 0; index < countFiles; index++) {
			formData.append("files" + index, filesSupport.file[index]);
			let _size = filesSupport.file[index] ? filesSupport.file[index].size : 0;
			let fSExt = ["Bytes", "KB", "MB", "GB"];
			let i = 0;
			while (_size > 900) {
				_size /= 1024;
				i++;
			}
			let exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
			formData.append("size" + index, exactSize != 0 ? exactSize : null);
		}

		formData.append("countFiles", countFiles.toString());
		formData.append("token", localStorage.getItem("usertoken"));

		postRequest("openTicket", formData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
					setIsOpenTicket(true);
					setUpdateRowsTable(true);
					store.dispatch(setMessage(languageText["onOpenTicketSuccess"]));
				} else {
					store.dispatch(setError(languageText["onOpenTicketError"]));
				}
				setShowPreloaderText(false);
			})
			.catch(err => {
				store.dispatch(setError(languageText["onOpenTicketError"]));
				setShowPreloaderText(false);
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

	const openLightbox = index => {
		setIsOpen(true);
		setPhotoIndex(index);
	};

	const closeLightbox = () => {
		setIsOpen(false);
		setPhotoIndex(0);
	};

	return (
		<div className="content dialog">
			<Container fluid>
				<Row>
					<Col lg={12}>
						<h4 className="content__title">{languageText["ticket8"]}</h4>
					</Col>
				</Row>
				{!isOpenTicket && (
					<Row>
						<Col lg={12}>
							<div className="wrapper-box">
								<Form className="cabinet-form" onSubmit={onOpenTicket}>
									<Form.Group as={Row} controlId="formPlaintextPassword">
										<Form.Label column="true" sm="12" md="2">
											{languageText["ticket9"]}
										</Form.Label>
										<Col column="true" sm="12" md="10">
											<Selection
												placeholder={languageText["ticket10"]}
												options={[
													{value: "1", label: languageText["themeTicket1"]},
													{value: "2", label: languageText["themeTicket2"]},
													{value: "3", label: languageText["themeTicket3"]},
													{value: "0", label: languageText["themeTicket0"]},
												]}
												value={theme}
												onChange={e => setTheme(e.value)}
											/>
										</Col>
									</Form.Group>
									<Form.Group as={Row} controlId="formPlaintextEmail">
										<Form.Label className="d-block" column="true" sm="12" md="2">
											{languageText["ticket11"]}
										</Form.Label>
										<Col sm="12" md="10">
											<textarea
												required
												name="support"
												className="form-control"
												placeholder={languageText["ticket12"]}
												id="support"
												rows="5"
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
																onClick={() => openLightbox(index)}
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
												{isOpen && (
													<Lightbox
														mainSrc={filesSupport.url[photoIndex]}
														nextSrc={
															filesSupport.url[(photoIndex + 1) % filesSupport.url.length]
														}
														prevSrc={
															filesSupport.url[
																(photoIndex + filesSupport.url.length - 1) %
																	filesSupport.url.length
															]
														}
														onCloseRequest={() => closeLightbox()}
														onMovePrevRequest={() =>
															setPhotoIndex(
																(photoIndex + filesSupport.url.length - 1) %
																	filesSupport.url.length
															)
														}
														onMoveNextRequest={() =>
															setPhotoIndex((photoIndex + 1) % filesSupport.url.length)
														}
													/>
												)}
											</div>
										)}
										<div className="dialog__footer-bottom">
											{isShowProgressText && (
												<Preloader type="line-progress" progress={progressText} />
											)}
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
							</div>
						</Col>
					</Row>
				)}
				<Table
					tabs={[
						{id: "pendingTickets", name: languageText["ticket1"]},
						{id: "endTickets", name: languageText["ticket2"]},
						{id: "allTickets", name: languageText["ticket3"]},
					]}
					headCells={{
						pendingTickets: [
							{id: "number", name: languageText["ticket4"], type: "id"},
							{id: "theme", name: languageText["ticket5"], type: "themeTicket"},
							{id: "date", name: languageText["ticket6"], type: "date"},
							{id: "status", name: languageText["ticket7"], type: "statusTicket"},
							{id: "event", name: null, type: "eventTicket"},
						],
						endTickets: [
							{id: "number", name: languageText["ticket4"], type: "id"},
							{id: "theme", name: languageText["ticket5"], type: "themeTicket"},
							{id: "date", name: languageText["ticket6"], type: "date"},
							{id: "status", name: languageText["ticket7"], type: "statusTicket"},
							{id: "event", name: null, type: "eventTicket"},
						],
						allTickets: [
							{id: "number", name: languageText["ticket4"], type: "id"},
							{id: "theme", name: languageText["ticket5"], type: "themeTicket"},
							{id: "date", name: languageText["ticket6"], type: "date"},
							{id: "status", name: languageText["ticket7"], type: "statusTicket"},
							{id: "event", name: null, type: "eventTicket"},
						],
					}}
					defaultSortIdCell={{
						pendingTickets: "number",
						endTickets: "number",
						allTickets: "number",
					}}
					errorGetDataTable={{
						pendingTickets: "getTableError",
						endTickets: "getTableError",
						allTickets: "getTableError",
					}}
					updateRows={updateRowsTable}
					setUpdateRows={updateRowsTable => setUpdateRowsTable(updateRowsTable)}
					echoRows={echoRowsTable}
					setEchoRows={echoRowsTable => setEchoRowsTable(echoRowsTable)}
					linkRows={{
						pendingTickets: {
							link: "/" + language + "/cabinet/dialog-open",
							property: "number",
						},
						endTickets: {
							link: "/" + language + "/cabinet/dialog-open",
							property: "number",
						},
						allTickets: {
							link: "/" + language + "/cabinet/dialog-open",
							property: "number",
						},
					}}
				/>
			</Container>
		</div>
	);
};

export default Support;
