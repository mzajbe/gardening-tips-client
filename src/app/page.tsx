/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
"use client";

import { useState } from "react";
import Quets from "../components/quets/Quets";
import PremiumTeaser from "../components/premiumTeaser/PremiumTeaser";
import CategoryFilter from "../components/categoryFilter/CategoryFilter";
import Posts from "./(commonLayout)/posts/Posts";



export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="mx-auto px-1 sm:px-4">
      <section className="flex flex-col md:flex-row md:gap-6 py-4 md:py-10">
        {/* Right column: sidebar - shown first on mobile for category filter access */}
        <aside className="w-full md:w-1/3 space-y-4 md:space-y-6 order-first md:order-last mb-4 md:mb-0">
          <div className="hidden md:block">
            <Quets />
          </div>
          <CategoryFilter selectedCategory={selectedCategory} onFilterChange={setSelectedCategory} />
          <div className="hidden md:block">
            <PremiumTeaser />
          </div>
        </aside>

        {/* Left column: main content (Posts) */}
        <div className="flex-1 min-w-0 order-last md:order-first">
          <Posts selectedCategory={selectedCategory} />
        </div>
      </section>
    </div>
  );
}
