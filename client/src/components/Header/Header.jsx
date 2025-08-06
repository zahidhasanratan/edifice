'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menus, setMenus] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const searchRef = useRef();

  // Handle scroll background
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Fetch menus
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
  const getChildren = parentId => menus.filter(menu => menu.parent === parentId);
  const getLinkHref = menu => {
    if (menu.page_type === 'page') return `/page/${menu.slug}`;
    if (menu.page_type === 'external' || menu.page_type === 'url') return menu.external_link;
    return '#';
  };

  // Fetch all projects for search
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects');
        const data = await res.json();
        setAllProjects(data);
      } catch (err) {
        console.error('Failed to fetch projects for search:', err);
      }
    };
    fetchProjects();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const filtered = allProjects.filter(project =>
      project.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered.slice(0, 5)); // show max 5 results
  }, [searchQuery, allProjects]);

  // Close search result on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed w-full top-0 left-0 z-50 text-white transition-all duration-300 ${
          isMenuOpen ? 'bg-black' : scrolled ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/10'
        }`}
      >
        <nav className="relative flex items-center justify-between px-6 py-1">
          <div className="z-50 max-w-[250px]">
            <Link href="/" className="inline-block">
              <img
                src="/assets/images/logo/logo.png"
                alt="logo"
                className="h-[80px] md:h-[120px] w-auto"
              />
            </Link>
          </div>

          <div className="z-50 flex items-center gap-4">
            {/* 🔍 Search */}
            <div className="relative w-[200px] hidden md:block" ref={searchRef}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full border border-white bg-transparent text-white rounded-[30px] px-3 pr-10 py-1 text-sm placeholder-white focus:outline-none"
              />
              <svg
                className="absolute w-4 h-4 text-white -translate-y-1/2 pointer-events-none right-2 top-1/2"
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

              {/* 🔎 Dropdown Results */}
              {searchResults.length > 0 && (
                <div className="absolute z-50 w-full mt-2 overflow-hidden text-black bg-white rounded shadow-md">
                  {searchResults.map((item) => (
                    <Link
                      key={item._id}
                      href={`/projects/${item.slug || item._id}`}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100"
                      onClick={() => setSearchQuery('')}
                    >
                      <img
                        src={item.featureImage || '/fallback.jpg'}
                        alt={item.title}
                        className="object-cover w-10 h-10 rounded"
                      />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* ☰ Mobile Menu Button */}
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

        {/* 🟡 Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={toggleMenu}
        />

        {/* 📱 Slide Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-[80%] max-w-xs bg-black text-white z-50 transform transition-transform duration-500 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex justify-end px-6 py-4">
            <button className="text-2xl text-white" onClick={toggleMenu}>
              ×
            </button>
          </div>
          <div className="h-[calc(100%-60px)] overflow-y-auto">
            <ul className="px-6 pb-8 space-y-2">
              <li>
                <Link href="/" className="block py-2" onClick={toggleMenu}>
                  Home
                </Link>
              </li>

              {mainMenus.map((menu) => {
                const children = getChildren(menu._id);
                const href = getLinkHref(menu);
                const target = menu.target === '_blank' ? '_blank' : '_self';

                if (children.length === 0) {
                  return (
                    <li key={menu._id}>
                      <Link href={href} target={target} className="block py-2" onClick={toggleMenu}>
                        {menu.menu_name}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li key={menu._id}>
                    <details className="group">
                      <summary className="flex items-center justify-between py-2 cursor-pointer">
                        {menu.menu_name}
                        <svg
                          className="w-4 h-4 transition-transform group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <ul className="mt-2 ml-4 space-y-2">
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
