'use client';

import AOS from "aos";
import { useEffect, useState } from "react";
import 'aos/dist/aos.css';

const AboutSection = () => {
  const [about, setAbout] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });
  }, []);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/about');
        const data = await res.json();
        setAbout(data);
      } catch (error) {
        console.error("Failed to fetch about data:", error);
      }
    };

    fetchAbout();
  }, []);

  if (!about) {
    return <section className="py-20 text-center text-gray-500">Loading...</section>;
  }

  return (
    <section className="bg-[var(--background)] text-[var(--foreground)] py-20 transition-colors duration-300" data-aos="fade-up">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between gap-10">
        {/* Left Content */}
        <div className="space-y-6">
          <p className="text-[#c20e35] text-sm uppercase tracking-wide">
            About Us
          </p>
          <h2 className="text-2xl md:text-2xl font-bold leading-tight">
            {about.title}
          </h2>
          <div
  className="text-[14px] leading-[20px] text-[var(--foreground)]/80 space-y-4"
  dangerouslySetInnerHTML={{ __html: about.description }}
></div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
