'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import AOS from 'aos';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import 'aos/dist/aos.css';

const Testimonials = () => {
  const swiperRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out' });

    const fetchTestimonials = async () => {
      try {
        const res = await fetch('https://edifice-tau.vercel.app/api/testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section
      data-aos="fade-up"
      className="relative py-20 text-white transition-colors duration-300 bg-center bg-cover dark:text-black"
      style={{ backgroundImage: `url('/assets/images/hero/01.jpg')` }}
    >
      <div className="absolute inset-0 z-0 bg-white/60 dark:bg-black/60"></div>

      <div className="container relative z-10 px-4 mx-auto">
        {/* Section Header */}
        <div className="mb-10 text-center">
          <p className="text-[#c20e35] text-sm uppercase tracking-wider relative inline-block mb-2 
              before:content-[''] before:absolute before:-left-4 before:top-1/2 
              before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#c20e35] before:rounded-full">
            Testimonial
          </p>
          <h2 className="relative text-3xl md:text-4xl font-bold text-black dark:text-white text-center mb-6 
              after:content-[''] after:block after:w-20 after:h-1 after:bg-[#c20e35] after:mx-auto after:mt-4">
            What Our Customers Say
          </h2>
        </div>

        {/* Swiper or Skeleton */}
        <div className="relative w-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-4 animate-pulse">
              <div className="w-64 h-5 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-4 w-[80%] bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 w-[60%] bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="w-24 h-24 mt-6 bg-gray-300 rounded-full dark:bg-gray-600" />
            </div>
          ) : (
            <Swiper
              ref={swiperRef}
              modules={[Autoplay, Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                reverseDirection: true,
              }}
              pagination={{ clickable: true }}
              className="w-full"
            >
              {testimonials.map((testimonial) => (
                <SwiperSlide key={testimonial._id} className="w-full">
                  <div className="flex flex-col items-center w-full px-4 text-center">
                    <h1 className="text-2xl text-[#c20e35] font-semibold mb-4">
                      {testimonial.title}
                    </h1>
                    <p className="text-[15px] leading-[24px] text-gray-700 dark:text-gray-200 max-w-4xl mx-auto">
                      {testimonial.shortDesc}
                    </p>
                    <p className="mt-4 font-semibold text-black dark:text-white">
                      — {testimonial.clientName}
                    </p>
                    <p className="mb-6 text-gray-700 dark:text-gray-200">
                      {testimonial.designation}
                    </p>
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#c20e35]">
                      <Image
                        src={testimonial.photo || '/fallback.jpg'}
                        alt={testimonial.clientName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 128px"
                        unoptimized // optional if using external domains
                        priority
                      />
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
