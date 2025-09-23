import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { generateServicesPageMetadata } from "../../SEO/seo"
import Head from 'next/head'
import { getServicesData, getServicesPageData } from "../../sanity/sanity-utils"
import { useRouter } from "next/router"
import Jumbotron from "../../components/jumbotron"
import { isMobile } from "react-device-detect"
import Slider from "react-slick"
import { Tab, Nav, Row, Col, Accordion } from 'react-bootstrap';
import imageUrlBuilder from "@sanity/image-url"
import client from "../../sanity/config/client-config"
import { PortableText } from '@portabletext/react';
import QuoteModal from '../../components/Quote/QuoteModal'
import Link from 'next/link'
import { BsCheckCircle } from 'react-icons/bs'
import SuccessStory from '../../components/TrustBadges';


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

        if (services && Array.isArray(services) && slug) {
            const activeService = services.find(
                service => service?.slug?.current?.toLowerCase() === slug?.toLowerCase()
            );

            setType(activeService?.name);
            setActiveTab(activeService);
        }
    }, [services, slug])



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

    // Get SEO metadata
    const seoData = generateServicesPageMetadata([
        "householdMoving",
        "office",
        "corporate",
        "warehousingAndStorage",
    ])

    return (
        <>
            <Head>
                <title>{seoData.title}</title>
                <meta name="description" content={seoData.description} />
                <meta name="keywords" content={seoData.keywords} />
                <meta property="og:title" content={seoData.openGraph.title} />
                <meta property="og:description" content={seoData.openGraph.description} />
                <meta property="og:type" content={seoData.openGraph.type} />
            </Head>

            <Jumbotron image={"taylor-movers-kenya-packing-boxe.png"} text={"What we do"} />

            {/* Top CTA: Phone and Quote */}
            <div className="container mt-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-lg font-bold">
                        Call: <a href='tel:+254721410517' className='text-[#FF5000] hover:underline'>+254 721 410 517</a>
                    </div>
                    <QuoteModal quotebtn="orange" />
                </div>
            </div>

            {/* Title and hero image for active service */}
            <div className="container my-8">
                <h1 className="text-4xl md:text-5xl font-bold text-[#FF5000] mb-6 text-center">{activeTab?.name}</h1>
                {activeTab?.image && (
                    <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden rounded-2xl shadow-xl">
                        <Image 
                            src={urlFor(activeTab.image).url()} 
                            alt={`${activeTab?.name} service`} 
                            fill
                            className="object-cover" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    </div>
                )}
            </div>

            {/* Success Story Stats - Trust Badges */}
            <SuccessStory 
                variant="compact"
                className="mb-12"
            />

            {/* Main Content with Sidebar */}
            <div className='container'>
                <div className='row'>
                    {/* Sidebar - Features */}
                    <div className='col-md-3 mb-8'>
                        <div className='sticky top-24'>
                            <div className='bg-gray-50 rounded-xl p-6 mb-6'>
                                <h3 className='text-xl font-bold text-[#FF5000] mb-4'>Key Features</h3>
                                <ul className='space-y-3'>
                                    {Array.isArray(activeTab?.featuresLinks) && activeTab.featuresLinks.length > 0 ? (
                                        activeTab.featuresLinks.map((link, idx) => (
                                            <li key={idx} className='flex items-start'>
                                                <BsCheckCircle className='text-[#FF5000] mr-2 mt-1 flex-shrink-0' />
                                                <Link href={link.href || '#'} className='hover:text-[#FF5000] transition-colors'>
                                                    {link.label || link.href}
                                                </Link>
                                            </li>
                                        ))
                                    ) : (
                                        <>
                                            <li className='flex items-start'>
                                                <BsCheckCircle className='text-[#FF5000] mr-2 mt-1 flex-shrink-0' />
                                                <span>Professional packing</span>
                                            </li>
                                            <li className='flex items-start'>
                                                <BsCheckCircle className='text-[#FF5000] mr-2 mt-1 flex-shrink-0' />
                                                <span>Secure transportation</span>
                                            </li>
                                            <li className='flex items-start'>
                                                <BsCheckCircle className='text-[#FF5000] mr-2 mt-1 flex-shrink-0' />
                                                <span>Full insurance coverage</span>
                                            </li>
                                            <li className='flex items-start'>
                                                <BsCheckCircle className='text-[#FF5000] mr-2 mt-1 flex-shrink-0' />
                                                <span>Experienced team</span>
                                            </li>
                                            <li className='flex items-start'>
                                                <BsCheckCircle className='text-[#FF5000] mr-2 mt-1 flex-shrink-0' />
                                                <span>Timely delivery</span>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </div>
                            
                            {/* Related Services */}
                            <div className='bg-white rounded-xl p-6 shadow-md'>
                                <h3 className='text-xl font-bold text-[#FF5000] mb-4'>Related Services</h3>
                                <ul className='space-y-2'>
                                    {(Array.isArray(services) ? services : []).slice(0, 5).filter(s => s.slug?.current !== slug).map((service, idx) => (
                                        <li key={idx}>
                                            <Link href={`/services/${service.slug?.current}`} className='text-gray-700 hover:text-[#FF5000] transition-colors'>
                                                → {service.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className='col-md-9'>
                        {/* Service Description */}
                        <div className='bg-white rounded-xl p-8 shadow-md mb-8'>
                            <h2 className='text-2xl font-bold mb-4 text-gray-800'>About This Service</h2>
                            <div className='prose max-w-none text-gray-600'>
                                {activeTab?.description ? (
                                    <PortableText value={activeTab.description} />
                                ) : (
                                    <p>We provide professional {activeTab?.name?.toLowerCase()} services with utmost care and dedication. Our experienced team ensures your belongings are handled safely and efficiently throughout the entire process.</p>
                                )}
                            </div>
                        </div>

                        {/* YouTube Video Embed */}
                        {activeTab?.videoUrl && (
                            <div className='mb-8'>
                                <h3 className='text-2xl font-bold mb-4 text-gray-800'>See How We Work</h3>
                                <div className='aspect-video rounded-xl overflow-hidden shadow-lg'>
                                    <iframe 
                                        src={`https://www.youtube.com/embed/${(activeTab.videoUrl.match(/(?:v=|be\/|embed\/)([\w-]+)/)?.[1] || '')}`}
                                        title={`${activeTab?.name} video`}
                                        frameBorder='0'
                                        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                                        allowFullScreen
                                        className='w-full h-full'
                                    />
                                </div>
                            </div>
                        )}

                        {/* Service Details Tabs */}
                        <div className='bg-white rounded-xl shadow-md p-8'>
                            <div className='border-[3px] border-[#FF5000] rounded-lg p-6'>
                                <div className='text-3xl text-[#FF5000] font-bold py-2 flex items-center justify-center mb-6'>
                                    <div className='mr-3'>
                                        {activeTab?.icon && <Image src={`${activeTab?.icon}`} alt='' width={50} height={50} />}
                                    </div>
                                    <div className=''>{activeTab?.name}</div>
                                </div>

                                <div className='my-4 service-navigator'>
                                    {!isMobile ? <DesktopActiveItem /> : <MobileActiveItem />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
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
