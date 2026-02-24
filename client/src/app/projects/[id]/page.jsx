import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import InnerHero from '@/components/Hero/InnerHero';

export const revalidate = 120; // ISR: refresh every 120s

async function getProject(id) {
  const res = await fetch(`https://edificese.vercel.app/api/projects/${id}`, {
    next: { revalidate },
  });
  if (!res.ok) notFound();
  return res.json();
}

// Use suspense only — no ssr:false in Server Components
const SingleProjectDetails = dynamic(
  () => import('@/components/ProjectDetails/SingleProjectDetails'),
  { suspense: true }
);
const ProjectDetailsGallery = dynamic(
  () => import('@/components/ProjectDetails/ProjectDetailsGallery'),
  { suspense: true }
);
const ProjectVideo = dynamic(
  () => import('@/components/ProjectDetails/ProjectVideo'),
  { suspense: true }
);
const ProjectLocation = dynamic(
  () => import('@/components/ProjectDetails/ProjectLocation'),
  { suspense: true }
);
const ProjectsGrid = dynamic(
  () => import('@/components/Projects/ProjectsGrid'),
  { suspense: true }
);

export default async function ProjectDetailsPage({ params }) {
  const { id } = params;
  const project = await getProject(id);

  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <InnerHero
        subtitle="Our Projects"
        title={project.title}
        backgroundImage={project.innerBannerImage || '/assets/images/hero/01.jpg'}
      />

      <Suspense fallback={<SectionSkeleton />}>
        <SingleProjectDetails project={project} />
      </Suspense>

      <Suspense fallback={<GallerySkeleton />}>
        <ProjectDetailsGallery images={project.multiplePhotos} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ProjectVideo youtubeUrl={project.youtubeUrl} />
      </Suspense>

      <Suspense fallback={<MapSkeleton />}>
        <ProjectLocation address={project.address} mapEmbedLink={project.googleMapLocation} />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ProjectsGrid title="Projects" subtitle="Related Projects" />
      </Suspense>
    </main>
  );
}

// --- lightweight server-safe skeletons ---
function shimmer() {
  return 'animate-pulse bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)]';
}
function SectionSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className={`w-1/2 max-w-[420px] h-7 mb-6 rounded-2xl ${shimmer()}`} />
      <div className="grid gap-6 md:grid-cols-2">
        <div className={`h-32 rounded-2xl ${shimmer()}`} />
        <div className="space-y-3">
          <div className={`w-5/6 h-4 rounded ${shimmer()}`} />
          <div className={`w-full h-4 rounded ${shimmer()}`} />
          <div className={`w-4/5 h-4 rounded ${shimmer()}`} />
          <div className={`w-3/4 h-4 rounded ${shimmer()}`} />
        </div>
      </div>
    </section>
  );
}
function GallerySkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className={`w-44 h-6 mb-6 rounded-2xl ${shimmer()}`} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`aspect-[4/3] rounded-2xl ${shimmer()}`} />
        ))}
      </div>
    </section>
  );
}
function MapSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className={`w-36 h-6 mb-4 rounded-2xl ${shimmer()}`} />
      <div className={`w-full h-[320px] md:h-[420px] rounded-2xl ${shimmer()}`} />
    </section>
  );
}
