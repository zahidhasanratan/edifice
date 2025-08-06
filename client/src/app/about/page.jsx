'use client';

import { useEffect } from 'react';
import InnerHero from '@/components/Hero/InnerHero';
import AboutSection from '@/components/About/AboutSection';
import TeamSection from '@/components/About/TeamSection';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'About Us | EDIFICE';
    window.scrollTo(0, 0);

    // Initialize AOS once
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
  }, []);

  return (
    <main>
      <InnerHero
        title="Our Story"
        subtitle="About Us"
        backgroundImage="/assets/images/hero/02.jpg"
      />
      <AboutSection />
      <TeamSection />
    </main>
  );
}
