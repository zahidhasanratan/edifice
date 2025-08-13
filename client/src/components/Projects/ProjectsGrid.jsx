'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const API_BASE = 'https://edifice-tau.vercel.app/api';

/**
 * ProjectsGrid
 * @param {string} title
 * @param {string} subtitle
 * @param {string} type        "Ongoing" | "Completed" | "Upcoming"
 * @param {boolean} showHomeOnly  show only showHome=true
 */
const ProjectsGrid = ({ title = '', subtitle = '', type = '', showHomeOnly = false }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const abortRef = useRef(null);

  // Track current theme from <html class="dark">
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const html = document.documentElement;
    const update = () => setIsDark(html.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(html, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Abort previous fetch on prop change/unmount
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams();
        if (showHomeOnly) params.set('home', 'true');
        if (type) params.set('type', type);
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
        if (err?.name !== 'AbortError') console.error('Failed to fetch projects:', err);
      } finally {
        // small delay for smoother skeleton removal, but no CSS transitions
        setTimeout(() => setIsLoading(false), 100);
      }
    };

    setIsLoading(true);
    fetchProjects();

    return () => controller.abort();
  }, [type, showHomeOnly]);

  // Sort: newest first by createdAt
  const visibleProjects = useMemo(() => {
    const filtered = type
      ? projects.filter(p => p?.projectType?.toLowerCase() === type.toLowerCase())
      : projects;

    return [...filtered].sort((a, b) => {
      const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (aDate !== bDate) return bDate - aDate;
      return String(a?._id || '').localeCompare(String(b?._id || ''));
    });
  }, [projects, type]);

  // THEME-SAFE CLASSES (no `dark:` usage)
  // Light mode => bg-gray-900 text-white
  // Dark mode  => bg-gray-100 text-black
  const sectionBg = isDark ? 'bg-gray-100' : 'bg-gray-900';
  const sectionText = isDark ? 'text-black' : 'text-white';
  const headingText = isDark ? 'text-black' : 'text-white';
  const accentText = isDark ? 'text-red-600' : 'text-[#c20e35]';

  const cardShellBg = isDark ? 'bg-black' : 'bg-white';
  const cardFooterBg = isDark ? 'bg-white' : 'bg-black';
  const cardTitle = isDark ? 'text-black' : 'text-white';
  const cardSubtitle = isDark ? 'text-gray-600' : 'text-gray-300';

  const skelBlock = isDark ? 'bg-black/10' : 'bg-white/20';

  return (
    <section className={`py-16 ${sectionBg} ${sectionText}`}>
      <div className="px-4 mx-auto text-center max-w-7xl">
        {/* Title & Subtitle */}
        <div className="mb-10 text-center">
          {title && (
            <p className={`${accentText} text-sm uppercase tracking-wider relative inline-block mb-2 before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#c20e35] before:rounded-full`}>
              {title}
            </p>
          )}
          {subtitle && (
            <h2 className={`relative text-3xl md:text-4xl font-bold ${headingText} text-center mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-[#c20e35] after:mx-auto after:mt-4`}>
              {subtitle}
            </h2>
          )}
        </div>

        {/* Project Grid */}
        <div className="-mx-4 flex flex-wrap justify-center">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="mx-auto mb-10 max-w-[380px]">
                  <div className="relative w-full h-[450px] rounded-lg overflow-hidden">
                    <div className={`absolute inset-0 ${skelBlock}`} />
                  </div>
                  <div className={`mt-4 h-6 w-3/4 mx-auto rounded ${skelBlock}`} />
                  <div className={`mt-2 h-4 w-1/2 mx-auto rounded ${skelBlock}`} />
                </div>
              </div>
            ))
          ) : visibleProjects.length > 0 ? (
            visibleProjects.map((project, idx) => (
              <div key={project._id} className="w-full px-4 md:w-1/2 lg:w-1/3">
                <div className="group mx-auto mb-10 max-w-[380px] text-center md:mb-16">
                  {/* Card shell */}
                  <div className={`${cardShellBg} shadow-lg overflow-hidden group cursor-pointer rounded-lg`}>
                    <Link href={`/projects/${project._id}`} prefetch scroll className="block">
                      {/* Image */}
                      <div className="overflow-hidden">
                        <div className="relative w-full h-[450px]">
                          <Image
                            src={project.featureImage || '/fallback.jpg'}
                            alt={project.title || 'Project'}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                            priority={idx < 2}
                          />
                        </div>
                      </div>

                      {/* Card footer */}
                      <div className={`p-5 ${cardFooterBg}`}>
                        <h3 className={`text-xl font-semibold ${cardTitle}`}>
                          {project.title}
                        </h3>
                        <p className={`mt-1 text-sm ${cardSubtitle}`}>
                          {project.address || project.exactLocation || 'No location available'}
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className={`${isDark ? 'text-gray-600' : 'text-gray-300'} text-lg`}>
              No projects found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
