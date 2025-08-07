'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('https://edifice-tau.vercel.app/api/sliders');
        const data = await res.json();
        const activeSlides = data.filter(slide => slide.status === true);
        setSlides(activeSlides);
      } catch (error) {
        console.error('Failed to fetch slides:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 500); // smooth transition
      }
    };

    fetchSlides();
  }, []);

  // Auto transition
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
        setIsAnimating(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 0.8,
      transition: { duration: 0.8 },
    },
    zoom: {
      scale: 1,
      transition: { delay: 0.8, duration: 1.2, ease: 'easeOut' },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: { duration: 0.8 },
    }),
  };

  const textVariants = {
    hidden: { y: 150, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { delay: 1.5, duration: 0.8 },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: { delay: 1.6, duration: 0.9 },
    },
  };

  // ✅ Skeleton loading UI
  if (isLoading || slides.length === 0) {
    return (
      <div className="relative w-full h-[250px] md:h-screen bg-gray-200 dark:bg-gray-900 overflow-hidden">
        {/* Simulated background shimmer */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-100 dark:from-gray-800 dark:to-gray-700 animate-pulse" />

        {/* Simulated text blocks */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 space-y-4 text-center">
          <div className="w-2/3 h-5 bg-gray-300 rounded md:w-1/3 dark:bg-gray-600"></div>
          <div className="w-3/4 h-8 bg-gray-300 rounded md:w-2/4 dark:bg-gray-700"></div>
          <div className="w-16 h-[2px] bg-gray-400 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full h-[250px] md:h-screen overflow-hidden">
      <div>
        <AnimatePresence custom={1} initial={false}>
          <motion.div
            key={slides[currentSlide]?._id}
            className="absolute inset-0 w-full h-full"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate={['center', 'zoom']}
            exit="exit"
          >
            {/* Background image */}
            <Image
              src={slides[currentSlide]?.image || '/fallback.jpg'}
              alt={slides[currentSlide]?.title || 'Hero Image'}
              layout="fill"
              objectFit="cover"
              priority
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

            {/* Content */}
            <div className="flex items-center justify-center w-full h-full px-4 md:px-8">
              <motion.div
                className="relative max-w-4xl mx-auto text-center"
                initial="hidden"
                animate="visible"
              >
                <motion.h2
                  className="mb-2 text-2xl tracking-wider text-white uppercase md:text-3xl"
                  variants={textVariants}
                >
                  {slides[currentSlide]?.title}
                </motion.h2>

                <motion.span
                  className="block text-3xl leading-tight text-white md:text-6xl"
                  variants={textVariants}
                >
                  {slides[currentSlide]?.subtitle}
                </motion.span>

                <motion.div
                  className="absolute bottom-0 left-0 h-[1px] bg-white"
                  variants={lineVariants}
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default HeroSlider;
