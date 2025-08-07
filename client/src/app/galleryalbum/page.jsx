'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useRouter } from 'next/navigation';
import InnerHero from '@/components/Hero/InnerHero';

const GalleryAlbum = () => {
  const router = useRouter();
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    document.title = 'Gallery | EDIFICE';
    window.scrollTo(0, 0);
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch('https://edifice-tau.vercel.app/api/albums');
      const data = await res.json();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setTimeout(() => setLoading(false), 300); // slight delay for smoother loading
    }
  };

  const handleGalleryClick = (albumId) => {
    router.push(`/gallery/${albumId}`);
  };

  return (
    <>
      <InnerHero subtitle="Our" title="GALLERY" backgroundImage="/assets/images/hero/gallery.jpg" />

      <section
        data-aos="fade-up"
        className="px-4 py-16 transition-colors duration-300 ease-in-out md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden bg-gray-200 rounded-xl dark:bg-gray-700 h-72"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="relative overflow-hidden shadow-lg cursor-pointer group rounded-xl"
                  onClick={() => handleGalleryClick(album._id)}
                >
                  <img
                    src={album.coverPhoto}
                    alt={album.title}
                    className="object-cover w-full transition duration-500 transform h-72 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-0 w-full py-3 text-center transition duration-300 backdrop-blur-sm"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.6)',
                      color: 'var(--foreground)',
                    }}
                  >
                    <h3 className="text-lg font-semibold transition duration-300 group-hover:text-[#c20e35]">
                      {album.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default GalleryAlbum;
