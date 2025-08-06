'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';

const JobDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out' });
    document.title = 'Career | EDIFICE';
    window.scrollTo(0, 0);
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/careers/${id}`);
      const data = await res.json();
      setJob(data);
    } catch (err) {
      console.error('Error fetching job details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="py-10 text-center text-gray-500">Loading job details...</p>;
  if (!job) return <p className="py-10 text-center text-red-500">Job not found</p>;

  return (
    <>
      <InnerHero subtitle="Latest Releases" title="Career" backgroundImage="" />

      <section
        data-aos="fade-up"
        className="px-4 py-16 transition-colors duration-300 ease-in-out md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="container px-4 mx-auto">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Main Content */}
            <div className="lg:w-3/4">
              <div
                className="max-w-4xl p-6 mx-auto rounded-lg shadow-lg sm:p-8"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              >
                <h1 className="mb-4 text-xl font-semibold sm:text-2xl md:text-3xl">
                  {job.title}
                </h1>

                <div className="mb-4 space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Location:</strong> {job.location}</p>
                  <p><strong>Job Function:</strong> {job.jobFunction}</p>
                  <p><strong>Job Type:</strong> {job.jobType}</p>
                </div>

                {job.description && (
                  <div className="mb-6 space-y-2 text-base text-gray-700 dark:text-gray-300">
                    <h2 className="mb-2 text-lg font-semibold">Description</h2>
                    <div dangerouslySetInnerHTML={{ __html: job.description }} />
                  </div>
                )}

                {job.job_summary && (
                  <div className="mb-6 space-y-2 text-base text-gray-700 dark:text-gray-300">
                    <h2 className="mb-2 text-lg font-semibold">Job Summary</h2>
                    <div dangerouslySetInnerHTML={{ __html: job.job_summary }} />
                  </div>
                )}

                <div className="mb-8">
                  <h2 className="mb-2 text-lg font-semibold">Benefits</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    Festival Bonus, Contributory Provident Fund, Gratuity, Health & Life Insurance and others as per organisation policy.
                  </p>
                </div>

                <button
                  onClick={() => router.push(`/career/${job._id}/apply`)}
                  className="flex items-center gap-2 px-6 py-2 bg-[#c20e35] text-white text-sm sm:text-base font-semibold rounded-xl hover:bg-indigo-900 transition-colors"
                >
                  Apply Now
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div
                className="text-sm rounded-lg p-4 shadow-md sticky top-[150px]"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              >
                <h3 className="text-lg text-white bg-[#c20e35] p-3 rounded-md mb-4">Job Summary</h3>
                <div className="space-y-3">
                  <div><strong>Title:</strong> {job.title}</div>
                  <div><strong>Location:</strong> {job.location}</div>
                  <div><strong>Job Function:</strong> {job.jobFunction}</div>
                  <div><strong>Job Type:</strong> {job.jobType}</div>
                  <div><strong>Application Link:</strong> <a href={job.link} className="text-blue-600 underline" target="_blank" rel="noreferrer">Click Here</a></div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default JobDetailsPage;
