'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Image from 'next/image';
import Link from 'next/link';
import InnerHero from '@/components/Hero/InnerHero';

const API_BASE =
  (process.env.NEXT_PUBLIC_API_BASE && process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, '')) ||
  'https://edifice-tau.vercel.app/api';

export default function StatusPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const abortRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
  }, []);

  useEffect(() => {
    // Abort previous request on re-fetch/unmount
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/status`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.statuses || data.items || [];
        // Ensure sequence ascending
        setItems([...arr].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0)));
      } catch (err) {
        if (err?.name !== 'AbortError') console.error('Failed to fetch status:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) => {
      const title = (it.title || '').toLowerCase();
      const desc = (it.description || '').replace(/<[^>]+>/g, '').toLowerCase();
      return title.includes(term) || desc.includes(term);
    });
  }, [items, q]);

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* Inner Hero */}
      <InnerHero
        subtitle=""
        title="Project Status"
        backgroundImage="/assets/images/hero/01.jpg"
      />

      {/* Body */}
      <section data-aos="fade-up" className="py-16">
        <div className="px-4 mx-auto max-w-7xl">
          {/* Top bar: heading + search (search on right) */}
          <div className="flex flex-col items-start justify-between gap-4 mb-8 sm:flex-row sm:items-center">
            <h2 className="text-2xl font-bold">All Status</h2>
            <div className="w-full sm:w-auto">
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search status..."
                className="input input-bordered w-full sm:w-80"
                aria-label="Search status"
              />
            </div>
          </div>

          {/* Grid: 4 per row on xl */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-lg shadow overflow-hidden">
                    <div className="relative h-[350px] bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)] animate-pulse" />
                    <div className="p-4">
                      <div className="h-5 w-3/4 rounded bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)] animate-pulse" />
                      <div className="mt-2 h-4 w-1/2 rounded bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)] animate-pulse" />
                    </div>
                  </div>
                ))
              : filtered.length > 0
              ? filtered.map((item, idx) => (
                  <article
                    key={item._id || item.id}
                    className="group rounded-lg shadow overflow-hidden bg-[var(--background)] text-[var(--foreground)]"
                    data-aos="fade-up"
                  >
                    <Link href={`/status/${item._id || item.id}`} prefetch className="block">
                      <div className="relative h-[350px] overflow-hidden">
                        <Image
                          src={item.featuredPhoto || '/fallback.jpg'}
                          alt={item.title || 'Status'}
                          fill
                          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          priority={idx < 2}
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-lg font-semibold group-hover:text-[#c20e35] transition">
                            {item.title}
                          </h3>
                         
                        </div>
                    
                      </div>
                    </Link>
                  </article>
                ))
              : (
                <p className="col-span-full text-center text-gray-500">No items found.</p>
              )}
          </div>
        </div>
      </section>
    </main>
  );
}
