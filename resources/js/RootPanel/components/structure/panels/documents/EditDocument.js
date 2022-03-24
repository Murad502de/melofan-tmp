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
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {connect} from "react-redux";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

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

class EditDocument extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Добавление документа",
			mainId: 0,
			numTab: 0,
			id: [],
			progressUpload: 0,
			name: [],
			isDisplay: false,
			urlConfirm: "",
			dataFiles: {
				file: [],
				url: [],
			},
		};
	}

	componentDidMount() {
		let mainId = this.props.match.params.idDocument;

		if (mainId) {
			this.setState({
				titlePage: "Редактирование документа",
				mainId,
			});
			this.fillMedia(mainId);
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChangeTab = (event, newValue) => {
		this.setState({numTab: newValue});
	};
	onChangeName = e => {
		let arrayName = this.state.name;
		arrayName[this.state.numTab] = e.target.value;
		this.setState({name: arrayName});
	};
	onChangeConfirmDocument = e => {
		this.setState({urlConfirm: e.target.value});
	};
	onChangeSwitch = e => {
		this.setState({isDisplay: e.target.checked});
	};
	onChangeDataFiles = e => {
		let typeFile = e.target.files[0].type;

		if (
			typeFile === "application/pdf" ||
			typeFile === "application/msword" ||
			typeFile === "application/rtf" ||
			typeFile === "application/vnd.oasis.opendocument.text"
		) {
			let arrayFileDocument = this.state.dataFiles;
			arrayFileDocument.url[this.state.numTab] = e.target.files[0].name;
			arrayFileDocument.file[this.state.numTab] = e.target.files[0];
			this.setState({dataFiles: arrayFileDocument});
		} else {
			this.setState({error: "Формат выбранного документа недоступен!"});
		}

		let inputFile = document.getElementById("mainDataFiles");
		inputFile.value = null;
	};
	selectionMedia = () => {
		document.getElementById("mainDataFiles").click();
	};

	fillMedia = id => {
		let error = "Ошибка при получении данных!";
		postRequest("get-documents", {id: id})
			.then(res => {
				let arrayLanguage = [];
				this.props.language.forEach(lang => {
					arrayLanguage.push(lang.id);
				});

				let resultState = {
					id: [],
					name: [],
					isDisplay: false,
					urlConfirm: "",
					dataFiles: {
						file: [],
						url: [],
					},
				};

				res.array.forEach(document => {
					let index = arrayLanguage.indexOf(document.language);
					if (index !== -1) {
						resultState.id[index] = document.id;
						resultState.name[index] = document.name;
						resultState.isDisplay = document.isDisplay == 1;
						resultState.urlConfirm = document.urlConfirm;
						resultState.dataFiles.url[index] = document.path;
					} else {
						store.dispatch(setError(error));
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/documents");
					}
				});
				this.setState({
					id: resultState.id,
					name: resultState.name,
					isDisplay: resultState.isDisplay,
					urlConfirm: resultState.urlConfirm,
					dataFiles: resultState.dataFiles,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/documents");
			});
	};

	addDocument = () => {
		store.dispatch(setIsShowProgress(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let newsFormData = new FormData();
		let countLanguage = this.props.language.length;
		if (this.state.name.length < countLanguage || this.state.dataFiles.file.length < countLanguage) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowProgress(false));
		} else {
			let isValidate = false;
			let isOneFile = false;
			let file = this.state.dataFiles.file[0];
			for (let index = 0; index < countLanguage; index++) {
				if (this.state.name[index] && this.state.dataFiles.file[index]) {
					isValidate = true;
					isOneFile =
						file.size === this.state.dataFiles.file[index].size &&
						file.name === this.state.dataFiles.file[index].name;

					newsFormData.append("name" + index, this.state.name[index]);
					newsFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("isOneFile", String(isOneFile));
				if (isOneFile) {
					newsFormData.append("file", this.state.dataFiles.file[0]);

					let _size = this.state.dataFiles.file[0].size;
					let fSExt = ["Bytes", "KB", "MB", "GB"];
					let i = 0;
					while (_size > 900) {
						_size /= 1024;
						i++;
					}
					let exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
					newsFormData.append("size", exactSize);
				} else {
					for (let index = 0; index < countLanguage; index++) {
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
				}

				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("isDisplay", this.state.isDisplay);
				newsFormData.append("urlConfirm", this.state.urlConfirm);
				newsFormData.append("token", localStorage.getItem("admintoken"));

				postRequest("create-documents", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
							this.props.history.push(this.props.basePath + "/documents");
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

	editDocument = () => {
		store.dispatch(setIsShowProgress(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let newsFormData = new FormData();

		let countLanguage = this.props.language.length;
		if (this.state.name.length < countLanguage) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowProgress(false));
		} else {
			let isValidate = false;

			for (let index = 0; index < countLanguage; index++) {
				if (this.state.name[index]) {
					isValidate = true;
					newsFormData.append("id" + index, this.state.id[index]);
					newsFormData.append("name" + index, this.state.name[index]);
					newsFormData.append(
						"file" + index,
						this.state.dataFiles.file[index] ? this.state.dataFiles.file[index] : null
					);

					let _size = this.state.dataFiles.file[index] ? this.state.dataFiles.file[index].size : 0;
					let fSExt = ["Bytes", "KB", "MB", "GB"];
					let i = 0;
					while (_size > 900) {
						_size /= 1024;
						i++;
					}
					let exactSize = Math.round(_size * 100) / 100 + " " + fSExt[i];
					newsFormData.append("size" + index, exactSize != 0 ? exactSize : null);
					newsFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("isDisplay", this.state.isDisplay);
				newsFormData.append("urlConfirm", this.state.urlConfirm);
				newsFormData.append("token", localStorage.getItem("admintoken"));

				postRequest("edit-documents", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
							this.props.history.push(this.props.basePath + "/documents");
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

	cancelDocument = () => {
		this.props.history.push(this.props.basePath + "/documents");
	};

	render() {
		const {classes, language} = this.props;

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
												<Button variant="contained" onClick={this.editDocument}>
													Сохранить
												</Button>
											) : (
												<Button variant="contained" onClick={this.addDocument}>
													Добавить
												</Button>
											)}
											<Button variant="contained" onClick={this.cancelDocument}>
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
										<TextField
											name="titleNew"
											error={false}
											id="standard-error-helper-text"
											label="Наименование"
											multiline
											fullWidth
											value={
												this.state.name[this.state.numTab]
													? this.state.name[this.state.numTab]
													: ""
											}
											onChange={this.onChangeName}
										/>
									</Grid>
									<Grid item xs={12}>
										<FormControlLabel
											control={
												<Switch
													checked={this.state.isDisplay}
													onChange={this.onChangeSwitch}
													name="isDisplay"
													color="primary"
												/>
											}
											label="Отображать на сайте"
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											name="urlConfirm"
											error={false}
											id="standard-error-helper-text"
											label="URL подтверждения (необязательно)"
											type="email"
											multiline
											fullWidth
											value={this.state.urlConfirm}
											onChange={this.onChangeConfirmDocument}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											name="name"
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
											Выбрать документ
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditDocument)));
