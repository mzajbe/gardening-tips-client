/* eslint-disable import/order */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import "@/src/styles/globals.css";
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";

import { Providers } from "./providers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { siteConfig } from "@/src/config/site";
import { fontSans } from "@/src/config/fonts";
// import { Navbar } from "@/src/components/navbar";
import Sidebar from "../components/sidebar/Sidebar";
import CosmosIcon from "../../public/Gemini_Generated_Image_e8twzbe8twzbe8tw.png"

import { Toaster, toast } from "sonner";
import Navbar from "../components/navbar/Navbar";
import { ThemeProvider } from "../components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: CosmosIcon.src,
  },
};

// export const viewport: Viewport = {
//   themeColor: [
//     { media: "(prefers-color-scheme: light)", color: "white" },
//     { media: "(prefers-color-scheme: dark)", color: "black" },
//   ],
// };

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
          "min-h-screen bg-background font-sans antialiased ",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}> */}
          <div className="relative flex flex-col h-screen">
            {/* Navbar at the top */}
            <Navbar />

            {/* Centering wrapper */}
            <div className="flex justify-center w-full flex-1">
              <div className="flex flex-col max-w-7xl border md:flex-row  w-full">
                {/* Sidebar */}

                <Sidebar />

                {/* Main content area */}
                <main className="flex-1  p-4 transition-all duration-300">
                  {children}
                </main>
              </div>
            </div>
          </div>
          {/* </Providers> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
