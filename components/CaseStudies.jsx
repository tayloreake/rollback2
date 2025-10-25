import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaArrowRight, FaMapMarkerAlt, FaCalendarAlt, FaGlobe, FaTruck } from 'react-icons/fa';
import { getBlogs } from '../sanity/sanity-utils';
import imageUrlBuilder from '@sanity/image-url';
import client from '../sanity/config/client-config';

const CaseStudies = ({ 
  title = "Success Stories", 
  subtitle = "Real case studies of our long-distance and international moves",
  showAll = false 
}) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  const builder = imageUrlBuilder(client);
  const urlFor = (source) => builder.image(source);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        setLoading(true);
        const blogs = await getBlogs();
        
        // Filter blogs by "Case Studies" category
        const caseStudyBlogs = blogs?.filter(blog => {
          if (!blog) return false;
          
          const categories = blog.blogCategories || [];
          
          // Check if blog has "Case Studies" category
          return categories.some(cat => {
            const categoryName = (cat.category || '').toLowerCase();
            return categoryName.includes('case stud');
          });
        });
        
        // Sort by date (newest first) if date exists
        const sortedBlogs = caseStudyBlogs.sort((a, b) => {
          if (!a.date || !b.date) return 0;
          return new Date(b.date) - new Date(a.date);
        });
        
        setCaseStudies(sortedBlogs?.slice(0, showAll ? 6 : 3) || []);
      } catch (error) {
        console.error('Error fetching case studies:', error);
        setCaseStudies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, [showAll]);

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!caseStudies || caseStudies.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold gradient-text mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {title}
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          </div>
          <div className="text-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <FaTruck className="text-[#FF5000] text-4xl mx-auto mb-4" />
              <p className="text-gray-600">Case studies coming soon! Check back for inspiring stories of successful moves.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold gradient-text mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.slug?.current || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                {study.blogImage ? (
                  <Image
                    src={urlFor(study.blogImage).url()}
                    alt={study.blogTitle || 'Case Study'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#FF5000] to-[#FF8A50] flex items-center justify-center">
                    <FaGlobe className="text-white text-4xl" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-[#FF5000] text-white text-xs font-semibold rounded-full">
                    Case Study
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#FF5000] transition-colors">
                  {study.blogTitle || 'Moving Success Story'}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {study.blogExcerpt || 'Discover how Taylor Movers helped make this relocation a success with professional service and expert care.'}
                </p>

                {/* Meta Information */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  {study.publishedAt && (
                    <div className="flex items-center space-x-1">
                      <FaCalendarAlt />
                      <span>{new Date(study.publishedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <FaMapMarkerAlt />
                    <span>Success Story</span>
                  </div>
                </div>

                {/* Read More Button */}
                <Link href={`/Blog/${study.slug?.current}`}>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group-hover:bg-[#FF5000] group-hover:text-white transition-all duration-300 cursor-pointer">
                    <span className="font-semibold text-sm">Read Full Story</span>
                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {!showAll && caseStudies.length >= 3 && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/Blog" className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#FF5000] to-[#FF8A50] text-white font-semibold rounded-2xl hover:shadow-lg transition-all duration-300">
              <span>View All Stories</span>
              <FaArrowRight />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CaseStudies;