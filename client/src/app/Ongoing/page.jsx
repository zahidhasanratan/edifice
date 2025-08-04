'use client';

import { useEffect } from 'react';
import InnerHero from '@/components/Hero/InnerHero';
import ProjectsGrid from '@/components/Projects/ProjectsGrid';

export default function ProjectsPage() {
  useEffect(() => {
    document.title = 'Ongoing Projects | EDIFICE';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main>
      <InnerHero
        title="Ongoing Projects"
        subtitle="Explore"
        backgroundImage="/assets/images/hero/03.jpg"
      />
      <ProjectsGrid type="Ongoing" />
    </main>
  );
}
