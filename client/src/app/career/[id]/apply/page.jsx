'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AOS from 'aos';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
import InnerHero from "@/components/Hero/InnerHero";

const CareerApplyPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    document.title = "Apply | EDIFICE";
    window.scrollTo(0, 0);

    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/careers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setJobTitle(data.title || ""); // Adjust if your API returns `data.job.title` or similar
      } else {
        setJobTitle("Unknown Position");
      }
    } catch (err) {
      console.error("Failed to fetch job:", err);
      setJobTitle("Unknown Position");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      return Swal.fire("Oops!", "Please upload your resume.", "warning");
    }

    const applicationData = new FormData();
    applicationData.append('resume', selectedFile);
    applicationData.append('jobId', id);
    applicationData.append('jobTitle', jobTitle); // ✅ dynamic title
    Object.entries(formData).forEach(([key, value]) => {
      applicationData.append(key, value);
    });

    try {
      const res = await fetch("http://localhost:5000/api/career-applications", {
        method: "POST",
        body: applicationData,
      });

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Application Submitted!',
          text: 'Your application has been received successfully.',
          confirmButtonColor: '#c20e35'
        }).then(() => {
          router.push("/career");
        });
      } else {
        const errData = await res.json();
        Swal.fire("Error", errData.message || "Submission failed", "error");
      }
    } catch (error) {
      console.error("Application error:", error);
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <>
      <InnerHero subtitle="Latest Releases" title="Career" backgroundImage="" />
      <section
        data-aos="fade-up"
        className="px-4 py-16 transition-colors duration-300 ease-in-out md:px-10"
        style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
      >
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div
                className="p-8 shadow-xl rounded-2xl"
                style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
              >
                <h2 className="text-2xl font-bold text-center text-[#c20e35] mb-6">Apply Now</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label className="block mb-1 text-gray-700 text-md dark:text-gray-300">Full Name *</label>
                      <input
                        name="fullName"
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md dark:bg-black dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 text-md dark:text-gray-300">Email *</label>
                      <input
                        name="email"
                        required
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md dark:bg-black dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 text-md dark:text-gray-300">Phone *</label>
                      <input
                        name="phone"
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md dark:bg-black dark:text-white dark:border-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 text-gray-700 text-md dark:text-gray-300">Position</label>
                      <input
                        value={jobTitle}
                        readOnly
                        className="w-full px-4 py-2 text-gray-600 bg-gray-100 border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-700 text-md dark:text-gray-300">Upload Resume *</label>
                    <input
                      id="resume"
                      name="resume"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      required
                      className="block w-full text-gray-700 dark:text-gray-300"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div>
                    <label className="block mb-1 text-gray-700 text-md dark:text-gray-300">Cover Letter / Message</label>
                    <textarea
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md dark:bg-black dark:text-white dark:border-gray-700"
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#c20e35] text-white rounded-full hover:bg-[#a10b2b] transition-colors"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CareerApplyPage;
