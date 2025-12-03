// components/modern/MovingTestimonials.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaRegStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import imageUrlBuilder from '@sanity/image-url';
import client from '../../sanity/config/client-config';

// Initialize builder at module level to prevent re-creation on every render
const builder = imageUrlBuilder(client);

// Google My Business style reviews as fallback
const defaultReviews = [
  {
    name: "Sarah Ndung'u",
    title: "Resident of Karen",
    rating: 5,
    review: "Taylor Movers made our family's relocation to Karen seamless. Their team was professional, punctual, and handled our furniture with exceptional care. Highly recommend their services!",
    avatar: "/assets/Reviews/review1.png",
    date: "2024-11-15",
    platform: "Google My Business"
  },
  {
    name: "James Mwangi",
    title: "Business Owner",
    rating: 5,
    review: "Exceptional service from Taylor Movers! They relocated our entire office from Westlands to Upper Hill with zero downtime. Professional team, fair pricing, and excellent customer service.",
    avatar: "/assets/Reviews/review1.png",
    date: "2024-11-10",
    platform: "Google My Business"
  },
  {
    name: "Grace Wanjiku",
    title: "UN Employee",
    rating: 5,
    review: "International relocation can be stressful, but Taylor Movers handled everything perfectly. From packing in Nairobi to delivery in Geneva - outstanding service throughout the entire process!",
    avatar: "/assets/Reviews/review1.png",
    date: "2024-11-05",
    platform: "Google My Business"
  },
  {
    name: "Michael Otieno",
    title: "Resident of Kilimani",
    rating: 5,
    review: "Best moving company in Kenya! They helped us relocate from Mombasa to Nairobi. Every item arrived safely and on time. Will definitely use their services again.",
    avatar: "/assets/Reviews/review1.png",
    date: "2024-10-28",
    platform: "Google My Business"
  },
  {
    name: "Diana Cherop",
    title: "Marketing Manager",
    rating: 5,
    review: "Taylor Movers Kenya exceeded our expectations. Their warehousing solutions saved us during our office renovation. Professional, reliable, and trustworthy team!",
    avatar: "/assets/Reviews/review1.png",
    date: "2024-10-20",
    platform: "Google My Business"
  },
  {
    name: "Robert Kiprotich",
    title: "Embassy Staff",
    rating: 5,
    review: "Fantastic experience with Taylor Movers! They handled our diplomatic move with utmost professionalism. Every detail was managed perfectly. 5 stars well deserved!",
    avatar: "/assets/Reviews/review1.png",
    date: "2024-10-15",
    platform: "Google My Business"
  }
];

const MovingTestimonials = ({
  title = "What Our Clients Say",
  subtitle = "Real experiences from our satisfied customers across Kenya and beyond",
  autoPlay = true,
  interval = 5000
}) => {
  const [reviews, setReviews] = useState(defaultReviews);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const intervalRef = useRef(null);

  // Use the module-level builder
  const urlFor = useCallback((source) => builder.image(source), []);

  // Load reviews from localStorage (from Sanity CMS)
  // This only needs to run once on mount, so dependencies array is empty
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedReviews = localStorage.getItem('clientReviews');
        if (storedReviews) {
          const parsedReviews = JSON.parse(storedReviews);
          if (parsedReviews && parsedReviews.length > 0) {
            // Transform Sanity reviews to match our format
            const transformedReviews = parsedReviews.map((review, index) => ({
              name: review.name || `Customer ${index + 1}`,
              title: review.title || "Taylor Movers Client",
              rating: review.rating || 5,
              review: review.review || review.testimonial || "Great service!",
              avatar: review.logo ? urlFor(review.logo).url() : `/assets/Reviews/review1.png`,
              date: review.createdAt || new Date().toISOString().split('T')[0],
              platform: "Google My Business"
            }));
            setReviews([...transformedReviews, ...defaultReviews].slice(0, 12));
          }
        }
      } catch (error) {
        console.log('Error loading reviews from localStorage:', error);
      }
    }
  }, []); // Empty dependencies - only run once on mount

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && reviews.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, interval);

      return () => clearInterval(intervalRef.current);
    }
  }, [isPlaying, reviews.length, interval]);

  const nextReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + reviews.length) % reviews.length);
  };

  const goToReview = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      index < rating ? (
        <FaStar key={index} className="text-yellow-400 text-sm" />
      ) : (
        <FaRegStar key={index} className="text-yellow-400 text-sm" />
      )
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-[#FF5000] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-24 h-24 bg-[#FF8A50] rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            y: [-20, 20, -20]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF5000] to-[#FF8A50] bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="p-8 md:p-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  {/* Review Content */}
                  <div className="lg:col-span-2">
                    <FaQuoteLeft className="text-[#FF5000] text-4xl mb-6" />
                    <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                      "{reviews[currentIndex]?.review}"
                    </blockquote>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex mr-3">
                        {renderStars(reviews[currentIndex]?.rating)}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({reviews[currentIndex]?.rating}/5 stars)
                      </span>
                    </div>

                    {/* Author Info */}
                    <div className="border-l-4 border-[#FF5000] pl-4">
                      <div className="font-bold text-gray-900 text-lg">
                        {reviews[currentIndex]?.name}
                      </div>
                      <div className="text-gray-600 mb-2">
                        {reviews[currentIndex]?.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reviews[currentIndex]?.platform} • {reviews[currentIndex]?.date}
                      </div>
                    </div>
                  </div>

                  {/* Avatar */}
                  <div className="flex justify-center lg:justify-end">
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-[#FF5000] shadow-lg">
                        <Image
                          src={reviews[currentIndex]?.avatar || `/assets/Reviews/review1.png`}
                          alt={reviews[currentIndex]?.name}
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = `/assets/Reviews/review1.png`;
                          }}
                        />
                      </div>
                      <div className="absolute -top-2 -right-2 bg-[#FF5000] text-white p-2 rounded-full">
                        <FaStar className="text-sm" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-4 flex items-center">
              <motion.button
                onClick={prevReview}
                className="bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChevronLeft className="text-[#FF5000] text-xl" />
              </motion.button>
            </div>

            <div className="absolute inset-y-0 right-4 flex items-center">
              <motion.button
                onClick={nextReview}
                className="bg-white/80 backdrop-blur-sm hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaChevronRight className="text-[#FF5000] text-xl" />
              </motion.button>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.slice(0, 6).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => goToReview(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex % 6 ? 'bg-[#FF5000] scale-125' : 'bg-gray-300'
                  }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          {/* Play/Pause Control */}
          <div className="flex justify-center mt-6">
            <motion.button
              onClick={togglePlayPause}
              className="bg-[#FF5000] text-white px-6 py-3 rounded-full font-medium hover:bg-[#e04400] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? 'Pause' : 'Play'} Slideshow
            </motion.button>
          </div>
        </div>

        {/* Statistics */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#FF5000] mb-2">
              4.9/5
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#FF5000] mb-2">
              4,000+
            </div>
            <div className="text-gray-600">Google Reviews</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-[#FF5000] mb-2">
              40,000+
            </div>
            <div className="text-gray-600">Successful Moves</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MovingTestimonials;