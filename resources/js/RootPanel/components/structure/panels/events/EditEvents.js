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
import SunEditor, {buttonList} from "suneditor-react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {connect} from "react-redux";
import {getLocaleDateTime} from "../../../../actions/time";
import {KeyboardDatePicker} from "@material-ui/pickers";

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
});

class EditEvents extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Добавление события",
			mainId: 0,
			numTab: 0,
			id: [],
			title: [],
			body: [],
			progressUpload: 0,
			date: "",
			dataFiles: {
				name: [],
				file: [],
				url: [],
			},
		};
	}

	componentDidMount() {
		let id = this.props.match.params.idEvent;

		if (id) {
			this.setState({
				titlePage: "Редактирование события",
				mainId: id,
			});
			this.fillMedia(id);
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChangeTab = (event, newValue) => {
		this.setState({numTab: newValue});
	};
	onChangeTitle = e => {
		let arrayTitles = this.state.title;
		arrayTitles[this.state.numTab] = e.target.value;
		this.setState({title: arrayTitles});
	};
	onChangeBody = value => {
		let arrayBodys = this.state.body;
		arrayBodys[this.state.numTab] = value;
		this.setState({body: arrayBodys});
	};
	onChangeDate = e => {
		this.setState({date: e});
	};
	onChangeNameEvent = e => {
		let arrayFileEvent = this.state.dataFiles;
		arrayFileEvent.name[this.state.numTab] = e.target.value;
		this.setState({dataFiles: arrayFileEvent});
	};
	onChangeDataFiles = e => {
		let typeFile = e.target.files[0].type;

		if (
			typeFile === "application/pdf" ||
			typeFile === "application/msword" ||
			typeFile === "application/rtf" ||
			typeFile === "application/vnd.oasis.opendocument.text"
		) {
			let arrayFileEvent = this.state.dataFiles;
			arrayFileEvent.url[this.state.numTab] = e.target.files[0].name;
			arrayFileEvent.file[this.state.numTab] = e.target.files[0];
			this.setState({dataFiles: arrayFileEvent});
		} else {
			this.setState({error: "Формат выбранного документа недоступен!"});
		}

		let inputFile = event.getElementById("mainDataFiles");
		inputFile.value = null;
	};
	selectionMedia = () => {
		event.getElementById("mainDataFiles").click();
	};

	fillMedia = id => {
		let error = "Ошибка при получении данных!";
		postRequest("get-events", {id: id})
			.then(res => {
				let arrayLanguage = [];
				this.props.language.forEach(lang => {
					arrayLanguage.push(lang.id);
				});

				let resultState = {
					id: [],
					title: [],
					body: [],
					date: "",
					dataFiles: {
						name: [],
						file: [],
						url: [],
					},
				};

				res.array.forEach(event => {
					let index = arrayLanguage.indexOf(event.language);
					if (index !== -1) {
						resultState.id[index] = event.id;
						resultState.title[index] = event.title;
						resultState.body[index] = event.body;
						resultState.date = event.created_at;
						resultState.dataFiles.name[index] = event.name;
						resultState.dataFiles.url[index] = event.path;
					} else {
						store.dispatch(setError(error));
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/events");
					}
				});
				this.setState({
					id: resultState.id,
					title: resultState.title,
					body: resultState.body,
					date: resultState.date,
					dataFiles: resultState.dataFiles,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/events");
			});
	};

	addEvent = () => {
		store.dispatch(setIsShowProgress(true));

		let error =
			"Проверьте все поля обязательные для заполнения на всех доступных языках! При заполнении необязательного поля на одном языке необходимо замолнить его на всех языках!";
		let newsFormData = new FormData();
		let countLanguage = this.props.language.length;
		if (
			this.state.title.length < countLanguage ||
			!this.state.date ||
			(this.state.dataFiles.file.length > 0 &&
				(this.state.dataFiles.file < countLanguage || this.state.dataFiles.name < countLanguage)) ||
			(this.state.body.length > 0 && this.state.body.length < countLanguage)
		) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowProgress(false));
		} else {
			let isSelectedFiles = this.state.dataFiles.file.length > 0;
			let isChangeBody = this.state.body.length > 0;
			let isValidate = false;

			for (let index = 0; index < countLanguage; index++) {
				if (
					this.state.title[index] &&
					(isChangeBody ? this.state.body[index] && this.state.body[index] !== "<p><br></p>" : true) &&
					(isSelectedFiles ? this.state.dataFiles.file[index] && this.state.dataFiles.name[index] : true)
				) {
					isValidate = true;
					newsFormData.append("title" + index, this.state.title[index]);
					newsFormData.append("body" + index, isChangeBody ? this.state.body[index] : "");
					newsFormData.append("languages" + index, this.props.language[index].id);

					if (isSelectedFiles) {
						newsFormData.append("name" + index, this.state.dataFiles.name[index]);
						newsFormData.append("file" + index, this.state.dataFiles.file[index]);

						let _size = this.state.dataFiles.file[index].size;
						let fSExt = ["Bytes", "KB", "MB", "GB"];
						let i = 0;
						while (_size > 900) {
							_size /= 1024;
							i++;
						}
						let exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
						newsFormData.append("size" + index, exactSize);
					}
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("date", getLocaleDateTime(this.state.date, "server"));
				newsFormData.append("isSelectedFiles", String(isSelectedFiles));
				newsFormData.append("token", localStorage.getItem("admintoken"));

				postRequest("create-events", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
							for (let index = 0; index < countLanguage; index++) {
								URL.revokeObjectURL(this.state.dataFiles.url[index]);
							}
							store.dispatch(setIsShowProgress(false));
							this.props.history.push(this.props.basePath + "/events");
						} else {
							store.dispatch(
								setError("Не удалось выполнить сохранение. Проверьте правильность введнных данных.")
							);
							store.dispatch(setIsShowProgress(false));
						}
					})
					.catch(err => {
						store.dispatch(setError(err));
						store.dispatch(setIsShowProgress(false));
					});
			} else {
				store.dispatch(setError(error));
				store.dispatch(setIsShowProgress(false));
			}
		}
	};

	editEvent = () => {
		store.dispatch(setIsShowProgress(true));

		let error =
			"Проверьте все поля обязательные для заполнения на всех доступных языках! При заполнении необязательного поля на одном языке необходимо замолнить его на всех языках!";
		let newsFormData = new FormData();

		let countLanguage = this.props.language.length;
		if (
			this.state.title.length < countLanguage ||
			!this.state.date ||
			(this.state.body.length > 0 && this.state.body.length < countLanguage)
		) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowProgress(false));
		} else {
			let isSelectedFiles = this.state.dataFiles.file.length > 0;
			let isSelectedUrl = this.state.dataFiles.url.length > 0;
			let isChangeBody = this.state.body.length > 0;
			let isValidate = false;

			for (let index = 0; index < countLanguage; index++) {
				if (
					this.state.title[index] &&
					(isChangeBody ? this.state.body[index] && this.state.body[index] !== "<p><br></p>" : true) &&
					(isSelectedFiles || isSelectedUrl ? this.state.dataFiles.name[index] : true)
				) {
					isValidate = true;
					newsFormData.append("id" + index, this.state.id[index]);
					newsFormData.append("title" + index, this.state.title[index]);
					newsFormData.append("body" + index, isChangeBody ? this.state.body[index] : "");
					newsFormData.append("languages" + index, this.props.language[index].id);

					newsFormData.append("name" + index, this.state.dataFiles.name[index]);
					let file = this.state.dataFiles.file[index] ? this.state.dataFiles.file[index] : null;
					newsFormData.append("file" + index, file);

					if (file) {
						let _size = this.state.dataFiles.file[index].size;
						let fSExt = ["Bytes", "KB", "MB", "GB"];
						let i = 0;
						while (_size > 900) {
							_size /= 1024;
							i++;
						}
						let exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
						newsFormData.append("size" + index, exactSize);
					}
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("date", getLocaleDateTime(this.state.date, "server"));
				newsFormData.append("isSelectedFiles", String(isSelectedFiles));
				newsFormData.append("isSelectedUrl", String(isSelectedUrl));
				newsFormData.append("token", localStorage.getItem("admintoken"));

				postRequest("edit-events", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
							for (let index = 0; index < countLanguage; index++) {
								if (this.state.dataFiles.file[index]) {
									URL.revokeObjectURL(this.state.dataFiles.url[index]);
								}
							}
							store.dispatch(setIsShowProgress(false));
							this.props.history.push(this.props.basePath + "/events");
						} else {
							store.dispatch(
								setError("Не удалось выполнить сохранение. Проверьте правильность введнных данных.")
							);
							store.dispatch(setIsShowProgress(false));
						}
					})
					.catch(err => {
						store.dispatch(setError(err));
						store.dispatch(setIsShowProgress(false));
					});
			} else {
				store.dispatch(setError(error));
				store.dispatch(setIsShowProgress(false));
			}
		}
	};

	cancelEvent = () => {
		this.props.history.push(this.props.basePath + "/events");
	};

	render() {
		const {classes, language} = this.props;
		let buttonComplex = buttonList.complex;
		buttonComplex[8] = ["image", "imageGallery", "video", "audio", "link"];

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
											{this.state.mainId > 0 ? (
												<Button variant="contained" onClick={this.editEvent}>
													Сохранить
												</Button>
											) : (
												<Button variant="contained" onClick={this.addEvent}>
													Добавить
												</Button>
											)}
											<Button variant="contained" onClick={this.cancelEvent}>
												Назад
											</Button>
										</ButtonGroup>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paperTabs}>
								<Tabs
									value={this.state.numTab}
									onChange={this.onChangeTab}
									indicatorColor="primary"
									textColor="primary"
									variant="scrollable"
									scrollButtons="auto">
									{language.map(lang => (
										<Tab label={lang.title} key={lang.id} />
									))}
								</Tabs>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<Grid item xs={12}>
										<KeyboardDatePicker
											variant="inline"
											views={["year", "month", "date"]}
											clearable
											format="dd.MM.yyyy"
											margin="normal"
											id="date-picker-inline"
											label="* Дата"
											className={classes.textField}
											value={this.state.date}
											onChange={this.onChangeDate}
											InputLabelProps={{
												shrink: true,
											}}
											fullWidth
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											name="title"
											error={false}
											id="standard-error-helper-text"
											label="* Заголовок"
											multiline
											fullWidth
											value={
												this.state.title[this.state.numTab]
													? this.state.title[this.state.numTab]
													: ""
											}
											onChange={this.onChangeTitle}
										/>
									</Grid>
									<SunEditor
										lang="ru"
										placeholder="Введите содержание..."
										width="100%"
										setOptions={{
											buttonList: buttonComplex,
											imageMultipleFile: true,
											imageGalleryUrl:
												"api/getGalleryFileForText?token=" + localStorage.admintoken,
											imageUploadUrl: "api/saveFileForText?token=" + localStorage.admintoken,
										}}
										onChange={this.onChangeBody}
										setContents={
											this.state.body[this.state.numTab] ? this.state.body[this.state.numTab] : ""
										}
									/>
								</Grid>
							</Paper>
						</Grid>

						<Grid item xs={12}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<Grid item xs={12}>
										<TextField
											name="titleNew"
											error={false}
											id="standard-error-helper-text"
											label="Наименование файла"
											multiline
											fullWidth
											value={
												this.state.dataFiles.name[this.state.numTab]
													? this.state.dataFiles.name[this.state.numTab]
													: ""
											}
											onChange={this.onChangeNameEvent}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											name="nameEvent"
											error={false}
											id="standard-error-helper-text"
											label="Загружаемый файл"
											multiline
											fullWidth
											value={
												this.state.dataFiles.url[this.state.numTab]
													? this.state.dataFiles.url[this.state.numTab]
													: "Не выбран"
											}
											disabled
										/>
									</Grid>
									<Grid item xs={12} align="center">
										<Button variant="contained" onClick={this.selectionMedia}>
											Выбрать файл
										</Button>
										<input
											id="mainDataFiles"
											type="file"
											hidden
											onChange={this.onChangeDataFiles}
										/>
									</Grid>
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
		language: store.root.language,
	};
};

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditEvents)));
