'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const Footer = () => {
  const [contact, setContact] = useState(null);
  const [footerMenus, setFooterMenus] = useState([]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/contactInfo');
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error('Failed to fetch contact info:', err);
      }
    };

    const fetchMenus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/menus/all');
        const data = await res.json();
        const filteredMenus = data.filter((menu) => menu.footer1 === true);
        setFooterMenus(filteredMenus);
      } catch (err) {
        console.error('Failed to fetch menus:', err);
      }
    };

    fetchContact();
    fetchMenus();
  }, []);

  if (!contact) {
    return (
      <footer className="py-20 text-center text-sm text-gray-400 animate-pulse">
        Loading contact information...
      </footer>
    );
  }

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="fixed bottom-32 right-5 z-[999]">
        <a
          href={`https://wa.me/${contact.hotline}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://esoft.com.bd/assets/view/images/whatsapp.png"
            alt="WhatsApp"
            className="w-[45px] h-auto rounded-full"
          />
        </a>
      </div>

      {/* Call Now Floating Button */}
      <div className="fixed bottom-20 right-5 z-[999]">
        <a
          href={`tel:${contact.hotline}`}
          className="bg-[#c20e35] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-red-700 hover:scale-105 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5a2 2 0 012-2h1.5a1 1 0 011 .89l.45 3.6a1 1 0 01-.27.84l-1.2 1.2a15.97 15.97 0 007.1 7.1l1.2-1.2a1 1 0 01.84-.27l3.6.45a1 1 0 01.89 1V19a2 2 0 01-2 2h-.5C10.28 21 3 13.72 3 5.5V5z"
            />
          </svg>
          Call Now
        </a>
      </div>

      <footer className="bg-[var(--background)] text-[var(--foreground)] py-10 transition-colors duration-300">
        <div className="max-w-screen-xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pt-2 border-t border-[var(--foreground)]/20">
          {/* Logo */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <img
              src="/assets/images/logo/logo.png"
              alt="Logo"
              className="w-32 mb-2"
            />
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
              <li>
                <Link href="/" className="hover:text-[#c20e35] transition">
                  Home
                </Link>
              </li>
              {footerMenus.map((menu) => {
                const isExternal = menu.page_type === 'url';
                const href = isExternal
                  ? menu.external_link
                  : `/page/${menu.slug}`;
                const target = menu.target || '_self';

                return (
                  <li key={menu._id}>
                    {isExternal || target === '_blank' ? (
                      <a
                        href={href}
                        target={target}
                        rel="noopener noreferrer"
                        className="hover:text-[#c20e35] transition"
                      >
                        {menu.menu_name}
                      </a>
                    ) : (
                      <Link href={href} className="hover:text-[#c20e35] transition">
                        {menu.menu_name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
              <li>
                <strong>T :</strong> {contact.telephone}
              </li>
              <li>
                <strong>H :</strong> {contact.hotline}
              </li>
              <li>
                <strong>E :</strong>
                <a
                  href={`mailto:${contact.email}`}
                  className="hover:text-[#c20e35]"
                >
                  {' '}
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
              Address
            </h3>
            <p className="text-sm text-[var(--foreground)]/80 leading-relaxed">
              {contact.address}
            </p>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 border-t border-[var(--foreground)]/20 pt-6 text-center text-xs text-[var(--foreground)]/60 transition-all">
          <p>&copy; 2025 EDIFICE. ALL RIGHTS ARE RESERVED</p>
          <p className="mt-1">
            <a
              href="https://www.esoft.com.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#c20e35]"
            >
              Web Design Company :{' '}
              <span className="font-cursive">
                e-<span className="text-red-500">S</span>oft
              </span>
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
