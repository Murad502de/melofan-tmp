import React, { useEffect, useLayoutEffect, useState } from "react"
import { Col, Container, Modal, Row } from "react-bootstrap"
import { useSelector } from "react-redux"
// import Lottie from "react-lottie";
import Slider from "react-slick"
import PhoneInput from "react-phone-input-2"
import { Link } from "react-router-dom"
import slide1 from "../../../../images/header_circle1.png"
import slide2 from "../../../../images/header_circle2.png"
import slide3 from "../../../../images/header_circle3.png"
import dark1 from "../../../../images/1dark.png"
import dark2 from "../../../../images/2dark.png"
import dark3 from "../../../../images/3dark.png"
import dark4 from "../../../../images/4dark.png"
import time1 from "../../../../images/main/time.png"
import header_logo from "../../../../images/header_logo.svg"
import vinyl2 from "../../../../images/vinyl2.png"
import protect_illustration from "../../../../images/main/protect_illustration.png"
import mockup_ipad from "../../../../images/mockup_ipad.png"
import strategy_1 from "../../../../images/main/strategy_1.png"
import strategy_2 from "../../../../images/main/strategy_2.png"
import phone_illustration from "../../../../images/main/phone_illustration.png"
import play_icons from "../../../../images/play_icons.svg"
import volume_white from "../../../../animations/volume_white.json"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import RoadMapItem from "../../other/RoadMapItem"
import { store } from "../../../store/configureStore"
import { setError } from "../../../actions/notification"
import BackgroundBlur from "../../other/BackgroundBlur"
import { CalendarSvg, DoneSvg, WarningSvg } from "../../other/Svg"
import { setIsShowPreloader } from "../../../actions/preloader"
import { getLocaleDateTime } from "../../../actions/time"
import { useGoogleReCaptcha } from "react-google-recaptcha-v3"
import MetaTags from "react-meta-tags"

function MyVerticallyCenteredModal(props) {
    const { executeRecaptcha } = useGoogleReCaptcha()
    const language = useSelector(state => state.languageCurrent.language)
    const languageText = useSelector(state => state.languageCurrent.languageText)

    const [ state, setStateData ] = useState({
        name: "",
        phone: "",
    })
    const [ message, setMessage ] = useState("")
    const [ error, setError ] = useState("")

    const setState = (newState = {}) => {
        setStateData(state => {
            return { ...state, ...newState }
        })
    }

    const onSendMessage = async e => {
        e.preventDefault()
        setMessage("")
        setError("")

        if (
            state.name === "" ||
            state.name == null ||
            state.name.length < 2 ||
            state.phone === "" ||
            state.phone == null ||
            state.phone.length < 3
        ) {
            setError(languageText[ "sendMessageConnectionError1" ])
        }
        store.dispatch(setIsShowPreloader(true))
        let captcha = await executeRecaptcha("SendConnectionMessage")

        postRequest("sendConnectionSupport", {
            name: state.name,
            phone: state.phone,
            language,
            captcha,
        })
            .then(res => {
                if ( res.success ) {
                    setState({ name: "", phone: "" })
                    setMessage(languageText[ "sendMessageConnectionSuccess" ])
                    store.dispatch(setIsShowPreloader(false))
                } else {
                    setError(languageText[ "sendMessageConnectionError1" ])
                    store.dispatch(setIsShowPreloader(false))
                }
            })
            .catch(err => {
                setError(languageText[ "sendMessageConnectionError2" ])
                store.dispatch(setIsShowPreloader(false))
            })
    }

    return (
        <Modal {...props} size="md" className="modal-contact " aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Body>
                <button type="button" className="close" onClick={props.onHide}>
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Close</span>
                </button>
                <form className="form-auth" onSubmit={e => onSendMessage(e)}>
                    {typeof message != "string" || message === "" ? (
                        <>
                            <div className="form-auth__img">
                                <img src={header_logo} alt="HitBeat Logo" width="150px"/>
                                <p>{languageText[ "connection1" ]}</p>
                            </div>
                            {typeof error == "string" && error !== "" && (
                                <p className="form-auth__text">
                                    <WarningSvg/>
                                    {" " + error}
                                </p>
                            )}
                            <div className="form-group">
                                <label className="form-auth-label" htmlFor="name">
                                    {languageText[ "connection2" ]}
                                </label>
                                <div className="input-wrapper">
                                    <input
                                        className="form-auth-input"
                                        required
                                        type="name"
                                        id="name"
                                        name="name"
                                        placeholder={languageText[ "connection3" ]}
                                        value={state.name}
                                        onChange={e => setState({ name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group input-wrapper">
                                <label className="form-auth-label" htmlFor="phone">
                                    {languageText[ "connection4" ]}
                                </label>
                                <PhoneInput
                                    placeholder={languageText[ "connection5" ]}
                                    value={state.phone}
                                    country={language}
                                    onChange={e => setState({ phone: e })}
                                    specialLabel=""
                                    id="phone"
                                    inputClass="form-auth-input"
                                    required
                                    disableSearchIcon={true}
                                    disableDropdown={true}
                                />
                            </div>
                            <div className="form-group mb-0">
                                <button className="btn-main w-100" type="submit">
                                    {languageText[ "connection6" ]}
                                </button>
                            </div>
                        </>
                    ) : (
                        <p className="form-auth__text form-auth__text-success">
                            <DoneSvg/>
                            {" " + message}
                        </p>
                    )}
                </form>
            </Modal.Body>
        </Modal>
    )
}

const Landing = () => {
    const [ roadmap, setRoadmap ] = useState([])
    const [ actualArticles, setActualArticles ] = useState([])

    const [ modalShow, setModalShow ] = React.useState(false)
    const languageText = useSelector(state => state.languageCurrent.languageText)
    const language = useSelector(state => state.languageCurrent.language)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: volume_white,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    }

    const settings = {
        infinite: true,
        fade: true,
        autoplay: true,
        autoplaySpeed: 3000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        pauseOnHover: false,
        pauseOnFocus: false,
        dots: false,
        arrows: false,
        onSwipe: false,
        swipeToSlide: false,
        swipe: false,
    }

    const settings_roadmap = {
        dots: false,
        // infinite: true,
        // autoplay: true,
        // autoplaySpeed: 3000,
        speed: 500,
        // infinite: false,
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        focusOnSelect: true,
        swipeToSlide: true,
        slidesToShow: 7,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 3500,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 2500,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1650,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1450,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 1350,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 997,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 567,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: "20px",
                },
            },
        ],
    }

    useLayoutEffect(() => {
        store.dispatch(setIsShowPreloader(true))
    }, [])

    useEffect(() => {
        postRequest("getRoadmap", { language })
            .then(res => {
                if ( res.success ) {
                    setRoadmap(res.arrayRoadmap)
                }
            })
            .catch(err => {
                store.dispatch(setError(languageText[ "getRoadMapError" ]))
            })
        postRequest("getActualArticles", { language })
            .then(res => {
                if ( res.success ) {
                    setActualArticles(res.actualArticles)
                    store.dispatch(setIsShowPreloader(false))
                }
            })
            .catch(err => {
                store.dispatch(setIsShowPreloader(false))
            })
    }, [])

    return (
        <>
            <section className="header">
                <MetaTags>
                    <title>{languageText[ "title" ]}</title>
                    <meta name="description" content={languageText[ "description" ]}/>
                    <meta property="og:title" content={languageText[ "title" ]}/>
                    <meta property="og:description" content={languageText[ "description" ]}/>
                </MetaTags>
                {/* <Background*/}
                {/*    yPosition={5}*/}
                {/*    xPosition={6}*/}
                {/*/>*/}
                {/* <Background
                    yPosition={1.6}
                    xPosition={1.2}
                /> */}
                <MyVerticallyCenteredModal show={modalShow} onHide={() => setModalShow(false)}/>
                <BackgroundBlur/>
                <Container>
                    <Row>
                        <Col lg={{ span: 7, order: 1 }} xs={{ span: 12, order: 2 }}>
                            <p className="header__uptitle">{languageText[ "header1" ]}</p>
                            <h1 className="header__title">
                                {languageText[ "header2" ]}
                                <br/>
                                {languageText[ "header3" ]}
                            </h1>
                            <p className="header__subtitle">
                                {languageText[ "header4" ]} <span>HitBeat</span> {languageText[ "header5" ]}
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "header6" ]}</button>
                            </Link>
                        </Col>
                        <Col lg={{ span: 5, order: 2 }} xs={{ span: 12, order: 1 }}>
                            <Slider className="header__slider" {...settings}>
                                <div>
                                    <img className="img-fluid" src={slide1} alt="HitBeat фото"/>
                                </div>
                                <div>
                                    <img className="img-fluid" src={slide2} alt="HitBeat фото"/>
                                </div>
                                <div>
                                    <img className="img-fluid" src={slide3} alt="HitBeat фото"/>
                                </div>
                            </Slider>
                            <div className="play-icons">
                                <img src={play_icons} alt="Play icons"/>
                                <div className="progress"/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="growth waves">
                <Container>
                    <Row>
                        <Col lg={6}>
                            <h2 className="title">{languageText[ "growth1" ]}</h2>
                            <div className="line"/>
                            <p className="text">{languageText[ "growth2" ]}</p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "growth3" ]}</button>
                            </Link>
                        </Col>
                        <Col lg={6}>
                            <img src={phone_illustration} className="growth__img" alt="Chart"/>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="people protect">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <h2 className="title" align="center">
                                {languageText[ "people4" ]}
                            </h2>
                            <div className="line mx-auto"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <div className="people__box">
                                <Row>
                                    <Col lg={6}>
                                        <p className="people__text">{languageText[ "people5" ]}
                                            <b>{languageText[ "people5_part2" ]}</b></p>
                                        <button className="btn-outline">{languageText[ "btn-detail" ]}</button>
                                    </Col>
                                    <Col lg={6}>
                                        <img src={protect_illustration} className=" people__img" alt=""/>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="ease-of-investment strategy pb-5">
                <Container>
                    <Row>
                        <Col lg={12} align="center">
                            <h2 className="title">{languageText[ "strategy1" ]}</h2>
                            <div className="line mx-auto"/>
                            <p className="text mb-5">{languageText[ "strategy2" ]}</p>
                        </Col>
                    </Row>
                    <Row className="align-items-center">
                        <Col lg={7}>
                            <h2 className="title">{languageText[ "strategy3" ]}</h2>
                            <div className="line"/>
                            <p className="text">{languageText[ "strategy4" ]}</p>
                            <button className="btn-main">{languageText[ "btn-detail" ]}</button>
                        </Col>
                        <Col lg={5}>
                            <img src={strategy_1} alt="" className="img-fluid d-none d-lg-block ms-auto"/>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="ease-of-investment strategy waves pt-0">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={5}>
                            <img src={strategy_2} alt="" className="img-fluid d-none d-lg-block me-auto"/>
                        </Col>
                        <Col lg={7}>
                            <h2 className="title">{languageText[ "strategy5" ]}</h2>
                            <div className="line"/>
                            <p className="text">{languageText[ "strategy6" ]}</p>
                            <button className="btn-main ms-auto">{languageText[ "btn-detail" ]}</button>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="people">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <h2 className="title" align="center">
                                {languageText[ "people1" ]}
                            </h2>
                            <div className="line mx-auto"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <div className="people__box">
                                <Row>
                                    <Col lg={6}>
                                        <p className="people__text">
                                            HitBeat - платформа для людей, стремящихся открыть для себя совершенно новую
                                            музыку от <b>музыкантов-любителей</b>, которые имеют потенциал стать грандиозными
                                            мировыми звездами. Платформа стремительно развивается, что гарантирует рост
                                            аудитории и соответственно стоимости самой компании.


                                        </p>
                                        <Link to={"/" + language + "/about"}>
                                            <button className="btn-outline">{languageText[ "btn-detail" ]}</button>
                                        </Link>
                                    </Col>
                                    <Col lg={6}>
                                        <img src={vinyl2} className=" people__img" alt="Винил"/>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="ease-of-investment">
                <Container>
                    <Row className="align-items-center">
                        <Col col={6}>
                            <img src={mockup_ipad} alt="" className="img-fluid d-none d-lg-block mx-auto"/>
                        </Col>
                        <Col lg={6}>
                            <h2 className="title">{languageText[ "ease-of-investment1" ]}</h2>
                            <div className="line"/>
                            <p className="text">
                                {languageText[ "ease-of-investment2" ]}
                                <br/>
                                {languageText[ "ease-of-investment3" ]}
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "ease-of-investment4" ]}</button>
                            </Link>
                            <button className="btn-outline" onClick={() => setModalShow(true)}>
                                {/* <svg
                                    className="me-1"
                                    width="15"
                                    height="15"
                                    viewBox="0 0 15 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.37518 7.19448H10.8777C11.1402 7.19448 11.2685 6.87948 11.0818 6.69865L10.2418 5.85865L12.5752 3.52532C12.6842 3.41625 12.7455 3.26831 12.7455 3.11407C12.7455 2.95982 12.6842 2.81189 12.5752 2.70282C12.4661 2.59375 12.3182 2.53247 12.1639 2.53247C12.0097 2.53247 11.8617 2.59375 11.7527 2.70282L9.41934 5.03615L8.57934 4.19615C8.53913 4.15475 8.48742 4.12636 8.43091 4.11464C8.3744 4.10291 8.31567 4.10839 8.2623 4.13036C8.20894 4.15234 8.16338 4.1898 8.13151 4.23792C8.09964 4.28604 8.08292 4.3426 8.08351 4.40032V6.90281C8.08351 7.06615 8.21184 7.19448 8.37518 7.19448Z"
                                        fill="#198EFB"
                                    />
                                    <path
                                        d="M9.61732 9.17783L8.14732 10.6362C6.68898 9.802 5.48148 8.5945 4.64732 7.13617L6.10565 5.66617C6.23982 5.52617 6.29815 5.33367 6.26315 5.14117L5.82565 2.9945C5.77315 2.72617 5.53398 2.52783 5.25398 2.52783H2.83315C2.50648 2.52783 2.23232 2.802 2.24982 3.12867C2.34898 4.8145 2.86232 6.39533 3.66732 7.77783C4.58898 9.37033 5.91315 10.6887 7.49982 11.6103C8.88232 12.4095 10.4632 12.9287 12.149 13.0278C12.4757 13.0453 12.7498 12.7712 12.7498 12.4445V10.0237C12.7498 9.74367 12.5515 9.5045 12.2832 9.452L10.1423 9.02617C10.0491 9.00587 9.95229 9.00911 9.86063 9.03559C9.76898 9.06207 9.68536 9.11095 9.61732 9.17783Z"
                                        fill="#198EFB"
                                    />
                                </svg> */}
                                {languageText[ "ease-of-investment5" ]}
                            </button>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="how-to-start waves capital">
                <Container>
                    <Row>
                        <Col lg={12} align="center">
                            <h2 className="title">Реальная возможность приумножить ваш капитал</h2>
                            <div className="line mx-auto mb-5"/>
                        </Col>
                    </Row>
                    <Row className="justify-content-center mt-5">
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                {/* <div className="volume-white">
                                    <Lottie
                                        options={defaultOptions}
                                        style={{
                                            width: "121px",
                                            height: "100%",
                                        }}
                                        // height={400}
                                        // width={}
                                    />
                                </div> */}
                                <img src={dark1} alt="З"/>
                                <h6>Высокая прибыль</h6>
                                <p>
                                    Инвестирование в бизнес-проекты с большим потенциалом роста позволяет многократно
                                    увеличить свой капитал.
                                </p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                {/* <div className="volume-white">
                                    <Lottie
                                        options={defaultOptions}
                                        style={{
                                            width: "121px",
                                            height: "100%",
                                        }}
                                        // height={400}
                                        // width={}
                                    />
                                </div> */}
                                <img src={time1} alt=""/>
                                <h6>Оптимальное время</h6>
                                <p>
                                    Чем раньше вы инвестируете, тем больше прибыли приносят ваши инвестиции за счет
                                    низкой цены покупки.
                                </p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                {/* <div className="volume-white">
                                    <Lottie
                                        options={defaultOptions}
                                        style={{
                                            width: "121px",
                                            height: "100%",
                                        }}
                                        // height={400}
                                        // width={}
                                    />
                                </div> */}
                                <img src={dark3} alt=""/>
                                <h6>Максимальная ликвидность</h6>
                                <p>
                                    Полная ликвидность ценных бумаг компании доступна благодаря листингу на бирже через
                                    механизм RTO.
                                </p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                <img src={dark4} alt=""/>
                                <h6>Абсолютная безопасность</h6>
                                <p>
                                    Инвестиции в фондовый рынок надежно защищены законодательством США и Канады и
                                    комиссией SEC.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="business">
                <Container>
                    <Row>
                        <Col lg={12}>
                            <h2 className="title" align="center">
                                {languageText[ "business1" ]}
                            </h2>
                            <div className="line mx-auto"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12}>
                            <div className="business__box">
                                <Row>
                                    <Col lg={6}>
                                        <p className="business__text">{languageText[ "business2" ]}</p>
                                        <button className="btn-outline" onClick={() => setModalShow(true)}>
                                            {/* <svg
                                                width="15"
                                                height="15"
                                                viewBox="0 0 15 15"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M8.37518 7.19448H10.8777C11.1402 7.19448 11.2685 6.87948 11.0818 6.69865L10.2418 5.85865L12.5752 3.52532C12.6842 3.41625 12.7455 3.26831 12.7455 3.11407C12.7455 2.95982 12.6842 2.81189 12.5752 2.70282C12.4661 2.59375 12.3182 2.53247 12.1639 2.53247C12.0097 2.53247 11.8617 2.59375 11.7527 2.70282L9.41934 5.03615L8.57934 4.19615C8.53913 4.15475 8.48742 4.12636 8.43091 4.11464C8.3744 4.10291 8.31567 4.10839 8.2623 4.13036C8.20894 4.15234 8.16338 4.1898 8.13151 4.23792C8.09964 4.28604 8.08292 4.3426 8.08351 4.40032V6.90281C8.08351 7.06615 8.21184 7.19448 8.37518 7.19448Z"
                                                    fill="#fff"
                                                />
                                                <path
                                                    d="M9.61732 9.17783L8.14732 10.6362C6.68898 9.802 5.48148 8.5945 4.64732 7.13617L6.10565 5.66617C6.23982 5.52617 6.29815 5.33367 6.26315 5.14117L5.82565 2.9945C5.77315 2.72617 5.53398 2.52783 5.25398 2.52783H2.83315C2.50648 2.52783 2.23232 2.802 2.24982 3.12867C2.34898 4.8145 2.86232 6.39533 3.66732 7.77783C4.58898 9.37033 5.91315 10.6887 7.49982 11.6103C8.88232 12.4095 10.4632 12.9287 12.149 13.0278C12.4757 13.0453 12.7498 12.7712 12.7498 12.4445V10.0237C12.7498 9.74367 12.5515 9.5045 12.2832 9.452L10.1423 9.02617C10.0491 9.00587 9.95229 9.00911 9.86063 9.03559C9.76898 9.06207 9.68536 9.11095 9.61732 9.17783Z"
                                                    fill="#fff"
                                                />
                                            </svg> */}
                                            {languageText[ "business3" ]}
                                        </button>
                                        <Link to={"/" + language + "/signup"}>
                                            <button className="btn-main">{languageText[ "business4" ]}</button>
                                        </Link>
                                    </Col>
                                    <Col lg={6}>
                                        <img src={vinyl2} className=" business__img" alt="Винил"/>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="how-to-start waves" style={{ paddingTop: "140px" }}>
                <Container>
                    <Row>
                        <Col lg={12} align="center">
                            <h2 className="title">{languageText[ "how-to-start1" ]}</h2>
                            <div className="line mx-auto"/>
                            <p className="text">{languageText[ "how-to-start2" ]}</p>
                        </Col>
                    </Row>
                    <Row>
                        {/* <div className="volume-white">
                            <Lottie
                                options={defaultOptions}
                                style={{width: '100%', height: '200px'}}
                                // height={400}
                                // width={}
                            />
                        </div> */}
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                {/* <div className="volume-white">
                                    <Lottie
                                        options={defaultOptions}
                                        style={{
                                            width: "121px",
                                            height: "100%",
                                        }}
                                        // height={400}
                                        // width={}
                                    />
                                </div> */}
                                <img src={dark1} alt="Зарегистрироваться на HitBeat"/>
                                <p>{languageText[ "how-to-start3" ]}</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                {/* <div className="volume-white">
                                    <Lottie
                                        options={defaultOptions}
                                        style={{
                                            width: "121px",
                                            height: "100%",
                                        }}
                                        // height={400}
                                        // width={}
                                    />
                                </div> */}
                                <img src={dark2} alt="Заполнить профиль"/>
                                <p>{languageText[ "how-to-start4" ]}</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                {/* <div className="volume-white">
                                    <Lottie
                                        options={defaultOptions}
                                        style={{
                                            width: "121px",
                                            height: "100%",
                                        }}
                                        // height={400}
                                        // width={}
                                    />
                                </div> */}
                                <img src={dark3} alt="Выгодно купить акции"/>
                                <p>{languageText[ "how-to-start5" ]}</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                <img src={dark4} alt="Начать зарабатывать уже сейчас"/>
                                <p>{languageText[ "how-to-start6" ]}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {actualArticles.length ? (
                <section className="people latest-articles">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <h2 className="title" align="center">
                                    {languageText[ "latest-articles1" ]}
                                </h2>
                                <div className="line mx-auto"/>
                            </Col>
                        </Row>
                        <Row>
                            {actualArticles.map(item => (
                                <Col lg={3} md={6} key={"actualArticles" + item.id}>
                                    <div className="news__link">
                                        <div className="news__item">
                                            <img src={item.image} alt={item.title}/>
                                            <div className="news__item-body">
												<span className="data">
													<CalendarSvg/> {getLocaleDateTime(item.date, "date")}
												</span>
                                                <h5>{item.title}</h5>
                                                <p>{item.announce}</p>
                                                <Link
                                                    to={"/" + language + "/article/" + item.url}
                                                    className="btn-main w-100 mt-3">
                                                    {languageText[ "actualArticles1" ]}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </section>
            ) : <></>}

            {roadmap.length ? (
                <section className="roadmap pb-5">
                    <Container fluid>
                        <Row>
                            <Col lg={12} align="center">
                                <h2 className="title">{languageText[ "road-map1" ]}</h2>
                                <div className="line mx-auto"/>
                                <p className="text">{languageText[ "road-map2" ]}</p>
                            </Col>
                            <Col lg={12} className="p-0">
                                <Slider className="roadmap__slider" {...settings_roadmap}>
                                    {roadmap.map(item => (
                                        <div key={"roadmapLanding" + item.id}>
                                            <RoadMapItem
                                                status={item.status}
                                                typeTime={item.typeTime}
                                                month={item.month}
                                                quarter={item.quarter}
                                                year={item.year}
                                                updated_at={item.updated_at}
                                                discription={item.title}
                                                HBM={item.amount}
                                                percentCalc={item.percentCalc}
                                                round={item.round}
                                                textRound={item.target}
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </Col>
                        </Row>
                    </Container>
                </section>
            ) : <></>}
        </>
    )
}

export default Landing
