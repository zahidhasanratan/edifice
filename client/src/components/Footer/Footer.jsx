"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const Footer = () => {
  const [contact, setContact] = useState(null);
  const [footerMenus, setFooterMenus] = useState([]);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/contact");
        const data = await res.json();
        setContact(data);
      } catch (err) {
        console.error("Failed to fetch contact info:", err);
      }
    };

    const fetchMenus = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/menus/all");
        const data = await res.json();
        const filteredMenus = data.filter(menu => menu.footer1 === true);
        setFooterMenus(filteredMenus);
      } catch (err) {
        console.error("Failed to fetch menus:", err);
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
    <footer className="bg-[var(--background)] text-[var(--foreground)] py-10 transition-colors duration-300">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pt-2 border-t border-[var(--foreground)]/20">
        {/* Logo */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img src="/assets/images/logo/logo.png" alt="Logo" className="w-32 mb-2" />
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
            Navigation
          </h3>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            <li>
              <Link href="/" className="hover:text-[#c20e35] transition">Home</Link>
            </li>
            {footerMenus.map(menu => {
              const isExternal = menu.page_type === "url";
              const href = isExternal ? menu.external_link : `/page/${menu.slug}`;
              const target = menu.target || "_self";

              if (target === "_blank") {
                return (
                  <li key={menu._id}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#c20e35] transition"
                    >
                      {menu.menu_name}
                    </a>
                  </li>
                );
              } else {
                return (
                  <li key={menu._id}>
                    <Link href={href} className="hover:text-[#c20e35] transition">
                      {menu.menu_name}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4 relative inline-block after:block after:w-16 after:h-[2px] after:bg-[#c20e35] after:mt-2">
            Contact
          </h3>
          <ul className="space-y-2 text-sm text-[var(--foreground)]/80">
            <li><strong>T :</strong> {contact.telephone}</li>
            <li><strong>H :</strong> {contact.hotline}</li>
            <li>
              <strong>E :</strong>
              <a href={`mailto:${contact.email}`} className="hover:text-[#c20e35]"> {contact.email}</a>
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

      <div className="mt-10 border-t border-[var(--foreground)]/20 pt-6 text-center text-xs text-[var(--foreground)]/60 transition-all">
        <p>&copy; 2025 EDIFICE. ALL RIGHTS ARE RESERVED</p>
        <p className="mt-1">
          <a href="https://www.esoft.com.bd/" target="_blank" rel="noopener noreferrer" className="hover:text-[#c20e35]">
            Web Design Company : <span className="font-cursive">e-<span className="text-red-500">S</span>oft</span>
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
