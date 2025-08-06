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
      const res = await fetch('http://localhost:5000/api/albums');
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
        className="transition-colors duration-300 ease-in-out py-16 px-4 md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 h-72"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {albums.map((album) => (
                <div
                  key={album._id}
                  className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                  onClick={() => handleGalleryClick(album._id)}
                >
                  <img
                    src={album.coverPhoto}
                    alt={album.title}
                    className="w-full h-72 object-cover transform transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-0 w-full text-center py-3 backdrop-blur-sm transition duration-300"
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
