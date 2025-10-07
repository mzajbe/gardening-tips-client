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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "../ui/separator";




interface SidebarProps {
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const navItems = [
    { href: "/premium", label: "Premium", icon: CheckCheck },
    { href: "/create-post", label: "Create Post", icon: PencilLine },
    { href: "/image-gallery", label: "Image Gallery", icon: Images },
    { href: "/contact", label: "Contact", icon: ContactRound },
    { href: "/about-us", label: "About", icon: MessageCircleWarning },
  ];

  // ---- Sidebar Core ----
  const SidebarContent = () => (
    <Card className="w-64 h-full flex flex-col justify-between p-4 shadow-lg border-none bg-muted/30 dark:bg-muted/20 backdrop-blur-sm">
      <nav className="space-y-4">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-2 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <Icon className="w-5 h-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        <Separator className="my-3" />
        <Button
          onClick={toggleTheme}
          variant="outline"
          className="w-full flex items-center gap-2"
        >
          <SunMoon className="w-4 h-4" />
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>
    </Card>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:block sticky top-0 h-screen">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
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
