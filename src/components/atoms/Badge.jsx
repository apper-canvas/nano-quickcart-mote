import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "md",
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-accent to-red-500 text-white shadow-soft",
secondary: "bg-secondary text-white",
    success: "bg-success text-white",
    warning: "bg-warning text-primary",
    error: "bg-error text-white",
    discount: "bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold"
  };

  const sizes = {
    sm: "text-xs px-2 py-1 min-w-[20px] h-5",
    md: "text-sm px-3 py-1 min-w-[24px] h-6",
    lg: "text-base px-4 py-2 min-w-[32px] h-8"
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;