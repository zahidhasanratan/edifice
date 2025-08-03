'use client';

import React from 'react';

const ProjectLocation = ({ address, mapEmbedLink }) => {
  return (
    <section
      className="transition-colors duration-300 ease-in-out py-16 px-4 md:px-10"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Text Content */}
        <div className="w-full md:w-[30%] flex items-center">
          <div className="w-full">
            <h2 className="w-full text-3xl md:text-4xl font-extrabold uppercase text-[#c20e35] mb-4 tracking-wider leading-snug">
              Project<br />Location
            </h2>
            <p className="leading-relaxed text-[color:var(--foreground)]">
              <strong>Address:</strong><br />
              {address || 'Not Available'}
            </p>
          </div>
        </div>

        {/* Right Map Embed */}
        <div className="w-full md:w-[70%]">
          <div className="overflow-hidden shadow-lg w-full h-[300px] md:h-[400px] rounded-xl">
            {mapEmbedLink ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: mapEmbedLink }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-800 rounded-xl">
                <p>No map available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectLocation;
