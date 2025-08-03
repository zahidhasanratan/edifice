'use client';

import { useEffect } from 'react';
import InnerHero from '@/components/Hero/InnerHero';
import ProjectsGrid from '@/components/Projects/ProjectsGrid';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = "Our Projects | EDIFICE";
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <InnerHero
        title="Our Projects"
        subtitle="Explore"
        backgroundImage="/assets/images/hero/03.jpg" // ✅ Make sure this image exists in your public folder
      />
      <ProjectsGrid
        subtitle=""
        title=""
      />
    </main>
  );
}
