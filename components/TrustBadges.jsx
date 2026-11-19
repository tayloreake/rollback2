import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'
import { 
  FaUsers,
  FaGlobe,
  FaCalendar,
  FaStar
} from 'react-icons/fa'

// Stats Card Component (reused from home page)
const StatsCard = ({ icon, number, label, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  useEffect(() => {
    if (!inView) return;
    
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
  }, [number, delay, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
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

// Main Success Story Component (reusing home page design)
const SuccessStory = ({ 
  variant = 'default', // 'default', 'compact'
  customStats = null,
  className = "",
  showTitle = true
}) => {
  const [statsVisible, setStatsVisible] = useState(true); // Always visible for service pages

  // Default stats from home page
  const defaultStats = [
    { icon: <FaUsers />, number: 40000, label: "successful moves", suffix: "+" },
    { icon: <FaGlobe />, number: 38, label: "Destination Countries we have moved clients.", suffix: "" },
    { icon: <FaCalendar />, number: 17, label: "Years - Established in 2008", suffix: "+" },
    { icon: <FaStar />, number: 4.9, label: "Rating Google Reviews / 4,000+ Reviews", suffix: "/5" }
  ];

  const stats = customStats || defaultStats;
  const isCompact = variant === 'compact';
  const sectionClass = isCompact 
    ? "py-12 bg-gradient-to-b from-white to-gray-50 relative"
    : "py-20 bg-gradient-to-b from-white to-gray-50 relative";

  return (
    <motion.section 
      className={`${sectionClass} ${className}`}
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
        {showTitle && (
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
        )}

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
  );
};

// Export both the component and the stats card for potential reuse
export default SuccessStory;
export { StatsCard };
