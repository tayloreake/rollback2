'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  FaArrowRight, 
  FaCheck, 
  FaPlay, 
  FaStar, 
  FaQuote, 
  FaChevronDown,
  FaHeart,
  FaShare,
  FaEye
} from 'react-icons/fa';

// Modern Button Component
export const ModernButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  disabled = false,
  loading = false,
  icon = null,
  className = '' 
}) => {
  const baseClasses = 'font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'btn-modern',
    secondary: 'btn-outline-modern',
    glass: 'btn-glass',
    gradient: 'bg-gradient-to-r from-[#FF5000] via-[#FF6B35] to-[#FF8A50] text-white hover:from-[#FF8A50] hover:via-[#FFB380] hover:to-[#FFA366] shadow-lg hover:shadow-2xl hover:shadow-[#FF5000]/30',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-8 py-3 text-base rounded-xl',
    lg: 'px-12 py-4 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <div className="loading-dots">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
};

// Modern Card Component
export const ModernCard = ({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '',
  onClick = null 
}) => {
  const variants = {
    default: 'card-modern',
    glass: 'card-glass',
    gradient: 'bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl',
    glow: 'bg-white shadow-xl hover:shadow-2xl hover:shadow-[#FF5000]/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -8, scale: 1.02 } : {}}
      className={`${variants[variant]} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

// Hero Section Component
export const ModernHero = ({ 
  title, 
  subtitle, 
  description, 
  primaryAction, 
  secondaryAction,
  backgroundImage = null,
  backgroundGradient = true 
}) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      {backgroundGradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50]">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}
      
      {backgroundImage && (
        <div className="absolute inset-0">
          <img src={backgroundImage} alt="Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-1/4 right-16 w-24 h-24 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {subtitle && (
            <motion.p 
              className="text-lg md:text-xl mb-4 text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {subtitle}
            </motion.p>
          )}
          
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p 
              className="text-lg md:text-xl mb-12 max-w-3xl mx-auto text-white/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {description}
            </motion.p>
          )}
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            {primaryAction}
            {secondaryAction}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

// Modern Feature Card
export const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className = '',
  href = null 
}) => {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.03 }}
      className={`card-glass p-8 text-center hover-glow ${href ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 gradient-text">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
      {href && (
        <div className="mt-6">
          <span className="text-[#FF5000] font-semibold hover:text-[#FF8A50] transition-colors flex items-center justify-center">
            Learn More →
          </span>
        </div>
      )}
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};


// Modern Testimonial Card
export const TestimonialCard = ({ 
  testimonial, 
  author, 
  role, 
  avatar, 
  rating = 5,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="card-glass p-8 hover-lift"
    >
      <div className="flex items-center mb-6">
        {[...Array(rating)].map((_, i) => (
          <FaStar key={i} className="text-yellow-400 text-lg" />
        ))}
      </div>
      
      <div className="text-[#FF5000] text-4xl mb-4">
        <FaQuote />
      </div>
      
      <blockquote className="text-gray-700 text-lg mb-6 italic leading-relaxed">
        "{testimonial}"
      </blockquote>
      
      <div className="flex items-center">
        {avatar && (
          <img 
            src={avatar} 
            alt={author} 
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
        )}
        <div>
          <h4 className="font-bold text-gray-800">{author}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Modern Loading Spinner
export const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };
  
  const colors = {
    primary: 'border-[#FF5000]',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-t-transparent ${colors[color]}`}></div>
  );
};

// Modern Alert/Notification
export const ModernAlert = ({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  autoClose = false,
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const types = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`border rounded-xl p-4 shadow-lg ${types[type]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <p className="text-sm">{message}</p>
        </div>
        {onClose && (
          <button 
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            className="text-xl leading-none hover:opacity-70 transition-opacity"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Modern Stats Counter
export const StatsCounter = ({ 
  value, 
  label, 
  suffix = '', 
  prefix = '', 
  icon = null,
  animationDuration = 2 
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  React.useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        const increment = value / (animationDuration * 60); // 60fps
        let current = 0;
        
        const counter = setInterval(() => {
          current += increment;
          if (current >= value) {
            setCount(value);
            clearInterval(counter);
            setHasAnimated(true);
          } else {
            setCount(Math.floor(current));
          }
        }, 16); // ~60fps
        
        return () => clearInterval(counter);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [value, animationDuration, hasAnimated]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-6"
    >
      {icon && (
        <div className="text-4xl text-[#FF5000] mb-4 flex justify-center">
          {icon}
        </div>
      )}
      <div className="text-4xl md:text-5xl font-bold text-[#FF5000] mb-2">
        {prefix}{hasAnimated ? value : count.toLocaleString()}{suffix}
      </div>
      <p className="text-gray-600 text-lg font-medium">{label}</p>
    </motion.div>
  );
};

// Modern Progress Bar
export const ProgressBar = ({
  progress, 
  label, 
  animated = true, 
  showPercentage = true,
  color = 'primary' 
}) => {
  const colors = {
    primary: 'bg-gradient-to-r from-[#FF5000] to-[#FF8A50]',
    success: 'bg-gradient-to-r from-green-400 to-green-600',
    warning: 'bg-gradient-to-r from-yellow-400 to-yellow-600'
  };

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm font-medium text-gray-600">{progress}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full ${colors[color]} ${animated ? 'animate-pulse' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};

export default {
  ModernButton,
  ModernCard,
  ModernHero,
  FeatureCard,
  StatsCounter,
  TestimonialCard,
  LoadingSpinner,
  ModernAlert,
  ProgressBar
};