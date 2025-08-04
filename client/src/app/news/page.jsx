'use client';

import React, { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';
import Link from 'next/link';

const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    document.title = "News | EDIFICE";
    window.scrollTo(0, 0);

    fetch('http://localhost:5000/api/news')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.news && Array.isArray(data.news)) {
          setNewsItems(data.news);
        }
      })
      .catch((err) => {
        console.error('Error fetching news:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 text-center text-gray-500">
        Loading news...
      </section>
    );
  }

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
                key={item._id}
                className="group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--foreground)' }}
              >
                <Link href={`/news/${item._id}`} className="block">
                  <div className="overflow-hidden h-60">
                    <img
                      src={item.featuredPhoto}
                      alt={item.title}
                      className="w-full h-full object-cover transform transition duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <p className="text-sm mb-2" style={{ color: 'var(--muted-text)' }}>
                      {new Date(item.publishDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <h3 className="text-xl font-semibold transition duration-300 group-hover:text-[#c20e35]">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default News;
