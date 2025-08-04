'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fetch menus from API
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/menus/all');
        const data = await res.json();
        setMenus(data);
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    };
    fetchMenus();
  }, []);

  const mainMenus = menus.filter(menu => menu.display && menu.parent === null);
  const getChildren = (parentId) =>
    menus.filter(menu => menu.parent === parentId);

  const getLinkHref = (menu) => {
    if (menu.page_type === 'url') {
      return `/${menu.external_link}`;
    } else if (menu.page_type === 'external') {
      return menu.external_link;
    }
    return '#';
  };

  return (
    <>
      <header
        className={`fixed w-full top-0 left-0 z-50 text-white transition-all duration-300 ${
          isMenuOpen ? 'bg-black' : scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/10'
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-1 relative">
          <div className="z-50 max-w-[250px]">
            <Link href="/" className="inline-block">
              <img
                src="/assets/images/logo/logo.png"
                alt="logo"
                className="h-[80px] md:h-[120px] w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center gap-4 z-50">
            <div className="relative w-[200px] hidden md:block">
              <input
                type="text"
                placeholder="Search..."
                className="w-full border border-white bg-transparent text-white rounded-[30px] px-3 pr-10 py-1 text-sm placeholder-white focus:outline-none"
              />
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </div>

            <button
              id="menu-toggle"
              className="flex items-center gap-1 text-white"
              onClick={toggleMenu}
            >
              <span className="text-xl font-semibold uppercase text-[#c20e35] mr-3">Menu</span>
              <svg className="w-7 h-7" viewBox="0 0 100 80" fill="currentColor">
                <rect width="100" height="10" rx="5"></rect>
                <rect y="30" width="100" height="10" rx="5"></rect>
                <rect y="60" width="100" height="10" rx="5"></rect>
              </svg>
            </button>
          </div>
        </nav>

        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMenu}
        />

        {/* Slide Menu */}



        <div
          className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-black text-white z-50 transform transition-transform duration-500 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end px-6 py-4">
            <button className="text-white text-2xl" onClick={toggleMenu}>
              ×
            </button>
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto">
            <ul className="px-6 pb-8 space-y-2">
             <li>
                <Link href="/" className="block py-2" onClick={toggleMenu}>Home</Link>
              </li>

              {mainMenus.map((menu) => {
                const children = getChildren(menu._id);
                const href = getLinkHref(menu);
                const target = menu.target === '_blank' ? '_blank' : '_self';

                if (children.length === 0) {
                  return (
                    <li key={menu._id}>
                      <Link
                        href={href}
                        target={target}
                        className="block py-2"
                        onClick={toggleMenu}
                      >
                        {menu.menu_name}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={menu._id}>
                    <details className="group">
                      <summary className="flex justify-between items-center cursor-pointer py-2">
                        {menu.menu_name}
                        <svg
                          className="h-4 w-4 group-open:rotate-180 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </summary>
                      <ul className="ml-4 mt-2 space-y-2">
                        {children.map((child) => {
                          const childHref = getLinkHref(child);
                          const childTarget = child.target === '_blank' ? '_blank' : '_self';
                          return (
                            <li key={child._id}>
                              <Link
                                href={childHref}
                                target={childTarget}
                                className="block py-2"
                                onClick={toggleMenu}
                              >
                                {child.menu_name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
