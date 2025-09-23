'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const WaveBackground = ({ 
  className = '',
  color = 'rgba(59, 130, 246, 0.1)',
  ...props 
}) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} {...props}>
      <svg 
        className="absolute bottom-0 w-full h-64" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,120 C150,60 350,0 600,60 C850,120 1050,60 1200,80 L1200,120 L0,120 Z"
          fill={color}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,100 C200,40 400,80 600,40 C800,0 1000,60 1200,40 L1200,120 L0,120 Z"
          fill={color}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.5, ease: "easeInOut" }}
        />
      </svg>
      
      {/* Animated floating circles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </div>
  );
};

export default WaveBackground;