'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import InnerHero from '@/components/Hero/InnerHero';
import AOS from 'aos';
import 'aos/dist/aos.css';

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
    });
    document.title = "News | EDIFICE";
    window.scrollTo(0, 0);

    const fetchNews = async () => {
      try {
        const res = await fetch(`https://edifice-tau.vercel.app/api/news/${id}`);
        const data = await res.json();
        setNews(data);
      } catch (err) {
        console.error("Error fetching news:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchNews();
  }, [id]);

  if (loading) {
    return <div className="py-20 text-center text-gray-500">Loading...</div>;
  }

  if (!news) {
    return <div className="py-20 text-center text-red-500">News not found.</div>;
  }

  return (
    <>
      <InnerHero
        subtitle="Latest Releases"
        title={news.title}
        backgroundImage={news.coverPhoto || "/assets/images/hero/1.jpg"}
      />

      <section
        data-aos="fade-up"
        className="transition-colors duration-300 ease-in-out pt-16 pb-[10px] md:pb-16 px-[10px] md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="flex flex-col items-center mx-auto max-w-7xl">
          <div className="w-full mb-10 md:w-4/5">
            <div className="overflow-hidden shadow-md rounded-xl">
              <img
                src={news.featuredPhoto}
                alt={news.title}
                className="w-full h-[350px] md:h-[550px] object-cover transition-all duration-300"
              />
            </div>
          </div>

          <div className="w-full md:w-4/5">
            <h3 className="mb-3 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {news.title}
            </h3>
            <div
              className="mb-4 leading-relaxed prose-sm prose md:prose-lg dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: news.description }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsDetails;
