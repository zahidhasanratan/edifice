'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InnerHero from '@/components/Hero/InnerHero';
import SingleProjectDetails from '@/components/ProjectDetails/SingleProjectDetails';
import ProjectDetailsGallery from '@/components/ProjectDetails/ProjectDetailsGallery';
import ProjectVideo from '@/components/ProjectDetails/ProjectVideo';
import ProjectLocation from '@/components/ProjectDetails/ProjectLocation';
import ProjectsGrid from '@/components/Projects/ProjectsGrid';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/projects/${id}`);
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error('Failed to fetch project details:', err);
      }
    };

    if (id) fetchProject();
  }, [id]);

  if (!project) return <div className="text-center py-32">Loading Project...</div>;

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <InnerHero
        subtitle="Our Projects"
        title={project.title}
        backgroundImage={project.innerBannerImage || '/assets/images/hero/01.jpg'}
      />
      <SingleProjectDetails project={project} />
      <ProjectDetailsGallery images={project.multiplePhotos} />
      <ProjectVideo youtubeUrl={project.youtubeUrl} />
      <ProjectLocation address={project.address} mapEmbedLink={project.googleMapLocation} />
      <ProjectsGrid title="Projects" subtitle="Related Projects" />
    </main>
  );
};

export default ProjectDetails;
