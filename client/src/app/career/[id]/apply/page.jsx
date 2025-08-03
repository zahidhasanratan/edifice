'use client'; // MUST be first line

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from "@/components/Hero/InnerHero"; // Make sure path is correct

const CareerApplyPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState(null);
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
  }, []);

  const jobTitle = "Sr. Executive/Assistant Manager"; // dynamic if needed

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationData = new FormData();
    applicationData.append('resume', selectedFile);
    applicationData.append('jobId', id);
    Object.entries(formData).forEach(([k, v]) => applicationData.append(k, v));

    console.log({ jobId: id, ...formData, resume: selectedFile?.name });
    alert("Application submitted successfully!");
    router.push("/career");
  };

  return (
    <>
      <InnerHero subtitle="Latest Releases" title="Career" backgroundImage="" />
      <section data-aos="fade-up" className="dark:bg-black dark:text-white bg-white text-black px-4 md:px-10 py-16">
        <div className="container mx-auto">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <div className="bg-white p-8 rounded-2xl shadow-xl">
                <h2 className="text-2xl font-bold text-center text-[#c20e35] mb-6">Apply Now</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-md text-gray-600 mb-1">Full Name *</label>
                      <input name="fullName" required type="text" value={formData.fullName} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-md text-gray-600 mb-1">Email *</label>
                      <input name="email" required type="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-md text-gray-600 mb-1">Phone *</label>
                      <input name="phone" required type="tel" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                    </div>
                    <div>
                      <label className="block text-md text-gray-600 mb-1">Position</label>
                      <input value={jobTitle} readOnly className="w-full px-4 py-2 border bg-gray-100 text-gray-600 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-md text-gray-600 mb-1">Upload Resume *</label>
                    <input id="resume" name="resume" type="file" accept=".pdf,.doc,.docx" required className="block w-full" onChange={handleFileChange} />
                  </div>

                  <div>
                    <label className="block text-md text-gray-600 mb-1">Cover Letter / Message</label>
                    <textarea name="message" rows="5" value={formData.message} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-md" />
                  </div>

                  <div className="flex justify-center">
                    <button type="submit" className="px-6 py-2 bg-[#c20e35] text-white rounded-full hover:bg-[#a10b2b]">Submit Application</button>
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
