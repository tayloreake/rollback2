import Image from "next/image";
import React, { useEffect, useState } from "react";
import { BiChevronRight } from "react-icons/bi";
import Accordion from 'react-bootstrap/Accordion';
import Reviews from "../Reviews/reviews";
import { isMobile } from "react-device-detect";
import { Tab, Tabs } from "react-bootstrap";
import imageUrlBuilder from "@sanity/image-url";
import client from "../../sanity/config/client-config"


const Clients = ({ content }) => {
  const [info, setInfo] = useState([])

  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }


  const handleClick = (id) => {
    const newInfo = info.map((item) => {
      if (item.id === id) {
        item.open = !item.open
      }
      return item
    })
    setInfo(newInfo)
  }


  const AccordionItem = ({ item }) => {

    return (
      <Accordion.Item eventKey={item.key}>
        <Accordion.Header className="font-bold !capitalize">
          {item.category}
        </Accordion.Header>
        <Accordion.Body className="!p-2">
        </Accordion.Body>
      </Accordion.Item>
    )
  }


  const ClientTabs = () => {
    const [clientCategories, setClientCategories] = useState([]);
    const [clients, setClients] = useState([]);
    const [activeKey, setActiveKey] = useState("banking")

    useEffect(() => { }, [clients])


    useEffect(() => {
      const storedcategories = JSON.parse(window.localStorage.getItem("clientCategories"));
      const storedClients = JSON.parse(window.localStorage.getItem("clients"));
      setClientCategories(storedcategories);

      setClients(storedClients?.filter(item => item?.logoCategories[0]?.key === "banking"));


    }, []);

    useEffect(() => {
      const storedClients = JSON.parse(window.localStorage.getItem("clients"));
      setClients(storedClients?.filter(item => item?.logoCategories[0]?.key === activeKey));

    }, [activeKey])

    return (
      <div className="">
        <Tabs
          defaultActiveKey={"banking"}
          id="scrollable-tabs"
          onSelect={(k) => setActiveKey(k)}
          className="capitalize plain-tabs flex-nowrap">
          {/* Make the tabs dynamic */}

          {
            clientCategories?.map((item, idx) => (
              <Tab
                key={`item-${idx}`}
                onSelect={() => setActiveKey(item?.key)}
                eventKey={item?.key}
                title={item?.category}
                className="p-3 max-h-[300px] overflow-auto !capitalize"
              >
                {clients?.map((src, i) => (

                  <Image
                    key={`${item.name}`}
                    alt={item?.alt}
                    src={urlFor(src?.clientLogo)?.url() || '/assets/Clients/default.png'}
                    width={100}
                    height={200}
                    className="inline-block mb-3 client-logo"
                    style={{ width: "160px", marginRight: "8px" }}
                  />
                ))}

                {clients?.length < 1 &&
                  <div
                    className="bg-gray-200 text-gray-700 rounded-md text-center border-dashed p-2 ">
                    You&apos;ll be a unique client
                  </div>
                }
              </Tab>
            ))
          }

        </Tabs>
      </div>
    )
  }

  const ClientAccordion = () => {
    const [clientCategories, setClientCategories] = useState([]);
    const [clients, setClients] = useState([]);
    const [activeKey, setActiveKey] = useState("banking")

    useEffect(() => { }, [clients])


    useEffect(() => {
      const storedcategories = JSON.parse(window.localStorage.getItem("clientCategories"));
      const storedClients = JSON.parse(window.localStorage.getItem("clients"));
      setClientCategories(storedcategories);

      setClients(storedClients?.filter(item => item?.logoCategories[0]?.key === "banking"));
      console.log("clients", clients);

    }, []);

    useEffect(() => {
      const storedClients = JSON.parse(window.localStorage.getItem("clients"));
      setClients(storedClients?.filter(item => item?.logoCategories[0]?.key === activeKey));

    }, [activeKey]);

    return (
      <div className="accordion">
        <Accordion
          className="accordion"
          id="clients-accordion"
          defaultActiveKey={"banking"}
          allowMultipleExpanded={false}
          uuid={63213}
        >
          {clientCategories?.map((category, idx) => (
            <Accordion.Item eventKey={category?.key} key={`category-${idx}`}>
              <div onClick={() => setActiveKey(category?.key)}><Accordion.Header className="font-bold !capitalize">
                {category?.category}
              </Accordion.Header>
              </div>
              <Accordion.Body className="!p-2">
                {clients?.map((src, i) => (

                  <Image
                    key={`${category.name}`}
                    alt={src?.alt}
                    src={urlFor(src?.clientLogo)?.url() || '/assets/Clients/default.png'}
                    width={100}
                    height={200}
                    className="inline-block mb-3 client-logo"
                    style={{ width: "132px", marginRight: "8px" }}
                  />
                ))}

                {clients?.length < 1 &&
                  <div
                    className="bg-gray-200 text-gray-700 rounded-md text-center border-dashed p-2 ">
                    You&apos;ll be a unique client
                  </div>
                }
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    )
  }
  return (
    <div className='w-full h-full py-4 px-2 md:px-8 flex items-center justify-center'>
      <div className='container'>
        <hr className='border border-[#DB421B] w-[50px] my-3' />

        {/* <p className='max-w-[1400px]'>{content.clientsDescription}</p> */}



        <div className='row'>
          <div className="col-12">
            <h3 className="my-5 text-center text-3xl font-bold">What Our Customers Say</h3>
            <div className="row">
              <div className="my-2 col-md-6">
                We have a diversified portfolio of moving services in Kenya that include residential moving, corporate moving, office moving and industrial moving services. Whether you&apos;re moving within Nairobi, moving anywhere in Kenya or international moving, Taylor Movers Kenya has a solution tailor made for you.
              </div>

              <div className="col-md-6">
                <Reviews />
              </div>
            </div>
          </div>

          <div className="col-12">
            <h3 className="text-2xl my-4 font-bold">Our Clients</h3>
            {isMobile ? (
              <ClientAccordion />
            ) : (
              <ClientTabs />
            )}

          </div>

        </div>
      </div>
    </div >
  )
}
export default Clients;