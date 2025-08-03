'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import InnerHero from '@/components/Hero/InnerHero';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Gallery = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);

  const images = [
    { src: '/assets/images/news/1.jpg', alt: 'Luxury Apartment Lobby' },
    { src: '/assets/images/news/2.jpg', alt: 'Modern Kitchen Design' },
    { src: '/assets/images/news/3.jpg', alt: 'Penthouse Balcony View' },
  ];

  // Preload images
  useEffect(() => {
    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
      });

    Promise.all(images.map((image) => loadImage(image.src)))
      .then(() => setLoadedImages(images))
      .catch(console.error);
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    document.title = 'Gallery | EDIFICE';
    window.scrollTo(0, 0);

    const indexFromURL = parseInt(searchParams.get('imageIndex'));
    if (!isNaN(indexFromURL)) {
      setCurrentImageIndex(indexFromURL);
      setIsModalOpen(true);
      document.body.style.overflow = 'hidden';
    }
  }, [searchParams]);

  const openModal = (index) => {
    router.push(`?imageIndex=${index}`);
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
    router.push('/gallery');
  };

  const navigateImage = (direction) => {
    const newIndex =
      direction === 'prev'
        ? (currentImageIndex - 1 + loadedImages.length) % loadedImages.length
        : (currentImageIndex + 1) % loadedImages.length;

    setCurrentImageIndex(newIndex);
    router.push(`?imageIndex=${newIndex}`);
  };

  // Handle keyboard nav
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
      <div className="relative z-0">
        <InnerHero subtitle="Our" title="GALLERY" backgroundImage="" />
      </div>

      <section
        data-aos="fade-up"
        className="relative z-0 py-16 px-4 md:px-10 transition-colors duration-300 ease-in-out"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadedImages.map((image, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
                onClick={() => openModal(index)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-72 object-cover transform transition duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {isModalOpen && (
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
              src={loadedImages[currentImageIndex]?.src}
              alt={loadedImages[currentImageIndex]?.alt}
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
