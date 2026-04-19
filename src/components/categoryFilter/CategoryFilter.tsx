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
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map(({ label, value, icon: Icon }) => {
        const isActive = selectedCategory === value;
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer",
              isActive
                ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200/50 dark:shadow-emerald-900/40"
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
