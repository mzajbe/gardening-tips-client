/* eslint-disable react/jsx-sort-props */
/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
"use client";
import {
  CheckCheck,
  ContactRound,
  Images,
  MessageCircleWarning,
  PencilLine,
  SunMoon,
  Tags,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SidebarProps {
  className?: string; // Optional string prop for className
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Set the theme based on the state
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  return (
    <div className="w-64 h-screen sticky top-0 p-4 ml-6 bg-gray-100 dark:bg-black flex flex-col justify-between shadow-lg">
      <nav className="flex flex-col space-y-6">
        <div className="flex space-x-2">
          <CheckCheck />
          <Link
            href="/dashboard"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500"
          >
            Premium
          </Link>
        </div>

        <div className="flex space-x-2">
          <PencilLine />
          <Link
            href="/create-post"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500"
          >
            Create Post
          </Link>
        </div>

        <div className="flex space-x-2">
          <Tags />
          <Link
            href="/tags"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500"
          >
            Tags
          </Link>
        </div>

        <div className="flex space-x-2">
          <Images />
          <Link
            href="/image-gallery"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500"
          >
            Image Gallery
          </Link>
        </div>

        <div className="flex space-x-2">
          <ContactRound />
          <Link
            href="/contact-us"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500"
          >
            Contact
          </Link>
        </div>

        <div className="flex space-x-2">
          <MessageCircleWarning />
          <Link
            href="/about-us"
            className="text-lg font-semibold text-gray-800 dark:text-gray-200 hover:text-blue-500"
          >
            About
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <SunMoon />
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center px-4 py-2 text-lg font-semibold text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-800 border border-transparent rounded-md shadow hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-300 ease-in-out"
          >
            {isDarkMode ? "Light" : "Dark"} Mode
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
