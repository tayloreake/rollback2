import React, { useState } from 'react';
import Head from 'next/head';
import { 
  FaRocket, 
  FaHeart, 
  FaStar, 
  FaPlay, 
  FaArrowRight,
  FaHome,
  FaTruck,
  FaCogs,
  FaUsers,
  FaAward,
  FaBoxes,
  FaGlobe
} from 'react-icons/fa';
import Layout from '../components/Layout';
import {
  ModernButton,
  ModernCard,
  ModernHero,
  FeatureCard,
  StatsCounter,
  TestimonialCard,
  LoadingSpinner,
  ModernAlert,
  ProgressBar
} from '../components/modern/ModernComponents';
import { EnhancedHero } from '../components/modern/AnimatedHero';
import {
  PageTransition,
  SlideTransition,
  ScaleTransition,
  StaggerContainer,
  StaggerItem,
  ScrollReveal,
  HoverAnimation,
  AnimatedText
} from '../components/modern/PageTransitions';

const ModernUIDemo = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleButtonClick = (type) => {
    console.log(`${type} button clicked!`);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <Layout>
      <Head>
        <title>Modern UI Components Demo - Taylor Movers</title>
        <meta name="description" content="Showcase of modern animated UI components" />
      </Head>

      <PageTransition>
        {/* Enhanced Hero Section with Rocket */}
        <EnhancedHero
          subtitle="Professional Moving Services"
          title="Experience Delightful Moving!"
          description="We specialize in local and international relocations with modern approach and exceptional quality. Let us make your next move extraordinary!"
          primaryButtonText="Get Free Quote"
          secondaryButtonText="Watch Demo"
          onPrimaryClick={() => handleButtonClick('Hero Primary')}
          onSecondaryClick={() => handleButtonClick('Hero Secondary')}
          clientCount={5000}
          stats={[
            { icon: <FaUsers />, number: 5000, label: "Happy Customers", suffix: "+" },
            { icon: <FaTruck />, number: 15, label: "Years Experience", suffix: "" },
            { icon: <FaBoxes />, number: 50000, label: "Items Moved", suffix: "+" },
            { icon: <FaGlobe />, number: 25, label: "Countries Served", suffix: "+" }
          ]}
        />

        {/* Button Showcase */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">Interactive Buttons</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Beautiful animated buttons with various styles and interactions
                </p>
              </div>
            </ScrollReveal>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StaggerItem>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <h3 className="font-semibold mb-4">Primary</h3>
                  <ModernButton 
                    variant="primary"
                    onClick={() => handleButtonClick('Primary')}
                  >
                    Click Me
                  </ModernButton>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <h3 className="font-semibold mb-4">Secondary</h3>
                  <ModernButton 
                    variant="secondary"
                    onClick={() => handleButtonClick('Secondary')}
                  >
                    Outline
                  </ModernButton>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <h3 className="font-semibold mb-4">Glass</h3>
                  <ModernButton 
                    variant="glass"
                    onClick={() => handleButtonClick('Glass')}
                  >
                    Glassmorphism
                  </ModernButton>
                </div>
              </StaggerItem>

              <StaggerItem>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <h3 className="font-semibold mb-4">Gradient</h3>
                  <ModernButton 
                    variant="gradient"
                    icon={<FaHeart />}
                    onClick={() => handleButtonClick('Gradient')}
                  >
                    With Icon
                  </ModernButton>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>

        {/* Cards Showcase */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">Modern Cards</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Elegant card designs with hover animations and glassmorphism effects
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <ScrollReveal className="h-full">
                <ModernCard variant="default" className="p-8 h-full">
                  <h3 className="text-xl font-bold mb-4 gradient-text">Default Card</h3>
                  <p className="text-gray-600 mb-6">
                    Clean and modern design with smooth hover animations and shadow effects.
                  </p>
                  <ModernButton size="sm" onClick={() => handleButtonClick('Default Card')}>
                    Learn More
                  </ModernButton>
                </ModernCard>
              </ScrollReveal>

              <ScrollReveal className="h-full" threshold={0.2}>
                <ModernCard variant="glass" className="p-8 h-full">
                  <h3 className="text-xl font-bold mb-4 gradient-text">Glass Card</h3>
                  <p className="text-gray-600 mb-6">
                    Beautiful glassmorphism effect with backdrop blur and translucent background.
                  </p>
                  <ModernButton variant="glass" size="sm" onClick={() => handleButtonClick('Glass Card')}>
                    Discover
                  </ModernButton>
                </ModernCard>
              </ScrollReveal>

              <ScrollReveal className="h-full" threshold={0.3}>
                <ModernCard variant="glow" className="p-8 h-full">
                  <h3 className="text-xl font-bold mb-4 gradient-text">Glow Card</h3>
                  <p className="text-gray-600 mb-6">
                    Subtle glow effect that intensifies on hover for an eye-catching design.
                  </p>
                  <ModernButton variant="gradient" size="sm" onClick={() => handleButtonClick('Glow Card')}>
                    Explore
                  </ModernButton>
                </ModernCard>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">Our Services</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Professional moving services with modern approach and exceptional quality
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<FaHome />}
                title="Home Moving"
                description="Professional residential moving services with care and precision for your belongings."
                delay={0.1}
              />
              <FeatureCard
                icon={<FaTruck />}
                title="Commercial"
                description="Efficient office and commercial relocations with minimal business disruption."
                delay={0.2}
              />
              <FeatureCard
                icon={<FaCogs />}
                title="Storage"
                description="Secure storage solutions with climate-controlled facilities for your items."
                delay={0.3}
              />
              <FeatureCard
                icon={<FaAward />}
                title="Premium Service"
                description="White-glove service with premium packing and specialized item handling."
                delay={0.4}
              />
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] text-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4">Our Achievements</h2>
                <p className="text-xl opacity-90">
                  Numbers that speak for our excellence
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ScrollReveal>
                <StatsCounter
                  number={5000}
                  suffix="+"
                  label="Happy Customers"
                  delay={0.1}
                />
              </ScrollReveal>
              <ScrollReveal>
                <StatsCounter
                  number={15}
                  label="Years Experience"
                  delay={0.2}
                />
              </ScrollReveal>
              <ScrollReveal>
                <StatsCounter
                  number={50}
                  suffix="+"
                  label="Professional Staff"
                  delay={0.3}
                />
              </ScrollReveal>
              <ScrollReveal>
                <StatsCounter
                  number={99}
                  suffix="%"
                  label="Success Rate"
                  delay={0.4}
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">What Clients Say</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Real feedback from our satisfied customers
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                testimonial="Taylor Movers made our relocation seamless. The modern approach and professional service exceeded our expectations!"
                author="Sarah Johnson"
                role="Business Owner"
                rating={5}
                delay={0.1}
              />
              <TestimonialCard
                testimonial="Outstanding service! The team was professional, efficient, and took great care of our belongings throughout the move."
                author="Michael Chen"
                role="Family Customer"
                rating={5}
                delay={0.2}
              />
              <TestimonialCard
                testimonial="Best moving experience ever! The attention to detail and customer service is what sets them apart from others."
                author="Emily Davis"
                role="Residential Customer"
                rating={5}
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold gradient-text mb-4">Interactive Elements</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Loading states, progress bars, and notifications
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Loading Demo */}
              <ScrollReveal>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <h3 className="font-semibold mb-6">Loading States</h3>
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <LoadingSpinner size="md" />
                    </div>
                    <ModernButton 
                      variant="primary"
                      loading={loading}
                      onClick={handleLoadingDemo}
                    >
                      {loading ? 'Loading...' : 'Show Loading'}
                    </ModernButton>
                  </div>
                </div>
              </ScrollReveal>

              {/* Progress Bars */}
              <ScrollReveal>
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="font-semibold mb-6 text-center">Progress Indicators</h3>
                  <div className="space-y-6">
                    <ProgressBar progress={85} label="Moving Progress" />
                    <ProgressBar progress={92} label="Customer Satisfaction" color="success" />
                    <ProgressBar progress={78} label="Efficiency Rate" color="warning" />
                  </div>
                </div>
              </ScrollReveal>

              {/* Alerts */}
              <ScrollReveal>
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                  <h3 className="font-semibold mb-6">Notifications</h3>
                  <div className="space-y-4">
                    <ModernButton 
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowAlert(true)}
                    >
                      Show Alert
                    </ModernButton>
                    {showAlert && (
                      <ModernAlert
                        type="success"
                        title="Success!"
                        message="Your action was completed successfully."
                        onClose={() => setShowAlert(false)}
                        autoClose
                      />
                    )}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50] text-white relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full animate-float"></div>
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Move Forward?</h2>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                  Experience the difference with our modern approach to moving services.
                  Let's make your next move extraordinary.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <ModernButton 
                    variant="glass" 
                    size="lg"
                    icon={<FaArrowRight />}
                    onClick={() => handleButtonClick('CTA Primary')}
                  >
                    Get Free Quote
                  </ModernButton>
                  <ModernButton 
                    variant="secondary" 
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-[#FF5000]"
                    onClick={() => handleButtonClick('CTA Secondary')}
                  >
                    Contact Us
                  </ModernButton>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default ModernUIDemo;