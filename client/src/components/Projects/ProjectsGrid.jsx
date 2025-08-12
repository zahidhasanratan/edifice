'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import AOS from 'aos';
import Image from 'next/image';
import Link from 'next/link';
import 'aos/dist/aos.css';

const ProjectsGrid = ({ title = '', subtitle = '', type = '' }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useEffect(() => {
    // abort previous fetch on prop change/unmount
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchProjects = async () => {
      try {
        const res = await fetch('https://edifice-tau.vercel.app/api/projects', {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store', // feel free to change to 'force-cache' if API has good cache headers
        });
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Failed to fetch projects:', err);
        }
      } finally {
        setTimeout(() => setIsLoading(false), 200);
      }
    };

    setIsLoading(true);
    fetchProjects();

    return () => controller.abort();
  }, [type]);

  // filter + sort without redoing work on every render
  const visibleProjects = useMemo(() => {
    const filtered = type
      ? projects.filter(
          (p) => p?.projectType?.toLowerCase() === type.toLowerCase()
        )
      : projects;

    const sorted = [...filtered].sort((a, b) => {
      const aId = a?._id ?? '';
      const bId = b?._id ?? '';
      const numA = /^[0-9]+$/.test(aId) ? BigInt(aId) : null;
      const numB = /^[0-9]+$/.test(bId) ? BigInt(bId) : null;
      if (numA !== null && numB !== null) return numA < numB ? -1 : numA > numB ? 1 : 0;
      return String(aId).localeCompare(String(bId));
    });

    return sorted;
  }, [projects, type]);

  return (
    <section
      data-aos="fade-up"
      className="py-16 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300"
    >
      <div className="px-4 mx-auto text-center max-w-7xl">
        {/* Title & Subtitle */}
        <div className="mb-10 text-center">
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
        <div className="flex flex-wrap justify-center -mx-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="mx-auto mb-10 max-w-[380px]">
                  <div className="relative w-full h-[570px] rounded-lg overflow-hidden">
                    <div className="absolute inset-0 animate-pulse bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)]" />
                  </div>
                  <div className="mt-4 h-6 w-3/4 mx-auto rounded animate-pulse bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)]" />
                  <div className="mt-2 h-4 w-1/2 mx-auto rounded animate-pulse bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)]" />
                </div>
              </div>
            ))
          ) : visibleProjects.length > 0 ? (
            visibleProjects.map((project, idx) => (
              <div key={project._id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div
                  className="group mx-auto mb-10 max-w-[380px] text-center md:mb-16"
                  data-aos="fade-up"
                >
                  <div className="bg-[var(--background)] text-[var(--foreground)] shadow-lg overflow-hidden transition-colors duration-300 rounded-lg group cursor-pointer">
                    {/* Use Next Link for SPA navigation + prefetch */}
                    <Link href={`/projects/${project._id}`} prefetch scroll className="block">
                      <div className="relative w-full h-[570px] overflow-hidden">
                        <Image
                          src={project.featureImage || '/fallback.jpg'}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          // Avoid forcing priority on every card; give it to the first couple only
                          priority={idx < 2}
                          // Next/Image is already lazy for non-priority; keep it smooth
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold group-hover:text-[#c20e35] transition duration-300">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-[var(--foreground)]/70">
                          {project.address || project.exactLocation || 'No location available'}
                        </p>
                      </div>
                    </Link>
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
