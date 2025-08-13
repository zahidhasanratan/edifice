'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import AOS from 'aos';
import Image from 'next/image';
import Link from 'next/link';
import 'aos/dist/aos.css';

const API_BASE = 'https://edifice-tau.vercel.app/api';

/**
 * ProjectsGrid
 * @param {string} title       Small label above heading (e.g., "Projects")
 * @param {string} subtitle    Main heading (e.g., "Latest Launches")
 * @param {string} type        Optional project type: "Ongoing" | "Completed" | "Upcoming"
 * @param {boolean} showHomeOnly Show only projects with showHome=true (for homepage)
 */
const ProjectsGrid = ({ title = '', subtitle = '', type = '', showHomeOnly = false }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useEffect(() => {
    // Abort previous fetch on prop change/unmount
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchProjects = async () => {
      try {
        // Build URL with server-side filters
        const params = new URLSearchParams();
        if (showHomeOnly) params.set('home', 'true'); // ✅ only showHome:true
        if (type) params.set('type', type);           // (works if you add type filter on backend)
        const url = `${API_BASE}/projects${params.toString() ? `?${params}` : ''}`;

        const res = await fetch(url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);

        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Failed to fetch projects:', err);
        }
      } finally {
        setTimeout(() => setIsLoading(false), 200); // smoother skeleton transition
      }
    };

    setIsLoading(true);
    fetchProjects();

    return () => controller.abort();
  }, [type, showHomeOnly]);

  // Optional client-side sort (in case API isn't sorted)
  const visibleProjects = useMemo(() => {
    const filteredByType = type
      ? projects.filter(p => p?.projectType?.toLowerCase() === type.toLowerCase())
      : projects;

    // Prefer createdAt desc if present; otherwise fallback to _id string compare
    return [...filteredByType].sort((a, b) => {
      const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aDate !== bDate) return bDate - aDate;
      return String(a?._id || '').localeCompare(String(b?._id || ''));
    });
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
                    <div className="absolute inset-0 animate-pulse bg-black/10 dark:bg-black/10" />
                  </div>
                  <div className="mt-4 h-6 w-3/4 mx-auto rounded animate-pulse bg-black/10 dark:bg-black/10" />
                  <div className="mt-2 h-4 w-1/2 mx-auto rounded animate-pulse bg-black/10 dark:bg-black/10" />
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
                  {/* Card contrasts with section in both themes */}
                  <div className="
                    bg-white text-gray-900
                    dark:bg-gray-900 dark:text-white
                    shadow-lg overflow-hidden transition-colors duration-300
                    rounded-lg group cursor-pointer
                    border border-transparent dark:border-gray-200/20
                  ">
                    <Link href={`/projects/${project._id}`} prefetch scroll className="block">
                      <div className="relative w-full h-[570px] overflow-hidden">
                        <Image
                          src={project.featureImage || '/fallback.jpg'}
                          alt={project.title || 'Project'}
                          fill
                          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={idx < 2}
                        />
                      </div>
                      <div className="p-5">
                        <h3 className="text-xl font-semibold transition duration-300 group-hover:text-[#c20e35]">
                          {project.title}
                        </h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {project.address || project.exactLocation || 'No location available'}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-500 dark:text-gray-600">No projects found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
