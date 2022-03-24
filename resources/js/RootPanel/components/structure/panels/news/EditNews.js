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
import {KeyboardDatePicker} from "@material-ui/pickers";
import {connect} from "react-redux";
import {getLocaleDateTime} from "../../../../actions/time";

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
	cancelButton: {
		marginLeft: 3,
	},
});

class EditNews extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Добавление новости",
			mainId: 0,
			numTab: 0,
			id: [],
			date: null,
			title: [],
			announce: [],
			body: [],
			images: {
				file: [],
				url: [],
			},
		};
	}

	componentDidMount() {
		let mainId = this.props.match.params.idNews;

		if (mainId) {
			this.setState({
				titlePage: "Редактирование новости",
				mainId: mainId,
			});
			this.fillNews(mainId);
		} else {
			store.dispatch(setIsShowPreloader(false));
		}
	}

	onChangeTab = (event, newValue) => {
		this.setState({numTab: newValue});
	};
	onChangeTitleNew = e => {
		let arrayTitleNews = this.state.title;
		arrayTitleNews[this.state.numTab] = e.target.value;
		this.setState({title: arrayTitleNews});
	};
	onChangeAnnounceNew = e => {
		let arrayAnnounceNew = this.state.announce;
		arrayAnnounceNew[this.state.numTab] = e.target.value;
		this.setState({announce: arrayAnnounceNew});
	};
	onChangeDateNew = e => {
		this.setState({date: e});
	};
	onChangeBodyNew = value => {
		let arrayBodyNews = this.state.body;
		arrayBodyNews[this.state.numTab] = value;
		this.setState({body: arrayBodyNews});
	};
	onChangeFileImageNew = e => {
		let typeFile = e.target.files[0].type;

		if (
			typeFile === "image/png" ||
			typeFile === "image/jpeg" ||
			typeFile === "image/gif" ||
			typeFile === "image/bmp" ||
			typeFile === "image/vnd.microsoft.icon" ||
			typeFile === "image/tiff" ||
			typeFile === "image/svg+xml"
		) {
			let arrayFileImageNew = this.state.images;
			arrayFileImageNew.url[this.state.numTab] = URL.createObjectURL(e.target.files[0]);
			arrayFileImageNew.file[this.state.numTab] = e.target.files[0];
			this.setState({images: arrayFileImageNew});
		} else {
			this.setState({error: "Формат выбранного файла недоступен!"});
		}

		let inputFile = document.getElementById("mainImageNew");
		inputFile.value = null;
	};
	selectionImage = () => {
		document.getElementById("mainImageNew").click();
	};

	fillNews = mainId => {
		let error = "Ошибка при получении новостей!";
		postRequest("get-news", {
			id: mainId,
		})
			.then(res => {
				let arrayLanguage = [];
				this.props.language.forEach(lang => {
					arrayLanguage.push(lang.id);
				});

				let resultState = {
					id: [],
					title: [],
					announce: [],
					body: [],
					date: null,
					images: {
						file: [],
						url: [],
					},
				};

				res.array.forEach(news => {
					let index = arrayLanguage.indexOf(news.language);
					if (index !== -1) {
						resultState.id[index] = news.id;
						resultState.title[index] = news.title;
						resultState.announce[index] = news.announce;
						resultState.body[index] = news.body;
						resultState.date = news.created_at;
						resultState.images.url[index] = news.image;
					} else {
						store.dispatch(setError(error));
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/news");
					}
				});
				this.setState({
					id: resultState.id,
					title: resultState.title,
					announce: resultState.announce,
					body: resultState.body,
					date: resultState.date,
					images: resultState.images,
				});
				store.dispatch(setIsShowPreloader(false));
			})
			.catch(err => {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
				this.props.history.push(this.props.basePath + "/news");
			});
	};

	addNew = () => {
		store.dispatch(setIsShowProgress(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let newsFormData = new FormData();

		let countLanguage = this.props.language.length;
		if (
			this.state.title.length < countLanguage ||
			this.state.body.length < countLanguage ||
			this.state.announce.length < countLanguage ||
			!this.state.date ||
			this.state.images.file.length < countLanguage
		) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowPreloader(false));
		} else {
			let isValidate = false;
			let isOneFile = false;
			let file = this.state.images.file[0];

			for (let index = 0; index < countLanguage; index++) {
				if (
					this.state.title[index] &&
					this.state.body[index] &&
					this.state.body[index] !== "<p><br></p>" &&
					this.state.announce[index] &&
					this.state.date &&
					this.state.images.file[index]
				) {
					isValidate = true;
					isOneFile =
						file.type === this.state.images.file[index].type &&
						file.size === this.state.images.file[index].size &&
						file.name === this.state.images.file[index].name;

					newsFormData.append("title" + index, this.state.title[index]);
					newsFormData.append("announce" + index, this.state.announce[index]);
					newsFormData.append("body" + index, this.state.body[index]);
					newsFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("isOneFile", String(isOneFile));
				if (isOneFile) {
					newsFormData.append("image", this.state.images.file[0]);
				} else {
					for (let index = 0; index < countLanguage; index++) {
						newsFormData.append("image" + index, this.state.images.file[index]);
					}
				}
				newsFormData.append("date", getLocaleDateTime(this.state.date, "server"));
				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("token", localStorage.getItem("admintoken"));

				console.log(newsFormData);

				postRequest("create-news", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
								URL.revokeObjectURL(this.state.images.url[index]);
							}
							store.dispatch(setIsShowPreloader(false));
							this.props.history.push(this.props.basePath + "/news");
						} else {
							store.dispatch(
								setError("Не удалось выполнить сохранение. Проверьте правильность введнных данных.")
							);
							store.dispatch(setIsShowPreloader(false));
						}
					})
					.catch(err => {
						store.dispatch(setError(err));
						store.dispatch(setIsShowPreloader(false));
					});
			} else {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
			}
		}
	};

	editNew = () => {
		store.dispatch(setIsShowProgress(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let newsFormData = new FormData();

		let countLanguage = this.props.language.length;
		if (
			this.state.title.length < countLanguage ||
			this.state.announce.length < countLanguage ||
			!this.state.date ||
			this.state.body.length < countLanguage
		) {
			store.dispatch(setError(error));
			store.dispatch(setIsShowPreloader(false));
		} else {
			let isValidate = false;

			for (let index = 0; index < countLanguage; index++) {
				if (
					this.state.title[index] &&
					this.state.body[index] &&
					this.state.body[index] !== "<p><br></p>" &&
					this.state.announce[index] &&
					this.state.date
				) {
					isValidate = true;
					newsFormData.append("id" + index, this.state.id[index]);
					newsFormData.append("title" + index, this.state.title[index]);
					newsFormData.append("announce" + index, this.state.announce[index]);
					newsFormData.append("body" + index, this.state.body[index]);
					newsFormData.append(
						"image" + index,
						this.state.images.file[index] ? this.state.images.file[index] : null
					);
					newsFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				newsFormData.append("date", getLocaleDateTime(this.state.date, "server"));
				newsFormData.append("countLanguage", countLanguage);
				newsFormData.append("token", localStorage.getItem("admintoken"));

				postRequest("edit-news", newsFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
								if (this.state.images.file[index]) {
									URL.revokeObjectURL(this.state.images.url[index]);
								}
							}
							store.dispatch(setIsShowPreloader(false));
							this.props.history.push(this.props.basePath + "/news");
						} else {
							store.dispatch(
								setError("Не удалось выполнить сохранение. Проверьте правильность введнных данных.")
							);
							store.dispatch(setIsShowPreloader(false));
						}
					})
					.catch(err => {
						store.dispatch(setError(err));
						store.dispatch(setIsShowPreloader(false));
					});
			} else {
				store.dispatch(setError(error));
				store.dispatch(setIsShowPreloader(false));
			}
		}
	};

	cancelNew = () => {
		this.props.history.push(this.props.basePath + "/news");
	};

	render() {
		const {classes, language} = this.props;

		let buttonComplex = buttonList.complex;
		buttonComplex[8] = ["image", "imageGallery", "video", "audio", "link"];

		console.log(this.state.date);

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
												<Button variant="contained" onClick={this.editNew}>
													Сохранить
												</Button>
											) : (
												<Button variant="contained" onClick={this.addNew}>
													Добавить
												</Button>
											)}
											<Button variant="contained" onClick={this.cancelNew}>
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

						<Grid item xs={12} sm={8}>
							<Paper className={classes.paper}>
								<SunEditor
									lang="ru"
									placeholder="Введите содержание..."
									width="100%"
									height={window.innerHeight - 500}
									setOptions={{
										buttonList: buttonComplex,
										imageMultipleFile: true,
										imageGalleryUrl: "api/getGalleryFileForText?token=" + localStorage.admintoken,
										imageUploadUrl: "api/saveFileForText?token=" + localStorage.admintoken,
									}}
									onChange={this.onChangeBodyNew}
									setContents={
										this.state.body[this.state.numTab] ? this.state.body[this.state.numTab] : ""
									}
								/>
							</Paper>
						</Grid>
						<Grid item xs={12} sm={4}>
							<Paper className={classes.paper}>
								<Grid container direction="column" justify="flex-start" spacing={3}>
									<Grid item xs={12}>
										<KeyboardDatePicker
											format="dd.MM.yyyy"
											margin="normal"
											id="date-picker-inline"
											label="Дата"
											className={classes.textField}
											value={this.state.date}
											onChange={this.onChangeDateNew}
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
											label="Заголовок"
											multiline
											fullWidth
											value={
												this.state.title[this.state.numTab]
													? this.state.title[this.state.numTab]
													: ""
											}
											onChange={this.onChangeTitleNew}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											name="announce"
											error={false}
											id="standard-error-helper-text"
											label="Анонс"
											multiline
											fullWidth
											value={
												this.state.announce[this.state.numTab]
													? this.state.announce[this.state.numTab]
													: ""
											}
											onChange={this.onChangeAnnounceNew}
										/>
									</Grid>
									<Grid item xs={12} align="center">
										<Button variant="contained" onClick={this.selectionImage}>
											Выбрать основное изображение
										</Button>
										<input
											id="mainImageNew"
											type="file"
											onChange={this.onChangeFileImageNew}
											hidden
										/>
									</Grid>
									<Grid item xs={12}>
										<img
											width="100%"
											src={
												this.state.images.url[this.state.numTab]
													? this.state.images.url[this.state.numTab]
													: ""
											}
											alt=""
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditNews)));
