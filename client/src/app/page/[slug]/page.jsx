'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const DynamicPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/pages');
        const data = await res.json();
        const matchedPage = data.find((page) => page.menuSlug === slug);
        setPageData(matchedPage || null);
      } catch (error) {
        console.error('Error fetching page data:', error);
        setPageData(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPageData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen text-black bg-white dark:bg-black dark:text-white animate-pulse">
        {/* Fake Cover Photo */}
        <div className="w-full h-[300px] bg-gray-300 dark:bg-gray-700" />

        {/* Shimmer Content */}
        <div className="container flex flex-col justify-between gap-10 px-4 py-10 mx-auto lg:flex-row">
          <div className="w-full space-y-6">
            <div className="w-32 h-4 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-1/2 h-6 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-full h-4 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-3/4 h-4 bg-gray-300 rounded dark:bg-gray-700" />
          </div>
        </div>
      </div>
    );
  }

  if (!pageData) {
    return <div className="p-10 text-center text-red-500">Page not found</div>;
  }

  return (
    <div className="min-h-screen text-black bg-white dark:bg-black dark:text-white">
      {/* Cover Photo */}
      {pageData.coverPhoto && (
        <div className="w-full">
          <img
            src={pageData.coverPhoto}
            alt="Cover"
            className="w-full max-h-[400px] object-cover"
          />
        </div>
      )}

      {/* Description Section */}
      <div className="container flex flex-col justify-between gap-10 px-4 py-10 mx-auto lg:flex-row">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold leading-tight md:text-2xl">
            {pageData.title || 'Untitled'}
          </h2>
          <div
            className="text-[14px] leading-[20px] text-[var(--foreground)]/80 space-y-4"
            dangerouslySetInnerHTML={{ __html: pageData.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;
