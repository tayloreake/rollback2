import React, { useEffect, useState } from "react"
import { motion } from 'framer-motion'
import Head from 'next/head'
import getPageMetadata from "../SEO/seo"
import { getAboutData } from "../sanity/sanity-utils"
import imageUrlBuilder from "@sanity/image-url"
import client from "../sanity/config/client-config"
import Clients from "../components/homepage/Clients"
import { 
  FaHandshake, 
  FaTrophy, 
  FaGlobe, 
  FaAward, 
  FaShieldAlt, 
  FaHeart,
  FaCogs,
  FaTruck,
  FaBuilding,
  FaUsers,
  FaPlane,
  FaWarehouse,
  FaPaw,
  FaCar,
  FaCheckCircle,
  FaLightbulb,
  FaSyncAlt,
  FaPhoneAlt
} from 'react-icons/fa'

// Simple Modern Button Component
const ModernButton = ({ children, variant = 'primary', size = 'md', icon }) => {
  const baseClasses = 'font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 rounded-xl';
  
  const variants = {
    primary: 'bg-gradient-to-r from-[#FF5000] to-[#FF8A50] text-white hover:from-[#FF8A50] hover:to-[#FFB380] shadow-lg hover:shadow-xl',
    secondary: 'border-2 border-[#FF5000] text-[#FF5000] hover:bg-[#FF5000] hover:text-white hover:shadow-lg',
    glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-lg hover:shadow-xl hover:bg-white/30',
    gradient: 'bg-gradient-to-r from-[#FF5000] via-[#FF6B35] to-[#FF8A50] text-white hover:from-[#FF8A50] hover:via-[#FFB380] hover:to-[#FFA366] shadow-lg hover:shadow-2xl'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-12 py-4 text-lg'
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${sizes[size]}`}>
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
};

// Simple Modern Card Component
const ModernCard = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300',
    glass: 'rounded-2xl shadow-xl bg-white/10 backdrop-blur-md border border-white/20 hover:shadow-2xl hover:-translate-y-2 hover:bg-white/20 transition-all duration-300',
    gradient: 'bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300',
    glow: 'bg-white rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-[#FF5000]/20 hover:-translate-y-2 transition-all duration-300'
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Simple Feature Card Component
const FeatureCard = ({ icon, title, description, delay = 0, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10, scale: 1.03 }}
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl hover:-translate-y-2 hover:bg-white/20 transition-all duration-300 ${className}`}
    >
      <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] bg-clip-text text-transparent">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

// Simple Stats Counter Component
const StatsCounter = ({ number, label, suffix = '', prefix = '', delay = 0 }) => {
  const [count, setCount] = useState(0);

  React.useEffect(() => {
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
      }, 30);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF5000] to-[#FF8A50] bg-clip-text text-transparent mb-2">
        {prefix}{Math.floor(count)}{suffix}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </motion.div>
  );
};

// Simple Modern Hero Component
const ModernHero = ({ subtitle, title, description, primaryAction, secondaryAction }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50]">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-1/4 right-16 w-24 h-24 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/10 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{ textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
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

const About = ({ aboutPage }) => {
  const [data, setData] = useState(aboutPage && aboutPage[0] ? aboutPage[0] : {})
  const builder = imageUrlBuilder(client)

  function urlFor(source) {
    return builder.image(source)
  }

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      setNewsletterStatus({ type: 'success', message: "Thanks for subscribing! You'll hear from us soon." })
      setNewsletterEmail('')
    } catch (err) {
      setNewsletterStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    }
  };
  const handleNewsletterEmailChange = (e) => setNewsletterEmail(e.target.value);

  // Get SEO metadata
  const seoData = getPageMetadata("about", {
    location: 'Nairobi',
    customTitle: 'About Taylor Movers - Your Trusted Professional House, office & International movers.',
    customDescription: 'Learn about Taylor Movers Kenya - Your trusted moving company offering safe, affordable, stress-free relocations locally & abroad since 2008.',
    includeLocalBusiness: true,
    includeService: false
  })

  return (
    <div className='w-full min-h-screen'>
      <Head>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta property="og:title" content={seoData.openGraph.title} />
        <meta property="og:description" content={seoData.openGraph.description} />
        <meta property="og:type" content={seoData.openGraph.type} />
      </Head>

      {/* Modern Hero Section */}
      <ModernHero
        subtitle="Kenya's Most Trusted Moving Company"
        title="Moving Excellence Since 2008"
        description="We are Taylor Movers Kenya - a leading and trusted moving company with a strong reputation for professionalism and seamless relocations. Experience the difference with Kenya's premier moving service."
        primaryAction={
          <ModernButton variant="gradient" size="lg" icon={<FaPhoneAlt />}>
            Get Free Quote
          </ModernButton>
        }
        secondaryAction={
          <ModernButton variant="glass" size="lg">
            Our Services
          </ModernButton>
        }
        backgroundGradient={true}
      />

      {/* Company Story & Statistics */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                Our Journey of Excellence
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Since 2008, we&apos;ve successfully completed over 40,000 moves for individuals, families, and businesses across Nairobi, Kenya, and internationally. Our extensive range of services includes household and office relocations, long-distance moves, corporate staff transfers, and international moves.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Taylor Movers also provides specialized services for valuable items like antiques and vehicles, along with secure storage and warehousing solutions. With nearly two decades of experience, our expert team is committed to delivering reliable, affordable, and secure moving solutions.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-8"
            >
              <StatsCounter 
                number={40000} 
                label="Successful Moves" 
                suffix="+" 
                delay={0} 
              />
              <StatsCounter 
                number={17} 
                label="Years of Excellence" 
                suffix="+" 
                delay={0.2} 
              />
              <StatsCounter 
                number={100} 
                label="Customer Satisfaction" 
                suffix="%" 
                delay={0.4} 
              />
              <StatsCounter 
                number={38} 
                label="Destination Countries" 
                suffix="" 
                delay={0.6} 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Why Choose Taylor Movers?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes us Kenya&apos;s most trusted moving company
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={<FaGlobe />}
              title="Africa’s Trusted Local Partner"
              description="With deep local knowledge and international standards, Taylor Movers Kenya bridges the gap between global mobility needs and on-the-ground expertise. From Nairobi to destinations across Africa, businesses and families trust us to deliver seamless, reliable moving solutions with a personal touch."
              delay={0.1}
            />
            
            <FeatureCard
              icon={<FaHandshake />}
              title="Customer Satisfaction at Our Core"
              description="We listen, plan, and execute with precision to make your move smooth and stress-free. With dedicated Client Experience, Quality Assurance, and Aftersales teams, we go beyond moving day to ensure lasting satisfaction and peace of mind."
              delay={0.2}
            />
            
            <FeatureCard
              icon={<FaCogs />}
              title="Efficiency You Can Count On"
              description="Every move is carefully planned with optimized routes, expert packing, and swift setup to minimize disruption. And when unexpected changes arise, our flexible team is equipped to handle even last-minute moves without compromising on quality or care."
              delay={0.3}
            />
            
            <FeatureCard
              icon={<FaHeart />}
              title="Keep Every Customer for Life"
              description="Our K4L mission has made us one of the most recommended moving companies in Nairobi, with many repeat and referral clients."
              delay={0.4}
            />
            
            <FeatureCard
              icon={<FaShieldAlt />}
              title="Safe, Secure & Professional"
              description="At Taylor Movers Kenya, we treat your belongings with the highest level of care. From expert packing and secure transport to professional handling at every stage, we ensure your move is safe, efficient, and worry-free."
              delay={0.5}
            />
            
            <FeatureCard
              icon={<FaAward />}
              title="Global Standards, Local Expertise"
              description="As proud members of the International Association of Movers (IAM), we operate at global quality standards while delivering trusted local touch."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* CTIC Values Section */}
      <section className="py-20 bg-gradient-to-br from-[#FF5000] to-[#FF8A50]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Our CTIC Values in Action
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              The core values that drive everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ModernCard variant="glass" className="p-8 text-center">
              <div className="text-4xl mb-6 text-white flex justify-center">
                <FaCogs />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Convenience</h3>
              <p className="text-white/90">We handle everything: packing, transport, storage, and delivery.</p>
            </ModernCard>
            
            <ModernCard variant="glass" className="p-8 text-center">
              <div className="text-4xl mb-6 text-white flex justify-center">
                <FaCheckCircle />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Trustworthy</h3>
              <p className="text-white/90">Licensed, insured, and reliable movers in Kenya you can count on.</p>
            </ModernCard>
            
            <ModernCard variant="glass" className="p-8 text-center">
              <div className="text-4xl mb-6 text-white flex justify-center">
                <FaLightbulb />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Innovation</h3>
              <p className="text-white/90">Tech-enabled moving solutions for efficient coordination and tracking.</p>
            </ModernCard>
            
            <ModernCard variant="glass" className="p-8 text-center">
              <div className="text-4xl mb-6 text-white flex justify-center">
                <FaSyncAlt />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Consistency</h3>
              <p className="text-white/90">Whether big or small, every move is handled with the same care and quality.</p>
            </ModernCard>
          </div>
        </div>
      </section>

      {/* Services Overview Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              What We Do
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are the leading logistical partner for comprehensive moving solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ModernCard variant="glow" className="p-8 text-center hover-lift">
              <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
                <FaTruck />
              </div>
              <h3 className="text-xl font-bold mb-4">Household Moves</h3>
              <p className="text-gray-600">Professional residential relocations with care and precision.</p>
            </ModernCard>
            
            <ModernCard variant="glow" className="p-8 text-center hover-lift">
              <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
                <FaBuilding />
              </div>
              <h3 className="text-xl font-bold mb-4">Office Moves</h3>
              <p className="text-gray-600">Seamless commercial relocations to minimize business disruption.</p>
            </ModernCard>
            
            <ModernCard variant="glow" className="p-8 text-center hover-lift">
              <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
                <FaUsers />
              </div>
              <h3 className="text-xl font-bold mb-4">Staff Relocation</h3>
              <p className="text-gray-600">Corporate staff transfers handled with professionalism.</p>
            </ModernCard>
            
            <ModernCard variant="glow" className="p-8 text-center hover-lift">
              <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
                <FaPlane />
              </div>
              <h3 className="text-xl font-bold mb-4">International Moves</h3>
              <p className="text-gray-600">Global relocations with local expertise and international standards.</p>
            </ModernCard>
            
            <ModernCard variant="glow" className="p-8 text-center hover-lift">
              <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
                <FaWarehouse />
              </div>
              <h3 className="text-xl font-bold mb-4">Storage & Warehousing</h3>
              <p className="text-gray-600">Secure storage solutions for your valuable possessions.</p>
            </ModernCard>
            
            <ModernCard variant="glow" className="p-8 text-center hover-lift">
              <div className="text-4xl mb-6 text-[#FF5000] flex justify-center">
                <div className="flex gap-2">
                  <FaPaw />
                  <FaCar />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4">Pet & Vehicle Relocations</h3>
              <p className="text-gray-600">Specialized moving services for your pets and vehicles.</p>
            </ModernCard>
          </div>
        </div>
      </section>

      {/* Experience & Commitment Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
                  Experience You Can Trust
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  With over a decade and a half of proven expertise, our seasoned team has mastered the unique logistics and challenges of relocations in Nairobi and across Kenya. Since 2008, Taylor Movers has earned a reputation for operational excellence, making us the trusted partner for stress-free local and international moves.
                </p>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold mb-4 text-[#FF5000]">Our Commitment</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  We pride ourselves on our professionalism, reliability, and unwavering commitment to customer satisfaction, making us the trusted choice for premier moving services for individuals and businesses alike in Kenya.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <ModernCard variant="gradient" className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-[#FF5000]">Who We Are</h3>
                <p className="text-gray-700 leading-relaxed">
                  Taylor Movers is an experienced top-rated moving company in Kenya with a reputation for fast, secure, and affordable relocations.
                </p>
              </ModernCard>
              
              <ModernCard variant="gradient" className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-[#FF5000]">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed">
                  To provide seamless and stress-free moving experiences both locally and internationally, keeping every customer for life through exceptional service.
                </p>
              </ModernCard>
              
              <ModernCard variant="gradient" className="p-8">
                <h3 className="text-2xl font-bold mb-4 text-[#FF5000]">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed">
                  To become Africa&apos;s number one local moving services provider, setting the standard for excellence in the industry.
                </p>
              </ModernCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] text-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Stay Connected With Taylor Movers</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Be the first to receive moving tips, special offers, and updates from Kenya’s trusted moving company
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={handleNewsletterEmailChange}
                placeholder="Enter your email"
                className="w-full sm:w-auto flex-1 px-5 py-4 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5000]"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-8 py-4 rounded-2xl font-semibold bg-white text-[#FF5000] hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
            {newsletterStatus && (
              <div className={`mt-4 text-sm ${newsletterStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}`}>
                {newsletterStatus.message}
              </div>
            )}
            <p className="mt-4 text-xs text-white/80">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Clients Section */}
      <Clients content={data} urlFor={urlFor} />
    </div>
  )
}

export default About

export async function getStaticProps() {
  try {
    const aboutPage = await getAboutData()
    
    return {
      props: {
        aboutPage: aboutPage || []
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    console.error('Error fetching about data:', error)
    return {
      props: {
        aboutPage: []
      },
      revalidate: 60,
    }
  }
}

