'use client';

import AOS from 'aos';
import { useEffect, useState } from 'react';
import 'aos/dist/aos.css';

const AboutSection = () => {
  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });

    const fetchAbout = async () => {
      try {
        const res = await fetch('https://edifice-tau.vercel.app/api/about');
        const data = await res.json();
        setAbout(data);
      } catch (error) {
        console.error('Failed to fetch about data:', error);
      } finally {
        setTimeout(() => setIsLoading(false), 300); // smoother transition
      }
    };

    fetchAbout();
  }, []);

  if (isLoading || !about) {
    return (
      <section className="bg-[var(--background)] text-[var(--foreground)] py-20 transition-colors duration-300">
        <div className="container flex flex-col justify-between gap-10 px-4 mx-auto lg:flex-row animate-pulse">
          <div className="space-y-6 lg:w-3/4">
            <div className="w-24 h-4 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-2/3 h-6 bg-gray-300 rounded dark:bg-gray-600" />
            <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-600" />
            <div className="w-5/6 h-4 bg-gray-300 rounded dark:bg-gray-600" />
            <div className="w-2/3 h-4 bg-gray-300 rounded dark:bg-gray-600" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="bg-[var(--background)] text-[var(--foreground)] py-20 transition-colors duration-300"
      data-aos="fade-up"
    >
      <div className="container flex flex-col justify-between gap-10 px-4 mx-auto lg:flex-row">
        {/* Left Content */}
        <div className="space-y-6">
          <p className="text-[#c20e35] text-sm uppercase tracking-wide">
            About Us
          </p>
          <h2 className="text-2xl font-bold leading-tight md:text-2xl">
            {about.title}
          </h2>
          <div
            className="text-[14px] leading-[20px] text-[var(--foreground)]/80 space-y-4"
            dangerouslySetInnerHTML={{ __html: about.description }}
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
