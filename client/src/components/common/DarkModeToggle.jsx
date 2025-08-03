'use client';

import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Run once after hydration
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDark = savedTheme
      ? savedTheme === 'dark'
      : prefersDark;

    applyTheme(isDark);
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  // Apply dark or light mode
  const applyTheme = (isDark) => {
    const html = document.documentElement;

    // Toggle class on <html>
    html.classList.remove('dark', 'light');
    html.classList.add(isDark ? 'dark' : 'light');

    // Set CSS hint
    html.style.colorScheme = isDark ? 'dark' : 'light';

    // Persist preference
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
      className="fixed bottom-5 right-5 z-50 p-3 bg-black text-white dark:bg-white dark:text-black rounded-full shadow-lg border border-gray-300 hover:scale-110 transition-transform duration-300"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
};

export default DarkModeToggle;
