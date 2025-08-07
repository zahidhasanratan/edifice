import { Suspense } from 'react';
import Gallery from './GalleryClient'; // your existing component

export default function GalleryPageWrapper() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading gallery...</div>}>
      <Gallery />
    </Suspense>
  );
}
