'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { 
  FaRocket, 
  FaArrowRight, 
  FaPlay, 
  FaStar,
  FaUsers,
  FaTruck,
  FaBoxes,
  FaGlobe
} from 'react-icons/fa';

// Taylor Movers Background Images
const taylorMoversImages = [
  {
    id: 1,
    src: '/assets/taylor-hero-images/taylor-movers-professional-team.jpg',
    alt: 'Taylor Movers professional team member working'
  },
  {
    id: 2,
    src: '/assets/taylor-hero-images/taylor-movers-boxes-stacked.jpg',
    alt: 'Taylor Movers branded boxes professionally stacked'
  },
  {
    id: 3,
    src: '/assets/taylor-hero-images/taylor-movers-single-box.jpg',
    alt: 'Taylor Movers branded box with company details'
  },
  {
    id: 4,
    src: '/assets/taylor-hero-images/taylor-movers-team-loading.jpg',
    alt: 'Taylor Movers team loading boxes into truck'
  },
  {
    id: 5,
    src: '/assets/taylor-hero-images/taylor-movers-box-handling.jpg',
    alt: 'Professional handling of Taylor Movers boxes'
  }
];

// Background Slideshow Component
const TaylorMoversBackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => 
          (prevIndex + 1) % taylorMoversImages.length
        );
        setIsTransitioning(false);
      }, 300);
    }, 6000); // 6 second intervals

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      {taylorMoversImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-800 ${
            index === currentImageIndex ? 'opacity-100' : 'opacity-0'
          } ${isTransitioning ? 'transition-opacity duration-300' : ''}`}
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
    </div>
  );
};

// Floating Particle Component
const FloatingParticle = ({ delay = 0, x = 0, y = 0, size = 4 }) => {
  return (
    <motion.div
      className="absolute bg-white/30 rounded-full"
      style={{ 
        width: size, 
        height: size, 
        left: `${x}%`, 
        top: `${y}%` 
      }}
      animate={{
        y: [-20, -40, -20],
        x: [-10, 10, -10],
        opacity: [0.3, 0.8, 0.3],
      }}
      transition={{
        duration: 6,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Animated Rocket Component
const AnimatedRocket = ({ clientCount, onCountComplete }) => {
  const [displayCount, setDisplayCount] = useState(0);
  const rocketControls = useAnimation();

  useEffect(() => {
    // Animate rocket launch
    const animateRocket = async () => {
      // Initial position
      await rocketControls.start({
        y: 0,
        rotate: 0,
        scale: 1,
      });
      
      // Launch sequence
      await rocketControls.start({
        y: -50,
        rotate: -15,
        scale: 1.2,
        transition: { duration: 2, ease: "easeOut" }
      });
      
      // Floating animation
      rocketControls.start({
        y: [-50, -70, -50],
        rotate: [-15, -10, -15],
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }
      });
    };

    // Count animation
    const animateCount = () => {
      const increment = clientCount / 100;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= clientCount) {
          setDisplayCount(clientCount);
          clearInterval(timer);
          onCountComplete && onCountComplete();
        } else {
          setDisplayCount(Math.floor(current));
        }
      }, 50);
    };

    // Start animations
    setTimeout(() => {
      animateRocket();
      animateCount();
    }, 1000);
  }, [clientCount, onCountComplete, rocketControls]);

  return (
    <motion.div
      className="relative flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Rocket */}
      <motion.div
        animate={rocketControls}
        className="relative z-10 mb-4"
      >
        <div className="relative">
          <FaRocket className="text-6xl text-yellow-400 drop-shadow-lg" />
          
          {/* Rocket exhaust */}
          <motion.div
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8"
            animate={{
              opacity: [0.6, 1, 0.6],
              scaleY: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="bg-gradient-to-t from-orange-500 via-red-400 to-yellow-300 w-full h-full rounded-full blur-sm"></div>
          </motion.div>
          
          {/* Exhaust particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-orange-400 rounded-full"
              style={{
                left: '50%',
                bottom: -15 - (i * 3),
              }}
              animate={{
                x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20],
                y: [0, 10, 20],
                opacity: [1, 0.5, 0],
                scale: [1, 0.5, 0],
              }}
              transition={{
                duration: 1,
                delay: i * 0.1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Client Count Display */}
      <motion.div
        className="bg-white/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
      >
        <div className="text-center">
          <motion.div 
            className="text-3xl font-bold text-white"
            animate={{ scale: displayCount > 0 ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {displayCount.toLocaleString()}+
          </motion.div>
          <div className="text-white/80 text-sm font-medium">Successful Moves</div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({ icon, number, label, delay = 0, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = number / 50;
      const interval = setInterval(() => {
        setCount(prev => {
          if (prev + increment >= number) {
            clearInterval(interval);
            return number;
          }
          return prev + increment;
        });
      }, 40);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ 
        y: -10, 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      className="glass-card p-6 text-center hover-glow rounded-2xl"
    >
      <motion.div
        className="text-4xl mb-4 text-[#FF5000] flex justify-center"
        animate={{ 
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2, 
          delay: delay + 0.5,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        {icon}
      </motion.div>
      
      <motion.div 
        className="text-3xl font-bold gradient-text mb-2"
        animate={count > 0 ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {Math.floor(count).toLocaleString()}{suffix}
      </motion.div>
      
      <p className="text-gray-600 font-medium text-sm">{label}</p>
    </motion.div>
  );
};

// Main Enhanced Hero Component
export const EnhancedHero = ({ 
  title = "Experience Delightful Moving!", 
  subtitle = "Professional Moving Services",
  description = "We specialize in local and international relocations with modern approach and exceptional quality.",
  primaryButtonText = "Get Free Quote",
  secondaryButtonText = "Learn More",
  onPrimaryClick,
  onSecondaryClick,
  clientCount = 5000,
  stats = [
    { icon: <FaUsers />, number: 5000, label: "Happy Customers", suffix: "+" },
    { icon: <FaTruck />, number: 17, label: "Years Experience", suffix: "+" },
    { icon: <FaBoxes />, number: 50000, label: "Items Moved", suffix: "+" },
    { icon: <FaGlobe />, number: 25, label: "Countries Served", suffix: "+" }
  ]
}) => {
  const [statsVisible, setStatsVisible] = useState(false);

  // Particle positions
  const particles = [
    { x: 10, y: 20, size: 6, delay: 0 },
    { x: 85, y: 15, size: 4, delay: 0.5 },
    { x: 20, y: 70, size: 8, delay: 1 },
    { x: 90, y: 80, size: 5, delay: 1.5 },
    { x: 15, y: 45, size: 3, delay: 2 },
    { x: 75, y: 25, size: 7, delay: 0.8 },
    { x: 60, y: 85, size: 4, delay: 1.2 },
    { x: 30, y: 10, size: 5, delay: 0.3 },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Image Background Slideshow */}
        <TaylorMoversBackgroundSlideshow />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {particles.map((particle, index) => (
            <FloatingParticle
              key={index}
              x={particle.x}
              y={particle.y}
              size={particle.size}
              delay={particle.delay}
            />
          ))}
        </div>

        {/* Animated Geometric Shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 border-4 border-white/20 rounded-3xl"
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        
        <motion.div
          className="absolute bottom-32 right-16 w-24 h-24 bg-white/10 rounded-full"
          animate={{ 
            y: [-10, 10, -10],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Main Content */}
        <div className="relative z-20 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left text-white">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.p 
                  className="text-lg md:text-xl mb-4 text-white/90 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  {subtitle}
                </motion.p>
                
                <motion.h1 
                  className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <span className="block">Trusted</span>
                  <span className="block text-yellow-400 drop-shadow-lg">
                    Professional
                  </span>
                  <span className="block">Movers</span>
                </motion.h1>
                
                <motion.p 
                  className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed max-w-xl lg:max-w-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {description}
                </motion.p>
                
                <motion.div 
                  className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <motion.button
                    className="btn-glass text-lg px-8 py-4 rounded-2xl font-semibold hover-scale"
                    onClick={onPrimaryClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaArrowRight className="mr-2" />
                    {primaryButtonText}
                  </motion.button>
                  
                  <motion.button
                    className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-[#FF5000] transition-all duration-300 hover-scale text-lg"
                    onClick={onSecondaryClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaPlay className="mr-2" />
                    {secondaryButtonText}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Column - Rocket Animation */}
            <div className="flex justify-center lg:justify-end">
              <AnimatedRocket 
                clientCount={clientCount}
                onCountComplete={() => setStatsVisible(true)}
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex flex-col items-center">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
            <p className="text-sm mt-2 opacity-80">Scroll</p>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-20 bg-gradient-to-b from-white to-gray-50 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: statsVisible ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#FF5000]/5 rounded-full"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FF8A50]/5 rounded-full"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: statsVisible ? 1 : 0, y: statsVisible ? 0 : 30 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Our Success Story
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Numbers that reflect our commitment to excellence and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatsCard
                key={index}
                icon={stat.icon}
                number={stat.number}
                label={stat.label}
                suffix={stat.suffix}
                delay={statsVisible ? 0.2 + (index * 0.1) : 0}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </>
  );
};

export default EnhancedHero;