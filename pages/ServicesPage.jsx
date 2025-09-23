import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { generateServicesPageMetadata } from "../SEO/seo"
import Head from 'next/head'
import { getServicesData, getServicesPageData } from "../sanity/sanity-utils"
import { useRouter } from "next/router"
import Script from 'next/script';
import Jumbotron from "../components/jumbotron"
import { isMobile } from "react-device-detect"
import Slider from "react-slick"
import { set } from "sanity"
import { Tab, Nav, Row, Col, Accordion } from 'react-bootstrap';
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import { PortableText } from '@portabletext/react';
import Link from "next/link";



const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};
const Services = ({ content, servicesData }) => {
  const router = useRouter();
  const videoRef = useRef(null);
  const [services, setServices] = useState(servicesData)


  const builder = imageUrlBuilder(client)
  function urlFor(source) {
    return builder.image(source)
  }

  useEffect(() => {
    const { service, subservice } = router.query;
    setType(service)
    setSubType(subservice)

  }, [router.query])

  const [type, setType] = useState("Household Moving")
  const [subType, setSubType] = useState("Premoving");
  const [activeTab, setActiveTab] = useState({});
  const [key, setKey] = useState('name');

  useEffect(() => {
    setType("Household Moving");
    setSubType("Premoving");
    if (services && services.length > 0) {
      setActiveTab(services[0])
    }

    // Add scroll event listener with safety check
    const scrollElement = document.querySelector(".scroll");
    if (scrollElement) {
      scrollElement.addEventListener("click", function () {
        const detailElement = document.getElementById("view-detail");
        if (detailElement) {
          detailElement.scrollIntoView({
            behavior: "smooth"
          });
        }
      });
    }
  }, [services])



  const ServiceItem = ({ item }) => {
    if (!item) return null;

    return (
      <div
        onClick={() => setType(item?.name)}
        className='max-w-[300px] px-0 bg-black h-full hover:animate-pulse cursor-pointer relative transition-all duration-300'>
        {item?.image ? (
          <Image
            src={urlFor(item.image).url()}
            alt={item?.name || 'Service image'}
            width={420}
            height={420}
            className='object-cover w-full h-full'
          />
        ) : (
          <div className='w-full h-[420px] bg-gray-300 flex items-center justify-center'>
            <span className='text-gray-600'>No image available</span>
          </div>
        )}
        <div className={`absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full ${item?.titlePos || 'bottom'}-0 py-4`}>
          <h3 className='text-white text-center font-semibold'>{item?.name || 'Service'}</h3>
        </div>
      </div>
    )
  }

  const LocalInternational = () => {
    return (
      <div className="row">
        <div className="col-md-6 bg-[#EDEDED] p-8">
          <h2 className="my-3 uppercase text-2xl font-bold text-[#ff5000]">{type?.toLowerCase() == "warehousing & storage" ? "Warehousing" : <span>Local <br />Moves</span>}</h2>
          <div className="my-3">
            <PortableText value={activeTab?.local} />
          </div>
        </div>
        <div className="col-md-6 bg-[#E1DEDE] p-8">
          <h2 className="my-3 uppercase text-2xl font-bold text-[#ff5000]">{type?.toLowerCase() == "warehousing & storage" ? "Storage" : <span>International <br />Moves</span>}</h2>
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

      <Jumbotron image={"taylor-movers-kenya-packing-boxe.png"} text={"What we do"} alt={"Stack of sturdy, professional moving boxes used by Taylor Movers Kenya for secure packing."} />

      <div className="container my-4">
        <h2 className="text-3xl font-[500] text-[#ff5000] py-2 !mt-12">We specialize in</h2>
        <div className="py-3">
          <p>local and international relocation. Taylor Movers is a privately held firm committed to excellence through providing relocation, transportation, warehousing, expatriate mobility services and logistics services efficiently.</p>
        </div>
      </div>
      <div className='container'>


        <div className='row items-center w-full h-full overflow-x-auto pb-4 mb-2'>
          {!isMobile
            ?
            services?.map((item, idx) => (
              <Link href="#view-detail" key={`service-list-${idx}`}
                onClick={() => setActiveTab(item)}
                className={`scroll col-md-3 px-0 ${activeTab == item && 'active'}`}>
                <ServiceItem item={item} /></Link>
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

        <div id="view-detail" className='border-[3px] border-[#FF5000] mb-8 md:p-12 p-6 rounded-sm'>
          <div className="text-3xl text-[#FF5000] font-bold py-2 flex items-center justify-center my-2">
            <div className="mr-3">
              {activeTab?.icon && <Image src={`${activeTab?.icon}`} alt="Image of moving boxes" width={50} height={50} />}
            </div>
            <div className="">{activeTab?.name}</div>
          </div>

          <div className="my-4 service-navigator">
            {!isMobile ? <DesktopActiveItem /> : <MobileActiveItem />}
          </div>

        </div >

      </div >

    </>
  )
}

export default Services

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
