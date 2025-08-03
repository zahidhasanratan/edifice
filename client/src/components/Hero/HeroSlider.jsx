'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      id: 1,
      title: 'Discover The',
      subtitle: 'Benchmark of Excellence',
      largeText: true,
      image: '/assets/images/hero/01.jpg',
    },
    {
      id: 2,
      title: 'Slider Caption 2',
      subtitle: 'Slider Caption 2 Large Text Here',
      largeText: true,
      image: '/assets/images/hero/02.jpg',
    },
    {
      id: 3,
      title: 'Slider Caption 3',
      subtitle: 'Slider Caption 3 Large Text Here',
      largeText: true,
      image: '/assets/images/hero/03.jpg',
    },
    {
      id: 4,
      title: 'Slider Caption 4',
      subtitle: 'Slider Caption 4 Large Text Here',
      largeText: true,
      image: '/assets/images/hero/04.jpg',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setIsAnimating(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8,
      top: '15vh',
      bottom: '15vh',
      left: '5%',
      right: '5%',
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 0.8,
      top: '15vh',
      bottom: '15vh',
      left: '5%',
      right: '5%',
      transition: {
        duration: 0.8,
      },
    },
    zoom: {
      scale: 1,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      transition: {
        delay: 0.8,
        duration: 1.2,
        ease: 'easeOut',
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        duration: 0.8,
      },
    }),
  };

  const textVariants = {
    hidden: { y: 150, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: 1.5,
        duration: 0.8,
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        delay: 1.6,
        duration: 0.9,
      },
    },
  };

  return (
    <section className="relative w-full h-[250px] md:h-screen overflow-hidden">
      <div>
        <AnimatePresence custom={1} initial={false}>
          <motion.div
            key={slides[currentSlide].id}
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
              alt={`Slide ${slides[currentSlide].id}`}
              layout="fill"
              objectFit="cover"
              priority={true}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>

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
                  className={`block text-white ${
                    slides[currentSlide].largeText
                      ? 'text-3xl md:text-6xl'
                      : 'text-2xl md:text-5xl mt-2'
                  } leading-tight`}
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
