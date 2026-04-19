/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
"use client";

import { logout } from "@/src/services/AuthService";
import { LayoutDashboard, LogIn, LogOut, Menu, Search, User, UserCircle } from "lucide-react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import CosmosLogo from "../CosmosLogo";

const handleLogout = () => {
  logout();
  // userLoading(true);

  // if (protectedRoutes.some((route) => pathname.match(route))) {
  // router.push("/");
  // }
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if the accessToken cookie is present on the client safely
    const hasToken = document.cookie.split(';').some(row => row.trim().startsWith('accessToken='));
    setIsLoggedIn(hasToken);
  }, [pathname]);

  const { setTheme } = useTheme();
  const router = useRouter();


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };



  return (
    <nav className="bg-gray shadow-lg ">
      <div className="max-w-7xl border mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side - Company Name */}

          <div className="flex items-center">
            {/* <span className="text-3xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">COSMOS</span> */}

            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              {/* <Logo /> */}
              {/* <p className="text-3xl font-bold text-indigo-600 hover:text-indigo-800 transition duration-300 ease-in-out">
                COSMOS
              </p> */}
              <CosmosLogo></CosmosLogo>
            </NextLink>
          </div>

          {/* Middle - Search Bar (hidden on mobile) */}
          <div className="hidden md:flex items-center flex-1 mx-8">
            <div className="relative w-full max-w-md">
              {/* <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" /> */}

              <Input className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
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

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User dropdown */}
            <div className="ml-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-900/50 dark:hover:bg-emerald-800/80 dark:text-emerald-100 rounded-full shadow-sm ring-1 ring-emerald-200/50 dark:ring-emerald-800/50 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span className="sr-only">Open profile menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  {isLoggedIn ? (
                    <>
                      <DropdownMenuItem onClick={() => router.push("/profile")}>
                        <UserCircle className="h-4 w-4 mr-2" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={async () => {
                        handleLogout();
                        setIsLoggedIn(false);
                        // Clears front-end cookie just in case auth service does not do it on time
                        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                        router.push("/login");
                      }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push("/login")}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
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
