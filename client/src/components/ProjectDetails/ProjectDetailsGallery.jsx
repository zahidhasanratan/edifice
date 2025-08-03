'use client';

import React, { useState, useEffect } from 'react';

const galleryImages = [
  { src: '/assets/images/hero/1.jpg', alt: 'Gallery Image 1' },
  { src: '/assets/images/hero/2.jpg', alt: 'Gallery Image 2' },
  { src: '/assets/images/hero/3.jpg', alt: 'Gallery Image 3' },
];

const ProjectDetailsGallery = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState([]);

  useEffect(() => {
    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(src);
        img.onerror = () => reject(src);
      });
    };

    Promise.all(galleryImages.map((image) => loadImage(image.src)))
      .then(() => setLoadedImages(galleryImages))
      .catch(console.error);
  }, []);

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
        return (prevIndex - 1 + galleryImages.length) % galleryImages.length;
      } else {
        return (prevIndex + 1) % galleryImages.length;
      }
    });
  };

  return (
    <section
      className="transition-colors duration-300 ease-in-out py-16 px-4 md:px-10"
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

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
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
