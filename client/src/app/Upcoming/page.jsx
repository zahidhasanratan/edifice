'use client';

import { useEffect } from 'react';
import InnerHero from '@/components/Hero/InnerHero';
import ProjectsGrid from '@/components/Projects/ProjectsGrid';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = 'Upcoming Projects | EDIFICE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <InnerHero
        title="Upcoming Projects"
        subtitle="Explore"
        backgroundImage="/assets/images/hero/03.jpg"
      />
      <ProjectsGrid type="Upcoming" />
    </main>
  );
}
