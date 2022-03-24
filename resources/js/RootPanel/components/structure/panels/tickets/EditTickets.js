import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import {withStyles} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {store} from "../../../../store/configureStore";
import {setError, setIsShowPreloader, setIsShowProgress, setProgress} from "../../../../store/rootActions";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import SendIcon from "@material-ui/icons/Send";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ClearIcon from "@material-ui/icons/Clear";
import {getLocaleDateTime} from "../../../../actions/time";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import {connect} from "react-redux";

const styles = theme => ({
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: "100vh",
		overflow: "auto",
	},
	container: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
	},
	paper: {
		padding: theme.spacing(2),
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	paperTabs: {
		display: "flex",
		overflow: "auto",
		flexDirection: "column",
	},
	fixedHeight: {
		height: 240,
	},
	marginField: {
		marginTop: theme.spacing(2),
	},
	titleBar: {
		height: 20,
		background:
			"linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, " +
			"rgba(255,255,255,0.3) 70%, rgba(255,255,255,0) 100%)",
	},
	imageContent: {
		height: "auto",
		width: "100%",
	},
});

class EditTickets extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Редактирование тикета",

			id: "",
			userLanguage: "",
			theme: "",
			status: "",
			statusId: 0,
			messages: [],
			created_at: "",
			images: [],

			textMessage: "",
			imageFiles: {
				file: [],
				url: [],
			},

			isOpen: false,
			photoIndex: 0,
			isOpenCurrent: false,
			photoIndexCurrent: 0,
		};
	}

	componentDidMount() {
		let id = this.props.match.params.idTickets;

		if (id) {
			this.fillTickets(id);
		} else {
			store.dispatch(setIsShowPreloader(false));
			this.props.history.push(this.props.basePath + "/tickets");
		}

		window.laravelEcho.private(`ticketOperator.${this.props.userId}`).listen("Tickets.SendOperator", res => {
			console.log(res);
			let newMessages = this.state.messages;
			newMessages.push(res.message);
			let newImages = this.state.images;
			res.message.images.forEach(itemMsg => {
				newImages.push(itemMsg.path + "?token=" + localStorage.admintoken);
			});

			this.setState({
				messages: newMessages,
				images: newImages,
			});
		});
	}

	onChange = e => {
		this.setState({[e.target.name]: e.target.value});
	};

	fillTickets = id => {
		let error = "Ошибка при получении данных тикета!";
		postRequest("get-tickets", {
			id: id,
		})
			.then(res => {
				let images = [];
				res.ticketMessages.forEach(itemMessage => {
					itemMessage.images.forEach(itemMsg => {
						images.push(itemMsg.path + "?token=" + localStorage.admintoken);
					});
				});
				this.setState({
					id: res.tickets.id,
					userLanguage: res.tickets.language,
					theme: res.tickets.theme,
					status: res.tickets.status,
					statusId: res.tickets.status,
					created_at: getLocaleDateTime(res.tickets.created_at),
					messages: res.ticketMessages,
					images: images,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				console.log(err);
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/tickets");
			});
	};

	sendMsgCtrlEnter = e => {
		if (e.ctrlKey) {
			this.sendMessage();
		}
	};

	sendMessage = () => {
		store.dispatch(setIsShowProgress(true));
		let textError = "Проверьте введенное сообщение!";

		let countImages = this.state.imageFiles.file.length;
		if ((this.state.textMessage !== null && this.state.textMessage !== "") || countImages > 0) {
			let newsFormData = new FormData();
			newsFormData.append("id", this.state.id);
			newsFormData.append("textMessage", this.state.textMessage);

			for (let index = 0; index < countImages; index++) {
				newsFormData.append("files" + index, this.state.imageFiles.file[index]);
			}

			newsFormData.append("countImages", countImages.toString());
			newsFormData.append("token", localStorage.getItem("admintoken"));

			postRequest("send-tickets", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
				let percentUpload = Math.round((itemUpload.loaded / itemUpload.total) * 100);
				if (percentUpload === 100) {
					store.dispatch(setProgress(0));
					store.dispatch(setIsShowProgress(false));
					store.dispatch(setIsShowPreloader(true));
				} else {
					store.dispatch(setProgress(percentUpload));
				}
			})
				.then(res => {
					if (res.success) {
						this.setState({
							message: "Сообщение отправлено.",
							status: "Ожидание Вашего ответа",
							textMessage: "",
							imageFiles: {
								file: [],
								url: [],
							},
						});
					} else {
						if (res.error) {
							store.dispatch(setError(res.error));
						} else {
							store.dispatch(setError(textError));
						}
					}
					store.dispatch(setIsShowPreloader(false));
				})
				.catch(err => {
					store.dispatch(setIsShowPreloader(false));
					store.dispatch(setError(textError));
				});
		} else {
			store.dispatch(setIsShowPreloader(false));
			store.dispatch(setError(textError));
		}
	};

	onChangeFileImageMessage = e => {
		let countFilesSuccess = 10 - this.state.imageFiles.file.length;

		if (countFilesSuccess < 1) {
			store.dispatch(setError("Превышено максимально допустимое количество файлов!"));
			let inputFile = document.getElementById("imagesForMessageTickets");
			inputFile.value = null;
			return;
		}

		let arrayFileImages = this.state.imageFiles;

		for (let index = 0; index < e.target.files.length; index++) {
			if (countFilesSuccess < 1) {
				this.setState({fileImageNew: arrayFileImages});
				store.dispatch(setError("Превышено максимально допустимое количество файлов!"));
				let inputFile = document.getElementById("imagesForMessageTickets");
				inputFile.value = null;
				return;
			}

			let typeFile = e.target.files[index].type;

			if (typeFile.indexOf("image") > -1 || typeFile === "application/pdf") {
				arrayFileImages.url.push(URL.createObjectURL(e.target.files[index]));
				arrayFileImages.file.push(e.target.files[index]);
			} else {
				store.dispatch(setError("Формат выбранного файла недоступен!"));
			}

			countFilesSuccess--;
		}
		this.setState({fileImageNew: arrayFileImages});

		let inputFile = document.getElementById("imagesForMessageTickets");
		inputFile.value = null;
	};
	selectionImage = () => {
		document.getElementById("imagesForMessageTickets").click();
	};
	delImageFiles = (e, index) => {
		let arrayFileImages = this.state.imageFiles;
		arrayFileImages.file.splice(index, 1);
		arrayFileImages.url.splice(index, 1);
		this.setState({imageFiles: arrayFileImages});
	};

	closeTickets = () => {
		store.dispatch(setIsShowPreloader(true));

		postRequest("close-tickets", {idTickets: this.state.id})
			.then(res => {
				if (res.success) {
					store.dispatch(setIsShowPreloader(false));
					this.props.history.push(this.props.basePath + "/tickets");
				} else {
					store.dispatch(setError("При закрытии тикета произошла ошибка!"));
					store.dispatch(setIsShowPreloader(false));
				}
			})
			.catch(err => {
				store.dispatch(setError(err));
				store.dispatch(setIsShowPreloader(false));
			});
	};

	cancelTickets = () => {
		this.props.history.push(this.props.basePath + "/tickets");
	};

	openLightboxCurrent = index => {
		this.setState({
			isOpenCurrent: true,
			photoIndexCurrent: index,
		});
	};

	closeLightboxCurrent = () => {
		this.setState({
			isOpenCurrent: false,
			photoIndexCurrent: 0,
		});
	};

	openLightbox = index => {
		this.setState({
			isOpen: true,
			photoIndex: index,
		});
	};

	closeLightbox = () => {
		this.setState({
			isOpen: false,
			photoIndex: 0,
		});
	};

	render() {
		console.log(this.state.messages);
		const {classes, userId} = this.props;

		return (
			<main className={classes.content}>
				<div className={classes.appBarSpacer} />
				<Container maxWidth="lg" className={classes.container}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container spacing={2}>
									<Grid item xs={12} sm={8} align="left">
										<Typography variant="h6" noWrap>
											{this.state.titlePage}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={4} align="center">
										<ButtonGroup aria-label="small outlined button group">
											<Button variant="contained" onClick={this.cancelTickets}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={9}>
							<Paper className={classes.paper}>
								<div className="platform-box__body">
									<div className="table-responsive">
										<table className="table table-support table-striped">
											<tbody>
												{this.state.messages.map(elemMessage => (
													<tr key={elemMessage.id}>
														<td width="235">
															<div className="table-avatar" align="center">
																<img
																	width="50px"
																	src={elemMessage.user_avatar}
																	alt=""
																/>
																<div className="table-title">
																	<p>
																		{elemMessage.user_id === userId
																			? "Вы"
																			: elemMessage.user_name}
																	</p>
																</div>
															</div>
														</td>
														<td style={{minWidth: "200px"}}>
															<p>{elemMessage.text}</p>
															{elemMessage.images.map((elemImage, index) => (
																<p
																	key={
																		"messageImage" + elemMessage.id + "img" + index
																	}
																	style={{textAlign: "center"}}>
																	<img
																		className={classes.imageContent}
																		src={
																			elemImage.path +
																			"?token=" +
																			localStorage.admintoken
																		}
																		onClick={() =>
																			this.openLightbox(elemImage.index)
																		}
																		alt={elemImage.name}
																	/>
																</p>
															))}
															{elemMessage.documents.map((elemDoc, index) => (
																<p0
																	key={
																		"messageDocument" +
																		elemMessage.id +
																		"img" +
																		index
																	}
																	style={{textAlign: "center"}}>
																	<a
																		href={
																			elemDoc.path +
																			"?token=" +
																			localStorage.admintoken
																		}
																		download>
																		{elemDoc.name}
																	</a>
																</p0>
															))}
														</td>
														<td>{getLocaleDateTime(elemMessage.created_at)}</td>
													</tr>
												))}
												{this.state.isOpen && (
													<Lightbox
														mainSrc={this.state.images[this.state.photoIndex]}
														nextSrc={
															this.state.images[
																(this.state.photoIndex + 1) % this.state.images.length
															]
														}
														prevSrc={
															this.state.images[
																(this.state.photoIndex + this.state.images.length - 1) %
																	this.state.images.length
															]
														}
														onCloseRequest={() => this.closeLightbox()}
														onMovePrevRequest={() =>
															this.setState({
																photoIndex:
																	this.state.photoIndex +
																	this.state.images.length -
																	(1 % this.state.images.length),
															})
														}
														onMoveNextRequest={() =>
															this.setState({
																photoIndex:
																	(this.state.photoIndex + 1) %
																	this.state.images.length,
															})
														}
													/>
												)}
											</tbody>
										</table>
									</div>
								</div>

								{this.state.statusId !== 1 && (
									<Grid container spacing={2} alignItems="flex-end" className={classes.marginField}>
										<Grid item xs={12}>
											<TextField
												label="Введите текст сообщения..."
												value={this.state.textMessage}
												name="textMessage"
												onChange={this.onChange}
												onKeyPress={this.sendMsgCtrlEnter}
												multiline
												fullWidth
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<Tooltip title="Прикрепить файл">
																<IconButton
																	aria-label="Прикрепить файл"
																	onClick={this.selectionImage}>
																	<AttachFileIcon />
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),

													endAdornment: (
														<InputAdornment position="end">
															<Tooltip title="Отправить сообщение">
																<IconButton
																	aria-label="Отправить сообщение"
																	onClick={this.sendMessage}>
																	<SendIcon />
																</IconButton>
															</Tooltip>
														</InputAdornment>
													),
												}}
											/>
										</Grid>
										<input
											id="imagesForMessageTickets"
											type="file"
											onChange={this.onChangeFileImageMessage}
											hidden
											multiple
										/>
										<Grid item xs={12}>
											<GridList>
												{this.state.imageFiles.url.map((file, index) => (
													<GridListTile key={index} rows={0.4} cols={0.4}>
														{this.state.imageFiles.file[index].type.indexOf("image") >
														-1 ? (
															<img
																src={file}
																alt={this.state.imageFiles.file[index].name}
																onClick={() => this.openLightboxCurrent(index)}
															/>
														) : (
															<p>{this.state.imageFiles.file[index].name}</p>
														)}

														<GridListTileBar
															className={classes.titleBar}
															titlePosition="top"
															actionPosition="right"
															actionIcon={
																<Tooltip title="Удалить">
																	<IconButton
																		size="small"
																		aria-label="Удалить"
																		onClick={e => this.delImageFiles(e, index)}>
																		<ClearIcon fontSize="small" />
																	</IconButton>
																</Tooltip>
															}
														/>
													</GridListTile>
												))}
												{this.state.isOpenCurrent && (
													<Lightbox
														mainSrc={
															this.state.imageFiles.url[this.state.photoIndexCurrent]
														}
														nextSrc={
															this.state.imageFiles.url[
																(this.state.photoIndexCurrent + 1) %
																	this.state.imageFiles.url.length
															]
														}
														prevSrc={
															this.state.imageFiles.url[
																(this.state.photoIndexCurrent +
																	this.state.imageFiles.url.length -
																	1) %
																	this.state.imageFiles.url.length
															]
														}
														onCloseRequest={() => this.closeLightboxCurrent()}
														onMovePrevRequest={() =>
															this.setState({
																photoIndexCurrent:
																	(this.state.photoIndexCurrent +
																		this.state.imageFiles.url.length -
																		1) %
																	this.state.imageFiles.url.length,
															})
														}
														onMoveNextRequest={() =>
															this.setState({
																photoIndexCurrent:
																	(this.state.photoIndexCurrent + 1) %
																	this.state.imageFiles.url.length,
															})
														}
													/>
												)}
											</GridList>
										</Grid>
									</Grid>
								)}
							</Paper>
						</Grid>

						<Grid item xs={12} sm={3}>
							<Paper className={classes.paper}>
								<Grid container spacing={2} className={classes.marginField}>
									<br />
									<Grid item xs={12}>
										<TextField
											label="ID тикета"
											value={this.state.id}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Язык пользователя"
											value={this.state.userLanguage}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Дата создания"
											value={this.state.created_at}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Тема"
											value={this.state.theme}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											label="Статус"
											value={this.state.status}
											fullWidth
											InputLabelProps={{
												shrink: true,
											}}
										/>
									</Grid>
									{this.state.statusId !== 1 && (
										<Grid item xs={12} align="center">
											<Button variant="contained" onClick={this.closeTickets}>
												Закрыть
											</Button>
										</Grid>
									)}
								</Grid>
							</Paper>
						</Grid>
					</Grid>
				</Container>
			</main>
		);
	}
}

const mapStateToProps = store => {
	return {
		userId: store.root.userId,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditTickets)));
