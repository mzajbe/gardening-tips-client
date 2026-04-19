/* eslint-disable prettier/prettier */
"use client";

import {
  CheckCheck,
  ContactRound,
  Images,
  MessageCircleWarning,
  PencilLine,
  SunMoon,
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";
import { cn } from "@/src/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.split(';').some(row => row.trim().startsWith('accessToken='));
    setIsLoggedIn(hasToken);
  }, [pathname]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navItems = [
    { href: "/premium", label: "Premium", icon: CheckCheck },
    ...(isLoggedIn ? [{ href: "/create-post", label: "Create Post", icon: PencilLine }] : []),
    { href: "/image-gallery", label: "Image Gallery", icon: Images },
    { href: "/contact", label: "Contact", icon: ContactRound },
    { href: "/about-us", label: "About", icon: MessageCircleWarning },
  ];

  // ---- Sidebar Core ----
  const SidebarContent = () => (
    <Card className="w-64 h-full flex flex-col justify-between py-6 px-4 shadow-xl border-r border-border/50 bg-background/95 dark:bg-muted/10 backdrop-blur-md rounded-none transition-all duration-300">
      <div>
        <div className="mb-6 px-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
            Overview
          </span>
        </div>
        <nav className="space-y-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-100/70 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-100 shadow-sm"
                    : "text-muted-foreground hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-emerald-600 dark:text-emerald-300" : "opacity-70")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* <div className="mt-6">
        <Separator className="my-3" />
        <Button
          onClick={toggleTheme}
          variant="outline"
          className="w-full flex items-center gap-2 mb-20"
        >
          <SunMoon className="w-4 h-4" />
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div> */}
    </Card>
  );

  return (
    <>
      {/* Desktop toggle button (top-left corner) */}
      <div className="hidden lg:flex items-center gap-2 fixed top-4 left-4 z-50 ">
        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="shadow-sm"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:block fixed top-0 left-0 h-screen transition-all duration-300 z-40  mt-16",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Mobile Sidebar (Sheet Drawer) */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="p-4">
              <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
            </SheetHeader>
            <div className="p-4">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;
