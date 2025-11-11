import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent to-red-500 text-white hover:brightness-110 focus:ring-accent shadow-lg hover:shadow-elevated",
    secondary: "bg-white text-primary border border-gray-300 hover:bg-gray-50 focus:ring-gray-400 shadow-soft hover:shadow-elevated",
    outline: "border-2 border-accent text-accent hover:bg-accent hover:text-white focus:ring-accent transition-colors duration-200",
    ghost: "text-primary hover:bg-gray-100 focus:ring-gray-400",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:brightness-110 focus:ring-red-500 shadow-lg"
  };

  const sizes = {
    sm: "text-sm px-3 py-2 h-8",
    md: "text-sm px-4 py-2.5 h-10",
    lg: "text-base px-6 py-3 h-12",
    xl: "text-lg px-8 py-4 h-14"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;