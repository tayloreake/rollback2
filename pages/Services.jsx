import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { generateServicesPageMetadata } from "../SEO/seo"
import { getServicesPageData } from "../sanity/sanity-utils"
import { useRouter } from "next/router"
import PageTitle from "../components/PageTitle"
import Script from 'next/script';
import Jumbotron from "../components/jumbotron"
import { isMobile } from "react-device-detect"
import Slider from "react-slick"
import { set } from "sanity"
import { Tab, Nav, Row, Col, Accordion } from 'react-bootstrap';




const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
};
const Services = ({ content }) => {
  const router = useRouter();
  const videoRef = useRef(null);


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
    setActiveTab(services[0])
  }, [])

  // console.log(service, subservice)

  const services = [

    {
      name: "Household Moving",
      image: "household.jpg",
      titlePos: "bottom",
      icon: '/icons/household.png',
      presurvey: "<p>We will schedule an appointment at a time convenient to you. Our relocation assessment consultant will then conduct a pre-move survey on your premises. Our survey begins with a walk through of the premises. A room by room evaluation of the items that you need relocated to the destination premises. This will allow our consultant to assess each article in every room that will be shipped out.</p> <p>During the survey, it will be helpful if you could identify and point out the household items that you would like to be sent via air, sea or stored in our warehouse. Our well trained and experienced consultants are ready to assist you should there be any concerns involving any step of the move. Their advice should ensure a satisfactory outcome to completion of the move. We request our clients to schedule approximately thirty minutes for the survey.</p>",
      quotation: "<p>An estimated quotation will then be sent to you based on the preliminary survey. This will include a description of the services we will provide on move day. Also included will be the time frame in which we expect to complete the scheduled relocation.</p> <p>Be sure to include any additional services you might need during your move: pre-packing boxes, crating, arrange for cars and boats to be transported, storage facilities during the move and much more.</p>",
      others: "<p>Rates - Cost competitiveness is an important factor for our clients. All our actions put the clients' value for their money first.</p> <p>First Rate equipment and Packing Materials Reliability is a basic requirement by our clients and we believe in consistent service delivery.To meet this goal we have implemented best of class practices thorough out the company to ensure the highest maintenance standards are observed.</p> <p> Communication - Keeping track of clients' shipment through-out the transportation process is a basic requirement and be competitive advantage for our clients. All the vehicles in the fleet are fitted with tracking equipment and a 2 way Radio Communication to ensure constant contact between headquarters, fleet management and truck drivers.</p> <p> Insurance - Our clients entrust Taylor Movers Ltd with the responsibility of transporting their valuable cargo.We have gone to great lengths to assure our clients that their cargo is protected, but unfortunate incidents do occur.To mitigate any losses to the client, all our shipments are insured with general cartage comprehensive cover.</p>",
      local: "<p>As a full service moving and storage company, we pride ourselves on servicing our customers with local and long distant moves. Our residential moves start with a free in home estimate by a professional move consultant. We offer movers and a full packing service as well as antique care and special heavy services.</p>",
      international: "<p>Moving overseas can be both intimidating and exciting. There is the prospect of seeing new places, becoming acquainted with people from different cultures, and learning customs different from those of your origin country. Nevertheless, particularly for the person who has lived abroad before, there are understandable anxieties, especially about the safe handling of one's household possessions.</p>",
    },

    {
      name: "Office Moving",
      image: "officehold.jpg",
      titlePos: "top",
      icon: '/icons/office.png',
      presurvey: "<p>We will schedule an appointment at a time convenient to you. Our relocation assessment consultant will then conduct a pre-move survey on your premises. Our survey begins with a walk through of the premises. A room by room evaluation of the items that you need relocated to the destination premises. This will allow our consultant to assess each article in every room that will be shipped out.</p> <p>During the survey, it will be helpful if you could identify and point out the household items that you would like to be sent via air, sea or stored in our warehouse. Our well trained and experienced consultants are ready to assist you should there be any concerns involving any step of the move. Their advice should ensure a satisfactory outcome to completion of the move. We request our clients to schedule approximately thirty minutes for the survey.</p>",
      quotation: "<p>An estimated quotation will then be sent to you based on the preliminary survey. This will include a description of the services we will provide on move day. Also included will be the time frame in which we expect to complete the scheduled relocation.</p> <p>Be sure to include any additional services you might need during your move: pre-packing boxes, crating, arrange for cars and boats to be transported, storage facilities during the move and much more.</p>",
      others: "<p>Rates - Cost competitiveness is an important factor for our clients. All our actions put the clients' value for their money first.</p> <p>First Rate equipment and Packing Materials Reliability is a basic requirement by our clients and we believe in consistent service delivery.To meet this goal we have implemented best of class practices thorough out the company to ensure the highest maintenance standards are observed.</p> <p> Communication - Keeping track of clients' shipment through-out the transportation process is a basic requirement and be competitive advantage for our clients. All the vehicles in the fleet are fitted with tracking equipment and a 2 way Radio Communication to ensure constant contact between headquarters, fleet management and truck drivers.</p> <p> Insurance - Our clients entrust Taylor Movers Ltd with the responsibility of transporting their valuable cargo.We have gone to great lengths to assure our clients that their cargo is protected, but unfortunate incidents do occur.To mitigate any losses to the client, all our shipments are insured with general cartage comprehensive cover.</p>",
      local: "<p>As a full service moving and storage company, we pride ourselves on servicing our customers with local and long distant moves. Our residential moves start with a free in home estimate by a professional move consultant. We offer movers and a full packing service as well as antique care and special heavy services.</p>",
      international: "<p>Moving overseas can be both intimidating and exciting. There is the prospect of seeing new places, becoming acquainted with people from different cultures, and learning customs different from those of your origin country. Nevertheless, particularly for the person who has lived abroad before, there are understandable anxieties, especially about the safe handling of one's household possessions.</p>",
    },
    {
      name: "Corporate Moving",
      image: "corporatehold.jpg",
      icon: '/icons/corporate.png',
      titlePos: "bottom",
      presurvey: "<p>We will schedule an appointment at a time convenient to you. Our relocation assessment consultant will then conduct a pre-move survey on your premises. Our survey begins with a walk through of the premises. A room by room evaluation of the items that you need relocated to the destination premises. This will allow our consultant to assess each article in every room that will be shipped out.</p> <p>During the survey, it will be helpful if you could identify and point out the household items that you would like to be sent via air, sea or stored in our warehouse. Our well trained and experienced consultants are ready to assist you should there be any concerns involving any step of the move. Their advice should ensure a satisfactory outcome to completion of the move. We request our clients to schedule approximately thirty minutes for the survey.</p>",
      quotation: "<p>An estimated quotation will then be sent to you based on the preliminary survey. This will include a description of the services we will provide on move day. Also included will be the time frame in which we expect to complete the scheduled relocation.</p> <p>Be sure to include any additional services you might need during your move: pre-packing boxes, crating, arrange for cars and boats to be transported, storage facilities during the move and much more.</p>",
      others: "<p>Rates - Cost competitiveness is an important factor for our clients. All our actions put the clients' value for their money first.</p> <p>First Rate equipment and Packing Materials Reliability is a basic requirement by our clients and we believe in consistent service delivery.To meet this goal we have implemented best of class practices thorough out the company to ensure the highest maintenance standards are observed.</p> <p> Communication - Keeping track of clients' shipment through-out the transportation process is a basic requirement and be competitive advantage for our clients. All the vehicles in the fleet are fitted with tracking equipment and a 2 way Radio Communication to ensure constant contact between headquarters, fleet management and truck drivers.</p> <p> Insurance - Our clients entrust Taylor Movers Ltd with the responsibility of transporting their valuable cargo.We have gone to great lengths to assure our clients that their cargo is protected, but unfortunate incidents do occur.To mitigate any losses to the client, all our shipments are insured with general cartage comprehensive cover.</p>",
      local: "<p>As a full service moving and storage company, we pride ourselves on servicing our customers with local and long distant moves. Our residential moves start with a free in home estimate by a professional move consultant. We offer movers and a full packing service as well as antique care and special heavy services.</p>",
      international: "<p>Moving overseas can be both intimidating and exciting. There is the prospect of seeing new places, becoming acquainted with people from different cultures, and learning customs different from those of your origin country. Nevertheless, particularly for the person who has lived abroad before, there are understandable anxieties, especially about the safe handling of one's household possessions.</p>",
    },
    {
      name: "Warehousing & Storage",
      image: "warehousehold.jpg",
      icon: '/icons/corporate.png',
      titlePos: "bottom",
      presurvey: "<p>We will schedule an appointment at a time convenient to you. Our relocation assessment consultant will then conduct a pre-move survey on your premises. Our survey begins with a walk through of the premises. A room by room evaluation of the items that you need relocated to the destination premises. This will allow our consultant to assess each article in every room that will be shipped out.</p> <p>During the survey, it will be helpful if you could identify and point out the household items that you would like to be sent via air, sea or stored in our warehouse. Our well trained and experienced consultants are ready to assist you should there be any concerns involving any step of the move. Their advice should ensure a satisfactory outcome to completion of the move. We request our clients to schedule approximately thirty minutes for the survey.</p>",
      others: "<p>Rates - Cost competitiveness is an important factor for our clients. All our actions put the clients' value for their money first.</p> <p>First Rate equipment and Packing Materials Reliability is a basic requirement by our clients and we believe in consistent service delivery.To meet this goal we have implemented best of class practices thorough out the company to ensure the highest maintenance standards are observed.</p> <p> Communication - Keeping track of clients' shipment through-out the transportation process is a basic requirement and be competitive advantage for our clients. All the vehicles in the fleet are fitted with tracking equipment and a 2 way Radio Communication to ensure constant contact between headquarters, fleet management and truck drivers.</p> <p> Insurance - Our clients entrust Taylor Movers Ltd with the responsibility of transporting their valuable cargo.We have gone to great lengths to assure our clients that their cargo is protected, but unfortunate incidents do occur.To mitigate any losses to the client, all our shipments are insured with general cartage comprehensive cover.</p>",
      local: "<p>As a full service moving and storage company, we pride ourselves on servicing our customers with local and long distant moves. Our residential moves start with a free in home estimate by a professional move consultant. We offer movers and a full packing service as well as antique care and special heavy services.</p>",
      international: "<p>Moving overseas can be both intimidating and exciting. There is the prospect of seeing new places, becoming acquainted with people from different cultures, and learning customs different from those of your origin country. Nevertheless, particularly for the person who has lived abroad before, there are understandable anxieties, especially about the safe handling of one's household possessions.</p>",
    },

  ]

  const ServiceItem = ({ item }) => {

    return (
      <div
        onClick={() => setType(item?.name)}
        className='px-0 bg-black  h-full hover:animate-pulse cursor-pointer'>
        <Image
          src={`/assets/services/${item?.image}`}
          alt=""
          width={420}
          height={420}
          // fill
          // style={{width:"300px", height:"400px", objectFit:"cover"}}
          className=''
        />
        <div className='absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full bottom-0 py-4'>
          <h3 className='text-white text-center'>{item?.name}</h3>
        </div>
      </div>
    )
  }

  const LocalInternational = () => {
    return (
      <div className="row">
        <div className="col-md-6 bg-[#EDEDED] p-8">
          <h1 className="my-3 uppercase text-2xl font-bold text-[#ff5000]">Local <br /> Moves</h1>
          <div className="my-3">
            <div dangerouslySetInnerHTML={{ __html: activeTab?.local }} />
          </div>
        </div>
        <div className="col-md-6 bg-[#E1DEDE] p-8">
          <h1 className="my-3 uppercase text-2xl font-bold text-[#ff5000]">International <br /> Moves</h1>
          <div className="my-3">
            <div dangerouslySetInnerHTML={{ __html: activeTab?.international }} />
          </div>
        </div>

      </div>
    )
  }

  const PresurveyContent = () => {
    return (
      <div className="my-3">
        <div dangerouslySetInnerHTML={{ __html: activeTab?.presurvey }} />
      </div>
    )
  }

  const QuotationContent = () => {
    return (
      <div className="my-3">
        <div dangerouslySetInnerHTML={{ __html: activeTab?.quotation }} />
      </div>
    )
  }
  const OthersContent = () => {
    return (
      <div className="my-3">
        <div dangerouslySetInnerHTML={{ __html: activeTab?.others }} />
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

export default Services

export async function getServerSideProps({ req, res }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  )
  const content = await getServicesPageData()

  return {
    props: {
      content,
    },
  }
}
