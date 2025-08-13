'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import InnerHero from '@/components/Hero/InnerHero';
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, '')) ||
  'https://edifice-tau.vercel.app/api';

export default function StatusDetailsPage() {
  const { id } = useParams();
  const [statusItem, setStatusItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });

    if (!id) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/status/${id}`, { signal: controller.signal, cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch status');
        const data = await res.json();
        setStatusItem(data);
        if (data?.title) document.title = `${data.title} | EDIFICE`;
      } catch (err) {
        if (err?.name !== 'AbortError') console.error('Error fetching status:', err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  if (loading) return <div className="py-20 text-center text-gray-500">Loading...</div>;
  if (!statusItem) return <div className="py-20 text-center text-red-500">Status not found.</div>;

  return (
    <>
      {/* Hero should show ONLY the cover photo */}
      <InnerHero
        subtitle="Project Status Details"
        title={statusItem.title || 'Project Status'}
        backgroundImage={statusItem.coverPhoto || '/assets/images/hero/01.jpg'}
      />

      <section
        data-aos="fade-up"
        className="transition-colors duration-300 ease-in-out pt-16 pb-[10px] md:pb-16 px-[10px] md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="flex flex-col items-center mx-auto max-w-7xl">
          <div className="w-full md:w-4/5">
            <h3 className="mb-3 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
              {statusItem.title}
            </h3>

            {/* Responsive wrapper so wide tables can scroll on small screens */}
            <div className="overflow-x-auto">
              <div
                className="mb-4 leading-relaxed prose-sm prose md:prose-lg dark:prose-invert max-w-none status-description"
                dangerouslySetInnerHTML={{ __html: statusItem.description || '' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT: make styles GLOBAL so they apply to inner HTML */}
      <style jsx global>{`
        .status-description table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          table-layout: auto;
        }
        .status-description th,
        .status-description td {
          border: 1px solid #d1d5db; /* gray-300 */
          padding: 12px 10px;
          text-align: left;
          vertical-align: top;
          line-height: 1.5;
        }
    
       
      `}</style>
    </>
  );
}
