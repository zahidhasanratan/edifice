'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';

const CareerPage = () => {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    document.title = "Career | EDIFICE";
    window.scrollTo(0, 0);
  }, []);

  const jobListings = [
    {
      id: 1,
      title: "Sr. Executive/Assistant Manager",
      location: "Head Office: Dhaka",
      details: [
        "Job Function: Executive",
        "Job Type: Permanent"
      ]
    },
    {
      id: 2,
      title: "Marketing Manager",
      location: "Regional Office: Chittagong",
      details: [
        "Job Function: Marketing",
        "Job Type: Full-time"
      ]
    },
    {
      id: 3,
      title: "Software Engineer",
      location: "Tech Division: Remote",
      details: [
        "Job Function: IT",
        "Job Type: Contract"
      ]
    }
  ];

  const handleViewDetails = (jobId) => {
    router.push(`/career/${jobId}`);
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
        className="dark:bg-black dark:text-white bg-white text-black px-4 md:px-10 transition-colors duration-300 ease-in-out py-16"
      >
        <div className="max-w-7xl mx-auto">
          <ul className="space-y-6">
            {jobListings.map((job) => (
              <li key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-3xl mb-3 text-gray-800">{job.title}</h3>
                    <p className="text-gray-600 mb-3">{job.location}</p>
                    <ul className="flex flex-wrap gap-4 mb-3 px-4 list-disc list-inside">
                      {job.details.map((detail, index) => (
                        <li key={index} className="text-gray-600 text-sm">{detail}</li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleViewDetails(job.id)}
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
        </div>
      </section>
    </>
  );
};

export default CareerPage;
