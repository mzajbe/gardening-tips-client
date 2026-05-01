/* eslint-disable prettier/prettier */
"use client";

import { cn } from "@/src/lib/utils";
import { Leaf, Flower2, Trees, Sparkles, LayoutGrid } from "lucide-react";

interface CategoryFilterProps {
  selectedCategory: string;
  onFilterChange: (category: string) => void;
}

const categories = [
  { label: "All", value: "All", icon: LayoutGrid },
  { label: "Vegetables", value: "Vegetables", icon: Leaf },
  { label: "Flowers", value: "Flowers", icon: Flower2 },
  { label: "Landscaping", value: "Landscaping", icon: Trees },
  { label: "Others", value: "Others", icon: Sparkles },
];

const CategoryFilter = ({ selectedCategory, onFilterChange }: CategoryFilterProps) => {
  return (
    <div className="flex flex-nowrap md:flex-wrap gap-2 mb-4 md:mb-6 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      {categories.map(({ label, value, icon: Icon }) => {
        const isActive = selectedCategory === value;
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer shrink-0",
              isActive
                ? "bg-transparent text-emerald-600 border-emerald-600 dark:border-emerald-500 dark:text-emerald-400 font-semibold"
                : "bg-transparent border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-400 hover:text-emerald-600 dark:hover:border-emerald-600 dark:hover:text-emerald-400"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
