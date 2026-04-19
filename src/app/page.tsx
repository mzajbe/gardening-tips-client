/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
"use client";

import { useState } from "react";
import Quets from "../components/quets/Quets";
import PremiumTeaser from "../components/premiumTeaser/PremiumTeaser";
import CategoryFilter from "../components/categoryFilter/CategoryFilter";
import Posts from "./(commonLayout)/posts/page";



export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className=" mx-auto px-4">
      <section className="flex flex-col md:flex-row md:gap-6 py-8 md:py-10">
        {/* Left column: main content (Posts) */}


        
        <div className="flex-1">
          <Posts selectedCategory={selectedCategory} />
        </div>

        {/* Right column: sidebar */}
        <aside className="w-full md:w-1/3 space-y-6">
          <Quets />
          <CategoryFilter selectedCategory={selectedCategory} onFilterChange={setSelectedCategory} />
          <PremiumTeaser />
        </aside>
        
      </section>
    </div>
  );
}
