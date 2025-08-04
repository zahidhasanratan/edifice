'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import AOS from 'aos';
import 'swiper/css';
import 'swiper/css/pagination';
import 'aos/dist/aos.css';

const Testimonials = () => {
  const swiperRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });

    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }

    // Fetch testimonials from API
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/testimonials');
        const data = await res.json();
        setTestimonials(data);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section
      data-aos="fade-up"
      className="relative fixed text-white dark:text-black py-20 bg-center bg-cover"
      style={{ backgroundImage: `url('/assets/images/hero/01.jpg')` }}
    >
      <div className="bg-white/60 dark:bg-black/60 absolute inset-0 z-0 transition-colors duration-300"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-10">
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

        <div className="relative w-full">
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
                <div className="w-full px-4 flex flex-col items-center text-center">
                  <h1 className="text-2xl text-[#c20e35] font-semibold mb-4">
                    {testimonial.title}
                  </h1>
                  <p className="text-[15px] leading-[24px] text-gray-700 dark:text-gray-200 max-w-4xl mx-auto">
                    {testimonial.shortDesc}
                  </p>
                  <p className="mt-4 font-semibold text-black dark:text-white">
                    — {testimonial.clientName}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 mb-6">
                    {testimonial.designation}
                  </p>
                  <img
                    src={testimonial.photo}
                    alt={testimonial.clientName}
                    className="w-32 h-32 rounded-full border-4 border-[#c20e35] object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
