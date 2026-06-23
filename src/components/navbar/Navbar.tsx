/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { LayoutDashboard, LogIn, LogOut, Menu, Search, User, UserCircle, Moon, Sun } from "lucide-react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import CosmosLogo from "../CosmosLogo";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";

import {
  getCurrentUserFromBrowserToken,
  getDashboardRouteByRole,
  isAdminRole,
} from "@/src/lib/auth";
import { logout } from "@/src/services/AuthService";

const handleLogout = () => {
  logout();
};

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();

  useEffect(() => {
    const currentUser = getCurrentUserFromBrowserToken();

    setUserRole(currentUser?.role ?? null);
  }, [pathname]);

  const isLoggedIn = Boolean(userRole);
  const isAdmin = isAdminRole(userRole);
  const dashboardHref = getDashboardRouteByRole(userRole);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center pl-10 lg:pl-0">
            <NextLink className="flex justify-start items-center gap-1" href="/">
              <CosmosLogo />
            </NextLink>
          </div>

          <div className="hidden md:flex items-center flex-1 mx-8">
            <div className="relative w-full max-w-md">
              <Input className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex items-center">
            {isAdmin && (
              <Button asChild className="mr-2" size="sm" variant="outline">
                <NextLink href="/admin-dashboard">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Dashboard</span>
                  <span className="sm:hidden">Admin</span>
                </NextLink>
              </Button>
            )}

            <button
              className="hidden items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="outline">
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

            <div className="ml-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="bg-emerald-100/80 hover:bg-emerald-200 text-emerald-900 dark:bg-emerald-900/50 dark:hover:bg-emerald-800/80 dark:text-emerald-100 rounded-full shadow-sm ring-1 ring-emerald-200/50 dark:ring-emerald-800/50 transition-colors"
                    size="icon"
                    variant="ghost"
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
                      <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                        <LayoutDashboard className="h-4 w-4 mr-2" />
                        {isAdmin ? "Admin Dashboard" : "Dashboard"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          handleLogout();
                          setUserRole(null);
                          document.cookie =
                            "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                          router.push("/login");
                          router.refresh();
                        }}
                      >
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

        {isMobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="relative">
                <input
                  className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  placeholder="Search..."
                  type="text"
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
