'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(true); // ✅ Default state is dark
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    // ✅ If user has a saved preference, use it. Otherwise default to dark.
    const isDark = savedTheme ? savedTheme === 'dark' : true;

    applyTheme(isDark);
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const applyTheme = (isDark) => {
    const html = document.documentElement;

    html.classList.remove('dark', 'light');
    html.classList.add(isDark ? 'dark' : 'light');

    html.style.colorScheme = isDark ? 'dark' : 'light';

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed z-50 p-3 text-white transition-transform duration-300 bg-black border border-gray-300 rounded-full shadow-lg bottom-5 right-5 dark:bg-white dark:text-black hover:scale-110"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
};

export default DarkModeToggle;
