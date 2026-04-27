/* eslint-disable prettier/prettier */
"use client";

import { jwtDecode } from "jwt-decode";
import nexiosInstance from "@/src/config/nexios.config";
import {
  BadgeCheck,
  CheckCheck,
  CircleHelp,
  Images,
  Loader2,
  PencilLine,
  Sparkles,
  SunMoon,
  Menu,
  UserRound,
  X,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

interface SidebarUser {
  _id: string;
  name?: string;
  email?: string;
  profilePicture?: string;
}

interface LoginResponse {
  success: boolean;
  data: {
    accessToken: string;
  };
}

const ANONYMOUS_CREDENTIALS = {
  email: "anom@gmail.com",
  password: "anom1324",
};

const Sidebar: React.FC<SidebarProps> = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<SidebarUser | null>(null);
  const [isAnonymousLoginLoading, setIsAnonymousLoginLoading] = useState(false);

  useEffect(() => {
    const hasToken = document.cookie.split(';').some(row => row.trim().startsWith('accessToken='));
    setIsLoggedIn(hasToken);
  }, [pathname]);

  useEffect(() => {
    const fetchSidebarUser = async () => {
      try {
        const accessToken = document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1];

        if (!accessToken) {
          setUserInfo(null);
          return;
        }

        const decodedToken: any = jwtDecode(accessToken);
        const userId = decodedToken._id;

        if (!userId) {
          setUserInfo(null);
          return;
        }

        const response = await fetch(`/api/proxy/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch sidebar user");
        }

        const data = await response.json();
        setUserInfo(data.data);
      } catch (error) {
        console.error("Error fetching sidebar user:", error);
        setUserInfo(null);
      }
    };

    fetchSidebarUser();
  }, [pathname]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const isAnonymousUser = userInfo?.email === "anom@gmail.com";
  const userInitial =
    userInfo?.name?.trim()?.charAt(0)?.toUpperCase() ||
    userInfo?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const handleAnonymousLogin = async () => {
    try {
      setIsAnonymousLoginLoading(true);

      const response = await nexiosInstance.post<LoginResponse>("/auth/login", {
        email: ANONYMOUS_CREDENTIALS.email,
        password: ANONYMOUS_CREDENTIALS.password,
      });

      if (!response.data.success) {
        throw new Error("Anonymous login failed");
      }

      document.cookie = `accessToken=${response.data.data.accessToken}; path=/; max-age=${60 * 24 * 60 * 60}`;
      setIsLoggedIn(true);
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error("Error during anonymous login:", error);
    } finally {
      setIsAnonymousLoginLoading(false);
    }
  };

  const navItems = [
    { href: "/premium", label: "Premium", icon: CheckCheck },
    ...(isLoggedIn ? [{ href: "/create-post", label: "Create Post", icon: PencilLine }] : []),
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/image-gallery", label: "Image Gallery", icon: Images },
    { href: "/help", label: "Help", icon: CircleHelp },
  ];

  // ---- Sidebar Core ----
  const SidebarContent = () => (
    <Card className="w-64 h-full flex flex-col justify-between py-6 px-4 shadow-xl border-r border-border/50 bg-background/95 dark:bg-muted/10 backdrop-blur-md rounded-none transition-all duration-300">
      <div>
        {isLoggedIn && userInfo && (
          <div className="mb-6 rounded-2xl border border-purple-300/80 bg-transparent p-3 shadow-sm dark:border-purple-800/80">
            <div className="flex items-center gap-3">
              {userInfo.profilePicture ? (
                <img
                  src={userInfo.profilePicture}
                  alt={userInfo.name || "User"}
                  className="h-12 w-12 rounded-full border-2 border-purple-400 object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-purple-400 bg-purple-100 text-lg font-semibold text-purple-700 dark:bg-purple-900/60 dark:text-purple-200">
                  {userInitial}
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {userInfo.name || "Logged in user"}
                  </p>
                  {isAnonymousUser ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-200/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-purple-800 dark:bg-purple-800/60 dark:text-purple-200">
                      <Sparkles className="h-3 w-3" />
                      Demo
                    </span>
                  ) : (
                    <BadgeCheck className="h-4 w-4 text-purple-500" />
                  )}
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {userInfo.email || "Authenticated account"}
                </p>
              </div>
            </div>
          </div>
        )}

        {!isLoggedIn && (
          <div className="mb-6 rounded-2xl border border-purple-300/80 bg-transparent p-3 shadow-sm dark:border-purple-800/80">
            <p className="text-sm font-semibold text-foreground">
              Explore with demo access
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in instantly with the anonymous test account.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleAnonymousLogin}
              className="mt-3 w-full border-purple-300 bg-background text-purple-700 hover:bg-purple-100 hover:text-purple-800 dark:border-purple-800 dark:text-purple-300 dark:hover:bg-purple-950/50"
              disabled={isAnonymousLoginLoading}
            >
              {isAnonymousLoginLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  <UserRound className="mr-2 h-4 w-4" />
                  Anonymous Login
                </>
              )}
            </Button>
          </div>
        )}

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
