/* eslint-disable react/self-closing-comp */
import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css'; 
import { siteConfig } from "@/src/config/site";
import { fontSans } from "@/src/config/fonts";
import { Navbar } from "@/src/components/navbar";
import Sidebar from "../components/sidebar/Sidebar";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            {/* Navbar at the top */}
            <Navbar />

            {/* Centering wrapper */}
            <div className="flex justify-center w-full">
              <div className="flex max-w-5xl w-full">
                {/* Sidebar with some margin to the left */}
                <div className="ml-8">
                  <Sidebar />
                </div>

                {/* Main content area */}
                <main className="flex-1 ml-12">{children}</main>
                <ToastContainer />
              </div>
            </div>

            <footer className="w-full flex items-center justify-center py-3">
              <h1>This is footer</h1>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
