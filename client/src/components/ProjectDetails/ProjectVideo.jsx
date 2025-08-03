'use client';

import React, { useState, useEffect } from 'react';

const ProjectVideo = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <section
      className="transition-colors duration-300 ease-in-out py-16 px-4 md:px-10"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div
        className="mx-auto w-[90%] md:w-[70%] rounded-xl p-4 transition-colors duration-300"
        style={{ backgroundColor: 'var(--card-bg, #f3f4f6)' }} // Optional: You can define --card-bg in light/dark mode if needed
      >
        {isClient ? (
          <div className="relative pt-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-lg"
              src="https://www.youtube.com/embed/6biMWgD6_JY?autoplay=0&rel=0"
              title="Project Video"
              allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="h-64 flex items-center justify-center rounded-lg"
            style={{ backgroundColor: 'var(--skeleton-bg, #d1d5db)' }}
          >
            <p>Loading video player...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectVideo;
