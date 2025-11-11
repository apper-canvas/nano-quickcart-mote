import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", className)}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-soft animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "cart") {
    return (
      <div className={cn("space-y-4", className)}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-soft animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-8 w-20 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100", className)}>
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32 mx-auto animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-24 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;