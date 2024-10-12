/* eslint-disable react/jsx-sort-props */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
    className?: string; // Optional string prop for className
  }

const Sidebar:React.FC<SidebarProps> = (props) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

  // Set the theme based on the state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
    return (
        <div className="w-64 h-screen sticky top-0 p-4 ml-6 bg-gray-100 dark:bg-black flex flex-col justify-between shadow-lg">
      <nav className="flex flex-col space-y-6">
        <Link href="/dashboard" className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500">Dashboard</Link>
        <Link href="/create-post" className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500">Create Post</Link>
        <Link href="/image-gallery" className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500">Image Gallery</Link>
        <Link href="/contact-us" className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500">Contact Us</Link>
        <Link href="/about-us" className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500">About Us</Link>
      </nav>

      <button
        onClick={toggleTheme}
        className="mt-auto w-full py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg font-medium"
      >
        Toggle {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>
    );
};

export default Sidebar;