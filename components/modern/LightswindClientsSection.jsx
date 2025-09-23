'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
// Using our custom 3D scroll trigger as fallback
import { 
  ThreeDScrollTriggerContainer, 
  ThreeDScrollTriggerRow 
} from './ThreeDScrollTrigger';

// Individual Logo Component
const ClientLogo = ({ logo, name, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      className="flex-shrink-0 mx-4 md:mx-6 lg:mx-8 group"
    >
      <div className="relative w-32 h-20 md:w-40 md:h-24 lg:w-48 lg:h-28 glass-card rounded-xl overflow-hidden hover-lift transition-all duration-300">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5000]/10 to-[#FF8A50]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out"></div>
        
        {/* Logo Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4">
          {logo ? (
            <Image
              src={logo}
              alt={`${name} logo`}
              width={120}
              height={80}
              className="max-w-full max-h-full object-contain filter group-hover:brightness-110 transition-all duration-300"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          
          {/* Fallback */}
          <div className="hidden w-full h-full bg-gradient-to-br from-[#FF5000]/20 to-[#FF8A50]/20 rounded-lg items-center justify-center">
            <span className="gradient-text font-semibold text-sm text-center px-2">
              {name}
            </span>
          </div>
        </div>
        
        {/* Border Glow */}
        <div className="absolute inset-0 rounded-xl border border-white/20 group-hover:border-[#FF5000]/40 transition-colors duration-300"></div>
      </div>
    </motion.div>
  );
};

// Main Lightswind Clients Section
export const LightswindClientsSection = ({ 
  title = "Trusted by Industry Leaders",
  subtitle = "Moving forward with confidence - our clients speak for themselves",
  clients = []
}) => {
  // Default clients if none provided
  const defaultClients = [
    { name: "Financial Institution", logo: "/assets/Clients/bank-oil/Picture1.png" },
    { name: "Government Agency", logo: "/assets/Clients/government/Picture10.png" },
    { name: "Corporate Client", logo: "/assets/Clients/companies/Picture29.png" },
    { name: "International Organization", logo: "/assets/Clients/international/Picture14.jpg" },
    { name: "Banking Sector", logo: "/assets/Clients/bank-oil/Picture2.png" },
    { name: "Educational Institution", logo: "/assets/Clients/institutions/Picture34.png" },
    { name: "Oil & Gas Company", logo: "/assets/Clients/bank-oil/Picture12.png" },
    { name: "Government Ministry", logo: "/assets/Clients/government/Picture7.png" },
    { name: "Private Company", logo: "/assets/Clients/companies/Picture31.jpg" },
    { name: "Healthcare Institution", logo: "/assets/Clients/institutions/Picture15.jpg" },
    { name: "Financial Services", logo: "/assets/Clients/bank-oil/Picture49.png" },
    { name: "International Embassy", logo: "/assets/Clients/international/Picture16.jpg" },
    { name: "Government Department", logo: "/assets/Clients/government/Picture11.jpg" },
    { name: "Corporate Entity", logo: "/assets/Clients/companies/Picture33.jpg" },
    { name: "Banking Institution", logo: "/assets/Clients/bank-oil/Picture47.jpg" },
    { name: "Educational Sector", logo: "/assets/Clients/institutions/Picture19.jpg" },
    { name: "International NGO", logo: "/assets/Clients/international/Picture17.jpg" },
    { name: "Oil Company", logo: "/assets/Clients/bank-oil/Picture4.jpg" },
    { name: "Ministry Office", logo: "/assets/Clients/government/Picture15.jpg" },
    { name: "Tech Company", logo: "/assets/Clients/companies/Picture38.jpg" },
  ];

  const clientList = clients.length > 0 ? clients : defaultClients;
  
  // Split clients into rows
  const row1Clients = clientList.slice(0, Math.ceil(clientList.length / 3));
  const row2Clients = clientList.slice(Math.ceil(clientList.length / 3), Math.ceil(clientList.length * 2 / 3));
  const row3Clients = clientList.slice(Math.ceil(clientList.length * 2 / 3));

  return (
    <section className="py-20 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF5000]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FF8A50]/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #FF5000 2px, transparent 2px)',
          backgroundSize: '50px 50px',
          animation: 'float 20s ease-in-out infinite'
        }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        {/* 3D Scroll Trigger Logo Carousel */}
        <div className="space-y-8 md:space-y-12">
          <ThreeDScrollTriggerContainer className="relative">
            {/* First Row - Moving Right */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <ThreeDScrollTriggerRow 
                baseVelocity={3} 
                direction={1}
                className="py-4"
              >
                {row1Clients.map((client, index) => (
                  <ClientLogo
                    key={`row1-${index}`}
                    logo={client.logo}
                    name={client.name}
                    index={index}
                  />
                ))}
              </ThreeDScrollTriggerRow>
            </motion.div>

            {/* Second Row - Moving Left */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <ThreeDScrollTriggerRow 
                baseVelocity={4} 
                direction={-1}
                className="py-4"
              >
                {row2Clients.map((client, index) => (
                  <ClientLogo
                    key={`row2-${index}`}
                    logo={client.logo}
                    name={client.name}
                    index={index}
                  />
                ))}
              </ThreeDScrollTriggerRow>
            </motion.div>

            {/* Third Row - Moving Right (Slower) */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 1 }}
            >
              <ThreeDScrollTriggerRow 
                baseVelocity={2} 
                direction={1}
                className="py-4"
              >
                {row3Clients.map((client, index) => (
                  <ClientLogo
                    key={`row3-${index}`}
                    logo={client.logo}
                    name={client.name}
                    index={index}
                  />
                ))}
              </ThreeDScrollTriggerRow>
            </motion.div>
          </ThreeDScrollTriggerContainer>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            From government institutions to multinational corporations, we've earned the trust of organizations across diverse industries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <motion.div
              className="flex items-center space-x-2 text-[#FF5000]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-3 h-3 bg-[#FF5000] rounded-full animate-pulse"></div>
              <span className="font-semibold">500+ Successful Projects</span>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-2 text-[#FF8A50]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-3 h-3 bg-[#FF8A50] rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <span className="font-semibold">15+ Years Experience</span>
            </motion.div>
            
            <motion.div
              className="flex items-center space-x-2 text-[#FFB380]"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-3 h-3 bg-[#FFB380] rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
              <span className="font-semibold">99% Client Satisfaction</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LightswindClientsSection;