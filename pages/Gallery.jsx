import React, { useEffect, useState } from "react"
import PageTitle from "../components/PageTitle"
import Image from "next/image"
import getPageMetadata from "../SEO/seo";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Gallery = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState({});
    const [fetchedImages, setFetchedImages] = useState([])

    const getCategories = () => {

      // apiCategories
      setCategories(
        [
          {
            id:1,
            name:'General Moving'
          },
          {
            id:2,
            name:"House Moving"
          },
          {
            id:3,
            name:"Office Moving"
          },
          {
            id: 4,
            name:"videos"
          }
        ]
      )
    }
    useEffect(() => {
      if(categories?.length > 0) {
        setActiveCategory(categories[0])
      }
    }, [categories]);

    const images = require.context(`../public/assets/gallery/images`, false, /\.(png|jpe?g|svg)$/);
    const imagePaths = images.keys().map(images);
    const videos = require.context(`../public/assets/gallery/videos`, false, /\.(png|jpe?g|svg)$/);
    const videoPaths = videos.keys().map(videos);

    const getCategoryContent = (category) => {

      // ApI get category content
      // for now` we do just the direct images
    }

    
    useEffect(() => {

      getCategoryContent(activeCategory);

    },[activeCategory]);

    useEffect(() => {
      getCategories();
    }, [])


    
  return (
    <div className='w-full h-full bg-[#EDEDED] pt-8 pb-6'>
        <section className="container">
          <h1 className="text-[#F05423] text-3xl font-[600] text-center">We would love to hear from you</h1>
        </section>
        <section className="container">
          <div className="my-4">
            {categories?.map((category, idx) => (
              <button 
                onClick={() => setActiveCategory(category)}
                className={`hover:bg-[#FF5000] text-white mr-3 btn rounded-3xl px-5 py-2 ${category == activeCategory ? "bg-[#FF5000]" : "bg-[#6D6E71]"}`}>
                  {category?.name}
              </button>
            ))}
          </div>
          <div className="md:columns-6 gap-1">
              {/* Do Active category instead */}
              {imagePaths.map((src, i) => (
                  <Image 
                  key={`${"gallery-images-"}-${i}`}
                  alt={`img-${i}`}
                  src={src}
                  width={200}
                  height={100}
                  className="break-inside-avoid inline-block mb-2"
                  style={{width:"200px", marginRight:"12px"}}
                  />
              ))}
          </div>
                
        </section>

    </div>
  )
}

export default Gallery