// components/homepage/EnhancedHeroSection.tsx
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import QuoteModal from '../Quote/QuoteModal';

interface HeroImage {
  id: number;
  src: string;
  alt: string;
}

interface Service {
  title: string;
  link: string;
  icon: string;
}

interface HeroTextContent {
  title: string;
  subtitle: string;
  description: string;
}

const heroImages: HeroImage[] = [
  {
    id: 1,
    src: '/assets/hero-images/hero-image-1.jpg',
    alt: 'Professional Taylor Movers team member working in tropical setting'
  },
  {
    id: 2,
    src: '/assets/hero-images/hero-image-2.jpg',
    alt: 'Taylor Movers boxes stacked and ready for transport'
  },
  {
    id: 3,
    src: '/assets/hero-images/hero-image-3.jpg',
    alt: 'Taylor Movers warehousing and storage services'
  },
  {
    id: 4,
    src: '/assets/hero-images/hero-image-4.jpg',
    alt: 'Team loading Taylor Movers boxes into truck'
  },
  {
    id: 5,
    src: '/assets/hero-images/hero-image-5.jpg',
    alt: 'Professional handling of Taylor Movers packages'
  },
  {
    id: 6,
    src: '/assets/hero-images/hero-image-6.jpg',
    alt: 'Taylor Movers professional moving services'
  },
  {
    id: 7,
    src: '/assets/hero-images/hero-image-7.jpg',
    alt: 'Worker carefully handling Taylor Movers boxes'
  }
];

const services: Service[] = [
  {
    title: 'Household',
    link: '/services/household-moving',
    icon: '/icons/household.png'
  },
  {
    title: 'Office',
    link: '/services/office-moving',
    icon: '/icons/office.png'
  },
  {
    title: 'Corporate',
    link: '/services/corporate-moving',
    icon: '/icons/corporate.png'
  },
  {
    title: 'Warehousing',
    link: '/services/warehousing-and-storage',
    icon: '/icons/warehouse.png'
  },
];

interface EnhancedHeroSectionProps {
  heroText?: HeroTextContent;
  autoSlideInterval?: number;
  enableTextEditing?: boolean;
  onTextChange?: (newText: HeroTextContent) => void;
}

const defaultHeroText: HeroTextContent = {
  title: 'Trusted Professional Movers',
  subtitle: 'Your Reliable Moving Partner',
  description: 'We support businesses and families through periods of expansion, relocation, and all other important transitions with professional excellence.'
};

const EnhancedHeroSection: React.FC<EnhancedHeroSectionProps> = ({
  heroText = defaultHeroText,
  autoSlideInterval = 5000,
  enableTextEditing = false,
  onTextChange
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [editableText, setEditableText] = useState(heroText);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-slide functionality
  useEffect(() => {
    if (autoSlideInterval > 0) {
      intervalRef.current = setInterval(() => {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentImageIndex((prevIndex) => 
            (prevIndex + 1) % heroImages.length
          );
          setIsTransitioning(false);
        }, 300);
      }, autoSlideInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoSlideInterval]);

  // Handle manual slide change
  const changeSlide = (index: number) => {
    if (index !== currentImageIndex && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex(index);
        setIsTransitioning(false);
      }, 300);

      // Reset auto-slide timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setIsTransitioning(true);
          setTimeout(() => {
            setCurrentImageIndex((prevIndex) => 
              (prevIndex + 1) % heroImages.length
            );
            setIsTransitioning(false);
          }, 300);
        }, autoSlideInterval);
      }
    }
  };

  // Handle text editing
  const handleTextChange = (field: keyof HeroTextContent, value: string) => {
    const newText = { ...editableText, [field]: value };
    setEditableText(newText);
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  return (
    <section className="hero-section">
      {/* Background Image Slideshow */}
      <div className="hero-background">
        {heroImages.map((image, index) => (
          <div
            key={image.id}
            className={`hero-slide ${
              index === currentImageIndex ? 'active' : ''
            } ${isTransitioning ? 'transitioning' : ''}`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              priority={index === 0}
              quality={90}
              sizes="100vw"
              style={{
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          </div>
        ))}
        
        {/* Gradient Overlay */}
        <div className="hero-overlay" />
      </div>

      {/* Content */}
      <div className="hero-content">
        <div className="row">
          <div className="hero-text-section">
            {enableTextEditing ? (
              <div className="editable-content">
                <input
                  type="text"
                  value={editableText.title}
                  onChange={(e) => handleTextChange('title', e.target.value)}
                  className="editable-title"
                  placeholder="Enter hero title"
                />
                <input
                  type="text"
                  value={editableText.subtitle}
                  onChange={(e) => handleTextChange('subtitle', e.target.value)}
                  className="editable-subtitle"
                  placeholder="Enter subtitle"
                />
                <textarea
                  value={editableText.description}
                  onChange={(e) => handleTextChange('description', e.target.value)}
                  className="editable-description"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
            ) : (
              <div className="static-content">
                <h1 className="hero-title">
                  {editableText.title}
                </h1>
                <div className="hero-divider" />
                <p className="hero-description">
                  {editableText.description}
                </p>
              </div>
            )}

            {/* Services Icons */}
            <div className="services-grid">
              {services.map((service) => (
                <div key={service.title} className="service-item">
                  <Link href={service.link} className="service-link">
                    <div className="service-icon">
                      <Image 
                        src={service.icon} 
                        alt={service.title} 
                        width={40} 
                        height={40} 
                      />
                    </div>
                    <span className="service-title">{service.title}</span>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-action-section">
            <div className="quote-button-container">
              <QuoteModal quotebtn="orange" />
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {heroImages.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
              onClick={() => changeSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="slide-navigation">
          <button
            className="nav-arrow nav-arrow-prev"
            onClick={() => changeSlide(
              currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
            )}
            aria-label="Previous slide"
          >
            &#8249;
          </button>
          <button
            className="nav-arrow nav-arrow-next"
            onClick={() => changeSlide(
              (currentImageIndex + 1) % heroImages.length
            )}
            aria-label="Next slide"
          >
            &#8250;
          </button>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 0.8s ease-in-out;
        }

        .hero-slide.active {
          opacity: 1;
        }

        .hero-slide.transitioning {
          transition: opacity 0.3s ease-in-out;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            rgba(0, 0, 0, 0.4) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            rgba(0, 0, 0, 0.4) 100%
          );
          z-index: 2;
        }

        .hero-content {
          position: relative;
          z-index: 3;
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
        }

        .hero-text-section {
          flex: 1;
          background: rgba(237, 237, 237, 0.95);
          padding: 4rem 3rem;
          backdrop-filter: blur(10px);
          border-radius: 0 2rem 2rem 0;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero-divider {
          height: 2px;
          width: 6rem;
          background: #FF5000;
          margin-bottom: 1.5rem;
        }

        .hero-description {
          color: #4a4a4a;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
          max-width: 500px;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .service-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .service-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .service-link:hover {
          transform: translateY(-2px);
        }

        .service-icon {
          margin-bottom: 0.5rem;
        }

        .service-title {
          color: #4a4a4a;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .hero-action-section {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .quote-button-container {
          margin-top: 2rem;
        }

        .slide-indicators {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          z-index: 4;
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.5);
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicator.active {
          background: #FF5000;
          border-color: #FF5000;
        }

        .indicator:hover {
          border-color: rgba(255, 255, 255, 0.8);
        }

        .slide-navigation {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          justify-content: space-between;
          padding: 0 2rem;
          z-index: 4;
        }

        .nav-arrow {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-arrow:hover {
          background: rgba(255, 80, 0, 0.8);
          border-color: #FF5000;
          transform: scale(1.1);
        }

        /* Editable Content Styles */
        .editable-title,
        .editable-subtitle,
        .editable-description {
          width: 100%;
          border: 2px solid #ddd;
          border-radius: 0.5rem;
          padding: 0.75rem;
          margin-bottom: 1rem;
          font-family: inherit;
          transition: border-color 0.3s ease;
        }

        .editable-title {
          font-size: 3rem;
          font-weight: bold;
          color: #1a1a1a;
        }

        .editable-subtitle {
          font-size: 1.2rem;
          color: #666;
        }

        .editable-description {
          font-size: 1.1rem;
          color: #4a4a4a;
          line-height: 1.6;
          resize: vertical;
        }

        .editable-title:focus,
        .editable-subtitle:focus,
        .editable-description:focus {
          outline: none;
          border-color: #FF5000;
          box-shadow: 0 0 0 3px rgba(255, 80, 0, 0.1);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .row {
            flex-direction: column;
            padding: 1rem;
          }

          .hero-text-section {
            padding: 2rem 1.5rem;
            border-radius: 1rem;
            max-width: none;
            width: 100%;
            margin-bottom: 2rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1rem;
          }

          .services-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1rem;
          }

          .slide-navigation {
            display: none;
          }

          .slide-indicators {
            bottom: 1rem;
          }
        }

        @media (max-width: 480px) {
          .hero-title {
            font-size: 1.75rem;
          }

          .services-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-text-section {
            padding: 1.5rem 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default EnhancedHeroSection;