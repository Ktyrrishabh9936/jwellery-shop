import { useEffect, useState } from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
export function useTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return { theme, toggleTheme };
}

const ThemeToggle = ({ className = "" }) => {
  const {theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-gray-100 hover:bg-gray-200
        dark:bg-gray-800 dark:hover:bg-gray-700
        transition-colors duration-200
        focus:outline-none 
        ${className}
      `}
      aria-label={`Switch to ${theme ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        <IoMdSunny
          className={`
            absolute inset-0 w-5 h-5 text-yellow-500
            transition-all duration-300 transform
            ${theme ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}
          `}
        />
        <IoMdMoon
          className={`
            absolute inset-0 w-5 h-5 
            transition-all duration-300 transform
            ${theme ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"}
          `}
        />
      </div>
    </button>
  )
}

export default ThemeToggle
