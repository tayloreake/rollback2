import Image from "next/image";
import React, { useState } from "react"

const Jumbotron = ({ image, text, alt, title, subtitle }) => {
  const timestamp = new Date().getTime();
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <>
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={`/assets/jumbotron/${image}`}
            fill
            alt={alt}
            className={`object-cover transition-all duration-700 ${imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            priority
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
          {/* Pattern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="container mx-auto px-6 text-center">
            <div className="animate-fade-in-up">
              {title && (
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 text-shadow-lg">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto text-shadow">
                  {subtitle}
                </p>
              )}
              {text && (
                <div className="text-2xl md:text-3xl font-bold text-white text-shadow-lg">
                  {text}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Animated Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-20 w-4 h-4 bg-white/20 rounded-full animate-float" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-32 right-32 w-3 h-3 bg-white/30 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-white/25 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        </div>
      </section>
    </>
  )
}

export default Jumbotron
