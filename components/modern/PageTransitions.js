'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Scroll Reveal Component
export const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6,
  className = '',
  ...props 
}) => {
  const directions = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
    scale: { scale: 0.8, opacity: 0 },
    fade: { opacity: 0 }
  };

  return (
    <motion.div
      className={className}
      initial={directions[direction]}
      whileInView={{ x: 0, y: 0, scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: duration, 
        delay: delay,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Page Transition Component
export const PageTransition = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.25, 0.25, 0.75]
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container for animating multiple children
export const StaggerContainer = ({ 
  children, 
  stagger = 0.1, 
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item for use inside StaggerContainer
export const StaggerItem = ({ 
  children, 
  direction = 'up',
  className = '',
  ...props 
}) => {
  const directions = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 },
    scale: { scale: 0.8, opacity: 0 }
  };

  return (
    <motion.div
      className={className}
      variants={{
        hidden: directions[direction],
        visible: { x: 0, y: 0, scale: 1, opacity: 1 }
      }}
      transition={{ duration: 0.5, ease: [0.25, 0.25, 0.25, 0.75] }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default { ScrollReveal, PageTransition, StaggerContainer, StaggerItem };