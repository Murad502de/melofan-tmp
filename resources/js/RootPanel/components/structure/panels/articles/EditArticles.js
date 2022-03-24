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
import {KeyboardDatePicker} from "@material-ui/pickers";
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

class EditArticles extends Component {
	constructor() {
		super();
		store.dispatch(setIsShowPreloader(true));
		this.state = {
			titlePage: "Добавление статьи",
			mainId: 0,
			numTab: 0,
			id: [],
			date: "",
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
		let mainId = this.props.match.params.idArticles;

		if (mainId) {
			this.setState({
				titlePage: "Редактирование статьи",
				mainId,
			});
			this.fillArticles(mainId);
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
	onChangeAnnounce = e => {
		let arrayAnnounce = this.state.announce;
		arrayAnnounce[this.state.numTab] = e.target.value;
		this.setState({announce: arrayAnnounce});
	};
	onChangeDate = e => {
		this.setState({date: e});
	};
	onChangeBody = value => {
		let arrayBodys = this.state.body;
		arrayBodys[this.state.numTab] = value;
		this.setState({body: arrayBodys});
	};
	onChangeFileImages = e => {
		let typeFile = e.target.files[0].type;
		typeFile = typeFile.split("/");

		if (
			typeFile === "image/png" ||
			typeFile === "image/jpeg" ||
			typeFile === "image/gif" ||
			typeFile === "image/bmp" ||
			typeFile === "image/vnd.microsoft.icon" ||
			typeFile === "image/tiff" ||
			typeFile === "image/svg+xml"
		) {
			let arrayFileImages = this.state.images;
			arrayFileImages.url[this.state.numTab] = URL.createObjectURL(e.target.files[0]);
			arrayFileImages.file[this.state.numTab] = e.target.files[0];
			this.setState({images: arrayFileImages});
		} else {
			this.setState({error: "Формат выбранного файла недоступен!"});
		}

		let inputFile = document.getElementById("mainImages");
		inputFile.value = null;
	};
	selectionImage = () => {
		document.getElementById("mainImages").click();
	};

	fillArticles = mainId => {
		let error = "Ошибка при получении новостей!";
		postRequest("get-articles", {
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
					date: "",
					images: {
						file: [],
						url: [],
					},
				};

				res.array.forEach(articles => {
					let index = arrayLanguage.indexOf(articles.language);
					if (index !== -1) {
						resultState.id[index] = articles.id;
						resultState.title[index] = articles.title;
						resultState.announce[index] = articles.announce;
						resultState.body[index] = articles.body;
						resultState.date = articles.created_at;
						resultState.images.url[index] = articles.image;
					} else {
						store.dispatch(setError(error));
						store.dispatch(setIsShowPreloader(false));
						this.props.history.push(this.props.basePath + "/articles");
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
				this.props.history.push(this.props.basePath + "/articles");
			});
	};

	addArticle = () => {
		store.dispatch(setIsShowProgress(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let articlesFormData = new FormData();

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

					articlesFormData.append("title" + index, this.state.title[index]);
					articlesFormData.append("announce" + index, this.state.announce[index]);
					articlesFormData.append("body" + index, this.state.body[index]);
					articlesFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				articlesFormData.append("isOneFile", String(isOneFile));
				if (isOneFile) {
					articlesFormData.append("image", this.state.images.file[0]);
				} else {
					for (let index = 0; index < countLanguage; index++) {
						articlesFormData.append("image" + index, this.state.images.file[index]);
					}
				}
				articlesFormData.append("date", getLocaleDateTime(this.state.date, "server"));
				articlesFormData.append("countLanguage", countLanguage);
				articlesFormData.append("token", localStorage.getItem("admintoken"));

				console.log(articlesFormData);

				postRequest(
					"create-articles",
					articlesFormData,
					{"Content-Type": "multipart/form-data"},
					itemUpload => {
						let percentUpload = Math.round((itemUpload.loaded / itemUpload.total) * 100);
						if (percentUpload === 100) {
							store.dispatch(setProgress(0));
							store.dispatch(setIsShowProgress(false));
							store.dispatch(setIsShowPreloader(true));
						} else {
							store.dispatch(setProgress(percentUpload));
						}
					}
				)
					.then(res => {
						if (res.success) {
							for (let index = 0; index < countLanguage; index++) {
								URL.revokeObjectURL(this.state.images.url[index]);
							}
							store.dispatch(setIsShowPreloader(false));
							this.props.history.push(this.props.basePath + "/articles");
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

	editArticle = () => {
		store.dispatch(setIsShowProgress(true));

		let error = "Все поля обязательны для заполнения на всех доступных языках! Проверьте все доступные поля!";
		let articlesFormData = new FormData();

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
					articlesFormData.append("id" + index, this.state.id[index]);
					articlesFormData.append("title" + index, this.state.title[index]);
					articlesFormData.append("announce" + index, this.state.announce[index]);
					articlesFormData.append("body" + index, this.state.body[index]);
					articlesFormData.append(
						"image" + index,
						this.state.images.file[index] ? this.state.images.file[index] : null
					);
					articlesFormData.append("languages" + index, this.props.language[index].id);
				} else {
					isValidate = false;
					break;
				}
			}

			if (isValidate) {
				articlesFormData.append("date", getLocaleDateTime(this.state.date, "server"));
				articlesFormData.append("countLanguage", countLanguage);
				articlesFormData.append("token", localStorage.getItem("admintoken"));

				postRequest("edit-articles", articlesFormData, {"Content-Type": "multipart/form-data"}, itemUpload => {
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
							this.props.history.push(this.props.basePath + "/articles");
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

	cancelArticle = () => {
		this.props.history.push(this.props.basePath + "/articles");
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
												<Button variant="contained" onClick={this.editArticle}>
													Сохранить
												</Button>
											) : (
												<Button variant="contained" onClick={this.addArticle}>
													Добавить
												</Button>
											)}
											<Button variant="contained" onClick={this.cancelArticle}>
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
									onChange={this.onChangeBody}
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
											variant="inline"
											views={["year", "month", "date"]}
											clearable
											format="dd.MM.yyyy"
											margin="normal"
											id="date-picker-inline"
											label="Дата"
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
											label="Заголовок"
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
											onChange={this.onChangeAnnounce}
										/>
									</Grid>
									<Grid item xs={12} align="center">
										<Button variant="contained" onClick={this.selectionImage}>
											Выбрать основное изображение
										</Button>
										<input id="mainImages" type="file" onChange={this.onChangeFileImages} hidden />
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

export default connect(mapStateToProps)(withStyles(styles)(withRouter(EditArticles)));
