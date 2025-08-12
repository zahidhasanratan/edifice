export default function Loading() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <HeroSkeleton />
      <SectionSkeleton />
      <GallerySkeleton />
      <SectionSkeleton />
      <MapSkeleton />
      <SectionSkeleton />
    </main>
  );
}

function shimmer() {
  return 'animate-pulse bg-[color-mix(in_srgb,var(--foreground)_/10%,transparent)]';
}
function HeroSkeleton() {
  return (
    <div className={`w-full h-[280px] md:h-[360px] lg:h-[420px] ${shimmer()}`}>
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-10">
        <div className={`w-40 h-4 mb-3 rounded ${shimmer()}`} />
        <div className={`w-2/3 max-w-[620px] h-10 md:h-14 rounded-2xl ${shimmer()}`} />
      </div>
    </div>
  );
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
