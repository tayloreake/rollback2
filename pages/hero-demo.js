import React from 'react';
import Head from 'next/head';
import EditableHeroDemo from '../components/homepage/EditableHeroDemo';

const HeroDemo = () => {
  return (
    <>
      <Head>
        <title>Hero Section Demo - Editable Text | Taylor Movers</title>
        <meta name="description" content="Demo page showing the editable hero section functionality with slideshow background." />
      </Head>

      <div className="min-h-screen">
        <EditableHeroDemo />
        
        {/* Instructions Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
                Hero Section Features
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#FF5000]">🖼️ Image Slideshow</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 7 high-quality Taylor Movers images</li>
                    <li>• Smooth crossfade transitions</li>
                    <li>• Auto-slide every 6 seconds</li>
                    <li>• Navigation arrows and indicators</li>
                    <li>• Mobile responsive design</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#FF5000]">✏️ Editable Content</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Click &quot;Edit Hero Text&quot; button</li>
                    <li>• Edit title, subtitle, and description</li>
                    <li>• Real-time preview updates</li>
                    <li>• Save changes to localStorage</li>
                    <li>• Reset to default option</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#FF5000]">🎨 Professional Design</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Modern glass-morphism effects</li>
                    <li>• Smooth animations and transitions</li>
                    <li>• Professional gradient overlays</li>
                    <li>• Taylor Movers brand colors</li>
                    <li>• Accessible navigation controls</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4 text-[#FF5000]">📱 Technical Features</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Next.js Image optimization</li>
                    <li>• TypeScript support</li>
                    <li>• CSS-in-JS styling</li>
                    <li>• Performance optimized</li>
                    <li>• SEO friendly structure</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">
                    🚀 Implementation Notes
                  </h3>
                  <p className="text-blue-800 mb-4">
                    To use the slideshow hero section, make sure to:
                  </p>
                  <ol className="text-left text-blue-800 space-y-2 max-w-2xl mx-auto">
                    <li>1. Add your 7 high-resolution images to <code className="bg-blue-100 px-2 py-1 rounded">/public/assets/hero-images/</code></li>
                    <li>2. Name them: <code className="bg-blue-100 px-2 py-1 rounded">hero-image-1.jpg</code> through <code className="bg-blue-100 px-2 py-1 rounded">hero-image-7.jpg</code></li>
                    <li>3. Images should be 1920x1080 or higher resolution</li>
                    <li>4. Use 16:9 aspect ratio for optimal display</li>
                    <li>5. Optimize images for web (recommended: 200KB - 500KB each)</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default HeroDemo;