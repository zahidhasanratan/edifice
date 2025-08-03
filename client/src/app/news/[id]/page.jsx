'use client';

import { useEffect } from "react";
import InnerHero from '@/components/Hero/InnerHero';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewsDetails = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
    document.title = "News | EDIFICE";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <InnerHero
        subtitle="Latest Releases"
        title="News and events"
        backgroundImage="/assets/images/hero/1.jpg" // ✅ now uses public path
      />

      <section
        data-aos="fade-up"
        className="dark:bg-black dark:text-white bg-white text-gray-800 transition-colors duration-300 ease-in-out pt-16 pb-[10px] md:pb-16 px-[10px] md:px-10"
      >
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <div className="w-full md:w-4/5 mb-10">
            <div className="overflow-hidden shadow-md rounded-xl">
              <img
                src="/assets/images/hero/1.jpg" // ✅ image path from public folder
                alt="News Header"
                className="w-full h-[350px] md:h-[550px] object-cover transition-all duration-300"
              />
            </div>
          </div>

          <div className="w-full md:w-4/5">
            <h3 className="text-xl font-semibold mb-3 dark:text-white text-gray-900">
              News Title Name Here
            </h3>
            <p className="dark:text-gray-300 text-gray-700 leading-relaxed mb-4">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
              quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
              proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetails;
