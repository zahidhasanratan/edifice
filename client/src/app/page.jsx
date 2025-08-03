'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import HeroSlider from '@/components/Hero/HeroSlider';
import ProjectsGrid from '@/components/Projects/ProjectsGrid';
import Testimonials from '@/components/common/Testimonilas';
import AboutHome from '@/components/About/AboutHome';

export default function HomePage() {
  useEffect(() => {
    AOS.init({ once: true });
    window.scrollTo(0, 0);
    document.title = 'Home | EDIFICE'; // ✅ Dynamically set title
  }, []);

  return (
    <main>
      <HeroSlider />
      <AboutHome />
      <ProjectsGrid subtitle="Latest Launches" title="Projects" />
      <Testimonials />
    </main>
  );
}
