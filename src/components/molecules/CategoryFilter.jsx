import React from "react";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";

const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  className 
}) => {
  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-display font-semibold text-primary">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange("")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            selectedCategory === "" 
              ? "bg-gradient-to-r from-accent to-red-500 text-white shadow-soft" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          )}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
              selectedCategory === category 
                ? "bg-gradient-to-r from-accent to-red-500 text-white shadow-soft" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;