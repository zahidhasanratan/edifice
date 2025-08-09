'use client';

import React, { useState, useEffect } from 'react';

const ProjectDetailsGallery = ({ images = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Preload images
  useEffect(() => {
    if (!images || !images.length) return;

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
      });

    Promise.all(images.map((src) => loadImage(src)))
      .then(() => {
        const formatted = images.map((src, index) => ({
          src,
          alt: `Gallery Image ${index + 1}`,
        }));
        setLoadedImages(formatted);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [images]);

  const openModal = (index) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    setCurrentImageIndex((prevIndex) => {
      if (direction === 'prev') {
        return (prevIndex - 1 + loadedImages.length) % loadedImages.length;
      } else {
        return (prevIndex + 1) % loadedImages.length;
      }
    });
  };

  return (
    <section className="px-4 py-16 text-black bg-white dark:bg-black dark:text-white md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="w-full bg-gray-200 h-72 dark:bg-gray-800 rounded-xl animate-pulse"
                />
              ))
            : loadedImages.map((image, index) => (
                <div
                  key={index}
                  className="relative overflow-hidden shadow-lg cursor-pointer group rounded-xl"
                  onClick={() => openModal(index)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full transition duration-500 transform h-72 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
              ))}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={closeModal}
        >
          <button
            className="absolute top-6 right-6 text-white text-3xl hover:text-[#c20e35] z-50 focus:outline-none"
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
            aria-label="Close modal"
          >
            &times;
          </button>

          <button
            className="absolute left-6 text-white text-4xl hover:text-[#c20e35] z-50 focus:outline-none"
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
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <button
            className="absolute right-6 text-white text-4xl hover:text-[#c20e35] z-50 focus:outline-none"
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
    </section>
  );
};

export default ProjectDetailsGallery;
