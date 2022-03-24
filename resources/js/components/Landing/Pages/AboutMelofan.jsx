import React, { useEffect, useLayoutEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"
import Parallax from "parallax-js"
import Slider from "react-slick"
import ReactPlayer from "react-player"
import App_Store from "../../../../images/App_Store.svg"
import Google_Play from "../../../../images/Google_Play.svg"
import phone from "../../../../images/phone.png"
import mac from "../../../../images/mac.png"
import image1 from "../../../../images/image1.jpg"
import image2 from "../../../../images/image2.jpg"
import volume_white from "../../../../animations/volume_white.json"
import advantage_1 from "../../../../images/about/advantage1.png"
import advantage_2 from "../../../../images/about/advantage2.png"
import advantage_3 from "../../../../images/about/advantage3.png"
import advantage_4 from "../../../../images/about/advantage4.png"
import moments1 from "../../../../images/about/moments1.png"
import moments2 from "../../../../images/about/moments2.png"
import moments3 from "../../../../images/about/moments3.png"
import nft from "../../../../images/ntf.png"
import audience_photo1 from "../../../../images/about/audience_photo1.jpg"
import audience_photo2 from "../../../../images/about/audience_photo2.jpg"
import business_model_photo1 from "../../../../images/about/business_model_photo1.png"
import business_model_photo2 from "../../../../images/about/business_model_photo2.png"
import headphones from "../../../../images/about/headphones.png"
import microphone from "../../../../images/about/microphone.png"
import music_player from "../../../../images/about/music_player.png"
import diagram from "../../../../images/about/diagram.png"
import diagram2 from "../../../../images/about/diagram2.png"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import RoadMapItem from "../../other/RoadMapItem"
import { store } from "../../../store/configureStore"
import { setError } from "../../../actions/notification"
import BackgroundBlur from "../../other/BackgroundBlur"
import { setIsShowPreloader } from "../../../actions/preloader"

const settings_roadmap = {
    dots: false,
    speed: 500,
    className: "center roadmap__slider",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    focusOnSelect: true,
    swipeToSlide: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
        {
            breakpoint: 1550,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 1260,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 650,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
}

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: volume_white,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
    },
}

const AboutMelofan = () => {
    const languageText = useSelector(state => state.languageCurrent.languageText)
    const [ roadmap, setRoadmap ] = useState([])
    const language = useSelector(state => state.languageCurrent.language)

    useLayoutEffect(() => {
        store.dispatch(setIsShowPreloader(true))
    }, [])

    useEffect(() => {
        var scene = document.getElementById("scene")
        var parallaxInstance = new Parallax(scene)
        var scene2 = document.getElementById("scene2")
        var parallaxInstance = new Parallax(scene2)
        var scene3 = document.getElementById("scene3")
        var parallaxInstance = new Parallax(scene3)

        postRequest("getRoadmap", { language })
            .then(res => {
                if ( res.success ) {
                    setRoadmap(res.arrayRoadmap)
                }
                store.dispatch(setIsShowPreloader(false))
            })
            .catch(err => {
                store.dispatch(setError(languageText[ "getRoadMapError" ]))
                store.dispatch(setIsShowPreloader(false))
            })
    }, [])

    return (
        <div className="about-melofan">
            <section className="header">
                <BackgroundBlur/>
                <Container>
                    <Row className="align-items-center">
                        <Col lg={{ span: 7, order: 1 }} xs={{ span: 12, order: 2 }}>
                            <h1
                                className="header__title"
                                dangerouslySetInnerHTML={{ __html: languageText[ '"about-melofan14' ] }}
                            />
                            <p className="header__subtitle">{languageText[ '"about-melofan15' ]}</p>
                            <Link to="/signup">
                                <button className="btn-main">{languageText[ "header6" ]}</button>
                            </Link>
                        </Col>
                        <Col lg={{ span: 5, order: 2 }} xs={{ span: 12, order: 1 }}>
                            <ReactPlayer
                                width="100%"
                                controls
                                height="290px"
                                className="react-video-player"
                                url="https://www.youtube.com/watch?v=0Blwk-vm_3s&feature=emb_title"
                            />
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="how-to-start melofan-advantages waves">
                <Container>
                    <Row>
                        <Col lg={12} align="center">
                            <h2 className="title">Преимущества HitBeat</h2>
                            <div className="line mx-auto mb-5"/>
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
                                <img src={advantage_1} alt=""/>
                                <p>Больше не нужно пролистывать бесконечные ленты некачественной музыки</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                <img src={advantage_2} alt="З"/>
                                <p>Больше не нужно беспокоиться о поиске своей аудитории</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                <img src={advantage_3} alt=""/>
                                <p>Только свежий контент, трансляция 24/7</p>
                            </div>
                        </Col>
                        <Col lg={3} md={6}>
                            <div className="how-to-start__item">
                                <img src={advantage_4} alt=""/>
                                <p>Реальные отзывы настоящих меломанов</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="about-melofan__main">
                <Container>
                    <Row>
                        <Col lg={6}>
                            <h2 className="title">Проблемы</h2>
                            <div className="line"/>
                            <ul className="about-melofan__ul">
                                <li>
                                    В настоящее время нет простого способа найти новых исполнителей среди огромного
                                    количества новой музыки в Интернете;
                                </li>
                                <li>
                                    Честолюбивые артисты изо всех сил стараются охватить широкую аудиторию, которой они
                                    заслуживают;
                                </li>
                                <li>
                                    Слушателям приходится просматривать тонны "мусорного" контента, чтобы найти что-то
                                    новое и действительно стоящее.
                                </li>
                            </ul>
                        </Col>
                        <Col lg={6}>
                            <div id="scene">
                                <img data-depth="0.6" src={image2} className="about-melofan__img1" alt=""/>
                                <img data-depth="0.2" src={image1} className="about-melofan__img2" alt=""/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="ease-of-investment waves">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <img src={headphones} alt="" className="img-fluid d-none d-lg-block mx-auto"/>
                        </Col>
                        <Col lg={6}>
                            <h2 className="title">Решение проблем есть - HitBeat</h2>
                            <div className="line"/>
                            <p className="text">
                                HitBeat Music предоставляет музыкантам удобный способ преодолеть шум и быть обнаруженным
                                нужной аудиторией. Чарты, составленные на основе конкурсов, предоставляют слушателям
                                массу высококачественного контента и возможности лично повлиять на музыку завтрашнего
                                дня.
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "ease-of-investment4" ]}</button>
                            </Link>
                            <a href="https://hitbeat.com" target="_blank" rel="noopener noreferrer">
                                <button className="btn-outline">Послушать</button>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="choose-the-best">
                <Container>
                    <Row>
                        <Col lg={12} align="center">
                            <h2 className="title">Мы позволяем пользователям выбирать лучшее и делаем его доступным</h2>
                            <div className="line mx-auto"/>
                            <p className="text">
                                <b>HitBeat Music</b> – это наш уникально разработанный алгоритм системы рейтинга,
                                основанный на конкурсах, который позволяет меломанам решать кто станет профессиональным
                                исполнителем качественного контента завтрашнего дня. В конечном итоге создание пула
                                высококачественного музыкального контента, выбранного слушателями напрямую, позволит им
                                избавиться от шума.

                            </p>
                            <div className="choose-the-best__box">
                                <img src={diagram} className="img-fluid" alt=""/>
                                <p>
                                    Платформа позволяет пользователям оценивать треки, создавать связи, отслеживать
                                    выступления артистов и, в конечном итоге, создавать качественные плейлисты для
                                    любителей музыки.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="ease-of-investment">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 className="title">HitBeat Music</h2>
                            <div className="line"/>
                            <p className="text">
                                <b>
                                    HitBeat Music – единственная в своем роде онлайн-платформа, которая ориентирована
                                    исключительно на открытие музыки, а не на популярные хиты. Концентрируя свое
                                    внимание на
                                    исполнителях-любителях, он не только предоставляет своим пользователям постоянный
                                    поток
                                    отличной новой музыки, но также дает музыкантам-любителям возможность заявить о себе
                                    и
                                    проложить путь к коммерческому успеху
                                </b>
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "ease-of-investment4" ]}</button>
                            </Link>
                            <a href="http://hitbeat.com" target="_blank" rel="noopener noreferrer">
                                <button className="btn-outline">Послушать</button>
                            </a>
                        </Col>
                        <Col lg={6}>
                            <img src={music_player} alt="" className="img-fluid d-none d-lg-block mx-auto"/>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="ease-of-investment waves pt-2">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={5}>
                            <img src={nft} alt="" className="img-fluid d-none d-lg-block me-auto"/>
                        </Col>
                        <Col lg={7}>
                            <h2 className="title">Новые технологии в HitBeat</h2>
                            <div className="line"/>
                            <p className="text">
                                HitBeat разрабатывает Blockchain технологии уже сейчас. NFT и Blockchain позволит
                                использовать авторские права на каждую песню, тем самым обезопасить их. С помощью NFT мы
                                можем капитализировать каждую песню и получать прибыль, которая будет как для артистов
                                так и для платформы HitBeat.
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "ease-of-investment4" ]}</button>
                            </Link>
                            <a href="https://hitbeat.com" target="_blank" rel="noopener noreferrer">
                                <button className="btn-outline">Использовать</button>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="about-melofan__main">
                <Container>
                    <Row>
                        <Col lg={6}>
                            <h2 className="title">Аудитория HitBeat</h2>
                            <div className="line"/>
                            <p className="text">
                            HitBeat Music нацелен на людей, которые стремятся открыть для себя новую музыку от малоизвестных музыкантов, у которых есть потенциал, чтобы стать в будущем коммерческим успехом.
                            </p>
                        </Col>
                        <Col lg={6}>
                            <div id="scene2">
                                <img data-depth="0.6" src={audience_photo1} className="about-melofan__img1" alt=""/>
                                <img data-depth="0.2" src={audience_photo2} className="about-melofan__img2" alt=""/>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="ease-of-investment">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 className="title">Соревнования</h2>
                            <div className="line"/>
                            <p className="text">
                                В условиях значительной перенаселенности рынка HitBeat Music предлагает непревзойденный
                                продукт, который в силу своей уникальности может выйти за рамки привычной прямой
                                конкуренции, оставаясь при этом масштабируемым и особенно подходящим для развертывания
                                по всему миру
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "ease-of-investment4" ]}</button>
                            </Link>
                        </Col>
                        <Col lg={6}>
                            <img src={diagram2} alt="" className="img-fluid d-none d-lg-block mx-auto"/>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="how-to-start waves pt-5">
                <Container>
                    <Row>
                        <Col lg={12} align="center">
                            <h2 className="title">Инвестиционные моменты</h2>
                            <div className="line mx-auto mb-5"/>
                        </Col>
                    </Row>
                    <Row className="justify-content-center">
                        {/* <div className="volume-white">
                            <Lottie
                                options={defaultOptions}
                                style={{width: '100%', height: '200px'}}
                                // height={400}
                                // width={}
                            />
                        </div> */}
                        <Col lg={4} md={6}>
                            <div className="how-to-start__item">
                                <img src={moments1} alt="З"/>
                                <h6>Востребованный проект</h6>
                                <p>Больше не нужно пролистывать бесконечные ленты некачественной музыки</p>
                            </div>
                        </Col>
                        <Col lg={4} md={6}>
                            <div className="how-to-start__item">
                                <img src={moments2} alt=""/>
                                <h6>Опытная управленческая команда</h6>
                                <p>Профессиональные Маркетинг и IT специалисты у руля Музыкальной индустрии</p>
                            </div>
                        </Col>
                        <Col lg={4} md={6}>
                            <div className="how-to-start__item">
                                <img src={moments3} alt=""/>
                                <h6>Современные технологии</h6>
                                <p>
                                    На страже безупречный опыт и надежные и проверенные запатентованные алгоритмы
                                    управления и анализа
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="about-melofan__main">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 className="title">Бизнес модель</h2>
                            <div className="line"></div>
                            <p className="text">
                                HitBeat Music создает слушателям возможность находить и определять будущие величайшие
                                хиты, с проведением ежемесячных конкурсов во всех музыкальных жанрах. Наш собственный
                                алгоритм анализирует поведение слушателей, определяет на основе анализа победителей и
                                награждает их широкими рекламными возможностями. Призы включают в себя выступления на
                                партнерских мероприятиях и фестивалях, публикации в популярных СМИ, выступления на
                                радио, приглашения в эксклюзивные мероприятия, капитальную проработку маркетинга
                                собственной командой RP и релизы как на независимые, так и крупные лейблы.
                            </p>
                        </Col>
                        <Col lg={6}>
                            <div id="scene3">
                                <img
                                    data-depth="0.6"
                                    src={business_model_photo1}
                                    className="about-melofan__img1"
                                    alt=""
                                />
                                <img
                                    data-depth="0.2"
                                    src={business_model_photo2}
                                    className="about-melofan__img2"
                                    alt=""
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="ease-of-investment monetization">
                <Container>
                    <Row className="align-items-center">
                        <Col lg={6}>
                            <h2 className="title">Монетизация</h2>
                            <div className="line"/>
                            <p className="text">
                                Доходы будут генерироваться за счет гипер-целевой рекламы, торговли правами музыки в
                                виде NFT и платы за подписку для премиум-членства
                            </p>
                            <Link to={"/" + language + "/signup"}>
                                <button className="btn-main">{languageText[ "ease-of-investment4" ]}</button>
                            </Link>
                        </Col>
                        <Col lg={6}>
                            <img src={microphone} alt="" className="img-fluid d-none d-lg-block mx-auto"/>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="about-melofan__main" style={{ paddingTop: "50px", paddingBottom: "80px" }}>
                <Container>
                    <Row>
                        <Col lg={6}>
                            <div className="about-melofan__app-wrapper">
                                <img
                                    src={mac}
                                    className="about-melofan__app-wrapper-img"
                                    style={{ marginTop: "24px" }}
                                    alt=""
                                />
                                <h2 className="title">{languageText[ "about-melofan6" ]}</h2>
                                <div className="line"/>
                                <p className="text">{languageText[ "about-melofan7" ]}</p>
                                <a href="https://hitbeat.com" target="_blank" rel="noopener noreferrer">
                                    <button className="btn-main">{languageText[ "about-melofan8" ]}</button>
                                </a>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="about-melofan__app-wrapper">
                                <img src={phone} className="about-melofan__app-wrapper-img" alt=""/>
                                <h2 className="title">{languageText[ "about-melofan9" ]}</h2>
                                <div className="line"/>
                                <p className="text">{languageText[ "about-melofan10" ]}</p>
                                <a href="http://" className="footer__app" target="_blank" rel="noopener noreferrer">
                                    <img src={App_Store} alt=""/>
                                </a>
                                <a href="http://" className="footer__app" target="_blank" rel="noopener noreferrer">
                                    <img src={Google_Play} alt=""/>
                                </a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            {roadmap.length && (
                <section className="roadmap">
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
            )}
        </div>
    )
}

export default AboutMelofan
