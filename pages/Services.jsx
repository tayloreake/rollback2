import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { generateServicesPageMetadata } from "../SEO/seo"
import { getServicesPageData } from "../sanity/sanity-utils"
import { useRouter } from "next/router"
import PageTitle from "../components/PageTitle"
import Script from 'next/script';

const Services = ({ content }) => {
  const router = useRouter();
  const videoRef = useRef(null);


  useEffect(() => {
    const { service, subservice } = router.query;   
    setType(service)
    setSubType(subservice)

  }, [router.query])
  
  const [type, setType] = useState("Household Moving")
  const [subType, setSubType] = useState("Premoving")

  useEffect(() => {
    setType("Household Moving");
    setSubType("Premoving")
  },[])

  // console.log(service, subservice)

  return (
    <>
      {generateServicesPageMetadata([
        "householdMoving",
        "office",
        "corporate",
        "warehousingAndStorage",
      ])}
      <div className='w-full h-full flex flex-col items-center justify-center'>
        <PageTitle title={"Our Services"} />
        <div className='max-w-[1440px] w-full h-full flex flex-col items-start justify-start py-8 my-4 px-4 md:px-8'>
          <div className='flex flex-col mb-6'>
            {/* <h2 className='text-xl mb-2 font-semibold'>Our Services</h2> */}
            <p>
              We specialize in local and international relocations. Taylor
              Movers is a privately held firm committed to excellence through
              providing relocations, transportation, warehousing, expatriate
              mobility services and logistics services efficiently.
            </p>
          </div>
          <div className='flex flex-row items-center w-full h-full overflow-x-auto pb-4 mb-12'>
            <div
              onClick={() => setType("Household Moving")}
              className='bg-black relative h-full hover:animate-pulse cursor-pointer'>
              <Image
                src='/assets/services/house.jpg'
                alt='Household Moving'
                width={419}
                height={419}
                className='max-h-[419px] object-cover max-w-[200px] md:max-w-[419px]'
              />
              <div className='absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full bottom-0 py-4'>
                <h3 className='text-white text-center'>Household Moving</h3>
              </div>
            </div>
            <div
              onClick={() => setType("Office Moving")}
              className='bg-black relative h-full hover:animate-pulse cursor-pointer'>
              <video 
                // ref={"videoRef"}
                width="320"
                height="240" 
                controls
                autoPlay muted loop
                playsInline
                className="max-w-[419px] w-[419px] h-[419px]"
                >
                <source 
                  src="/assets/services/office.mp4" type="video/mp4"/>
                <source src="/assets/services/office.mov" type="video/mov"/>

                
                Your browser does not support the video tag.
              </video>
              
              {/* <iframe src="https://www.youtube.com/embed/19g66ezsKAg" allowFullScreen /> */}

              <div className='absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full bottom-0 py-4'>
                <h3 className='text-white text-center'>Office Moving</h3>
              </div>
            </div>
            <div
              onClick={() => setType("Corporate Moving")}
              className='bg-black relative h-full hover:animate-pulse cursor-pointer'>
              <Image
                src='/assets/services/corporate.jpg'
                alt='Corporate Moving'
                width={419}
                height={419}
                className='max-h-[419px] object-cover max-w-[200px] md:max-w-[419px]'
              />
              <div className='absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full bottom-0 py-4'>
                <h3 className='text-white text-center'>Corporate Moving</h3>
              </div>
            </div>
            <div
              onClick={() => setType("Warehouse Moving")}
              className='bg-black relative h-full hover:animate-pulse cursor-pointer'>
              <Image
                src='/assets/services/warehouse.jpg'
                alt='Warehouse Moving'
                width={419}
                height={419}
                className='h-[419px] object-cover max-w-[200px] md:max-w-[419px]'
              />
              <div className='absolute bg-gradient-to-t from-[#DB421B] to-[#DB421B]/40 w-full bottom-0 py-4'>
                <h3 className='text-white text-center'>Warehouse Storage</h3>
              </div>
            </div>
          </div>

          {type === "Household Moving" ? (
            <div className='flex flex-col items-start justify-start w-full'>
              <h3 className='font-bold mb-4 text-xl'>Household Moving</h3>
              <h4 className='mb-2 text-[#DB421B] text-lg'>Local Moves</h4>
              <p className='mb-6'>
                As a full service moving and storage company, we pride ourselves
                on servicing our customers with local and long distant moves.
                Our residential moves start with a free in home estimate by a
                professional move consultant. We o er movers and a full packing
                service as well as antique care and special heavy services.
              </p>
              <h4 className='mb-2 text-[#DB421B] text-lg'>
                International Moves
              </h4>
              <p className='mb-6'>
                Moving overseas can be both intimidating and exciting. There is
                the prospect of seeing new places, becoming acquainted with
                people from different cultures, and learning customs different
                from those of your origin country. Nevertheless, particularly
                for the person who has lived abroad before, there are
                understandable anxieties, especially about the safe handling of
                one&apos;s household possessions.
                <br />
                <br />
                The key to an uncomplicated international relocation is
                “pre-planning”- minimizing the uncertainty by reducing it to a
                series of manageable, scheduled events.
              </p>

              <div className='flex flex-col md:flex-row mt-6 w-full'>
                <div className='md:flex-col md:max-w-fit md:pr-6 md:min-w-fit w-full overflow-x-auto pb-6 md:mr-6 border-b md:border-b-0 md:border-r border-gray-200'>
                  <div
                    onClick={() => setSubType("Premoving")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold'>Pre Moving Survey </p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                  <div
                    onClick={() => setSubType("Quotation")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold'>Quotation</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                  <div
                    onClick={() => setSubType("Other Services")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold'>Other Services</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                </div>
                {subType === "Premoving" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='mb-2 text-[#DB421B] text-lg'>
                      Scheduling Appointments
                    </h4>
                    <p className='mb-6'>
                      We will schedule an appointment at a time convenient to
                      you. Our relocation assessment consultant will then
                      conduct a pre-move survey on your premises. Our survey
                      begins with a walk through of the premises. A room by room
                      evaluation of the items that you need relocated to the
                      destination premises. This will allow our consultant to
                      assess each article in every room that will be shipped
                      out.
                      <br />
                      <br />
                      During the survey, it will be helpful if you could
                      identify and point out the household items that you would
                      like to be sent via air, sea or stored in our warehouse.
                      Our well trained and experienced consultants are ready to
                      assist you should there be any concerns involving any step
                      of the move. Their advice should ensure a satisfactory
                      outcome to completion of the move. We request our clients
                      to schedule approximately thirty minutes for the survey.
                    </p>
                  </div>
                ) : subType === "Quotation" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='font-[500] mb-2 text-[#DB421B] text-lg'>
                      Quotation Time
                    </h4>
                    <p className='mb-6'>
                      An estimated quotation will then be sent to you based on
                      the preliminary survey. This will include a description of
                      the services we will provide on move day. Also included
                      will be the time frame in which we expect to complete the
                      scheduled relocation.
                      <br />
                      <br />
                      Be sure to include any additional services you might need
                      during your move: pre-packing boxes, crating, arrange for
                      cars and boats to be transported, storage facilities
                      during the move and much more.
                    </p>
                  </div>
                ) : subType === "Other Services" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='font-[500] mb-2 text-[#DB421B] text-lg'>
                      Other Services
                    </h4>
                    <p className='mb-6'>
                      Rates - Cost competitiveness is an important factor for
                      our clients. All our actions put the clients&apos; value
                      for their money first.
                      <br />
                      <br />
                      First Rate equipment and Packing Materials Reliability is
                      a basic requirement by our clients and we believe in
                      consistent service delivery. To meet this goal we have
                      implemented best of class practices thorough out the
                      company to ensure the highest maintenance standards are
                      observed.
                      <br />
                      <br />
                      Communication - Keeping track of clients&apos; shipment
                      through-out the transportation process is a basic
                      requirement and be competitive advantage for our clients.
                      All the vehicles in the fleet are fitted with tracking
                      equipment and a 2 way Radio Communication to ensure
                      constant contact between headquarters, fleet management
                      and truck drivers.
                      <br />
                      <br />
                      Insurance - Our clients entrust Taylor Movers Ltd with the
                      responsibility of transporting their valuable cargo. We
                      have gone to great lengths to assure our clients that
                      their cargo is protected, but unfortunate incidents do
                      occur. To mitigate any losses to the client, all our
                      shipments are insured with general cartage comprehensive
                      cover.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : type === "Office Moving" ? (
            <div className='flex flex-col items-start justify-start w-full'>
              <h3 className='font-bold mb-4 text-xl'>Office Relocation Services</h3>
              {/* <h4 className='mb-2 text-[#DB421B] text-lg'>Local Moves</h4> */}
              <p className='mb-6'>
                Our office relocation services are designed with your
                company&apos;s functionality and productivity in mind. We
                understand your need to have a smooth, seamless transition for
                your employees from one location to the next. We realize this as
                your corporate relocation company, but also as a successful
                business ourselves.
                <br />
                <br />
                Now more than ever it&apos;s imperative that your business keeps
                moving forward. And nobody knows that better than you. Because,
                when it comes to relocating your people, you don&apos;t have
                time to deal with problems like real estate negotiations or
                special financing. These interruptions stop business. At Taylor
                Movers, we work diligently to eliminate the bumps that prevent
                you from running your business smoothly.
                <br />
                <br />
                It starts with a deep understanding of your operational and
                personal needs. It goes far beyond trucks, boxes and
                stretch-wrap. It&apos;s insight, trust, integrity and peace of
                mind. We pride ourselves on delivering individualized relocation
                solutions that meet the diverse and ever-changing needs of a
                corporate account.
                <br />
                <br />
                <span className='text-[#DB421B]'>
                  In other words, we stop at nothing to keep you and your
                  employees productive before, during and after a move.
                  <br />
                  Other Corporate Relocation Companies Cannot Top Taylor Movers.
                </span>
              </p>
              {/* <h4 className='mb-2 text-[#DB421B] text-lg'>International Moves</h4> */}

              <div className='flex flex-col md:flex-row mt-6 w-full'>
                <div className='flex-row md:flex-col md:pr-6 max-w-fit min-w-fit w-full overflow-x-auto pb-6 md:mr-6 border-b md:border-b-0 md:border-r border-gray-200'>
                  <div
                    onClick={() => setSubType("Office Move")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold underline'>Office Move</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                  <div
                    onClick={() => setSubType("Service List")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold '> Service List</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                </div>
                {subType === "Office Move" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='mb-2 text-[#DB421B] text-lg'>Office Move</h4>
                    <p className='mb-6'>
                      Our office relocation services are designed with your
                      company&apos;s functionality and productivity in mind. We
                      understand your need to have a smooth, seamless transition
                      for your employees from one location to the next. We
                      realize this as your corporate relocation company, but
                      also as a successful business ourselves.
                      <br />
                      <br />
                      Now more than ever it&apos;s imperative that your business
                      keeps moving forward. And nobody knows that better than
                      you. Because, when it comes to relocating your people, you
                      don&apos;t have time to deal with problems like real
                      estate negotiations or special financing. These
                      interruptions stop business. At Taylor Movers, we work
                      diligently to eliminate the bumps that prevent you from
                      running your business smoothly.
                      <br />
                      <br />
                      It starts with a deep understanding of your operational
                      and personal needs. It goes far beyond trucks, boxes and
                      stretch-wrap. It&apos;s insight, trust, integrity and
                      peace of mind. We pride ourselves on delivering
                      individualized relocation solutions that meet the diverse
                      and ever-changing needs of a corporate account.
                      <br />
                      <br />
                      In other words, we stop at nothing to keep you and your
                      employees productive before, during and after a move.
                      <br />
                      <br />
                      Other Corporate Relocation Companies Cannot Top Taylor
                      Movers.
                    </p>
                  </div>
                ) : subType === "Service List" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='mb-2 text-[#DB421B] text-lg'>
                       Service List
                    </h4>
                    <p className='mb-6'>
                      Taylor is a leader in the planning, routing, distribution
                      and logistics of IT and office equipment, space-planning
                      and decorating. We have computer and office moving
                      divisions at all major branches and our specialized
                      computer and office relocations team is experienced in the
                      safe handling and secure rigging of any computer
                      equipment. Big or small office, moving your business
                      smoothly and at a competitive cost is easy with Taylor
                      Movers.
                      <br />
                      <br />
                      We go out of our way to ensure minimum downtime for your
                      staff members. Where required, disassembly and reassembly
                      of desks and other items will be completed to ensure a
                      smooth transition to your new office premises. All company
                      documents are systematically packed and unpacked, ensuring
                      no extra work is created for the individuals when they
                      arrive at their new workstations.
                      <br />
                      <br />
                      Using our office moving checklists, we ensure the entire
                      move process is handled seamlessly, with special attention
                      to communication, logistics preparation, checking
                      inventory and finally execution.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : type === "Corporate Moving" ? (
            <div className='flex flex-col items-start justify-start w-full'>
              <h3 className='font-bold mb-4 text-xl'>
                Corporate Staff Relocation Services
              </h3>
              {/* <h4 className='mb-2 text-[#DB421B] text-lg'>Local Moves</h4> */}
              <p className='mb-6'>
                Our General Manager and his team action and manage each
                international relocation case according to the principles of
                service excellence of Taylor Movers. Our entire network is
                constantly monitored to ensure consistent service delivery and
                that the newest, best practices are being implemented.
              </p>
              {/* <h4 className='mb-2 text-[#DB421B] text-lg'>International Moves</h4> */}

              <div className='flex flex-col md:flex-row mt-6 w-full'>
                <div className='flex-row md:flex-col md:pr-6 max-w-fit  w-full overflow-x-auto pb-6 md:mr-6 border-b md:border-b-0 md:border-r border-gray-200'>
                  <div
                    onClick={() => setSubType("Coporate Relocations")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold underline'>Corporate Relocations</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                  <div
                    onClick={() => setSubType("Coporate Service List")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold underline'> Service List</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                </div>
                {subType === "Coporate Relocations" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='mb-2 text-[#DB421B] text-lg'>
                      Coporate Relocations
                    </h4>
                    <p className='mb-6'>
                      We offer Area Tours, Area Information Packets, School/
                      Community Information, Home Finding/Home Purchasing
                      Information & Assistance, Home Rental Solutions, Mortgage
                      Services and Temporary Housing Our network of in-country
                      relocation specialists deliver destination and support
                      services across East Africa and cover more than fifty
                      countries across all continents.
                      <br />
                      <br />
                      Each of our relocation consultants and in-country partners
                      is nationally renowned and has been carefully chosen for
                      their ability to deliver services that reflect our own
                      high standards and attention to detail. We fully
                      investigate each network member&apos;s credentials,
                      professionalism, experience and reputation with
                      organizations that have utilized their services.
                      <br />
                      <br />
                      Only once we have done this do we begin discussions to
                      determine whether or not they will meet premier service
                      requirements of the network - from a geographical,
                      operational expertise and, especially, delivery standards
                      point of view.
                    </p>
                  </div>
                ) : subType === "Coporate Service List" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='mb-2 text-[#DB421B] text-lg'>
                      Service List
                    </h4>
                    <p className='mb-6'>
                      While Taylor Movers offers a bespoke service tailored to
                      each client&apos;s requirements, below is a list that
                      details our typical level of assistance:
                      <br />
                      <br />
                      • Orientation and look-see visits
                      <br />
                      • Visa and immigration services
                      <br />
                      • Accommodation searchFamily support and settling-in
                      programme
                      <br />
                      • Home and school searchUtilities assistanceFurniture
                      leasing
                      <br />
                      • Handy man and maid services
                      <br />
                      • Cross-cultural and language programmes
                      <br />
                      • Tenancy management
                      <br />• Departure services
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : type === "Warehouse Moving" ? (
            <div className='flex flex-col items-start justify-start w-full'>
              <h3 className='font-bold mb-4 text-xl'>Warehouse Services</h3>
              {/* <h4 className='mb-2 text-[#DB421B] text-lg'>Local Moves</h4> */}
              <p className='mb-6'>
                Our warehouse is an 11,000 square foot facility located off
                Mombasa Road. It is strategically positioned for easy access to
                the central business district as well as other parts of Nairobi.
                Choosing a warehousing and distribution partner can be a
                daunting and perplexing task. That is why we ensure all bases
                are covered, from customer care, security and 24-hour access to the
                final delivery of your stored items.
              </p>
              {/* <h4 className='mb-2 text-[#DB421B] text-lg'>International Moves</h4> */}

              <div className='flex flex-col md:flex-row mt-6 w-full'>
                <div className='flex flex-row md:flex-col md:pr-6 max-w-fit min-w-fit  w-full overflow-x-auto pb-6 md:mr-6 border-b md:border-b-0 md:border-r border-gray-200'>
                  <div
                    onClick={() => setSubType("Our Warehouse Services")}
                    className=' mr-6 md:mr-0 md:my-4 cursor-pointer w-fit'>
                    <p className='whitespace-nowrap font-bold underline'>Our Warehouse Services</p>
                    <hr className='border border-[#DB421B] w-[50px] hover:w-[80px] duration-150' />
                  </div>
                </div>
                {subType === "Our Warehouse Services" ? (
                  <div className='flex flex-col mt-8 md:mt-0'>
                    <h4 className='mb-2 text-[#DB421B] text-lg '>
                      Our Warehouse Services
                    </h4>
                    <p className='mb-6'>
                      We, an experienced and highly competent partner, can
                      provide you with:
                      <br />
                      <br />
                      • Customer Service - We believe in maintaining our
                      customer relationships by providing exceptional service.
                      Delivering quality personalized services at all levels
                      from all our team members
                      <br />
                      <br />
                      • Responsive Support - Quick and easy access to your
                      warehousing partner is crucial; when you have questions,
                      requests or concerns, you have direct access to an account
                      manager - your own expert who is intimately familiar with
                      your business processes and needs.
                      <br />
                      <br />
                      • Rapid Response Times - Our account managers are also
                      trained to respond quickly to your enquiries and keep you
                      updated on day to day matters concerning your account.
                      <br />
                      <br />
                      • Quality over Quantity - We believe in quality over
                      quantity. That being that we do not hold priority on the
                      size of our warehouse but on the value of our service,
                      encouraging engagement and commitment of each team member
                      to our customers.
                      <br />
                      <br />
                      • Security - In line with delivering sound customer
                      service, we ensure that your assets remain our greatest
                      priority. We have 24 hour security, backed up by a nearby
                      police station. Our facility is also surrounded by an
                      electric perimeter fence and protected by fire prevention
                      systems including alarms and an automatic water
                      sprinkler system.
                      <br />
                      <br />
                      • 24 Hour Access - We provide 24 hour access and security
                      whilst delivering effective offsite warehousing solutions.
                      <br />
                      <br />• Local & International Delivery - We not only
                      provide our customer&apos;s service at any time but also
                      upon request are able to deliver items to any local or
                      international destination.
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
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
