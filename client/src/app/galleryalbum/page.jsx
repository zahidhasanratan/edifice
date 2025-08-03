'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
import InnerHero from '@/components/Hero/InnerHero';

const galleryItems = [
  {
    id: 1,
    imageSrc: '/assets/images/news/1.jpg', // ✅ from public folder
    altText: 'Gallery Image',
    title: 'Penthouse Balcony View',
  },
  {
    id: 2,
    imageSrc: '/assets/images/news/2.jpg',
    altText: 'Gallery Image',
    title: 'Luxury Apartment Lobby',
  },
  {
    id: 3,
    imageSrc: '/assets/images/news/3.jpg',
    altText: 'Gallery Image',
    title: 'Modern Kitchen Design',
  },
];

const GalleryAlbum = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    document.title = 'Gallery | EDIFICE';
    window.scrollTo(0, 0);
  }, []);

  const handleGalleryClick = () => {
    router.push('/gallery'); // ✅ navigate in Next.js
  };

  return (
    <>
      <InnerHero subtitle="Our" title="GALLERY" backgroundImage="" />
      <section
        className="dark:bg-black dark:text-white bg-white text-black py-16 px-4 md:px-10 transition-colors duration-300 ease-in-out"
        data-aos="fade-up"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                onClick={handleGalleryClick}
              >
                <img
                  src={item.imageSrc}
                  alt={item.altText}
                  className="w-full h-72 object-cover transform transition duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 w-full bg-white/60 dark:bg-black/60 dark:text-white text-black text-center py-3 backdrop-blur-sm transition duration-300">
                  <h3 className="text-lg font-semibold transition duration-300 group-hover:text-[#c20e35]">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default GalleryAlbum;
