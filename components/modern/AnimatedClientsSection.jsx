'use client';
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Image from 'next/image';

// 3D Card Component with Scroll Trigger
const AnimatedLogoCard = ({ 
  logo, 
  name, 
  index, 
  totalItems,
  containerRef 
}) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Calculate stagger delay based on index
  const delay = index * 0.1;
  
  // Transform values based on scroll
  const y = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [50, 0, -50]
  );
  
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [15, 0, -15]
  );
  
  const rotateY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [-10, 0, 10]
  );
  
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 0.8]
  );

  const opacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.3, 1, 1, 0.3]
  );

  // Spring animations for smooth movement
  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 30 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={cardRef}
      className="relative perspective-1000"
      initial={{ opacity: 0, y: 50, rotateX: 20 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        transition: { 
          duration: 0.8, 
          delay: delay,
          ease: [0.4, 0.0, 0.2, 1] 
        }
      } : {}}
    >
      <motion.div
        className="group relative w-full h-32 md:h-40"
        style={{
          y: springY,
          rotateX: springRotateX,
          rotateY: springRotateY,
          scale: springScale,
          opacity,
        }}
        whileHover={{ 
          scale: 1.05, 
          rotateY: 5,
          rotateX: -5,
          transition: { duration: 0.3 }
        }}
      >
        {/* 3D Card with Glass Effect */}
        <div className="relative w-full h-full glass-card rounded-2xl overflow-hidden transform-gpu">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
          
          {/* Logo Container */}
          <div className="relative w-full h-full flex items-center justify-center p-6">
            {logo ? (
              <Image
                src={logo}
                alt={`${name} logo`}
                width={120}
                height={80}
                className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-[#FF5000]/20 to-[#FF8A50]/20 rounded-xl flex items-center justify-center">
                <span className="gradient-text font-bold text-lg">{name}</span>
              </div>
            )}
          </div>
          
          {/* Border Glow Effect */}
          <div className="absolute inset-0 rounded-2xl border border-white/20 group-hover:border-[#FF5000]/30 transition-colors duration-300"></div>
        </div>
        
        {/* Shadow */}
        <div className="absolute inset-0 bg-black/10 rounded-2xl blur-lg transform translate-y-4 scale-95 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      </motion.div>
    </motion.div>
  );
};

// Floating Background Elements
const FloatingElement = ({ delay = 0, duration = 4, x = 0, y = 0, size = 20 }) => {
  return (
    <motion.div
      className="absolute bg-[#FF5000]/10 rounded-full blur-sm"
      style={{
        width: size,
        height: size,
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{
        y: [-10, 10, -10],
        x: [-5, 5, -5],
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Wave Background Component
const WaveBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        className="absolute bottom-0 w-full h-32"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill="rgba(255, 80, 0, 0.1)"
          animate={{
            d: [
              "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",
              "M0,0V56.29c47.79,12.2,103.59,22.17,158,18,70.36-5.37,136.33-43.31,206.8-27.5C438.64,42.43,512.34,43.67,583,62.05c69.27,28,138.3,14.88,209.4,23.08,36.15-6,69.85-7.84,104.45-19.34C989.49,35,1113-4.29,1200,62.47V0Z",
              "M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill="rgba(255, 138, 80, 0.1)"
          animate={{
            d: [
              "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",
              "M0,0V25.81C13,26.92,27.64,46.86,47.69,62.05,99.41,101.27,165,101,224.58,81.58c31.15-10.15,60.09-36.07,89.67-29.8,40.92-9,84.73-36,130.83-39.67,36.26-2.85,70.9,19.42,98.6,41.56,31.77,15.39,62.32,52,103.63,63,40.44,20.79,81.35-16.69,119.13-14.28s75.16-29,116.92-33.05c59.73-5.85,113.28,32.88,168.9,28.84,30.2,8.66,59,16.17,87.09-17.5,22.43-10.89,48-16.93,60.65-39.24V0Z",
              "M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </svg>
    </div>
  );
};

// Main Animated Clients Section
export const AnimatedClientsSection = ({ 
  title = "Trusted by Industry Leaders",
  subtitle = "Join thousands of satisfied customers who chose our services",
  clients = []
}) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const isInView = useInView(containerRef, { 
    once: true, 
    amount: 0.2 
  });

  useEffect(() => {
    if (isInView) {
      setIsVisible(true);
    }
  }, [isInView]);

  // Default clients if none provided
  const defaultClients = [
    { name: "TechCorp", logo: "/assets/clients/techcorp.png" },
    { name: "GlobalCo", logo: "/assets/clients/globalco.png" },
    { name: "Innovate Inc", logo: "/assets/clients/innovate.png" },
    { name: "Future Ltd", logo: "/assets/clients/future.png" },
    { name: "NextGen", logo: "/assets/clients/nextgen.png" },
    { name: "ProBiz", logo: "/assets/clients/probiz.png" },
    { name: "EliteCorp", logo: "/assets/clients/elite.png" },
    { name: "MegaBrand", logo: "/assets/clients/mega.png" },
  ];

  const clientList = clients.length > 0 ? clients : defaultClients;
  
  // Floating elements positions
  const floatingElements = [
    { x: 10, y: 15, size: 30, delay: 0, duration: 6 },
    { x: 85, y: 25, size: 20, delay: 1, duration: 5 },
    { x: 20, y: 80, size: 25, delay: 2, duration: 7 },
    { x: 90, y: 70, size: 15, delay: 0.5, duration: 4 },
    { x: 50, y: 10, size: 18, delay: 1.5, duration: 6 },
  ];

  return (
    <section 
      ref={containerRef}
      className="relative py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden"
    >
      {/* Wave Background */}
      <WaveBackground />
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element, index) => (
          <FloatingElement
            key={index}
            x={element.x}
            y={element.y}
            size={element.size}
            delay={element.delay}
            duration={element.duration}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* 3D Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
          {clientList.map((client, index) => (
            <AnimatedLogoCard
              key={index}
              logo={client.logo}
              name={client.name}
              index={index}
              totalItems={clientList.length}
              containerRef={containerRef}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-lg text-gray-600 mb-6">
            Ready to join our growing family of satisfied clients?
          </p>
          <motion.button
            className="btn-modern inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Today
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default AnimatedClientsSection;