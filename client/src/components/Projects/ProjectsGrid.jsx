'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import Image from 'next/image';
import 'aos/dist/aos.css';

const ProjectsGrid = ({ title = '', subtitle = '', type = '' }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });

    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects');
        const data = await res.json();

        const filtered = type
          ? data.filter(
              (project) =>
                project.projectType?.toLowerCase() === type.toLowerCase()
            )
          : data;

        setProjects(filtered);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      } finally {
        setTimeout(() => setIsLoading(false), 300); // smoother loading
      }
    };

    fetchProjects();
  }, [type]);

  return (
    <section
      data-aos="fade-up"
      className="py-16 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Title & Subtitle */}
        <div className="text-center mb-10">
          {title && (
            <p className="text-[#c20e35] dark:text-red-600 text-sm uppercase tracking-wider relative inline-block mb-2 before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#c20e35] before:rounded-full">
              {title}
            </p>
          )}
          {subtitle && (
            <h2 className="relative text-3xl md:text-4xl font-bold text-[var(--foreground)] text-center mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-[#c20e35] after:mx-auto after:mt-4">
              {subtitle}
            </h2>
          )}
        </div>

        {/* Project Grid */}
        <div className="-mx-4 flex flex-wrap justify-center">
          {isLoading ? (
            // Skeleton loader
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-full px-4 md:w-1/2 lg:w-1/3 animate-pulse"
              >
                <div className="mx-auto mb-10 max-w-[380px] bg-gray-200 dark:bg-gray-800 h-[300px] rounded-lg" />
              </div>
            ))
          ) : projects.length > 0 ? (
            projects.map((project) => (
              <div key={project._id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div
                  className="group mx-auto mb-10 max-w-[380px] text-center md:mb-16"
                  data-aos="fade-up"
                >
                  <div className="bg-[var(--background)] text-[var(--foreground)] shadow-lg overflow-hidden transition-colors duration-300 rounded-lg group cursor-pointer">
                    <a href={`/projects/${project._id}`} className="block">
                      <div className="relative w-full h-[250px] overflow-hidden">
                        <Image
                          src={project.featureImage || '/fallback.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-110 duration-1000 ease-in-out"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized // optional if not using internal image domain
                          priority
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold group-hover:text-[#c20e35] transition duration-300">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--foreground)]/70">
                          {project.address ||
                            project.exactLocation ||
                            'No location available'}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500">No projects found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
