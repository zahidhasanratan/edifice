'use client';

import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';
import ContactForm from '@/components/common/ContactForm';

const ContactPage = () => {
  const [contactData, setContactData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    window.scrollTo(0, 0);
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const res = await fetch('https://edifice-tau.vercel.app/api/contactInfo');
      const data = await res.json();
      setContactData(data);
    } catch (err) {
      console.error('Failed to load contact info:', err);
    } finally {
      setTimeout(() => setIsLoading(false), 300);
    }
  };

  if (isLoading || !contactData) {
    return (
      <main>
        <InnerHero
          subtitle="Get In Touch"
          title="Contact Us"
          backgroundImage="/assets/images/hero/contact.jpg"
        />

        <section className="grid max-w-6xl gap-10 px-6 py-16 mx-auto text-black bg-white dark:bg-black dark:text-white md:grid-cols-2 animate-pulse">
          <div className="space-y-8">
            <div className="w-2/3 h-6 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="w-full h-4 bg-gray-200 rounded dark:bg-gray-800" />
            <div className="w-5/6 h-4 bg-gray-200 rounded dark:bg-gray-800" />
            <div className="w-4/6 h-4 bg-gray-200 rounded dark:bg-gray-800" />
            <div className="w-1/2 h-4 bg-gray-200 rounded dark:bg-gray-800" />
          </div>
          <div className="w-full h-[350px] bg-gray-200 dark:bg-gray-800 rounded-xl" />
        </section>
      </main>
    );
  }

  return (
    <main>
      <InnerHero
        subtitle="Get In Touch"
        title="Contact Us"
        backgroundImage="/assets/images/hero/contact.jpg"
      />

      <section
        data-aos="fade-up"
        className="grid max-w-6xl gap-10 px-6 py-16 mx-auto text-black transition-colors duration-300 bg-white dark:bg-black dark:text-white md:grid-cols-2"
      >
        <div className="space-y-8">
          {/* Address */}
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-[#c20e35] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Head Office:</h2>
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line dark:text-white">
                {contactData.address}
              </p>
            </div>
          </div>

          {/* Phones */}
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-[#c20e35] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2l2 5-2 2c1.5 3 4.5 6 7.5 7.5l2-2 5 2v2a2 2 0 01-2 2h-1c-9 0-16-7-16-16V5z" />
            </svg>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Phones:</h2>
              <p className="text-sm text-gray-600 dark:text-white">{contactData.telephone}</p>
              <p className="text-sm text-gray-600 dark:text-white">{contactData.home}</p>
              <p className="text-sm text-gray-600 dark:text-white">
                Hotline: {contactData.hotline}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-[#c20e35] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 4.5v15a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 013.75 3h16.5a1.5 1.5 0 011.5 1.5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6l9 7.5 9-7.5" />
            </svg>
            <div>
              <h2 className="mb-2 text-xl font-semibold">Write Us:</h2>
              <p className="text-sm text-gray-600 dark:text-white">
                <a
                  href={`mailto:${contactData.email}`}
                  className="hover:text-[#c20e35] transition-colors"
                >
                  {contactData.email}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Map */}
        <div
          className="w-full h-full min-h-[350px] rounded-xl shadow-md"
          dangerouslySetInnerHTML={{ __html: contactData.mapIframe }}
        />
      </section>

      {/* Contact Form */}
      <div data-aos="fade-up">
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
