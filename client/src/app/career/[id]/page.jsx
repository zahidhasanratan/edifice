'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';

const JobDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
    });
    document.title = 'Career | EDIFICE';
    window.scrollTo(0, 0);
  }, []);

  const jobData = {
    id,
    title: "Sr. Executive/Assistant Manager",
    location: "Head Office",
    postedDate: "December 27, 2021",
    deadline: "January 2, 2022",
    description: [
      "We are looking for an experienced professional to join our team as a Senior Executive/Assistant Manager.",
      "The ideal candidate will have excellent organizational skills and the ability to manage multiple tasks simultaneously.",
      "This position requires strong communication skills and the ability to work collaboratively across departments.",
    ],
    responsibilities: [
      "Receive and deliver materials in FIFO method.",
      "Prepare the indent and inventorial works combination with all maintenance section.",
      "Prepare daily store statement and update stock register.",
      "Observe and monitor the local purchase, bill entry, IOU Adjust etc in emergency time.",
      "Ensure maximum use of all material and reserve store related documents.",
    ],
    requirements: [
      "Knowledge on material distribution.",
      "Excellent Writing Skill in English and Bengali",
      "Basic knowledge on computer applications",
      "Inventory Management knowledge",
      "3+ years of relevant experience",
    ],
    benefits:
      "Festival Bonus, Contributory Provident Fund, Gratuity, Health & Life Insurance and others as per organisation policy.",
    summary: {
      published: "27 Dec 2025",
      vacancy: "01",
      employmentStatus: "Full-time",
      experience: "3 to 4 year(s)",
      age: "24 to 36 years",
      jobLocation: "Dhaka",
      salary: "Negotiable",
      deadline: "27 Jan 2026",
    },
  };

  return (
    <>
      <InnerHero subtitle="Latest Releases" title="Career" backgroundImage="" />
      <section
        data-aos="fade-up"
        className="dark:bg-black dark:text-white bg-white text-black py-16 px-4 md:px-10 transition-colors duration-300 ease-in-out"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="bg-white text-black p-6 sm:p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
                  {jobData.title}
                </h1>

                <div className="text-sm text-gray-600 space-y-1 mb-4">
                  <p>
                    <strong>Location:</strong> {jobData.location}
                  </p>
                  <p>
                    <strong>Date Posted:</strong> {jobData.postedDate}
                  </p>
                  <p>
                    <strong>Last Date of Application:</strong> {jobData.deadline}
                  </p>
                </div>

                <div className="text-base text-gray-700 space-y-4 mb-6">
                  {jobData.description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Key Responsibilities</h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {jobData.responsibilities.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Job Requirements</h2>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    {jobData.requirements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Benefits</h2>
                  <p className="text-gray-700">{jobData.benefits}</p>
                </div>

                <button
                  onClick={() => router.push(`/career/${id}/apply`)}
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

            <div className="lg:w-1/4">
              <div className="bg-white text-sm rounded-lg p-4 shadow-md sticky top-[150px]">
                <h3 className="text-lg text-white bg-[#c20e35] p-3 rounded-md mb-4">Job Summary</h3>

                <div className="space-y-3 text-gray-800">
                  {Object.entries(jobData.summary).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                      <span className="text-gray-600"> {value}</span>
                    </div>
                  ))}
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
