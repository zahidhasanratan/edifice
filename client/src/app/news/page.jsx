'use client';

import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';

const newsItems = [
  {
    id: 1,
    image: "/assets/images/news/1.jpg",
    date: "June 30, 2025",
    title: "Exciting Updates on Our Latest Projects",
    link: "/news/1"
  },
  {
    id: 2,
    image: "/assets/images/news/2.jpg",
    date: "June 28, 2025",
    title: "Construction Milestones Reached",
    link: "/news/2"
  },
  {
    id: 3,
    image: "/assets/images/news/3.jpg",
    date: "June 25, 2025",
    title: "CEO's Future Development Vision",
    link: "/news/3"
  },
  {
    id: 4,
    image: "/assets/images/news/4.jpg",
    date: "June 22, 2025",
    title: "New Green Building Initiative",
    link: "/news/4"
  },
  {
    id: 5,
    image: "/assets/images/news/5.jpg",
    date: "June 20, 2025",
    title: "Award-Winning Design Recognized",
    link: "/news/5"
  },
  {
    id: 6,
    image: "/assets/images/news/6.jpg",
    date: "June 18, 2025",
    title: "Community Program Update",
    link: "/news/6"
  }
];

const News = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    document.title = "News | EDIFICE";
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <InnerHero
        subtitle="Latest Releases"
        title="News and Events"
        backgroundImage="/assets/images/hero/01.jpg"
      />

      <section
        data-aos="fade-up"
        className="py-16 transition-colors duration-300"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}
              >
                <a href={item.link} className="block">
                  <div className="overflow-hidden h-60">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm mb-2" style={{ color: 'var(--muted-text)' }}>
                      {item.date}
                    </p>
                    <h3 className="text-xl font-semibold transition duration-300 group-hover:text-[#c20e35]">
                      {item.title}
                    </h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
