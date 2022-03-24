import React, { useEffect, useLayoutEffect, useState } from "react"
import { Col, Container, Form, Modal, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
import { store } from "../../../../store/configureStore"
import { setIsShowPreloader } from "../../../../actions/preloader"
import { setError, setMessage } from "../../../../actions/notification"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import { setAvatar as setAvatarState, setCash } from "../../../../actions/user"
import Google_Authenticator_logo from "../../../../../images/Google_Authenticator_logo.png"
import PhoneInput from "react-phone-input-2"
import InputMask from "react-input-mask"
import { WarningSvg } from "../../../other/Svg"
import Avatar from "react-avatar-edit"
import AuthenticatorModalEnable from "./AuthenticatorModalEnable"
import AuthenticatorModalDisable from "./AuthenticatorModalDisable"
import { getLocaleDateTime } from "../../../../actions/time"

const Settings = () => {
    const [ modal2faEnableShow, setModal2faEnableShow ] = React.useState(false)
    const [ modal2faDisableShow, setModal2faDisableShow ] = React.useState(false)

    const { executeRecaptcha } = useGoogleReCaptcha()
    const [ state, setDataState ] = useState({
        oldAvatar: null,
        avatar: null,
        srcAvatar: "",
        openModal: false,
        id: "",
        phone: "",
        email: "",
        firstName: "",
        lastName: "",
        birthday: "",
        country: "",
        city: "",
        address: "",
        mentor: {},
        password: "",
        password_confirmation: "",
        old_password: "",
        referral: "",
        payeer: "",
        is2faEnable: false,
    })
    const languageText = useSelector(state => state.languageCurrent.languageText)
    const payeer = useSelector(state => state.user.payeer)

    useLayoutEffect(() => {
        store.dispatch(setIsShowPreloader(true))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
        postRequest("getDataForSettings", {
            token: localStorage.usertoken,
        })
            .then(res => {
                if ( res.success ) {
                    setState({
                        ...res.user,
                        birthday: getLocaleDateTime(res.user.birthday + " 00:00:00", "date"),
                        oldAvatar: res.user.avatar,
                        is2faEnable: res.user.is2faEnable == 1,
                    })
                    store.dispatch(setIsShowPreloader(false))
                } else {
                    store.dispatch(setError(languageText[ "getDataError" ]))
                    store.dispatch(setIsShowPreloader(false))
                }
            })
            .catch(err => {
                store.dispatch(setError(languageText[ "getDataError" ]))
                store.dispatch(setIsShowPreloader(false))
            })
    }, [])

    const setState = (newState = {}) => {
        setDataState(state => {
            return { ...state, ...newState }
        })
    }

    const editPassword = async e => {
        e.preventDefault()
        store.dispatch(setIsShowPreloader(true))
        let captcha = await executeRecaptcha("EditPassword")

        let passwd = {
            old_password: state.old_password,
            password: state.password,
            password_confirmation: state.password_confirmation,
            captcha,
        }

        postRequest("editPassword", passwd)
            .then(res => {
                if ( res.success ) {
                    store.dispatch(setMessage(languageText[ "editPasswordSuccess" ]))
                    setState({
                        old_password: "",
                        password: "",
                        password_confirmation: "",
                    })
                    store.dispatch(setIsShowPreloader(false))
                } else {
                    if ( res.error === 1 ) {
                        store.dispatch(setError(languageText[ "editPasswordError" ]))
                    } else {
                        store.dispatch(setError(languageText[ "registerPasswordError2" ]))
                    }
                    store.dispatch(setIsShowPreloader(false))
                }
            })
            .catch(err => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.errors &&
                    err.response.data.errors.password
                ) {
                    store.dispatch(setError(languageText[ "registerPasswordError2" ]))
                } else {
                    store.dispatch(setError(languageText[ "editUserFieldError" ]))
                }
                store.dispatch(setIsShowPreloader(false))
            })
    }

    const editCash = async e => {
        e.preventDefault()
        store.dispatch(setIsShowPreloader(true))
        let captcha = await executeRecaptcha("EditPassword")

        let payeer = state.payeer
        postRequest("editCash", {
            data: { payeer },
            captcha,
        })
            .then(res => {
                if ( res.success ) {
                    store.dispatch(setMessage(languageText[ "editUserFieldSuccess" ]))
                    store.dispatch(setCash(res.dataCash))
                    store.dispatch(setIsShowPreloader(false))
                } else {
                    store.dispatch(setError(languageText[ "editUserFieldError" ]))
                    store.dispatch(setIsShowPreloader(false))
                }
            })
            .catch(err => {
                store.dispatch(setError(languageText[ "editUserFieldError" ]))
                store.dispatch(setIsShowPreloader(false))
            })
    }

    const onCropAvatar = avatar => {
        setState({ avatar })
    }

    const onOpenModal = e => {
        e.preventDefault()
        setState({
            openModal: true,
        })
    }

    const onCloseModal = () => {
        setState({
            avatar: state.oldAvatar,
            srcAvatar: "",
            openModal: false,
        })
    }

    const setAvatar = async (e, isDelAvatar = false) => {
        e.preventDefault()
        store.dispatch(setIsShowPreloader(true))
        let captcha = await executeRecaptcha("EditAvatar")

        let avatar = null
        if ( !isDelAvatar ) {
            avatar = state.avatar
        }

        postRequest("editAvatar", {
            avatar,
            captcha,
        })
            .then(res => {
                if ( res.success ) {
                    store.dispatch(setAvatarState(res.avatar))
                    setState({ avatar: res.avatar, oldAvatar: res.avatar })
                    setState({ openModal: false })
                    store.dispatch(setMessage(languageText[ "editUserFieldSuccess" ]))
                    store.dispatch(setIsShowPreloader(false))
                } else {
                    store.dispatch(setError(languageText[ "editUserFieldError" ]))
                    store.dispatch(setIsShowPreloader(false))
                }
            })
            .catch(err => {
                store.dispatch(setError(languageText[ "editUserFieldError" ]))
                store.dispatch(setIsShowPreloader(false))
            })
    }

    const openModal2FA = () => {
        if ( state.is2faEnable ) {
            setModal2faDisableShow(true)
        } else {
            setModal2faEnableShow(true)
        }
    }

    let passwordValidate = state.password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,255}$/)

    return (
        <div className="content verification">
            <Container fluid>
                <Row>
                    <Col lg={12}>
                        <h4 className="content__title">{languageText[ "textSettings1" ]}</h4>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6}>
                        <div className="wrapper-box">
                            <Form className="cabinet-form mt-0">
                                <div className="avatar-change mb-3">
                                    <div className="avatar-change__photo" onClick={onOpenModal}>
                                        <img src={state.avatar} alt=""/>
                                    </div>
                                    <div className="avatar-change__right">
                                        <button className="btn-main d-inline-block" onClick={onOpenModal}>
                                            {languageText[ "textSettings2" ]}
                                        </button>
                                        <button
                                            className="btn-outline d-inline-block"
                                            onClick={e => setAvatar(e, true)}>
                                            {languageText[ "textSettings3" ]}
                                        </button>
                                    </div>
                                    <Modal
                                        show={state.openModal}
                                        className="modalPhotoChange"
                                        onHide={onCloseModal}
                                        backdrop="static"
                                        centered>
                                        <form onSubmit={setAvatar}>
                                            <Modal.Header closeButton>
                                                <p className="mb-0">{languageText[ "textSettings31" ]}</p>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Row>
                                                    <Col lg={12} align="center">
                                                        <Avatar
                                                            label={languageText[ "textSettings32" ]}
                                                            width={300}
                                                            height={300}
                                                            imageWidth={500}
                                                            onCrop={e => onCropAvatar(e)}
                                                            onClose={() => onCropAvatar(null)}
                                                            src={state.srcAvatar}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <button className="btn-main mx-auto d-inline-block" type="submit">
                                                    {languageText[ "textSettings33" ]}
                                                </button>
                                            </Modal.Footer>
                                        </form>
                                    </Modal>
                                </div>
                                <p className="text-muted">{languageText[ "textSettings4" ]}</p>
                                <Form.Group as={Row} controlId="verifName">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings5" ]}
                                    </Form.Label>
                                    <Col sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.firstName}
                                            disabled
                                            placeholder={languageText[ "textSettings6" ]}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="verifFirstName">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings7" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.lastName}
                                            disabled
                                            placeholder={languageText[ "textSettings8" ]}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="verifDateBDay">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings9" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.birthday}
                                            disabled
                                            placeholder={languageText[ "textSettings25" ]}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="verifEmail">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings26" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.email}
                                            disabled
                                            placeholder={languageText[ "textSettings27" ]}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="verifPhone">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings28" ]}
                                    </Form.Label>
                                    <PhoneInput
                                        placeholder={languageText[ "textSettings29" ]}
                                        value={state.phone}
                                        containerClass="col-md-8 col-sm-12"
                                        country={"ru"}
                                        specialLabel=""
                                        disabled
                                        disableSearchIcon={true}
                                        disableDropdown={true}
                                    />
                                </Form.Group>
                                <hr className="mt-4"/>
                                <p className="text-muted">{languageText[ "textSettings10" ]}</p>
                                <Form.Group as={Row} controlId="verifCountry">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings11" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.country}
                                            disabled
                                            placeholder={languageText[ "textSettings12" ]}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="verifCity">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings13" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.city}
                                            disabled
                                            placeholder={languageText[ "textSettings14" ]}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId="verifAddress">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings15" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <Form.Control
                                            type="text"
                                            value={state.address}
                                            disabled
                                            placeholder={languageText[ "textSettings16" ]}
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </div>
                        <div className="wrapper-box">
                            <p className="text-muted">{languageText[ "textSettings34" ]}</p>
                            <Row>
                                <Col sm="12" md="7" className="text-center text-md-start">
                                    <div
                                        className="d-flex align-items-center justify-content-md-start justify-content-center">
                                        <img src={Google_Authenticator_logo} className="me-2" alt=""/> Google
                                        Authentificator
                                    </div>
                                </Col>
                                <Col sm="12" md="5">
                                    <button
                                        onClick={() => openModal2FA()}
                                        className="btn-main d-block ms-auto me-auto me-md-0 mt-3 mt-md-0">
                                        {state.is2faEnable
                                            ? languageText[ "textSettings36" ]
                                            : languageText[ "textSettings35" ]}
                                    </button>
                                </Col>
                            </Row>
                            <AuthenticatorModalEnable
                                show={modal2faEnableShow}
                                onHide={() => setModal2faEnableShow(false)}
                                is2faEnable={state.is2faEnable}
                                setIs2faEnable={is2fa => setState({ is2faEnable: is2fa })}
                            />
                            <AuthenticatorModalDisable
                                show={modal2faDisableShow}
                                onHide={() => setModal2faDisableShow(false)}
                                is2faEnable={state.is2faEnable}
                                setIs2faEnable={is2fa => setState({ is2faEnable: is2fa })}
                            />
                        </div>
                    </Col>
                    <Col xl={6}>
                        <div className="wrapper-box" style={{ fontSize: '14' }}>
                            <p className="text-muted">{languageText[ "mentor" ]}</p>

                            <div className={'row'}>
                                <Col className={'mt-3'} column="true" sm="12" md="4">
                                    {languageText[ "mentor_name" ]}
                                </Col>
                                <Col className={'mt-3'} column="true" sm="12" md="7">
                                    {state.mentor.firstName + ' ' + state.mentor.lastName}
                                </Col>
                            </div>

                            <div className={'row'}>
                                <Col className={'mt-3'} column="true" sm="12" md="4">
                                    {languageText[ "textSettings26" ]}
                                </Col>
                                <Col className={'mt-3'} column="true" sm="12" md="7">
                                    <a href={'mailto:'+  state.mentor.email}>{ state.mentor.email}</a>
                                </Col>
                            </div>

                            <div className={'row'}>
                                <Col className={'mt-3'} column="true" sm="12" md="4">
                                    {languageText[ "textSettings28" ]}
                                </Col>
                                <Col className={'mt-3'} column="true" sm="12" md="7">
                                    <a href={'tel:'+  state.mentor.phone}>{ state.mentor.phone}</a>
                                </Col>
                            </div>

                            <hr/>
                            <Form.Group as={Row} controlId="verifCountry">
                                <Form.Label column="true" sm="12" md="4">
                                    {languageText[ "your_referral" ]}
                                </Form.Label>
                                <Col column="true" sm="12" md="8">
                                    <Form.Control
                                        type="text"
                                        className="form-control"
                                        required
                                        value={state.referral}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>

                        </div>
                        <div className="wrapper-box">
                            <Form className="cabinet-form mt-0" onSubmit={editPassword}>
                                <p className="text-muted">{languageText[ "textSettings18" ]}</p>
                                <p className="form-auth__text">
                                    <WarningSvg/>
                                    {" " + languageText[ "textSettings30" ]}
                                </p>
                                <Form.Group as={Row} controlId="verifOldPassword">
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings19" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <div className="input-wrapper">
                                            <Form.Control
                                                type="password"
                                                className="form-auth-input"
                                                required
                                                value={state.old_password}
                                                onChange={e =>
                                                    setState({
                                                        old_password: e.target.value,
                                                    })
                                                }
                                            />
                                            <label className="form-auth-label form-group-before"/>
                                        </div>
                                    </Col>
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    controlId="verifPassword"
                                    className={`${!passwordValidate && state.password && "error"}`}>
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings20" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <div className="input-wrapper">
                                            <Form.Control
                                                type="password"
                                                className="form-auth-input"
                                                required
                                                value={state.password}
                                                onChange={e =>
                                                    setState({
                                                        password: e.target.value,
                                                    })
                                                }
                                            />
                                            {passwordValidate && state.password && (
                                                <label className="form-auth-label form-group-before"/>
                                            )}
                                        </div>
                                    </Col>
                                    {!passwordValidate && state.password && (
                                        <small id="password" className="form-text text-danger">
                                            {languageText[ "registerPasswordError1" ]}
                                        </small>
                                    )}
                                </Form.Group>
                                <Form.Group
                                    as={Row}
                                    controlId="verifPasswordConfirm"
                                    className={`${!passwordValidate && state.password && "error"}`}>
                                    <Form.Label column="true" sm="12" md="4">
                                        {languageText[ "textSettings21" ]}
                                    </Form.Label>
                                    <Col column="true" sm="12" md="8">
                                        <div className="input-wrapper">
                                            <Form.Control
                                                type="password"
                                                className="form-auth-input"
                                                required
                                                value={state.password_confirmation}
                                                onChange={e =>
                                                    setState({
                                                        password_confirmation: e.target.value,
                                                    })
                                                }
                                            />
                                            {state.password === state.password_confirmation && (
                                                <label className="form-auth-label form-group-before"/>
                                            )}
                                        </div>
                                    </Col>
                                    {state.password !== state.password_confirmation &&
                                    state.password_confirmation !== "" && (
                                        <small id="confirmPassword" className="form-text text-danger">
                                            {languageText[ "registerPasswordConfirmedError" ]}
                                        </small>
                                    )}
                                </Form.Group>
                                <hr className="mt-4"/>
                                <button type="submit" className="btn-main d-block mt-4 mx-auto">
                                    {languageText[ "textSettings17" ]}
                                </button>
                            </Form>
                        </div>

                        {/*<div className="wrapper-box">*/}
                        {/*	<Form className="cabinet-form mt-0" onSubmit={editCash}>*/}
                        {/*		<p className="text-muted">{languageText["textSettings22"]}</p>*/}
                        {/*		<Form.Group as={Row} controlId="verifPayeer">*/}
                        {/*			<Form.Label column="true" sm="12" md="4">*/}
                        {/*				{languageText["textSettings23"]}*/}
                        {/*			</Form.Label>*/}
                        {/*			<Col column="true" sm="12" md="8">*/}
                        {/*				<InputMask*/}
                        {/*					mask="P99999999999999999999"*/}
                        {/*					maskChar=""*/}
                        {/*					type="text"*/}
                        {/*					className="w-100"*/}
                        {/*					name="payeer"*/}
                        {/*					placeholder="P________________"*/}
                        {/*					value={*/}
                        {/*						state.payeer === "" || state.payeer == null*/}
                        {/*							? payeer*/}
                        {/*								? payeer*/}
                        {/*								: ""*/}
                        {/*							: state.payeer*/}
                        {/*					}*/}
                        {/*					onChange={e =>*/}
                        {/*						setState({*/}
                        {/*							payeer: e.target.value,*/}
                        {/*						})*/}
                        {/*					}*/}
                        {/*					disabled={payeer != null && payeer !== ""}*/}
                        {/*				/>*/}
                        {/*			</Col>*/}
                        {/*		</Form.Group>*/}
                        {/*		{(payeer == null || payeer === "") && (*/}
                        {/*			<>*/}
                        {/*				<hr className="mt-4" />*/}
                        {/*				<button type="submit" className="btn-main d-block mt-4 mx-auto">*/}
                        {/*					{languageText["textSettings17"]}*/}
                        {/*				</button>*/}
                        {/*			</>*/}
                        {/*		)}*/}
                        {/*	</Form>*/}
                        {/*</div>*/}
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Settings
