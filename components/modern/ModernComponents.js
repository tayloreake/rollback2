'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Modern Button Component
export const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  className = '',
  ...props 
}) => {
  const baseClasses = 'relative overflow-hidden rounded-lg font-semibold transition-all duration-300 transform hover:scale-105';
  
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700',
    secondary: 'bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg hover:shadow-xl',
    outline: 'border-2 border-blue-500 text-blue-500 bg-transparent hover:bg-blue-500 hover:text-white'
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg'
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full transition-transform duration-700 hover:translate-x-full" />
    </motion.button>
  );
};

// Modern Card Component
export const ModernCard = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  return (
    <motion.div
      className={`
        relative bg-white/10 backdrop-blur-lg border border-white/20 
        rounded-xl shadow-xl p-6 transition-all duration-300
        ${hover ? 'hover:shadow-2xl hover:bg-white/15' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Feature Card Component
export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  backgroundImage,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`
        group relative overflow-hidden rounded-xl transition-all duration-300
        hover:shadow-2xl cursor-pointer min-h-[300px]
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      {...props}
    >
      {/* Background Image */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 group-hover:from-black/70 transition-all duration-300" />
      
      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-end">
        {icon && (
          <div className="mb-4 text-4xl text-white group-hover:text-orange-300 transition-colors duration-300 transform group-hover:scale-110">
            {icon}
          </div>
        )}
        {title && (
          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-200 transition-colors duration-300">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-gray-200 group-hover:text-white transition-colors duration-300 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-500/0 via-orange-400/10 to-orange-300/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </motion.div>
  );
};

// Testimonial Card Component
export const TestimonialCard = ({ 
  testimonial, 
  author, 
  role,
  avatar,
  className = '',
  ...props 
}) => {
  return (
    <motion.div
      className={`
        relative bg-white/10 backdrop-blur-lg border border-white/20 
        rounded-xl p-6 transition-all duration-300 hover:bg-white/15
        hover:shadow-xl
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      {...props}
    >
      {testimonial && (
        <p className="text-gray-700 mb-6 text-lg italic leading-relaxed">
          "{testimonial}"
        </p>
      )}
      
      <div className="flex items-center">
        {avatar ? (
          <img 
            src={avatar} 
            alt={author} 
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 mr-4 flex items-center justify-center text-white font-bold">
            {author ? author.charAt(0) : 'T'}
          </div>
        )}
        <div>
          {author && (
            <h4 className="font-semibold text-gray-800">{author}</h4>
          )}
          {role && (
            <p className="text-sm text-gray-600">{role}</p>
          )}
        </div>
      </div>
      
      {/* Quote decoration */}
      <div className="absolute top-4 right-4 text-4xl text-blue-500/20 font-serif">"</div>
    </motion.div>
  );
};

export default { ModernButton, ModernCard, FeatureCard, TestimonialCard };
