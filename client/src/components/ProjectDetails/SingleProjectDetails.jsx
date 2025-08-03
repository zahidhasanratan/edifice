'use client';

import React from 'react';

const SingleProjectDetails = ({ project }) => {
  if (!project) return null;

  return (
    <section
      className="transition-colors duration-300 ease-in-out py-16 px-4 md:px-10"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Project Image */}
        <div className="w-full md:w-4/5 mb-10">
          <div className="overflow-hidden shadow-md">
            <img
              src={project.mainImage || project.featureImage || '/assets/images/hero/1.jpg'}
              alt={project.title}
              className="w-full h-[550px] object-cover rounded-md"
            />
          </div>
        </div>

        {/* Project Content */}
        <div className="w-full md:w-4/5">
          <h1 className="text-4xl font-bold uppercase mb-2">
            {project.title}
          </h1>
          {project.subtitle && (
            <p className="text-lg text-[#c20e35] font-medium mb-6">
              {project.subtitle}
            </p>
          )}

          <div className="flex items-center text-blue-600 mb-6">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z" />
            </svg>
            <span>{project.address || 'No address provided'}</span>
          </div>

          <h3 className="text-xl font-semibold mb-3">Overview</h3>
          <p className="leading-relaxed mb-4">
            {project.overview || 'No overview available.'}
          </p>

          {/* Project Specs */}
          {project.specs?.length > 0 && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold border-b-2 border-[#c20e35] inline-block pb-2 mb-4">
                Project Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.specs.map((spec) => (
                  <div key={spec._id} className="flex text-sm">
                    <span className="w-36 font-semibold">
                      {spec.title}
                    </span>
                    <span>{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SingleProjectDetails;
