'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import Image from 'next/image';

const AboutHome = () => {
  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out' });

    const fetchAbout = async () => {
      try {
        const res = await fetch('https://edifice-tau.vercel.app/api/about');
        const data = await res.json();
        setAbout(data);
      } catch (error) {
        console.error('Failed to load About data:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300);
      }
    };

    fetchAbout();
  }, []);

  if (isLoading || !about) {
    return (
      <section className="px-4 py-20">
        <div className="container flex flex-col gap-10 mx-auto lg:flex-row animate-pulse">
          <div className="space-y-4 lg:w-1/2">
            <div className="w-24 h-4 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-3/4 h-8 bg-gray-300 rounded dark:bg-gray-600" />
            <div className="w-full h-4 bg-gray-200 rounded dark:bg-gray-700" />
            <div className="w-5/6 h-4 bg-gray-200 rounded dark:bg-gray-700" />
          </div>
          <div className="lg:w-[500px] h-[300px] bg-gray-300 dark:bg-gray-700 rounded-lg" />
        </div>
      </section>
    );
  }

  return (
    <section
      data-aos="fade-up"
      className="bg-[var(--background)] text-[var(--foreground)] py-10 md:py-20 transition-colors duration-300"
    >
      <div className="container flex flex-col justify-between gap-10 px-4 mx-auto lg:flex-row">
        {/* Left Text Area */}
        <div className="space-y-6 lg:w-1/2">
          <p className="text-[#c20e35] dark:text-red-600 text-sm uppercase tracking-wide">
            About Us
          </p>
          <h2 className="text-2xl font-bold leading-tight md:text-5xl">
            {about.title}
          </h2>
          {about.shortDescription?.split('\n').map((para, index) => (
            <p
              key={index}
              className="text-[var(--foreground)] text-[14px] leading-[20px]"
            >
              {para}
            </p>
          ))}
        </div>

        {/* Right Image & Stats */}
        <div className="relative lg:w-[500px]">
          <Image
            src={about.featurePhoto || '/fallback.jpg'}
            alt="About"
            width={500}
            height={400}
            className="object-cover w-full h-auto rounded-lg shadow-lg"
            data-aos="fade-up"
            data-aos-delay="600"
            priority
            unoptimized // optional: remove if you added allowed domain in next.config
          />

          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 bg-[#c20e35] dark:bg-red-600 text-white px-5 py-3 shadow-lg text-center">
            <p className="text-sm tracking-wide uppercase">{about.tag1}</p>
            <h3 className="text-4xl font-extrabold tracking-widest">{about.tag2}</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHome;
