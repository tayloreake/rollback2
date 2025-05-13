import Image from "next/image"
import React, { useEffect, useState } from "react"
import { BiChevronRight } from "react-icons/bi"
import Accordion from 'react-bootstrap/Accordion';
import Reviews from "../Reviews/reviews";
import { isMobile } from "react-device-detect";
import { Tab, Tabs } from "react-bootstrap";

const Clients = ({ content, urlFor }) => {
  const [info, setInfo] = useState([])
  useEffect(() => {
    setInfo(
      content.clientsAccordions.map((item, index) => {
        const { _key, clientsAccordionTitle, clientsAccordionImages } = item
        const imagesArray = clientsAccordionImages.map((image) =>
          urlFor(image).url()
        )
        return {
          id: _key,
          title: clientsAccordionTitle,
          images: imagesArray,
          open: index === 0,
        }
      })
    )
  }, [urlFor])

  const handleClick = (id) => {
    const newInfo = info.map((item) => {
      if (item.id === id) {
        item.open = !item.open
      }
      return item
    })
    setInfo(newInfo)
  }
  const clients = ["banking", 'companies', 'institutions'];

  // not working... sort out
  const getImagePaths = (name) => {
    console.log("THE NAME IS :::: ", name);
    try{
      const importedImages = require.context(`../../public/assets/clients/banking`, false, /\.(png|jpe?g|svg)$/);
      const imgPaths = importedImages.keys().map(importedImages);
      return imgPaths;
    } catch(err) {
      console.log("THE ERR   ", err)
      return [];
    }
    
  }

  const bankingImages = require.context(`../../public/assets/Clients/bank-oil`, false, /\.(png|jpe?g|svg)$/);
  const bankingImgPaths = bankingImages.keys().map(bankingImages);
  const companiesImages = require.context(`../../public/assets/Clients/companies`, false, /\.(png|jpe?g|svg)$/);
  const companiesImgPaths = companiesImages.keys().map(companiesImages);
  const institutionImages = require.context(`../../public/assets/Clients/institutions`, false, /\.(png|jpe?g|svg)$/);
  const institutionImgPaths = institutionImages.keys().map(institutionImages);
  const internationalImages = require.context(`../../public/assets/Clients/international`, false, /\.(png|jpe?g|svg)$/);
  const internationalImgPaths = internationalImages.keys().map(internationalImages);
  const governmentImages = require.context(`../../public/assets/Clients/government`, false, /\.(png|jpe?g|svg)$/);
  const governmentImgPaths = governmentImages?.keys()?.map(governmentImages);
  
  const AccordionItem = ({item}) => {

    return (
      <Accordion.Item eventKey={item.name}>
        <Accordion.Header className="font-bold !capitalize">
            {item.name}
        </Accordion.Header>
        <Accordion.Body>
          {item.imgPaths.map((src, i) => (
            <Image 
              key={`${item.name}`}
              alt={`img-${i}`}
              src={src}
              width={100}
              height={100}
              className="inline-block mb-3 client-logo"
              style={{width:"100px", marginRight:"12px"}}
              />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    )
  }


  const ClientTabs = () => {

    const tabsList = [
      {
        title: "banking and oil",
        eventKey: 'banking',
        imgPaths: bankingImgPaths,
      },
      {
        title: "Companies",
        eventKey: 'companies',
        imgPaths: companiesImgPaths,
      },
      {
        title: "institutions",
        eventKey: 'institutions',
        imgPaths: institutionImgPaths,
      },
      {
        title: "International",
        eventKey: 'international',
        imgPaths: internationalImgPaths,
      },
      {
        title: "government",
        eventKey: 'government',
        imgPaths: governmentImgPaths,
      }
    ]

    return (
      <div className="">
      <Tabs defaultActiveKey={"banking"} id="scrollable-tabs" className="plain-tabs flex-nowrap">
        {/* Make the tabs dynamic */}

        {
          tabsList?.map((item, idx) => (
            <Tab 
              eventKey={item?.eventKey}
              title={item?.title}
              className="p-3 max-h-[300px] overflow-auto"
              >
                {item.imgPaths.map((src, i) => (
                  <Image 
                    key={`${item.name}`}
                    alt={`img-${i}`}
                    src={src}
                    width={100}
                    height={200}
                    className="inline-block mb-3 client-logo"
                    style={{width:"200px", marginRight:"12px"}}
                    />
                ))}
            </Tab>
          ))
        }
    </Tabs>
    </div>
    )
  }
  return (
    <div className='w-full h-full py-4 px-4 md:px-8 flex items-center justify-center'>
      <div className='container'>
        <hr className='border border-[#DB421B] w-[50px] my-3' />

        {/* <p className='max-w-[1400px]'>{content.clientsDescription}</p> */}

        
        
        <div className='row'>
          <div className="col-md-6 md:pr-5">
            <h1 className="my-3 text-3xl font-bold">What Our Customers Say</h1>

            <div className="my-2">
              We have a diversified portfolio of moving services in Kenya that include residential moving, corporate moving, office moving and industrial moving services. Whether you're moving within Nairobi, moving anywhere in Kenya or international moving, Taylor Movers Kenya has a solution tailor made for you.
            </div>

            <div className="mt-5">
              <Reviews />
            </div>
          </div>

          <div className="col-md-6">
            <h1 className="text-2xl my-4 font-bold">Our Clients</h1>

            {isMobile 
              ?
              <Accordion
              className="accordion"
              id="clients-accordion"
              defaultActiveKey={"Banking and Oil"}
              allowMultipleExpanded={false}
              uuid={63213}
            >
              <AccordionItem item={{name:"Banking and Oil", imgPaths: bankingImgPaths}}/>
              <AccordionItem item={{name:"Companies", imgPaths: companiesImgPaths}}/>
              <AccordionItem item={{name:"Institutions", imgPaths: institutionImgPaths}}/>
              <AccordionItem item={{name:"International", imgPaths: internationalImgPaths}}/>
              <AccordionItem item={{name:"Government", imgPaths: governmentImgPaths}}/>
            </Accordion>
            :
            
              <ClientTabs />
            }
            
          </div>
                        
        </div>
      </div>
    </div>
  )
}

export default Clients
