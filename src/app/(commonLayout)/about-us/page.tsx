/* eslint-disable prettier/prettier */
"use client";

import Image from "next/image";
import { Button } from "@/src/components/ui/button";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-pink-50 dark:from-background dark:to-muted flex items-center justify-center py-12 px-6 sm:px-12">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20">
        
        {/* Left Column: Text & CTA */}
        <div className="flex-1 space-y-8 flex flex-col items-start text-left z-10">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl font-extrabold text-[#2a2c59] dark:text-emerald-400 tracking-tight drop-shadow-sm uppercase">
              About Us
            </h1>
            <div className="w-24 h-1 bg-[#2a2c59] dark:bg-emerald-500 rounded-full" />
          </div>

          <p className="text-lg text-[#5a5e7b] dark:text-muted-foreground italic leading-relaxed max-w-lg">
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo 
            consequat."
          </p>
          <p className="text-md text-[#5a5e7b] dark:text-muted-foreground leading-relaxed max-w-lg">
            Welcome to BloomSpace — a community where gardeners, nature lovers, and green 
            souls come together to share inspiration, tips, and stories.
          </p>

          <Button 
            className="rounded-full px-10 py-6 bg-[#2a2c59] hover:bg-[#3d407a] text-white font-semibold tracking-wide shadow-lg hover:shadow-xl transition-all duration-300 dark:bg-emerald-600 dark:hover:bg-emerald-700"
          >
            LEARN MORE
          </Button>
        </div>

        {/* Right Column: Illustration Visual */}
        <div className="flex-1 w-full max-w-md md:max-w-none relative animate-fadeIn">
          {/* Abstract background blob underlying the image for extra depth */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-[#ffc6b5] dark:bg-emerald-950/40 rounded-full blur-3xl opacity-30 -z-10" />
          
          <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-500">
            <Image
              src="/flat_vector_about_us.png"
              alt="BloomSpace Community Illustration"
              layout="fill"
              objectFit="contain"
              quality={100}
              priority
              className="drop-shadow-2xl z-10"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
