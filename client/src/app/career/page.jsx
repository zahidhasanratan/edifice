'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';

const CareerPage = () => {
  const router = useRouter();
  const [jobListings, setJobListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    document.title = "Career | EDIFICE";
    window.scrollTo(0, 0);
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/careers');
      const data = await res.json();
      setJobListings(data);
    } catch (error) {
      console.error('Failed to fetch careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id) => {
    router.push(`/career/${id}`);
  };

  return (
    <>
      <InnerHero
        subtitle="Latest Releases"
        title="Career"
        backgroundImage=""
      />

      <section
        data-aos="fade-up"
        className="px-4 py-16 transition-colors duration-300 ease-in-out md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <p className="text-center text-gray-500">Loading job openings...</p>
          ) : jobListings.length === 0 ? (
            <p className="text-center text-gray-500">No job openings at the moment.</p>
          ) : (
            <ul className="space-y-6">
              {jobListings.map((job) => (
                <li
                  key={job._id}
                  className="p-6 transition-shadow rounded-lg shadow-md hover:shadow-lg"
                  style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start">
                    <div className="flex-1">
                      <h3 className="mb-3 text-lg font-semibold md:text-3xl">
                        {job.title}
                      </h3>
                      <p className="mb-3 text-gray-600 dark:text-gray-400">
                        {job.location}
                      </p>
                      <ul className="flex flex-wrap gap-4 px-4 mb-3 list-disc list-inside">
                        <li className="text-sm text-gray-600 dark:text-gray-400">
                          Job Function: {job.jobFunction}
                        </li>
                        <li className="text-sm text-gray-600 dark:text-gray-400">
                          Job Type: {job.jobType}
                        </li>
                      </ul>
                    </div>
                    <button
                      onClick={() => handleViewDetails(job._id)}
                      className="flex items-center gap-2 px-6 py-2 bg-[#c20e35] text-md text-white font-semibold rounded-xl hover:bg-indigo-900 transition-colors md:self-center"
                    >
                      View Details
                      <span className="text-base">
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                          <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
                        </svg>
                      </span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export default CareerPage;
