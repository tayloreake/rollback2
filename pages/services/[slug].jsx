import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { generateServicesPageMetadata } from "../../SEO/seo"
import { getServicesData, getServicesPageData } from "../../sanity/sanity-utils"
import { useRouter } from "next/router"
import Jumbotron from "../../components/jumbotron"
import { isMobile } from "react-device-detect"
import Slider from "react-slick"
import { Tab, Nav, Row, Col, Accordion } from 'react-bootstrap';
import imageUrlBuilder from "@sanity/image-url"
import client from "../../sanity/config/client-config"
import { PortableText } from '@portabletext/react';


const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
};
const ServicesItem = ({ content, servicesData }) => {
    const router = useRouter();
    const videoRef = useRef(null);
    const [services, setServices] = useState(servicesData)
    const { slug } = router.query

    const builder = imageUrlBuilder(client)
    function urlFor(source) {
        return builder.image(source)
    }

    useEffect(() => {
        const { service, subservice } = router.query;
        setType(service)
        setSubType(subservice)

    }, [router.query])

    const [type, setType] = useState("")
    const [subType, setSubType] = useState("Premoving");
    const [activeTab, setActiveTab] = useState({});
    const [key, setKey] = useState('name');

    useEffect(() => {
        setSubType("Premoving");

        const activeService = services.find(
            service => service?.slug?.current?.toLowerCase() === slug?.toLowerCase()
        );

        setType(activeService?.name);

        setActiveTab(activeService)
    }, [])



    const ServiceItem = ({ item }) => {

        return (
            <div
                onClick={() => setType(item?.name)}
                className='max-w-[300px] px-0 bg-black  h-full hover:animate-pulse cursor-pointer relative'>
                <Image
                    src={urlFor(item?.image).url()}
                    alt=""
                    width={420}
                    height={420}
                    // fill
                    // style={{ width: "300px", height: "400px", objectFit: "cover" }}
                    className=''
                />
                <div className={`absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full ${item?.titlePos}-0 py-4`}>
                    <h3 className='text-white text-center'>{item?.name}</h3>
                </div>
            </div>
        )
    }

    const LocalInternational = () => {
        return (
            <div className="row">
                <div className="col-md-6 bg-[#EDEDED] p-8">
                    <h3 className="my-3 uppercase text-2xl font-bold text-[#ff5000]">Local <br /> Moves</h3>
                    <div className="my-3">
                        <PortableText value={activeTab?.local} />
                    </div>
                </div>
                <div className="col-md-6 bg-[#E1DEDE] p-8">
                    <h3 className="my-3 uppercase text-2xl font-bold text-[#ff5000]">International <br /> Moves</h3>
                    <div className="my-3">
                        <PortableText value={activeTab?.international} />
                    </div>
                </div>

            </div>
        )
    }

    const PresurveyContent = () => {
        return (
            <div className="my-3">
                <PortableText value={activeTab?.presurvey} />
            </div>
        )
    }

    const QuotationContent = () => {
        return (
            <div className="my-3">
                <PortableText value={activeTab?.quotation} />
            </div>
        )
    }
    const OthersContent = () => {
        return (
            <div className="my-3">
                <PortableText value={activeTab?.others} />
            </div>
        )
    }

    const MobileActiveItem = () => {

        return (
            <Accordion
                className="accordion"
                id="mobile-services-accordion"
                defaultActiveKey={'name'}
                allowMultipleExpanded={false}
                uuid={63213}
            >
                <Accordion.Item eventKey={"name"}>
                    <Accordion.Header className="font-bold !capitalize">
                        {activeTab?.name}
                    </Accordion.Header>
                    <Accordion.Body>
                        <LocalInternational />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"presurvey"}>
                    <Accordion.Header className="font-bold !capitalize">
                        Pre-survey
                    </Accordion.Header>
                    <Accordion.Body>
                        <PresurveyContent />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"quotation"}>
                    <Accordion.Header className="font-bold !capitalize">
                        Quotation
                    </Accordion.Header>
                    <Accordion.Body>
                        <QuotationContent />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey={"others"}>
                    <Accordion.Header className="font-bold !capitalize">
                        Other Services
                    </Accordion.Header>
                    <Accordion.Body>
                        <OthersContent />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        )
    }

    const DesktopActiveItem = () => {

        return (
            <Tab.Container id="left-tabs-example" activeKey={key} onSelect={(k) => setKey(k)}>
                <Row>
                    <Col sm={3} className="pr-4">
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="name">{activeTab?.name}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="presurvey">Pre-survey</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="quotation">Quotation</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="others">Other Services</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="name">
                                <LocalInternational />
                            </Tab.Pane>
                            <Tab.Pane eventKey="presurvey">
                                <PresurveyContent />
                            </Tab.Pane>
                            <Tab.Pane eventKey="quotation">
                                <QuotationContent />
                            </Tab.Pane>
                            <Tab.Pane eventKey="others">
                                <OthersContent />
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container >
        )
    }

    return (
        <>
            {generateServicesPageMetadata([
                "householdMoving",
                "office",
                "corporate",
                "warehousingAndStorage",
            ])}

            <Jumbotron image={"services.png"} text={"What we do"} />

            <div className="container my-4">
                <h1 className="text-3xl font-[500] text-[#ff5000] py-2 !mt-12">We specialize in</h1>
                <div className="py-3">
                    <p>local and international relocation. Taylor Movers is a privately held firm committed to excellence through providing relocation, transportation, warehousing, expatriate mobility services and logistics services efficiently.</p>
                </div>
            </div>
            <div className='container'>


                <div className='row items-center w-full h-full overflow-x-auto pb-4 mb-12'>
                    {!isMobile
                        ?
                        services?.map((item, idx) => (
                            <div key={`service-list-${idx}`}
                                onClick={() => setActiveTab(item)}
                                className="col-md-3 px-0">
                                <ServiceItem item={item} /></div>
                        ))

                        :
                        <Slider {...settings}>
                            {services?.map((service, idx) => (
                                <div key={`services-${idx}`}
                                    onClick={() => setActiveTab(service)}
                                    className="col-12">
                                    <ServiceItem item={service} />
                                </div>

                            ))}
                        </Slider>

                    }
                </div>

                <div className='border-[3px] border-[#FF5000] mb-8 md:p-12 p-6 rounded-sm'>
                    <div className="text-3xl text-[#FF5000] font-bold py-2 flex items-center justify-center my-2">
                        <div className="mr-3">
                            {activeTab?.icon && <Image src={`${activeTab?.icon}`} alt="" width={50} height={50} />}
                        </div>
                        <div className="">{activeTab?.name}</div>
                    </div>

                    <div className="my-4 service-navigator">
                        {!isMobile ? <DesktopActiveItem /> : <MobileActiveItem />}
                    </div>

                </div>

            </div >

        </>
    )
}

export default ServicesItem

export async function getServerSideProps({ req, res }) {
    res.setHeader(
        "Cache-Control",
        "public, s-maxage=10, stale-while-revalidate=59"
    )
    const content = await getServicesPageData()
    const servicesData = await getServicesData();

    return {
        props: {
            content,
            servicesData
        },
    }
}
