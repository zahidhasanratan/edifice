'use client';

import AOS from 'aos';
import { useEffect } from 'react';
import 'aos/dist/aos.css';

export const projects = [
  {
    id: 1,
    title: "Surma Tower",
    location: "Taltala, Sylhet",
    image: "/assets/images/projects/surmaTower.jpg",
    link: "/projects/:id"
  },
  {
    id: 2,
    title: "FAZLUR RAHMAN Tower",
    location: "Mohakhali, Dhaka",
    image: "/assets/images/projects/bulbul_tower.jpg",
    link: "/projects/:id"
  },
  {
    id: 3,
    title: "Impulse Tower",
    location: "Rikabi Bazar, Sylhet",
    image: "/assets/images/projects/impulse_Tower.jpg",
    link: "/projects/:id"
  },
  {
    id: 4,
    title: "Impulse Tower",
    location: "Aftabnagar, E. H. L. Dhaka",
    image: "/assets/images/projects/aftabnagar.jpg",
    link: "/projects/:id"
  },
  {
    id: 5,
    title: "Office & Home Solution (Pvt.) Ltd.",
    location: "Uttara, Dhaka",
    image: "/assets/images/projects/home-solution.jpg",
    link: "/projects/:id"
  },
  {
    id: 6,
    title: "Lotus Kamal Properties Ltd.",
    location: "Baridhara, Dhaka",
    image: "/assets/images/projects/lotus_Kamal.jpg",
    link: "/projects/:id"
  }
];

const ProjectsGrid = ({ title = '', subtitle = '' }) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  return (
    <section data-aos="fade-up" className="py-16 bg-gray-100 text-black dark:bg-gray-800 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-center mb-10">
          {title && (
            <p className="text-[#c20e35] dark:text-red-600 text-sm uppercase tracking-wider relative inline-block mb-2 before:content-[''] before:absolute before:-left-4 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:bg-[#c20e35] before:rounded-full">
              {title}
            </p>
          )}
          {subtitle && (
            <h2 className="relative text-3xl md:text-4xl font-bold text-black dark:text-white text-center mb-6 after:content-[''] after:block after:w-20 after:h-1 after:bg-[#c20e35] after:mx-auto after:mt-4">
              {subtitle}
            </h2>
          )}
        </div>

        <div className="-mx-4 flex flex-wrap justify-center">
          {projects.map((project) => (
            <div key={project.id} className="w-full px-4 md:w-1/2 lg:w-1/3">
              <div className="group mx-auto mb-10 max-w-[380px] text-center md:mb-16 wow fadeInUp" data-wow-delay=".25s">
                <div className="bg-white dark:bg-black shadow-lg overflow-hidden group cursor-pointer">
                  <a href={project.link || "#"}>
                    <div className="overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full max-h-[450px] object-cover transition-transform group-hover:scale-110 duration-1500 ease-in-out"
                      />
                    </div>
                    <div className="p-5 bg-white dark:bg-black">
                      <h3 className="text-xl font-semibold text-black dark:text-white group-hover:text-[#c20e35] transition duration-300">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-white mt-1">
                        {project.location}
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
