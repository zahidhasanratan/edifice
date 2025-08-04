'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';

const Gallery = () => {
  const { albumId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [photos, setPhotos] = useState([]);
  const [albumTitle, setAlbumTitle] = useState('GALLERY');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Load images from API
  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    window.scrollTo(0, 0);
    fetchPhotos();
  }, [albumId]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/photos');
      const data = await res.json();

      const filtered = data.filter((item) => item.album?._id === albumId);
      setPhotos(filtered);

      if (filtered.length > 0 && filtered[0].album?.title) {
        setAlbumTitle(filtered[0].album.title);
        document.title = `${filtered[0].album.title} | EDIFICE`;
      } else {
        setAlbumTitle('Gallery');
        document.title = 'Gallery | EDIFICE';
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
      setAlbumTitle('Gallery');
      document.title = 'Gallery | EDIFICE';
    }
  };

  // Open modal from URL param
  useEffect(() => {
    const indexFromURL = parseInt(searchParams.get('imageIndex'));
    if (!isNaN(indexFromURL)) {
      setCurrentImageIndex(indexFromURL);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, [searchParams]);

  const openModal = (index) => {
    router.push(`/gallery/${albumId}?imageIndex=${index}`);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    router.push(`/gallery/${albumId}`);
  };

  const navigateImage = (direction) => {
    const total = photos.length;
    const newIndex =
      direction === 'prev'
        ? (currentImageIndex - 1 + total) % total
        : (currentImageIndex + 1) % total;

    setCurrentImageIndex(newIndex);
    router.push(`/gallery/${albumId}?imageIndex=${newIndex}`);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isModalOpen) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateImage('prev');
      if (e.key === 'ArrowRight') navigateImage('next');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, currentImageIndex]);

  return (
    <>
      <InnerHero subtitle="Our Gallery" title={albumTitle} backgroundImage="" />

      <section
        data-aos="fade-up"
        className="relative z-0 py-16 px-4 md:px-10 transition-colors duration-300 ease-in-out"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="max-w-7xl mx-auto">
          {photos.length === 0 ? (
            <p className="text-center text-lg">No photos found in this album.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {photos.map((image, index) => (
                <div
                  key={image._id}
                  className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title}
                    className="w-full h-72 object-cover transform transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {isModalOpen && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}
          onClick={closeModal}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:text-[#c20e35]"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            aria-label="Close modal"
          >
            &times;
          </button>
          <button
            className="absolute left-6 text-white text-4xl hover:text-[#c20e35]"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('prev');
            }}
            aria-label="Previous image"
          >
            ❮
          </button>
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={photos[currentImageIndex]?.imageUrl}
              alt={photos[currentImageIndex]?.title}
              className="min-w-[80vw] min-h-[80vh] object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <button
            className="absolute right-6 text-white text-4xl hover:text-[#c20e35]"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage('next');
            }}
            aria-label="Next image"
          >
            ❯
          </button>
        </div>
      )}
    </>
  );
};

export default Gallery;
