import Image from "next/image"
import React, { useEffect, useState } from "react"
import { BiChevronRight } from "react-icons/bi"
import Accordion from 'react-bootstrap/Accordion';

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

  const bankingImages = require.context(`../../public/assets/Clients/banking`, false, /\.(png|jpe?g|svg)$/);
  const bankingImgPaths = bankingImages.keys().map(bankingImages);
  const companiesImages = require.context(`../../public/assets/Clients/companies`, false, /\.(png|jpe?g|svg)$/);
  const companiesImgPaths = companiesImages.keys().map(companiesImages);
  const institutionImages = require.context(`../../public/assets/Clients/govtoil`, false, /\.(png|jpe?g|svg)$/);
  const institutionImgPaths = institutionImages.keys().map(institutionImages);
  
  
  const AccordionItem = ({item}) => {

    return (
      <Accordion.Item eventKey={"clients-" + item.name}>
        <Accordion.Header className="font-bold !capitalize">
            {item.name}
        </Accordion.Header>

        <Accordion.Body>
          {item.imgPaths.map((src, i) => (
            <Image 
              key={`${item.name}-${i}`}
              alt={`img-${i}`}
              src={src}
              width={200}
              height={100}
              className="inline-block mb-3 client-logo"
              style={{width:"200px", marginRight:"7px"}}
              />
          ))}
        </Accordion.Body>
      </Accordion.Item>
    )
  }
  return (
    <div className='w-full h-full py-4 px-4 md:px-8 flex items-center justify-center'>
      <div className='flex flex-col max-w-[1440px] w-full'>
        <h2 className='text-xl font-semibold'>{content.clientsTitle}</h2>
        <hr className='border border-[#DB421B] w-[50px] my-3' />

        <p className='max-w-[1400px]'>{content.clientsDescription}</p>

        <div className='flex flex-col mt-12'>
        <Accordion
          className="accordion"
          id="clients-accordion"
          defaultActiveKey={"clients-banking"}
          allowMultipleExpanded={false}
          uuid={63213}
        >
            
          <AccordionItem item={{name:"Banking", imgPaths: bankingImgPaths}}/>
          <AccordionItem item={{name:"Companies", imgPaths: companiesImgPaths}}/>
          <AccordionItem item={{name:"Institutions", imgPaths: institutionImgPaths}}/>
            
        </Accordion>                  
        </div>
      </div>
    </div>
  )
}

export default Clients
