import Image from "next/image";
import React, { useState } from "react"



const Jumbotron = ({ image, text, alt}) => {
  const timestamp = new Date().getTime();
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section className="relative h-[auto]">
        <Image
          src={`/assets/jumbotron/${image}`}
          fill
          alt={alt}
          className="z-10"
        />
        <div className="h-[100px] md:h-[252px] relative z-20 container"><div className="text-3xl w-full h-[30px] absolute z-20 font-bold text-white bottom-[20%]">{text}</div></div>
      </section>
    </>
  )
}

export default Jumbotron
