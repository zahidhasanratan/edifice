'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const swiperRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Watch <html> for class changes so we always know current theme
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains('dark'));
    update();

    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('https://edificese.vercel.app/api/testimonials', { cache: 'no-store' });
        const data = await res.json();
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchTestimonials();
  }, []);

  // Corrected colors for dark/light modes
  const sectionText = isDark ? 'text-white' : 'text-black';
  const overlayBg = isDark ? 'bg-black/80' : 'bg-white/80';
  const headingText = isDark ? 'text-white' : 'text-black';
  const bodyText = isDark ? 'text-gray-200' : 'text-gray-700';
  const roleText = isDark ? 'text-gray-300' : 'text-gray-600';
  const nameText = isDark ? 'text-white' : 'text-black';

  return (
    <section
      className={`relative py-20 ${sectionText} bg-fixed bg-center bg-cover transition-colors duration-300`}
      style={{ backgroundImage: `url('/assets/images/hero/01.jpg')` }}
    >
      {/* Overlay */}
      <div className={`absolute inset-0 z-0 ${overlayBg} transition-colors duration-300`} />

      <div className="container relative z-10 px-4 mx-auto">
        {/* Heading */}
        <div className="mb-10 text-center">
          <p className="text-[#c20e35] text-sm uppercase tracking-wider relative inline-block mb-2 
              before:content-[''] before:absolute before:-left-4 before:top-1/2 
              before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#c20e35] before:rounded-full">
            Testimonial
          </p>
          <h2 className={`relative text-3xl md:text-4xl font-bold ${headingText} text-center mb-6 
              after:content-[''] after:block after:w-20 after:h-1 after:bg-[#c20e35] after:mx-auto after:mt-4`}>
            What Our Customers Say
          </h2>
        </div>

        {/* Swiper / Skeleton */}
        <div className="relative w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
              <div className={`w-64 h-5 rounded ${isDark ? 'bg-white/50' : 'bg-black/30'}`} />
              <div className={`h-4 w-[80%] rounded ${isDark ? 'bg-white/40' : 'bg-black/20'}`} />
              <div className={`h-4 w-[60%] rounded ${isDark ? 'bg-white/40' : 'bg-black/20'}`} />
              <div className={`w-24 h-24 mt-6 rounded-full ${isDark ? 'bg-white/50' : 'bg-black/30'}`} />
            </div>
          ) : (
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              centeredSlides
              loop
              autoplay={{ delay: 5000, disableOnInteraction: false, reverseDirection: true }}
              pagination={{ clickable: true }}
              className="w-full"
            >
              {testimonials.map((t) => (
                <SwiperSlide key={t._id} className="w-full">
                  <div className="flex justify-center">
                    <div className="w-full md:w-[70%] flex flex-col items-center text-center">
                      <h1 className="mb-4 text-2xl font-semibold text-[#c20e35]">
                        {t.title}
                      </h1>

                      <p className={`max-w-4xl mx-auto text-[15px] leading-[24px] ${bodyText}`}>
                        {t.shortDesc}
                      </p>

                      <p className={`mt-4 font-semibold ${nameText}`}>
                        — {t.clientName}
                      </p>

                      <p className={`mb-6 ${roleText}`}>
                        {t.designation}
                      </p>

                      <div className="relative w-32 h-32 overflow-hidden rounded-full border-4 border-[#c20e35]">
                        <Image
                          src={t.photo || '/fallback.jpg'}
                          alt={t.clientName || 'Client'}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 128px"
                          unoptimized
                          priority
                        />
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
