import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '../components/Layout';
import { AnimatedClientsSection } from '../components/modern/AnimatedClientsSection';
import { 
  MagneticCard,
  MorphingBlob,
  ScrollRevealText,
  ParticleField,
  GlitchText,
  InfinitySpinner,
  TiltCard,
  ElasticSearch
} from '../components/modern/LightswindComponents';
import { 
  ModernButton, 
  FeatureCard,
  TestimonialCard,
  StatsCounter
} from '../components/modern/ModernComponents';
import { 
  PageTransition, 
  ScrollReveal 
} from '../components/modern/PageTransitions';
import { 
  FaRocket, 
  FaMagic, 
  FaCog, 
  FaUsers, 
  FaHeart,
  FaSearch,
  FaStar
} from 'react-icons/fa';

const ComponentsShowcase = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  return (
    <Layout>
      <Head>
        <title>Components Showcase - Modern UI Library</title>
        <meta name="description" content="Showcase of modern animated components inspired by Lightswind" />
      </Head>

      <PageTransition>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50]">
          {/* Particle Field Background */}
          <ParticleField particleCount={30} color="#FFFFFF" />
          
          {/* Morphing Blobs */}
          <MorphingBlob size={300} color="#FFFFFF" opacity={0.1} className="top-10 left-10" />
          <MorphingBlob size={200} color="#FFFFFF" opacity={0.08} className="bottom-20 right-20" duration={12} />
          
          <div className="container mx-auto px-6 text-center text-white relative z-10">
            <GlitchText 
              text="Modern UI Components" 
              className="text-5xl md:text-7xl font-bold mb-6"
              glitchIntensity="medium"
            />
            
            <ScrollRevealText
              text="Experience the future of web design with cutting-edge animations and interactions"
              className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto"
              staggerDelay={0.1}
              animationType="slideUp"
            />
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <ModernButton variant="glass" size="lg" className="animate-pulse-gentle">
                <FaRocket className="mr-2" />
                Explore Components
              </ModernButton>
              
              <InfinitySpinner size={50} color="#FFFFFF" />
            </div>
          </div>
        </section>

        {/* Interactive Cards Section */}
        <section className="py-20 bg-gray-50 relative">
          <MorphingBlob size={250} color="#FF5000" opacity={0.05} className="top-0 right-0" />
          
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  Interactive Components
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Hover, click, and interact with these modern UI elements
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Magnetic Card */}
              <ScrollReveal>
                <MagneticCard className="h-full" intensity={0.2}>
                  <div className="glass-card p-8 rounded-2xl h-full">
                    <FaMagic className="text-4xl text-[#FF5000] mb-4" />
                    <h3 className="text-xl font-bold mb-4 gradient-text">Magnetic Card</h3>
                    <p className="text-gray-600">
                      This card follows your mouse movement with smooth 3D transforms
                    </p>
                  </div>
                </MagneticCard>
              </ScrollReveal>

              {/* Tilt Card */}
              <ScrollReveal>
                <TiltCard maxTilt={20} scale={1.1} className="h-full">
                  <div className="bg-white p-8 rounded-2xl h-full">
                    <FaCog className="text-4xl text-[#FF5000] mb-4" />
                    <h3 className="text-xl font-bold mb-4 gradient-text">Tilt Card</h3>
                    <p className="text-gray-600">
                      Advanced 3D tilt effects with gradient borders
                    </p>
                  </div>
                </TiltCard>
              </ScrollReveal>

              {/* Regular Feature Card */}
              <ScrollReveal>
                <FeatureCard
                  icon={<FaUsers />}
                  title="Feature Card"
                  description="Animated feature cards with icons and hover effects"
                  delay={0.1}
                  className="h-full"
                />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Search and Text Effects */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  Text Effects & Search
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Modern text animations and search interactions
                </p>
              </div>
            </ScrollReveal>

            <div className="max-w-2xl mx-auto space-y-12">
              {/* Elastic Search */}
              <ScrollReveal>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 gradient-text">Elastic Search Bar</h3>
                  <ElasticSearch
                    placeholder="Search for anything..."
                    onSearch={(query) => setSearchQuery(query)}
                  />
                </div>
              </ScrollReveal>

              {/* Text Reveal Effects */}
              <ScrollReveal>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 gradient-text">Text Reveal Animations</h3>
                  
                  <div className="space-y-6">
                    <ScrollRevealText
                      text="This text slides up word by word"
                      className="text-xl"
                      staggerDelay={0.1}
                      animationType="slideUp"
                    />
                    
                    <ScrollRevealText
                      text="This text scales in dramatically"
                      className="text-xl"
                      staggerDelay={0.15}
                      animationType="scale"
                    />
                    
                    <ScrollRevealText
                      text="This text rotates into view"
                      className="text-xl"
                      staggerDelay={0.12}
                      animationType="rotate"
                    />
                  </div>
                </div>
              </ScrollReveal>

              {/* Glitch Text */}
              <ScrollReveal>
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 gradient-text">Glitch Effects</h3>
                  <div className="space-y-4">
                    <GlitchText 
                      text="Low intensity glitch effect" 
                      className="text-2xl font-bold"
                      glitchIntensity="low"
                    />
                    <GlitchText 
                      text="High intensity glitch effect" 
                      className="text-2xl font-bold"
                      glitchIntensity="high"
                    />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Animated Clients Section with Real Logos */}
        <AnimatedClientsSection
          title="Our Esteemed Clients"
          subtitle="Trusted by leading organizations across various industries"
          clients={[
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
            { name: "International NGO", logo: "/assets/Clients/international/Picture17.jpg" },
          ]}
        />

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative overflow-hidden">
          <ParticleField particleCount={25} color="#FF5000" />
          
          <div className="container mx-auto px-6 relative z-10">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Animated Statistics
                </h2>
                <p className="text-xl opacity-90 max-w-3xl mx-auto">
                  Watch these numbers count up with smooth animations
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <ScrollReveal>
                <div className="text-center">
                  <StatsCounter
                    number={150}
                    suffix="+"
                    label="Components Created"
                    delay={0.1}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="text-center">
                  <StatsCounter
                    number={1000}
                    suffix="+"
                    label="Animations Added"
                    delay={0.2}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="text-center">
                  <StatsCounter
                    number={50}
                    suffix="+"
                    label="Modern Effects"
                    delay={0.3}
                  />
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="text-center">
                  <StatsCounter
                    number={100}
                    suffix="%"
                    label="Modern Design"
                    delay={0.4}
                  />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Testimonials with Modern Cards */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-6">
            <ScrollReveal>
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                  What Developers Say
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Feedback on our modern component library
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard
                testimonial="These components are absolutely incredible! The animations are smooth and the 3D effects are mind-blowing."
                author="Sarah Chen"
                role="Frontend Developer"
                rating={5}
                delay={0.1}
              />
              
              <TestimonialCard
                testimonial="The Lightswind-inspired components took our website to the next level. Users love the interactive elements!"
                author="Michael Rodriguez"
                role="UI/UX Designer"
                rating={5}
                delay={0.2}
              />
              
              <TestimonialCard
                testimonial="Perfect blend of modern design and functionality. Easy to implement and customize for any project."
                author="Emily Johnson"
                role="Full Stack Developer"
                rating={5}
                delay={0.3}
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-gradient-to-br from-[#FF5000] via-[#FF6B35] to-[#FF8A50] text-white relative overflow-hidden">
          <MorphingBlob size={400} color="#FFFFFF" opacity={0.1} className="top-0 left-0" />
          <ParticleField particleCount={20} color="#FFFFFF" />
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <ScrollReveal>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Use these modern components to create stunning, interactive web experiences that will wow your users.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <ModernButton variant="glass" size="lg" className="animate-pulse-gentle">
                  <FaHeart className="mr-2" />
                  Start Building
                </ModernButton>
                <ModernButton variant="secondary" size="lg" className="border-white text-white hover:bg-white hover:text-[#FF5000]">
                  <FaStar className="mr-2" />
                  View Documentation
                </ModernButton>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
};

export default ComponentsShowcase;