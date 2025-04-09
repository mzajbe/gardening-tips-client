/* eslint-disable prettier/prettier */
"use client";
import { logout } from "@/src/services/AuthService";
import { Menu, Search, User } from "lucide-react";
import Link from "next/link";
import NextLink from "next/link";
import { useState } from "react";

const handleLogout = () => {
  logout();
  // userLoading(true);

  // if (protectedRoutes.some((route) => pathname.match(route))) {
  // router.push("/");
  // }
};

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray shadow-lg">
      <div className="max-w-[980px] mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Company Name */}

          <div className="flex items-center">
            {/* <span className="text-3xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">COSMOS</span> */}

            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              {/* <Logo /> */}
              <p className="text-3xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">
                COSMOS
              </p>
            </NextLink>
          </div>

          {/* Middle - Search Bar (hidden on mobile) */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right side - User Icon and Mobile Menu Button */}
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* User dropdown */}
            <div className="relative ml-3">
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <User className="h-6 w-6" />
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => handleLogout()}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {/* Mobile search bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
