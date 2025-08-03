'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ProjectsGrid = ({ title = '', subtitle = '' }) => {
  const [projects, setProjects] = useState([]);

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
        setProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
      }
    };

    fetchProjects();
  }, []);

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
          {projects.map((project) => (
            <div key={project._id} className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div
                className="group mx-auto mb-10 max-w-[380px] text-center md:mb-16"
                data-aos="fade-up"
              >
                <div className="bg-[var(--background)] text-[var(--foreground)] shadow-lg overflow-hidden group cursor-pointer transition-colors duration-300">
                  <a href={`/projects/${project._id}`} className="block">
                    <div className="overflow-hidden">
                      <img
                        src={project.featureImage}
                        alt={project.title}
                        className="w-full max-h-[450px] object-cover transition-transform group-hover:scale-110 duration-1000 ease-in-out"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="text-xl font-semibold group-hover:text-[#c20e35] transition duration-300">
                        {project.title}
                      </h3>
                      <p className="mt-1">
                        {project.address || project.exactLocation || 'No location available'}
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
