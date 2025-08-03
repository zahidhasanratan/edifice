'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import InnerHero from '@/components/Hero/InnerHero';
import ProjectDetailsGallery from '@/components/ProjectDetails/ProjectDetailsGallery';
import SingleProjectDetails from '@/components/ProjectDetails/SingleProjectDetails';
import ProjectVideo from '@/components/ProjectDetails/ProjectVideo';
import ProjectLocation from '@/components/ProjectDetails/ProjectLocation';
import ProjectsGrid from '@/components/Projects/ProjectsGrid';

const ProjectDetails = () => {
  const { id } = useParams();

  useEffect(() => {
    document.title = `Project ${id} | EDIFICE`;
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <InnerHero
        subtitle="Our Projects"
        title={`Project ID: ${id}`}
        backgroundImage="/assets/images/hero/01.jpg"
      />

      <SingleProjectDetails />
      <ProjectDetailsGallery />
      <ProjectVideo />
      <ProjectLocation />

      <ProjectsGrid 
        subtitle="Related Projects"
        title="Projects"
      />
    </main>
  );
};

export default ProjectDetails;
