import Image from "next/image";
import React, { useState } from "react"



const Jumbotron = ({image}) => {
  const timestamp = new Date().getTime();
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
    <section className="relative h-[300px]">
      <Image
        src={`/assets/jumbotron/${image}`}
        fill
      />
    </section>
    </>
  )
}

export default Jumbotron
