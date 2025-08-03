'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import InnerHero from '@/components/Hero/InnerHero';
import ContactForm from '@/components/common/ContactForm';

const ContactPage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
    });
    window.scrollTo(0, 0);
  }, []);

  const contactItems = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#c20e35] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Head Office:',
      content: (
        <p className="text-sm text-gray-600 dark:text-white leading-relaxed">
          46, Kazi Nazrul Islam Avenue (3rd Floor)<br />
          Besides Hotel Super Star, Kawran Bazar,<br />
          Dhaka-1215,<br />
          Bangladesh
        </p>
      ),
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#c20e35] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h2l2 5-2 2c1.5 3 4.5 6 7.5 7.5l2-2 5 2v2a2 2 0 01-2 2h-1c-9 0-16-7-16-16V5z" />
        </svg>
      ),
      title: 'Phones:',
      content: (
        <>
          <p className="text-sm text-gray-600 dark:text-white">02-9133366 (Hunting)</p>
          <p className="text-sm text-gray-600 dark:text-white">01614098055</p>
          <p className="text-sm text-gray-600 dark:text-white">Hotline: 01614098055</p>
        </>
      ),
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#c20e35] mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 4.5v15a1.5 1.5 0 01-1.5 1.5H3.75a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 013.75 3h16.5a1.5 1.5 0 011.5 1.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6l9 7.5 9-7.5" />
        </svg>
      ),
      title: 'Write Us:',
      content: (
        <p className="text-sm text-gray-600 dark:text-white">
          <a href="mailto:info@navana-realestate.com" className="hover:text-[#c20e35] transition-colors">
            info@navana-realestate.com
          </a>
        </p>
      ),
    },
  ];

  return (
    <main>
      <InnerHero
        subtitle="Get In Touch"
        title="Contact Us"
        backgroundImage="/assets/images/hero/contact.jpg" // ✅ Replace with your own image path
      />

      <section
        data-aos="fade-up"
        className="bg-white text-black dark:bg-black dark:text-white max-w-6xl mx-auto grid md:grid-cols-2 gap-10 px-6 py-16 transition-colors duration-300"
      >
        <div className="space-y-8">
          {contactItems.map((item, index) => (
            <div key={index} className="flex items-start gap-4">
              {item.icon}
              <div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                {item.content}
              </div>
            </div>
          ))}
        </div>

        <div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8341235748476!2d90.38914647439165!3d23.753293888667006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8a2fb089f83%3A0xd626cd8e61880f4c!2sDevelopment%20Design%20and%20Management!5e0!3m2!1sen!2sbd!4v1751267656111!5m2!1sen!2sbd"
            width="100%"
            height="400"
            className="w-full h-full min-h-[350px] rounded-xl border-0 shadow-md"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Company Location Map"
          ></iframe>
        </div>
      </section>

      <div data-aos="fade-up">
        <ContactForm />
      </div>
    </main>
  );
};

export default ContactPage;
