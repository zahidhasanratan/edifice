import { useState, useEffect } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(true); // Default to true (dark mode)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Initialize state - default to dark if no preference saved
    const initialDarkMode = savedTheme 
      ? savedTheme === 'dark' 
      : true; // Default to dark mode if no preference
    
    setDarkMode(initialDarkMode);
    applyTheme(initialDarkMode);
  }, []);

  const applyTheme = (isDark) => {
    // Apply to document
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    applyTheme(newMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 z-50 p-3 dark:bg-white bg-black dark:text-gray-800 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 border border-gray-200 dark:border-gray-700 transform"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <FiMoon size={20} /> : <FiSun size={20} />}
    </button>
  );
};

export default DarkModeToggle;