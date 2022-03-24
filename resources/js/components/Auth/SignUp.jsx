import React, { useEffect, useLayoutEffect, useState } from "react"
import { Col, Container, Row } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"
import header_logo from "../../../images/header_logo.svg"
import { DoneSvg, WarningSvg } from "../other/Svg"
import { useSelector } from "react-redux"
import { store } from "../../store/configureStore"
import { setIsShowPreloader } from "../../actions/preloader"
import PhoneInput from "react-phone-input-2"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import BackgroundBlur from "../other/BackgroundBlur"

const SignUp = props => {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const history = useHistory()

    const [ firstName, setFirstName ] = useState("")
    const [ lastName, setLastName ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ phone, setPhone ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ password_confirmation, setPassword_confirmation ] = useState("")
    const [ referral, setReferral ] = useState("")

    const [ mentorName, setMentorName ] = useState("")
    const [ mentorId, setMentorId ] = useState("")
    const [ mentorAvatar, setMentorAvatar ] = useState("")

    const [ message, setMessage ] = useState("")
    const [ error, setError ] = useState({})

    const languageText = useSelector(state => state.languageCurrent.languageText)
    const language = useSelector(state => state.languageCurrent.language)

    useLayoutEffect(() => {
        store.dispatch(setIsShowPreloader(true))
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0)
        let mentor = ""
        if ( localStorage.referral ) {
            mentor = localStorage.referral
        }

        if ( mentor ) {
            postRequest("getMentor", { mentor }).then(res => {
                if ( res.success ) {
                    setMentorId(mentor)
                    setMentorName(res.nameMentor)
                    if ( res.avatarMentor ) {
                        setMentorAvatar(res.avatarMentor)
                    }
                }
                store.dispatch(setIsShowPreloader(false))
            })
        }

        if ( !mentor ) {
            store.dispatch(setIsShowPreloader(false))
        }
    }, [])

    const onChange = (value, name) => {
        if ( error && error[ name ] ) {
            delete error[ name ]
        }
        switch ( name ) {
            case "email":
                setEmail(value)
                break
            case "phone":
                setPhone(value)
                break
            case "password":
                setPassword(value)
                break
        }
    }

    const onRegister = async e => {
        e.preventDefault()
        store.dispatch(setIsShowPreloader(true))
        setMessage("")
        setError("")
        let captcha = await executeRecaptcha("SignUp")

        postRequest("signup", {
            firstName,
            lastName,
            phone,
            email,
            password,
            password_confirmation,
            mentorId,
            captcha,
            language,
        })
            .then(res => {
                if ( res.success ) {
                    store.dispatch(setIsShowPreloader(false))
                    window.scrollTo(0, 0)
                    setMessage(languageText[ "textSignUp20" ])
                } else {
                    store.dispatch(setIsShowPreloader(false))
                    window.scrollTo(0, 0)
                    setError(languageText[ "registerError001" ])
                }
            })
            .catch(err => {
                if ( err.response && err.response.data && err.response.data.errors ) {
                    setError(err.response.data.errors)
                } else {
                    setError(languageText[ "registerError001" ])
                }
                store.dispatch(setIsShowPreloader(false))
                window.scrollTo(0, 0)
            })
    }

    let passwordValidate = password.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,255}$/)

    return (
        <section className="auth">
            <BackgroundBlur/>
            <Container>
                <Row>
                    <Col lg={12}>
                        <form onSubmit={onRegister} className="form-auth" autoComplete="off">
                            <div className="form-auth__img">
                                <img src={header_logo} alt="HitBeat Logo" width="150px"/>
                                <p>{languageText[ "textSignUp1" ]}</p>
                            </div>
                            {typeof message != "string" || message === "" ? (
                                <>
                                    <p className="form-auth__text">
                                        <WarningSvg/>
                                        {" " + languageText[ "textSignUp2" ]}
                                        {error && error.captcha && (
                                            <small id="confirmPassword" className="form-text text-danger">
                                                {languageText[ "registerCaptchaError" ]}
                                            </small>
                                        )}
                                    </p>
                                    {typeof error == "string" && error !== "" && (
                                        <p className="form-auth__text">
                                            <WarningSvg/>
                                            {" " + error}
                                        </p>
                                    )}
                                    <div className={`form-group ${error && error.firstName && "error"}`}>
                                        <label className="form-auth-label" htmlFor="first_name">
                                            {languageText[ "textSignUp3" ]}
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                className="form-auth-input"
                                                required
                                                type="text"
                                                id="first_name"
                                                name="a"
                                                value={firstName}
                                                onChange={e => setFirstName(e.target.value)}
                                                placeholder={languageText[ "textSignUp4" ]}
                                                autoComplete="off"
                                            />
                                            {firstName.length >= 2 && firstName.length <= 255 && (
                                                <label
                                                    className="form-auth-label form-group-before"
                                                    htmlFor="first_name"
                                                />
                                            )}
                                        </div>
                                        {error && error.firstName && (
                                            <small id="first_name" className="form-text text-danger">
                                                {languageText[ "registerFirstNameError" ]}
                                            </small>
                                        )}
                                    </div>
                                    <div className={`form-group ${error && error.lastName && "error"}`}>
                                        <label className="form-auth-label" htmlFor="last_name">
                                            {languageText[ "textSignUp5" ]}
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                className="form-auth-input"
                                                type="text"
                                                id="last_name"
                                                name="b"
                                                placeholder={languageText[ "textSignUp6" ]}
                                                required
                                                value={lastName}
                                                onChange={e => setLastName(e.target.value)}
                                                autoComplete="off"
                                            />
                                            {lastName.length >= 2 && lastName.length <= 255 && (
                                                <label
                                                    className="form-auth-label form-group-before"
                                                    htmlFor="last_name"
                                                />
                                            )}
                                        </div>
                                        {error && error.lastName && (
                                            <small id="last_name" className="form-text text-danger">
                                                {languageText[ "registerFirstNameError" ]}
                                            </small>
                                        )}
                                    </div>
                                    <div className={`form-group ${error && error.email && "error"}`}>
                                        <label className="form-auth-label" htmlFor="email">
                                            {languageText[ "textSignUp7" ]}
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                className="form-auth-input"
                                                required
                                                type="email"
                                                id="email"
                                                name="c"
                                                value={email}
                                                onChange={e => onChange(e.target.value, "email")}
                                                placeholder={languageText[ "textSignUp8" ]}
                                                autoComplete="off"
                                            />
                                            <label className="form-auth-label form-group-before" htmlFor="email"/>
                                        </div>
                                        {error && error.email && (
                                            <small id="last_name" className="form-text text-danger">
                                                {languageText[ "registerEmailError-" + error.email[ 0 ] ]}
                                            </small>
                                        )}
                                    </div>
                                    <div className={`form-group input-wrapper ${error && error.phone && "error"}`}>
                                        <label className="form-auth-label" htmlFor="phone">
                                            {languageText[ "textSignUp9" ]}
                                        </label>
                                        <PhoneInput
                                            placeholder={languageText[ "textSignUp10" ]}
                                            value={phone}
                                            country={language}
                                            onChange={value => onChange(value, "phone")}
                                            specialLabel=""
                                            id="phone"
                                            inputClass="form-auth-input"
                                            required
                                            disableSearchIcon={true}
                                            disableDropdown={true}
                                        />
                                        {phone && (
                                            <label className="form-auth-label form-group-before" htmlFor="phone"/>
                                        )}
                                        {error && error.phone && (
                                            <small id="phone" className="form-text text-danger">
                                                {languageText[ "registerPhoneError-" + error.phone[ 0 ] ]}
                                            </small>
                                        )}
                                    </div>
                                    <div
                                        className={`form-group ${
                                            ((error && error.password) || (!passwordValidate && password)) && "error"
                                        }`}>
                                        <label className="form-auth-label" htmlFor="password">
                                            {languageText[ "textSignUp11" ]}
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                className="form-auth-input"
                                                type="password"
                                                id="password"
                                                required
                                                name="d"
                                                placeholder={languageText[ "textSignUp12" ]}
                                                value={password}
                                                onChange={e => onChange(e.target.value, "password")}
                                                autoComplete="off"
                                            />
                                            {passwordValidate && password && (
                                                <label
                                                    className="form-auth-label form-group-before"
                                                    htmlFor="password"
                                                />
                                            )}
                                        </div>
                                        {((error && error.password) || (!passwordValidate && password)) && (
                                            <small id="password" className="form-text text-danger">
                                                {!passwordValidate && password
                                                    ? languageText[ "registerPasswordError-validation.regex" ]
                                                    : languageText[ "registerPasswordError-" + error.password[ 0 ] ]}
                                            </small>
                                        )}
                                    </div>
                                    <div
                                        className={`form-group ${
                                            password !== password_confirmation &&
                                            password_confirmation !== "" &&
                                            "error"
                                        }`}>
                                        <label className="form-auth-label" htmlFor="confirmPassword">
                                            {languageText[ "textSignUp13" ]}
                                        </label>
                                        <div className="input-wrapper">
                                            <input
                                                className="form-auth-input"
                                                type="password"
                                                id="confirmPassword"
                                                required
                                                value={password_confirmation}
                                                onChange={e => setPassword_confirmation(e.target.value)}
                                                name="f"
                                                placeholder={languageText[ "textSignUp14" ]}
                                                autoComplete="off"
                                            />
                                            {password === password_confirmation && (
                                                <label
                                                    className="form-auth-label form-group-before"
                                                    htmlFor="confirmPassword"
                                                />
                                            )}
                                        </div>
                                        {password !== password_confirmation && password_confirmation !== "" && (
                                            <small id="confirmPassword" className="form-text text-danger">
                                                {languageText[ "registerPasswordError-validation.confirmed" ]}
                                            </small>
                                        )}
                                    </div>

                                    <div className="form-group form-check">
                                        <input
                                            type="checkbox"
                                            required
                                            className="form-check-input mb-0"
                                            id="form-auth-checkbox"
                                        />
                                        <label className="form-check-label mb-0" htmlFor="form-auth-checkbox">
                                            {languageText[ "textSignUp15" ] + " "}
                                            <Link target="_blank" to={"/" + language + "/terms-of-use"}>
                                                {languageText[ "textSignUp16" ]}
                                            </Link>
                                        </label>
                                    </div>
                                    {mentorName && mentorId && mentorId !== 1 &&
                                    (
                                        <div className={`form-group`}>
                                            <label className="form-auth-label" htmlFor="mentorName">
                                                {languageText[ "mentor" ]}
                                            </label>
                                            <div className="input-wrapper">
                                                <input
                                                    className="form-auth-input"
                                                    type="text"
                                                    id="mentorName"
                                                    readOnly
                                                    disabled
                                                    value={mentorName}
                                                    name="mentorName"
                                                />
                                            </div>
                                        </div>
                                    )
                                    }
                                    <div className="form-group">
                                        <button className="btn-main" type="submit">
                                            {languageText[ "textSignUp17" ]}
                                        </button>
                                        <p className="form-p">
                                            {languageText[ "textSignUp18" ] + " "}
                                            <Link
                                                to={"/" + language + "/signin"}>{languageText[ "textSignUp19" ]}</Link>
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="form-auth__text form-auth__text-success">
                                    <DoneSvg/>
                                    {" " + message}
                                </p>
                            )}
                        </form>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}

export default SignUp
