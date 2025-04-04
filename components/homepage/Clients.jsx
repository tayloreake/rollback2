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

  const clients = [
    {
      name: "banking and insurance",
      folder:"banking",
      logos: [
        {
          name: "kcb",
          logo: 'kcb.png'
        },
        {
          name: "corp",
          logo: 'corp.jpeg'
        },
        {
          name: "imperial",
          logo: 'imperial.jpg'
        },
        {
          name: "britam",
          logo: 'britam.jpg'
        },
        {
          name: "watu credit",
          logo: 'watu.jpg'
        },
        {
          name: "ncba",
          logo: 'ncba.jpg'
        },
        {
          name: "family",
          logo: 'family.jpg'
        },
        {
          name: "aar",
          logo: 'aar.jpg'
        }
      ]
    },
    {
      name: "government and oil",
      folder:"govtoil",
      logos: [
        {
          name: "knec",
          logo: 'knec.jpg'
        },
        {
          name: "ict",
          logo: 'ict.jpg'
        },
        {
          name: "kenha",
          logo: 'kenha.jpg'
        },
        {
          name: "cbk",
          logo: 'cbk.jpg'
        },
        {
          name: "kura",
          logo: 'kura.jpg'
        },
        {
          name: "tourism",
          logo: 'tourism.jpg'
        },
        {
          name: "national oil",
          logo: 'national.jpg'
        },
        {
          name: "npsc",
          logo: 'npsc.jpg'
        },
        {
          name: "epra",
          logo: 'epra.jpg'
        },
        {
          name: "kemsa",
          logo: 'kemsa.jpg'
        }
      ]
    },
    {
      name: "institutions",
      folder:"institutions",
      logos: [
        {
          name: "gibb",
          logo: 'gibb.jpg'
        },
        {
          name: "givep",
          logo: 'givep.jpg'
        },
        {
          name: "kenha",
          logo: 'kenha.jpg'
        },
        {
          name: "cbk",
          logo: 'cbk.jpg'
        },
        {
          name: "kura",
          logo: 'kura.jpg'
        },
        {
          name: "tourism",
          logo: 'tourism.jpg'
        },
        {
          name: "national oil",
          logo: 'national.jpg'
        },
        {
          name: "nacost",
          logo: 'nacost.jpg'
        },
        {
          name: "unicef",
          logo: 'unicef.jpg'
        }
      ]
    },
    {
      name: "companies/business",
      folder:"companies",
      logos: [
        {
          name: "cellulant",
          logo: 'cellulant.jpg'
        },
        {
          name: "inchcape",
          logo: 'inchcape.jpg'
        },
        {
          name: "jumia",
          logo: 'jumia.jpg'
        },
        {
          name: "azam",
          logo: 'azam.jpg'
        },
        {
          name: "davis",
          logo: 'davis.jpg'
        },
        {
          name: "hp",
          logo: 'hp.jpg'
        }
      ]
    }
  ]

  const AccordionItem = ({item}) => {

    return (
      <Accordion.Item eventKey={"clients-" + item.folder}>
        <Accordion.Header className="font-bold !capitalize">
            {item.name}
        </Accordion.Header>

        <Accordion.Body>
          {item?.logos?.map((logo)=> (
            <Image 
              key={logo.name}
              alt={logo.name}
              src={`/assets/clients/${item?.folder}/${logo?.logo}`}
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
          {clients.map((client) => (
            <>
              <AccordionItem item={client}/>
            </>
          ))}

        </Accordion>                  
        </div>
      </div>
    </div>
  )
}

export default Clients
