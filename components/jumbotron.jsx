import Image from "next/image";
import React, { useState } from "react"



const Jumbotron = ({image, text}) => {
  const timestamp = new Date().getTime();
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
    <section className="relative h-[200px]">
      <Image
        src={`/assets/jumbotron/${image}`}
        fill
        className="z-10"
      />
      <div className="h-[200px] relative z-20 container"><div className="text-3xl w-full h-[30px] absolute z-20 font-bold text-white bottom-[20%]">{text}</div></div>
    </section>
    </>
  )
}

export default Jumbotron
