'use client';
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';

// 3D Magnetic Card Component
export const MagneticCard = ({ children, className = '', intensity = 0.3 }) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [scale, setScale] = useState(1);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateXValue = (e.clientY - centerY) * intensity * -1;
    const rotateYValue = (e.clientX - centerX) * intensity;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    setScale(1.05);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setScale(1);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="transform-gpu"
        animate={{
          rotateX,
          rotateY,
          scale,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Morphing Blob Background
export const MorphingBlob = ({ 
  size = 200, 
  color = "#FF5000", 
  opacity = 0.1,
  duration = 8,
  className = "" 
}) => {
  return (
    <div className={`absolute ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 200 200">
        <motion.path
          fill={color}
          fillOpacity={opacity}
          animate={{
            d: [
              "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,91.2,0.4C92.4,17.1,92.2,34.2,86.1,48.8C80,63.4,68,75.5,53.9,83.9C39.8,92.3,23.6,97,6.8,97.2C-10,97.4,-20,92.8,-32.6,86.4C-45.2,80,-60.4,71.8,-70.1,59.8C-79.8,47.8,-84,32,-84.7,16.1C-85.4,0.2,-82.6,-15.8,-76.4,-29.9C-70.2,-44,-60.6,-56.2,-48.5,-64.8C-36.4,-73.4,-22.8,-78.4,-7.9,-78.6C7,-78.8,22.6,-83.6,44.7,-76.4Z",
              "M37.8,-63.6C49.5,-56.5,59.7,-46.2,66.8,-33.8C73.9,-21.4,77.9,-7,79.2,8.2C80.5,23.4,79.1,39.4,72.6,52.8C66.1,66.2,54.5,77,40.8,83.2C27.1,89.4,11.3,90.9,-4.9,90.4C-21.1,89.9,-37.7,87.4,-51.8,80.1C-65.9,72.8,-77.5,60.7,-83.4,46.2C-89.3,31.7,-89.5,14.8,-87.1,-1.2C-84.7,-17.2,-79.7,-32.3,-71.2,-44.9C-62.7,-57.5,-50.7,-67.6,-37.4,-73.8C-24.1,-80,-9.5,-82.3,3.7,-79.9C16.9,-77.5,26.1,-70.7,37.8,-63.6Z",
              "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,91.2,0.4C92.4,17.1,92.2,34.2,86.1,48.8C80,63.4,68,75.5,53.9,83.9C39.8,92.3,23.6,97,6.8,97.2C-10,97.4,-20,92.8,-32.6,86.4C-45.2,80,-60.4,71.8,-70.1,59.8C-79.8,47.8,-84,32,-84.7,16.1C-85.4,0.2,-82.6,-15.8,-76.4,-29.9C-70.2,-44,-60.6,-56.2,-48.5,-64.8C-36.4,-73.4,-22.8,-78.4,-7.9,-78.6C7,-78.8,22.6,-83.6,44.7,-76.4Z"
            ]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </div>
  );
};

// Scroll-triggered Text Reveal
export const ScrollRevealText = ({ 
  text, 
  className = "", 
  staggerDelay = 0.1,
  animationType = "slideUp" 
}) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  
  const words = text.split(' ');
  
  const animations = {
    slideUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    slideDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.5 },
      visible: { opacity: 1, scale: 1 }
    },
    rotate: {
      hidden: { opacity: 0, rotate: -10 },
      visible: { opacity: 1, rotate: 0 }
    }
  };

  return (
    <div ref={containerRef} className={`flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-2"
          variants={animations[animationType]}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{
            duration: 0.6,
            delay: index * staggerDelay,
            ease: [0.4, 0, 0.2, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

// Interactive Particle System
export const ParticleField = ({ 
  particleCount = 50, 
  color = "#FF5000", 
  className = "" 
}) => {
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [particleCount]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            backgroundColor: color,
            opacity: 0.3,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.1, 0.6, 0.1],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Glitch Effect Text
export const GlitchText = ({ 
  text, 
  className = "", 
  glitchIntensity = "medium" 
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  const intensities = {
    low: { x: [-2, 2], duration: 0.1, interval: 3000 },
    medium: { x: [-4, 4], duration: 0.2, interval: 2000 },
    high: { x: [-8, 8], duration: 0.3, interval: 1000 }
  };

  const settings = intensities[glitchIntensity];

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), settings.duration * 1000);
    }, settings.interval);

    return () => clearInterval(glitchInterval);
  }, [settings]);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative z-10"
        animate={isGlitching ? {
          x: settings.x,
          transition: { duration: settings.duration, repeat: 2, repeatType: "reverse" }
        } : {}}
      >
        {text}
      </motion.div>
      
      {/* Glitch layers */}
      <motion.div
        className="absolute inset-0 text-red-500 opacity-70 mix-blend-screen"
        animate={isGlitching ? {
          x: settings.x.map(v => v * -1),
          transition: { duration: settings.duration, repeat: 2, repeatType: "reverse" }
        } : {}}
        style={{ clipPath: isGlitching ? 'inset(0 0 80% 0)' : 'inset(0)' }}
      >
        {text}
      </motion.div>
      
      <motion.div
        className="absolute inset-0 text-blue-500 opacity-70 mix-blend-screen"
        animate={isGlitching ? {
          x: settings.x,
          transition: { duration: settings.duration, repeat: 2, repeatType: "reverse", delay: 0.1 }
        } : {}}
        style={{ clipPath: isGlitching ? 'inset(80% 0 0 0)' : 'inset(0)' }}
      >
        {text}
      </motion.div>
    </div>
  );
};

// Infinity Loading Spinner
export const InfinitySpinner = ({ 
  size = 40, 
  color = "#FF5000", 
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size / 2}
        viewBox="0 0 100 50"
        className="overflow-visible"
      >
        <motion.path
          d="M20,25 C20,11 32,1 46,1 C60,1 72,11 72,25 C72,39 60,49 46,49 C32,49 20,39 20,25 Z M28,25 C28,35 32,43 40,43 C48,43 52,35 52,25 C52,15 48,7 40,7 C32,7 28,15 28,25 Z M72,25 C72,11 60,1 46,1 C32,1 20,11 20,25 C20,39 32,49 46,49 C60,49 72,39 72,25 Z M64,25 C64,35 60,43 52,43 C44,43 40,35 40,25 C40,15 44,7 52,7 C60,7 64,15 64,25 Z"
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1,
            rotate: 360
          }}
          transition={{
            pathLength: { duration: 2, ease: "easeInOut" },
            opacity: { duration: 0.3 },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        />
      </svg>
    </div>
  );
};

// Tilt Card with Gradient Border
export const TiltCard = ({ 
  children, 
  className = "",
  maxTilt = 15,
  scale = 1.05,
  speed = 400 
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * maxTilt * -1;
    const rotateY = (x - centerX) / centerX * maxTilt;
    
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <motion.div
      ref={ref}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative preserve-3d"
        animate={{
          rotateX: rotate.x,
          rotateY: rotate.y,
          scale: isHovered ? scale : 1,
        }}
        transition={{
          type: "spring",
          stiffness: speed,
          damping: 30,
        }}
      >
        <div className="relative gradient-border">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Elastic Search Bar
export const ElasticSearch = ({ 
  placeholder = "Search...", 
  onSearch,
  className = "" 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative overflow-hidden"
        animate={{
          scale: isFocused ? 1.02 : 1,
          boxShadow: isFocused 
            ? "0 0 30px rgba(255, 80, 0, 0.3)" 
            : "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full px-6 py-4 text-lg bg-white/90 backdrop-blur-md rounded-2xl border border-gray-200 focus:outline-none focus:border-[#FF5000] transition-colors duration-300"
        />
        
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-[#FF5000] pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Search icon */}
        <motion.div
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          animate={{ 
            scale: isFocused ? 1.1 : 1,
            color: isFocused ? "#FF5000" : "#9CA3AF"
          }}
        >
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};

