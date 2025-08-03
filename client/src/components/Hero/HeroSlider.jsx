'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sliders');
        const data = await res.json();
        setSlides(data.filter(slide => slide.status === true)); // only active
      } catch (error) {
        console.error('Failed to fetch slides:', error);
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

  if (slides.length === 0) {
    return <div className="h-[300px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <section className="relative w-full h-[250px] md:h-screen overflow-hidden">
      <div>
        <AnimatePresence custom={1} initial={false}>
          <motion.div
            key={slides[currentSlide]._id}
            className="absolute inset-0 w-full h-full"
            custom={1}
            variants={slideVariants}
            initial="enter"
            animate={['center', 'zoom']}
            exit="exit"
          >
            {/* Background image */}
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              layout="fill"
              objectFit="cover"
              unoptimized // 👈 Important for external images (or set domain in next.config.js)
              priority
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

            {/* Content */}
            <div className="w-full px-4 md:px-8 h-full flex items-center justify-center">
              <motion.div
                className="relative max-w-4xl mx-auto text-center"
                initial="hidden"
                animate="visible"
              >
                <motion.h2
                  className="text-white text-2xl md:text-3xl uppercase tracking-wider mb-2"
                  variants={textVariants}
                >
                  {slides[currentSlide].title}
                </motion.h2>

                <motion.span
                  className="block text-white text-3xl md:text-6xl leading-tight"
                  variants={textVariants}
                >
                  {slides[currentSlide].subtitle}
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
