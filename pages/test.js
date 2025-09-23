import React from 'react';
import Head from 'next/head';

const TestPage = () => {
  return (
    <div>
      <Head>
        <title>Test Page - Taylor Movers</title>
      </Head>
      
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Taylor Movers Test Page
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Next.js setup is working correctly! 🎉
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Available Components:</h2>
            <ul className="text-left space-y-2">
              <li>✅ LightswindClientsSection - 3D scroll-triggered client logos</li>
              <li>✅ ModernButton, ModernCard, FeatureCard - Modern UI components</li>
              <li>✅ ScrollReveal, PageTransition - Animation components</li>
              <li>✅ WaveBackground - Animated background</li>
              <li>✅ Enhanced-home page - Complete landing page with all components</li>
            </ul>
          </div>
          
          <div className="mt-8">
            <a 
              href="/enhanced-home" 
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              View Enhanced Home Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;