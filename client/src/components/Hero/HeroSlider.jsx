'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const API = 'https://edificese.vercel.app/api/sliders';

const HeroSlider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage first, then fetch if needed
  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('heroSlides') : null;

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSlides(parsed);
          setIsLoading(false);
        }
      } catch {
        /* fall through to fetch */
      }
    }

    if (!saved) {
      (async () => {
        try {
          const res = await fetch(API, { cache: 'no-store' });
          const data = await res.json();
          const active = Array.isArray(data) ? data.filter((s) => s?.status === true) : [];
          setSlides(active);
          if (typeof window !== 'undefined') {
            localStorage.setItem('heroSlides', JSON.stringify(active));
          }
        } catch (err) {
          console.error('Failed to fetch slides:', err);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, []);

  // Auto transition
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
        setIsAnimating(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides]);

  // Variants (unchanged)
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

  /* ---------- Ultra-light placeholder (no shimmer, minimal DOM) ---------- */
  if (isLoading || slides.length === 0) {
    return (
      <div
        className="w-full h-[220px] md:h-[70vh] bg-neutral-200 dark:bg-neutral-900"
        role="presentation"
        aria-hidden="true"
        style={{
          contentVisibility: 'auto',
          contain: 'layout paint size style',
        }}
      />
    );
  }

  return (
    <section className="relative w-full h-[250px] md:h-screen overflow-hidden">
      <AnimatePresence custom={1} initial={false}>
        <motion.div
          key={slides[currentSlide]?._id || currentSlide}
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
            fill
            sizes="100vw"
            priority={currentSlide === 0}
            style={{ objectFit: 'cover' }}
          />

          {/* Static overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

          {/* Content */}
          <div className="flex items-center justify-center w-full h-full px-4 md:px-8">
            <motion.div
              className="relative max-w-4xl mx-auto text-center"
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                className="mb-2 text-xl tracking-wider text-white uppercase lg:text-3xl"
                variants={textVariants}
              >
                {slides[currentSlide]?.title}
              </motion.h2>

              <motion.span
                className="block text-xl leading-tight text-white lg:text-6xl"
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
    </section>
  );
};

export default HeroSlider;
