'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    let isDark;
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else {
      // Detect system preference if no saved theme
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    applyTheme(isDark);
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const applyTheme = (isDark) => {
    const html = document.documentElement;

    if (isDark) {
      html.classList.add('dark');
      html.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      html.style.colorScheme = 'light';
    }

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
